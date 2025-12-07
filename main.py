import requests
import xml.etree.ElementTree as ET
import trafilatura
from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance, PointStruct
import cohere
from tqdm import tqdm
import time

# ============================= CONFIG =============================
SITEMAP_URL = "https://physical-ai-humanoid-robotics-book-tan.vercel.app/sitemap.xml"
COLLECTION_NAME = "humanoid_ai_book"

COHERE_API_KEY = "lMfsXuLN4JfcXRLZJX1qE5TTDv29XjxGYxRkSoMy"
EMBED_MODEL = "embed-english-v3.0"
BATCH_SIZE = 96

# Qdrant
qdrant = QdrantClient(
    url="https://17b20767-4f6f-4658-9281-bb8da2c51092.us-east4-0.gcp.cloud.qdrant.io:6333",
    api_key="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.semax-0E_qLmg2bJpvmggx21gxOaveIFGvB38dpEU60",
    timeout=60,
)

cohere_client = cohere.Client(COHERE_API_KEY)

session = requests.Session()
session.headers.update({"User-Agent": "Mozilla/5.0 (compatible; BookIngestor/1.0)"})


# ============================= 1. Get URLs =============================
def get_urls():
    print("Downloading sitemap...")
    xml = session.get(SITEMAP_URL, timeout=30).text
    root = ET.fromstring(xml)
    ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    urls = [elem.text for elem in root.findall(".//s:loc", ns)]
    print(f"Found {len(urls)} URLs\n")
    return urls


# ============================= 2. Extract Text (FIXED!) =============================
def extract_text(url):
    try:
        # Use direct requests.get() — trafilatura works fine with raw HTML string
        html = session.get(url, timeout=30).text
        text = trafilatura.extract(html, include_formatting=True, include_images=False)
        if text and len(text.strip()) > 100:
            return text.strip()
        else:
            print(f"  [SKIP] Empty or too short: {url}")
            return None
    except Exception as e:
        print(f"  [ERROR] {url} → {e}")
        return None


# ============================= 3. Chunk Text =============================
def chunk_text(text, max_chars=1500):
    paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]
    chunks = []
    current = ""

    for para in paragraphs:
        if len(current) + len(para) + 2 <= max_chars:
            current += ("\n\n" if current else "") + para
        else:
            if current:
                chunks.append(current)
            if len(para) > max_chars:
                # split long paragraph by sentences
                sentences = [s.strip() for s in para.replace(".\n", ". ").split(". ") if s]
                for s in sentences:
                    if len(current) + len(s) + 2 <= max_chars:
                        current += (". " if current else "") + s
                    else:
                        if current:
                            chunks.append(current + ".")
                        current = s
                if current and not current.endswith("."):
                    current += "."
            else:
                current = para

    if current:
        chunks.append(current)
    return [c for c in chunks if len(c) > 50]


# ============================= 4. Embed + Upload =============================
def embed_and_upload(chunks_with_meta):
    if not chunks_with_meta:
        return

    texts = [item["text"] for item in chunks_with_meta]
    print(f"\nEmbedding {len(texts)} chunks in batches of {BATCH_SIZE}...")

    for i in range(0, len(texts), BATCH_SIZE):
        batch = texts[i:i + BATCH_SIZE]
        batch_meta = chunks_with_meta[i:i + BATCH_SIZE]

        try:
            resp = cohere_client.embed(
                model=EMBED_MODEL,
                input_type="search_document",   # THIS IS CRITICAL
                texts=batch
            )
            vectors = resp.embeddings

            points = [
                PointStruct(
                    id=1000 + idx + i,  # simple IDs
                    vector=vec,
                    payload={
                        "url": meta["url"],
                        "text": meta["text"],
                    }
                )
                for idx, (vec, meta) in enumerate(zip(vectors, batch_meta))
            ]

            qdrant.upsert(collection_name=COLLECTION_NAME, points=points)
            print(f"  Uploaded batch {i//BATCH_SIZE + 1}/{(len(texts)-1)//BATCH_SIZE + 1}")

        except Exception as e:
            print(f"Embedding/upload failed: {e}")
            raise

        time.sleep(0.2)  # stay under rate limit


# ============================= 5. Create Collection =============================
def create_collection():
    if qdrant.collection_exists(COLLECTION_NAME):
        print(f"Deleting existing collection '{COLLECTION_NAME}'...")
        qdrant.delete_collection(COLLECTION_NAME)

    print(f"Creating collection '{COLLECTION_NAME}'...")
    qdrant.create_collection(
        collection_name=COLLECTION_NAME,
        vectors_config=VectorParams(size=1024, distance=Distance.COSINE),
    )


# ============================= MAIN =============================
def main():
    urls = get_urls()
    create_collection()

    all_chunks = []

    for url in tqdm(urls, desc="Processing pages"):
        print(f"\n→ {url}")
        text = extract_text(url)
        if not text:
            continue

        chunks = chunk_text(text)
        print(f"  Created {len(chunks)} chunks")
        for chunk in chunks:
            all_chunks.append({"text": chunk, "url": url})

    print(f"\nTotal chunks collected: {len(all_chunks)}")

    if all_chunks:
        embed_and_upload(all_chunks)
        print(f"\nSUCCESS! {len(all_chunks)} chunks stored in Qdrant collection '{COLLECTION_NAME}'")
    else:
        print("\nNo chunks were extracted. Something is wrong with the site.")

    # Final verification
    count = qdrant.get_collection(COLLECTION_NAME).points_count
    print(f"Qdrant now has {count} points.")


if __name__ == "__main__":
    main()