import cohere
import numpy as np
import faiss
import pickle
import os
import traceback # Import traceback for detailed error printing
from dotenv import load_dotenv
from langchain_community.docstore.document import Document
# Corrected import based on the deprecation warning
from langchain_community.docstore.in_memory import InMemoryDocstore
from openai import OpenAI

# Load environment variables
load_dotenv()
cohere_api_key = os.getenv("COHERE_API_KEY")
api_key = os.getenv("DEEPKEY")

# Initialize OpenAI client with minimal configuration
client = OpenAI(
    api_key=api_key,
    base_url="https://api.deepseek.com/v1"
)

# Initialize Cohere client
if not cohere_api_key:
    raise ValueError("COHERE_API_KEY not found in environment variables")
co = cohere.Client(cohere_api_key)

# --- Custom Cohere Embeddings Class (for query embedding) ---
class CohereEmbeddingsForQuery:
    def __init__(self, client):
        self.client = client
        self.embed_dim = self._get_embed_dim()

    def _get_embed_dim(self):
        try:
            response = self.client.embed(
                texts=["test"], model="embed-english-v3.0", input_type="search_query"
            )
            return len(response.embeddings[0])
        except Exception as e:
            print(f"Warning: Could not determine embedding dimension automatically: {e}. Defaulting to 4096.")
            return 4096

    def embed_query(self, text):
        try:
            response = self.client.embed(
                texts=[str(text)],
                model="embed-english-v3.0",
                input_type="search_query"
            )
            if hasattr(response, 'embeddings') and len(response.embeddings) > 0:
                return np.array(response.embeddings[0]).astype('float32')
            else:
                print("Warning: No query embedding found in the response. Returning zero vector.")
                return np.zeros(self.embed_dim, dtype=np.float32)
        except Exception as e:
            print(f"Query embedding error: {e}")
            return np.zeros(self.embed_dim, dtype=np.float32)

# --- FAISS Query System ---
class FAISSQuerySystem:
    def __init__(self, persist_dir='docs/faiss/'):
        self.persist_dir = persist_dir
        self.index = None
        self.documents = [] # List to hold LangChain Document objects
        self.metadata_list = [] # List to hold metadata dictionaries
        self.embedding_function = CohereEmbeddingsForQuery(co) # Use the query-specific class
        self.load_index()

    def stream_chat_completions(self, input_text):
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {"role": "system", "content": "Your job is to make text more appealing by adding emojis, formatting, and other enhancements. Do not include any awkward markup though."},
                {"role": "user", "content": input_text},
            ],
            stream=False
        )
        try:
            resp = response.choices[0].message.content.split("\n---")[1]
        except:
            resp = response.choices[0].message.content
        # Extracting just the core content without the extra sections
        resp = resp.replace('**', '')  # Remove bold formatting
        resp = resp.replace('*', '') 
        return resp


    def load_index(self):
        """Load the FAISS index and associated document/metadata files"""
        faiss_index_path = os.path.join(self.persist_dir, "index.faiss")
        pkl_path = os.path.join(self.persist_dir, "index.pkl")
        metadata_path = os.path.join(self.persist_dir, "metadata.pkl")

        print(f"Loading FAISS index from: {faiss_index_path}")
        print(f"Loading docstore info from: {pkl_path}")
        print(f"Loading separate metadata from: {metadata_path}")

        if not os.path.exists(faiss_index_path) or not os.path.exists(pkl_path):
             raise FileNotFoundError(f"Required index files (index.faiss, index.pkl) not found in {self.persist_dir}")

        try:
            # 1. Load FAISS index
            self.index = faiss.read_index(faiss_index_path)
            print(f"FAISS index loaded successfully with {self.index.ntotal} vectors.")

            # 2. Load LangChain docstore pickle file
            with open(pkl_path, 'rb') as f:
                # *** CORRECTED: Swap variable names based on the error log ***
                # The error indicated the first item was the Docstore, second was the dict
                docstore, index_to_docstore_id = pickle.load(f)

            # Verify the types after loading
            print(f"Docstore object loaded. Type: {type(docstore)}")
            print(f"Index-to-ID mapping loaded. Type: {type(index_to_docstore_id)}")

            # Now this line should work
            if isinstance(index_to_docstore_id, dict):
                 print(f"Mapping contains {len(index_to_docstore_id)} entries.")
            else:
                 # This case should ideally not happen now, but good to have a check
                 raise TypeError(f"Expected index_to_docstore_id to be a dict, but got {type(index_to_docstore_id)}")

            if not isinstance(docstore, InMemoryDocstore):
                 # Add a check for the docstore type too
                 print(f"Warning: Expected docstore to be InMemoryDocstore, but got {type(docstore)}")


            # 3. Reconstruct the list of documents in FAISS index order
            self.documents = []
            num_vectors = self.index.ntotal

            # Verify consistency
            if num_vectors != len(index_to_docstore_id):
                 print(f"Warning: FAISS index size ({num_vectors}) does not match mapping size ({len(index_to_docstore_id)}). Reconstruction might be incomplete.")

            print("Reconstructing document list...")
            reconstructed_count = 0
            missing_in_mapping = 0
            missing_in_docstore = 0
            # Ensure docstore has the 'search' method needed.
            if not hasattr(docstore, 'search'):
                raise AttributeError(f"Loaded docstore object (type: {type(docstore)}) does not have a 'search' method.")

            for i in range(num_vectors):
                docstore_id = index_to_docstore_id.get(i)
                if docstore_id:
                    # Use the correct method for InMemoryDocstore to retrieve by ID
                    doc = docstore.search(docstore_id)
                    if doc:
                        self.documents.append(doc)
                        reconstructed_count += 1
                    else:
                        print(f"Warning: Document with ID '{docstore_id}' (for FAISS index {i}) not found in the loaded docstore.")
                        missing_in_docstore += 1
                else:
                    print(f"Warning: No docstore ID found in mapping for FAISS index {i}.")
                    missing_in_mapping += 1

            print(f"Successfully reconstructed {reconstructed_count} documents.")
            if missing_in_mapping > 0: print(f"Could not find mapping for {missing_in_mapping} indices.")
            if missing_in_docstore > 0: print(f"Could not find {missing_in_docstore} documents in docstore despite having mapping.")


            # 4. Load the separate metadata list
            if os.path.exists(metadata_path):
                with open(metadata_path, 'rb') as f:
                    self.metadata_list = pickle.load(f)
                print(f"Loaded separate metadata list with {len(self.metadata_list)} entries.")

                if len(self.metadata_list) != len(self.documents):
                    print(f"Warning: Mismatch between reconstructed documents ({len(self.documents)}) and loaded metadata list ({len(self.metadata_list)}).")
                    print("Falling back to using metadata attached to Document objects if available.")
                    self.metadata_list = [getattr(doc, 'metadata', {}) for doc in self.documents]
                elif not self.documents and self.metadata_list:
                     print("Warning: Loaded metadata but no documents were reconstructed. Discarding metadata.")
                     self.metadata_list = []

            else:
                print("Warning: Separate metadata file (metadata.pkl) not found.")
                print("Attempting to use metadata attached to Document objects.")
                self.metadata_list = [getattr(doc, 'metadata', {}) for doc in self.documents]

            print(f"Final document count: {len(self.documents)}")
            print(f"Final metadata count: {len(self.metadata_list)}")

        except FileNotFoundError as e:
             print(f"Error loading index files: {e}")
             raise
        except Exception as e:
            print(f"An unexpected error occurred during index loading: {e}")
            traceback.print_exc()
            raise

    def search(self, query, k=3):
        """Search the index and return relevant documents with metadata and scores"""
        if not self.index or self.index.ntotal == 0:
            print("Warning: FAISS index is not loaded or is empty.")
            return []
        if not self.documents:
            print("Warning: No documents were successfully loaded.")
            return []

        actual_k = min(k, len(self.documents))
        if actual_k == 0:
             return []

        query_embedding = self.embedding_function.embed_query(query)
        if np.all(query_embedding == 0):
             print("Warning: Query embedding failed, search may be ineffective.")

        query_embedding_batch = np.array([query_embedding])
        distances, indices = self.index.search(query_embedding_batch, actual_k)
        results = []
        retrieved_indices = indices[0]

        for i, idx in enumerate(retrieved_indices):
            if idx == -1:
                continue

            if idx < len(self.documents):
                doc = self.documents[idx]
                metadata = self.metadata_list[idx] if idx < len(self.metadata_list) else getattr(doc, 'metadata', {})
                distance = distances[0][i]
                similarity_score = 1.0 / (1.0 + distance) # Basic L2 -> Similarity

                results.append({
                    "content": getattr(doc, 'page_content', str(doc)),
                    "metadata": metadata,
                    "score": float(similarity_score)
                })
            else:
                print(f"Warning: Search returned index {idx} which is out of bounds for loaded documents ({len(self.documents)}).")

        results.sort(key=lambda x: x['score'], reverse=True)
        return results

    def generate_response(self, query, context_docs):
        """Generate RAG response using Cohere's chat API"""
        if not context_docs:
            print("No context documents provided to generate_response.")
            try:
                 response = co.chat(
                    message=f"I could not find relevant documents in my knowledge base to answer your question: '{query}'. Please try rephrasing or asking about topics covered in the source material.",
                    model="command-r-plus",
                    temperature=0.3,
                    preamble="You are an AI assistant explaining limitations."
                 )
                 return response.text
            except Exception as e:
                 print(f"Error calling Cohere even without documents: {e}")
                 return "I could not find relevant documents and encountered an error trying to respond."

        formatted_docs = []
        for i, doc in enumerate(context_docs):
            content_preview = doc['content'][:3000]
            doc_info = f"Source: {doc['metadata'].get('source', 'Unknown')}\n"
            doc_info += f"Type: {doc['metadata'].get('type', 'Unknown')}\n"
            doc_info += f"Content Snippet: {content_preview}"
            formatted_docs.append({"title": f"Document {i+1} (Source: {doc['metadata'].get('source', 'Unknown')})", "snippet": doc_info})

        try:
            response = co.chat(
                message=query,
                documents=formatted_docs,
                model="command-r-plus",
                temperature=0.3,
                prompt_truncation='AUTO',
                preamble="You are an expert AI assistant. Answer the user's question based *only* on the provided document snippets. Cite the source document number (e.g., [Document 1]) when using information from it. If the answer isn't in the documents, state that clearly."
            )
            return self.stream_chat_completions(response.text)
        except Exception as e:
             print(f"Error during Cohere chat API call: {e}")
             traceback.print_exc()
             return "Sorry, I encountered an error while trying to generate a response using the retrieved documents."

def main():
    try:
        # Initialize query system
        query_system = FAISSQuerySystem() # Defaults to 'docs/faiss/'

        # Interactive query loop
        print("\n--- FAISS RAG Query System ---")
        print("Ask questions about the content indexed from web, PDFs, and audio.")
        print("Type 'exit' or 'quit' to stop.")

        while True:
            query = input("\nYour question: ")
            if query.lower() in ('exit', 'quit'):
                print("Exiting...")
                break
            if not query:
                continue

            try:
                # 1. Search for relevant documents
                print("Searching for relevant documents...")
                docs = query_system.search(query, k=5) # Get top 5 results

                if not docs:
                    print("Could not find relevant documents in the knowledge base.")
                    response = query_system.generate_response(query, [])
                    print("\nResponse:")
                    print("-" * 50)
                    print(response)
                    print("-" * 50)
                    continue

                print(f"Found {len(docs)} relevant document chunks.")

                # 2. Generate and display response using RAG
                print("Generating response based on documents...")
                response = query_system.generate_response(query, docs)
                print("\nResponse:")
                print("-" * 50)
                print(response)
                print("-" * 50)

                # 3. Show sources (optional)
                print("\nRetrieved Sources (Snippets):")
                for i, doc in enumerate(docs, 1):
                    print(f"\n--- Source {i} ---")
                    print(f"  Score: {doc['score']:.4f}")
                    print(f"  Source File: {doc['metadata'].get('source', 'Unknown')}")
                    print(f"  Type: {doc['metadata'].get('type', 'Unknown')}")
                    if 'page' in doc['metadata']:
                         print(f"  Page (PDF): {doc['metadata']['page']}")
                    print(f"  Content: {doc['content'][:250]}...")

            except Exception as e:
                print(f"\nAn error occurred while processing your query: {e}")
                traceback.print_exc()

    except FileNotFoundError as e:
         print(f"\nInitialization Error: Could not find necessary index files.")
         print(f"Details: {e}")
         print("Please ensure you have run the indexing script first and the 'docs/faiss/' directory contains 'index.faiss' and 'index.pkl'.")
    except Exception as e:
        print(f"\nA critical initialization error occurred: {e}")
        traceback.print_exc()

if __name__ == "__main__":
    main()