import json
from pathlib import Path

from langchain_core.documents import Document

from app.core.companion_config import companion_settings


def load_companion_documents() -> list[Document]:
    payload = json.loads(Path(companion_settings.knowledge_base_path).read_text(encoding="utf-8"))
    documents: list[Document] = []
    for item in payload.get("documents", []):
        documents.append(
            Document(
                page_content=item["content"],
                metadata={
                    "id": item["id"],
                    "title": item["title"],
                    "category": item["category"],
                    "lang": item.get("lang", "en"),
                    "source": item.get("source", "internal"),
                },
            )
        )
    return documents