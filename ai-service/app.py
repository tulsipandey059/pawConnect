import base64
import json
import os
from io import BytesIO
from pathlib import Path

import clip
import faiss
import numpy as np
import requests
import torch
from flask import Flask, jsonify, request
from PIL import Image

app = Flask(__name__)

device = "cpu"
model, preprocess = clip.load("ViT-B/32", device=device)

dimension = 512
storage_dir = Path(
    os.getenv(
        "AI_SERVICE_STORAGE_DIR",
        Path(__file__).resolve().parent / "storage",
    )
)
storage_dir.mkdir(parents=True, exist_ok=True)
index_path = storage_dir / "image_index.faiss"
metadata_path = storage_dir / "image_db.json"


def normalize_embedding(embedding):
    matrix = np.asarray(embedding, dtype="float32")

    if matrix.ndim == 1:
        matrix = matrix.reshape(1, -1)

    faiss.normalize_L2(matrix)
    return matrix


def build_index(entries):
    next_index = faiss.IndexFlatIP(dimension)

    vectors = [
        entry["embedding"]
        for entry in entries
        if len(entry.get("embedding", [])) == dimension
    ]

    if vectors:
        next_index.add(normalize_embedding(np.array(vectors, dtype="float32")))

    return next_index


def load_image_db():
    if not metadata_path.exists():
        return []

    try:
        raw_entries = json.loads(metadata_path.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return []

    if not isinstance(raw_entries, list):
        return []

    valid_entries = []
    seen_pet_ids = set()

    for entry in raw_entries:
        pet_id = str(entry.get("pet_id", "")).strip()
        embedding = entry.get("embedding")

        if (
            not pet_id
            or pet_id in seen_pet_ids
            or not isinstance(embedding, list)
            or len(embedding) != dimension
        ):
            continue

        seen_pet_ids.add(pet_id)
        valid_entries.append({"pet_id": pet_id, "embedding": embedding})

    return valid_entries


def persist_state():
    global index

    index = build_index(image_db)
    faiss.write_index(index, str(index_path))
    metadata_path.write_text(json.dumps(image_db), encoding="utf-8")


def decode_image(image_url):
    if image_url.startswith("data:"):
        _, encoded = image_url.split(",", 1)
        return base64.b64decode(encoded)

    response = requests.get(image_url, timeout=15)
    response.raise_for_status()
    return response.content


def upsert_pet_embedding(pet_id, embedding):
    for index_value, entry in enumerate(image_db):
        if entry["pet_id"] == pet_id:
            image_db[index_value] = {"pet_id": pet_id, "embedding": embedding}
            return

    image_db.append({"pet_id": pet_id, "embedding": embedding})


image_db = load_image_db()
index = build_index(image_db)
persist_state()


@app.get("/health")
def health():
    return jsonify(
        {
            "success": True,
            "message": "Image similarity service is running",
            "indexed_images": len(image_db),
        }
    )


@app.post("/embedding")
def get_embedding():
    try:
        data = request.get_json(silent=True) or {}
        image_url = data.get("image_url")

        if not image_url:
            return jsonify({"error": "image_url is required"}), 400

        image_bytes = decode_image(image_url)
        image = Image.open(BytesIO(image_bytes)).convert("RGB")
        image = preprocess(image).unsqueeze(0).to(device)

        with torch.no_grad():
            embedding = model.encode_image(image)

        embedding = normalize_embedding(embedding.cpu().numpy().astype("float32"))

        pet_id = str(data.get("pet_id", "")).strip()
        if pet_id:
            upsert_pet_embedding(pet_id, embedding[0].tolist())
            persist_state()

        return jsonify({"embedding": embedding.tolist()[0]})
    except Exception as error:
        return jsonify({"error": str(error)}), 500


@app.post("/search")
def search_embedding():
    try:
        data = request.get_json(silent=True) or {}
        embedding = data.get("embedding")

        if embedding is None:
            return jsonify({"error": "embedding is required"}), 400

        if len(image_db) == 0:
            return jsonify({"matches": []})

        query_embedding = normalize_embedding(np.array(embedding, dtype="float32"))
        requested_k = int(data.get("top_k", 5))
        k = min(max(requested_k, 1), len(image_db))
        scores, indices = index.search(query_embedding, k)

        matches = []
        for entry_index, score in zip(indices[0], scores[0]):
            if 0 <= entry_index < len(image_db):
                matches.append(
                    {
                        "pet_id": image_db[entry_index]["pet_id"],
                        "score": max(0.0, min(1.0, (float(score) + 1.0) / 2.0)),
                    }
                )

        return jsonify({"matches": matches})
    except Exception as error:
        return jsonify({"error": str(error)}), 500


if __name__ == "__main__":
    port = int(os.getenv("AI_SERVICE_PORT", "8000"))
    app.run(host="0.0.0.0", port=port, debug=True)
