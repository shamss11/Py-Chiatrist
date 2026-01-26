import os
import chromadb
from chromadb.utils import embedding_functions

# Configuration
CHROMA_DB_DIR = os.path.join(os.path.dirname(__file__), "chroma_db")
COLLECTION_NAME = "clinical_knowledge"

# Initialize ChromaDB
client = chromadb.PersistentClient(path=CHROMA_DB_DIR)
sentence_transformer_ef = embedding_functions.SentenceTransformerEmbeddingFunction(model_name="all-MiniLM-L6-v2")

collection = client.get_or_create_collection(
    name=COLLECTION_NAME,
    embedding_function=sentence_transformer_ef
)

def get_relevant_context(user_query, n_results=3):
    """
    Searches the clinical_knowledge database and returns the top n_results 
    most relevant psychological insights.
    """
    results = collection.query(
        query_texts=[user_query],
        n_results=n_results
    )
    
    # Flatten the list of documents and return
    return results['documents'][0] if results['documents'] else []

if __name__ == "__main__":
    # Test the search
    test_query = "anxiety and workplace stress"
    insights = get_relevant_context(test_query)
    print(f"Top 3 insights for '{test_query}':")
    for i, insight in enumerate(insights):
        print(f"{i+1}: {insight[:200]}...")
