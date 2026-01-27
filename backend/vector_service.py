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
    
    # Flatten the list of documents and metadatas, then return as a list of dicts
    if not results['documents'] or not results['documents'][0]:
        return []
        
    contexts = []
    for doc, meta in zip(results['documents'][0], results['metadatas'][0]):
        contexts.append({
            "content": doc,
            "source": meta.get("source", "Unknown Source")
        })
    return contexts

if __name__ == "__main__":
    # Test the search
    test_query = "anxiety and workplace stress"
    insights = get_relevant_context(test_query)
    print(f"Top 3 insights for '{test_query}':")
    for i, insight in enumerate(insights):
        print(f"{i+1}: {insight[:200]}...")
