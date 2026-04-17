from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document

from app.core.logging import get_logger
from app.rag.companion_doctor.loader import load_companion_documents
from app.rag.embedder import get_embeddings

logger = get_logger(__name__)

_vectorstore: FAISS | None = None


def _get_vectorstore() -> FAISS:
    global _vectorstore
    if _vectorstore is None:
        documents = load_companion_documents()
        _vectorstore = FAISS.from_documents(documents, get_embeddings())
        logger.info("Companion knowledge base loaded into in-memory FAISS retriever")
    return _vectorstore


def retrieve_companion_context(query: str, limit: int) -> list[Document]:
    if not query.strip():
        return []
    vectorstore = _get_vectorstore()
    return vectorstore.similarity_search(query, k=limit)