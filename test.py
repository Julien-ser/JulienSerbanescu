from langchain_community.document_loaders import PyPDFLoader, WebBaseLoader
import os
from faster_whisper import WhisperModel
from langchain.text_splitter import RecursiveCharacterTextSplitter
from dotenv import load_dotenv
import cohere
from langchain_community.vectorstores import FAISS
from langchain_community.docstore.document import Document
import glob
import pickle

# Load environment variables
load_dotenv()
cohere_api_key = os.getenv("COHERE_API_KEY")

# Initialize Cohere client
if not cohere_api_key:
    raise ValueError("COHERE_API_KEY not found in environment variables")
co = cohere.Client(cohere_api_key)

# Define directories
persist_directory = 'docs/faiss/'
pdf_directory = 'docs/pdfs/'
audio_directory = 'docs/youtube/'

# Create directories if they don't exist
for directory in [persist_directory, pdf_directory, audio_directory]:
    os.makedirs(directory, exist_ok=True)

# Initialize text splitter for all document types
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200,
    length_function=len
)

# Custom embedding function for FAISS
class CohereEmbeddings:
    def __init__(self, client):
        self.client = client
    
    def embed_documents(self, texts):
        embeddings = []
        # Process in batches to avoid rate limits
        batch_size = 20
        for i in range(0, len(texts), batch_size):
            batch = texts[i:i+batch_size]
            try:
                response = self.client.embed(
                    texts=[str(text) for text in batch],
                    model="embed-english-v3.0",
                    input_type="search_document"
                )
                if hasattr(response, 'embeddings'):
                    embeddings.extend(response.embeddings)
                else:
                    print("Warning: No embeddings in response")
            except Exception as e:
                print(f"Batch embedding error: {e}")
                # Add empty embeddings for failed texts to maintain alignment
                # Using a small random value instead of None to avoid FAISS errors
                import numpy as np
                embeddings.extend([np.zeros(4096) for _ in range(len(batch))])
        return embeddings
    
    def embed_query(self, text):
        try:
            response = self.client.embed(
                texts=[str(text)],
                model="embed-english-v3.0",
                input_type="search_query"
            )
            if hasattr(response, 'embeddings') and len(response.embeddings) > 0:
                return response.embeddings[0]
            else:
                raise ValueError("No query embedding found in the response")
        except Exception as e:
            print(f"Query embedding error: {e}")
            import numpy as np
            return np.zeros(4096)  # Return empty embedding as fallback

# Function to transcribe audio files
def transcribe_audio(file_path, model_size="base"):
    try:
        # Initialize the model only when needed
        model = WhisperModel(model_size)
        
        # Use Whisper model to transcribe the audio
        segments, info = model.transcribe(file_path)
        
        # The result is a generator, so we need to iterate over it
        transcription_text = ""
        for segment in segments:
            transcription_text += segment.text + " "
        
        return transcription_text.strip()
    except Exception as e:
        print(f"Error transcribing {file_path}: {e}")
        return ""

# Initialize the embedding function
embedding_function = CohereEmbeddings(co)

# List to collect all documents from different sources
all_documents = []

# 1. Load and process web content
try:
    print("\n--- Processing Web Content ---")
    web_loader = WebBaseLoader("https://julien-ser.github.io/JulienSerbanescu/")
    web_docs = web_loader.load()
    print(f"Loaded {len(web_docs)} web documents")
    
    # Split web documents
    split_web_docs = text_splitter.split_documents(web_docs)
    print(f"Split into {len(split_web_docs)} chunks")
    
    # Add to document collection
    all_documents.extend(split_web_docs)
except Exception as e:
    print(f"Error processing web content: {e}")

# 2. Load and process PDF files
try:
    print("\n--- Processing PDF Files ---")
    pdf_files = glob.glob(os.path.join(pdf_directory, "*.pdf"))
    
    if not pdf_files:
        print(f"No PDF files found in {pdf_directory}")
    else:
        print(f"Found {len(pdf_files)} PDF files")
        
        for pdf_file in pdf_files:
            try:
                print(f"Loading {os.path.basename(pdf_file)}...")
                pdf_loader = PyPDFLoader(pdf_file)
                pdf_docs = pdf_loader.load()
                
                # Split PDF documents
                split_pdf_docs = text_splitter.split_documents(pdf_docs)
                print(f"  Split into {len(split_pdf_docs)} chunks")
                
                # Add to document collection
                all_documents.extend(split_pdf_docs)
            except Exception as e:
                print(f"  Error processing {pdf_file}: {e}")
except Exception as e:
    print(f"Error processing PDF files: {e}")

# 3. Process audio transcriptions
try:
    print("\n--- Processing Audio Files ---")
    audio_files = glob.glob(os.path.join(audio_directory, "*.m4a"))
    
    if not audio_files:
        print(f"No audio files found in {audio_directory}")
    else:
        print(f"Found {len(audio_files)} audio files")
        
        for audio_file in audio_files:
            try:
                file_name = os.path.basename(audio_file)
                transcript_file = os.path.join(audio_directory, f"{os.path.splitext(file_name)[0]}_transcript.txt")
                
                # Check if transcription already exists
                if os.path.exists(transcript_file):
                    print(f"Loading existing transcription for {file_name}...")
                    with open(transcript_file, 'r') as f:
                        transcription = f.read()
                else:
                    print(f"Transcribing {file_name}...")
                    transcription = transcribe_audio(audio_file)
                    
                    # Save transcription
                    if transcription:
                        with open(transcript_file, 'w') as f:
                            f.write(transcription)
                
                if transcription:
                    # Create document from transcription
                    doc = Document(
                        page_content=transcription,
                        metadata={"source": file_name, "type": "audio_transcription"}
                    )
                    
                    # Split transcription
                    split_docs = text_splitter.split_documents([doc])
                    print(f"  Split into {len(split_docs)} chunks")
                    
                    # Add to document collection
                    all_documents.extend(split_docs)
            except Exception as e:
                print(f"  Error processing {audio_file}: {e}")
except Exception as e:
    print(f"Error processing audio files: {e}")

# 4. Create FAISS index from documents
print("\n--- Creating FAISS Vector Store ---")
if all_documents:
    print(f"Creating FAISS index with {len(all_documents)} document chunks...")
    
    try:
        # Create the FAISS index
        vector_store = FAISS.from_documents(
            documents=all_documents,
            embedding=embedding_function
        )
        
        # Save the FAISS index to disk
        vector_store.save_local(persist_directory)
        print(f"FAISS index saved to {persist_directory}")
        
        # Save metadata separately for easy access
        metadata_path = os.path.join(persist_directory, "metadata.pkl")
        with open(metadata_path, 'wb') as f:
            metadata = [doc.metadata for doc in all_documents]
            pickle.dump(metadata, f)
        print(f"Document metadata saved to {metadata_path}")
        
        # Let's also save a simple text lookup for reference
        lookup_path = os.path.join(persist_directory, "document_lookup.txt")
        with open(lookup_path, 'w') as f:
            for i, doc in enumerate(all_documents):
                f.write(f"Document {i}:\n")
                f.write(f"Source: {doc.metadata.get('source', 'Unknown')}\n")
                f.write(f"Type: {doc.metadata.get('type', 'Unknown')}\n")
                f.write(f"Content Preview: {doc.page_content[:100]}...\n")
                f.write("-" * 80 + "\n")
        print(f"Document lookup saved to {lookup_path}")
    except Exception as e:
        print(f"Error creating FAISS index: {e}")
else:
    print("No documents to add to the vector store")

print("\n--- Process Completed ---")

# Example of how to load and search the FAISS index later
print("\n--- Example: Loading and Searching FAISS Index ---")
print("To load and search the index later, use this code:")
print("""
# Load the FAISS index
from langchain.vectorstores import FAISS
from your_module import CohereEmbeddings  # Import your embedding class
import cohere
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
cohere_api_key = os.getenv("COHERE_API_KEY")
co = cohere.Client(cohere_api_key)

# Initialize embedding function
embedding_function = CohereEmbeddings(co)

# Load the FAISS index
persist_directory = 'docs/faiss/'
vector_store = FAISS.load_local(persist_directory, embedding_function)

# Search the index
query = "your search query here"
results = vector_store.similarity_search(query, k=5)  # Get top 5 results

# Print results
for i, doc in enumerate(results):
    print(f"Result {i+1}:")
    print(f"Source: {doc.metadata.get('source', 'Unknown')}")
    print(f"Content: {doc.page_content[:200]}...")
    print("-" * 50)
""")