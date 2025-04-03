from flask import Flask, request, jsonify
from flask_cors import CORS
import traceback

# Import the RAG system class from the other file
from queryrun import FAISSQuerySystem

# --- Flask App Setup ---
app = Flask(__name__)
# Allow requests from any origin (adjust in production if needed)
CORS(app)

# --- Initialize the RAG system ONCE when the app starts ---
query_system = None # Global variable to hold the system instance
try:
    # This will execute the __init__ and load_index methods in FAISSQuerySystem
    print("Initializing RAG system for the Flask app...")
    query_system = FAISSQuerySystem()
    print("RAG system ready for queries.")
except Exception as e:
    # Log the critical failure if the RAG system can't initialize
    print("--- APPLICATION FAILED TO START: RAG SYSTEM INITIALIZATION ERROR ---")
    # The error details should have been printed by the rag_system constructor
    # query_system remains None


# --- API Endpoint ---
@app.route('/api/query', methods=['POST'])
def handle_query():
    # Check if the RAG system was successfully initialized
    if query_system is None:
        print("Error: Query received but RAG system is not initialized.")
        return jsonify({"error": "The backend RAG system failed to start. Please check server logs."}), 500

    # Check if request is JSON
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    # Get query from request body
    data = request.get_json()
    query = data.get('query')

    if not query:
        return jsonify({"error": "Missing 'query' field in request body"}), 400

    print(f"\nReceived query via API: {query}")

    try:
        # 1. Search for relevant documents using the initialized system
        print("Searching documents...")
        # Using k=5 to provide more context to the LLM
        search_results = query_system.search(query, k=5)
        print(f"Found {len(search_results)} relevant document chunks.")

        # 2. Generate response using the search results
        print("Generating response...")
        response_text = query_system.generate_response(query, search_results)
        print("Response generated.")

        # 3. Prepare source information for the frontend
        # Send back limited, structured info about the sources used
        sources_for_response = []
        for i, doc in enumerate(search_results):
            source_info = {
                "id": i + 1, # Simple ID for frontend use
                "score": round(doc['score'], 4),
                "metadata": doc.get('metadata', {}) # Send the whole metadata dict
                # Optionally, add a short preview if needed, but metadata is often enough
                # "content_preview": doc.get('content', '')[:100] + "..."
            }
            # Clean up metadata slightly for JSON if needed (e.g., convert non-serializable types)
            # For now, assume metadata is JSON-friendly
            sources_for_response.append(source_info)


        # 4. Return JSON response to the frontend
        return jsonify({
            "response": response_text,
            "sources": sources_for_response # Send the structured source info
        })

    except Exception as e:
        # Catch any errors during search or generation
        print(f"Error processing API query '{query}': {e}")
        traceback.print_exc() # Log the full error stacktrace to the server console
        # Return a generic error message to the frontend
        return jsonify({"error": "An internal error occurred while processing your query. Please try again."}), 500

# --- Main Execution Block ---
if __name__ == '__main__':
    # Runs the Flask development server
    # host='0.0.0.0' makes it accessible on your local network
    # port=5000 is the default Flask port
    print("Starting Flask server...")
    app.run(host='0.0.0.0', port=5000, debug=True, use_reloader=False)