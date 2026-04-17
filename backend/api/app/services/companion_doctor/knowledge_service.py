from app.core.companion_config import companion_settings
from app.rag.companion_doctor.retriever import retrieve_companion_context


def get_support_context(query: str) -> tuple[str, list[dict[str, str]]]:
    documents = retrieve_companion_context(query, companion_settings.rag_top_k)
    if not documents:
        return "", []

    snippets = []
    metadata_rows = []
    for index, document in enumerate(documents, start=1):
        metadata_rows.append({
            "title": str(document.metadata.get("title", f"Snippet {index}")),
            "category": str(document.metadata.get("category", "general")),
            "lang": str(document.metadata.get("lang", "en")),
        })
        snippets.append(f"[{index}] {document.page_content}")

    return "\n\n".join(snippets), metadata_rows