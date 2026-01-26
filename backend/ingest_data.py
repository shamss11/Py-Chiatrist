import os
import chromadb
from chromadb.utils import embedding_functions
from pypdf import PdfReader
import uuid

# Configuration
KNOWLEDGE_BASE_DIR = os.path.join(os.path.dirname(__file__), "..", "knowledge_base")
CHROMA_DB_DIR = os.path.join(os.path.dirname(__file__), "chroma_db")
COLLECTION_NAME = "clinical_knowledge"

# Initialize ChromaDB
client = chromadb.PersistentClient(path=CHROMA_DB_DIR)

# Use Sentence-Transformers for local embeddings
# This will download the model 'all-MiniLM-L6-v2' on first run
sentence_transformer_ef = embedding_functions.SentenceTransformerEmbeddingFunction(model_name="all-MiniLM-L6-v2")

collection = client.get_or_create_collection(
    name=COLLECTION_NAME,
    embedding_function=sentence_transformer_ef
)

def chunk_text(text, chunk_size=500):
    """Splits text into chunks of roughly chunk_size characters."""
    return [text[i:i + chunk_size] for i in range(0, len(text), chunk_size)]

def process_pdf(file_path):
    """Extracts text from a PDF file."""
    reader = PdfReader(file_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
    return text

def process_txt(file_path):
    """Reads text from a TXT file."""
    with open(file_path, "r", encoding="utf-8") as f:
        return f.read()

def ingest_knowledge():
    """Processes all files in the knowledge_base directory and stores chunks in ChromaDB."""
    if not os.path.exists(KNOWLEDGE_BASE_DIR):
        print(f"Directory {KNOWLEDGE_BASE_DIR} not found.")
        return

    files = os.listdir(KNOWLEDGE_BASE_DIR)
    if not files:
        print("No files found in knowledge_base.")
        return

    for filename in files:
        file_path = os.path.join(KNOWLEDGE_BASE_DIR, filename)
        print(f"Processing {filename}...")
        
        content = ""
        if filename.endswith(".pdf"):
            content = process_pdf(file_path)
        elif filename.endswith(".txt"):
            content = process_txt(file_path)
        else:
            continue

        chunks = chunk_text(content)
        ids = [str(uuid.uuid4()) for _ in chunks]
        metadatas = [{"source": filename} for _ in chunks]
        
        collection.add(
            documents=chunks,
            ids=ids,
            metadatas=metadatas
        )
        print(f"Added {len(chunks)} chunks from {filename} to collection '{COLLECTION_NAME}'.")

if __name__ == "__main__":
    ingest_knowledge()
