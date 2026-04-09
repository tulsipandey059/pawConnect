import os
from io import BytesIO

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
index = faiss.IndexFlatL2(dimension)
image_db = []


@app.get("/health")
def health():
    return jsonify({"success": True, "message": "Image similarity service is running"})


@app.post("/embedding")
def get_embedding():
    try:
        data = request.get_json(silent=True) or {}
        image_url = data.get("image_url")

        if not image_url:
            return jsonify({"error": "image_url is required"}), 400

        response = requests.get(image_url, timeout=15)
        response.raise_for_status()

        image = Image.open(BytesIO(response.content)).convert("RGB")
        image = preprocess(image).unsqueeze(0).to(device)

        with torch.no_grad():
            embedding = model.encode_image(image)

        embedding = embedding.cpu().numpy().astype("float32")

        pet_id = data.get("pet_id")
        if pet_id:
            index.add(embedding)
            image_db.append({"pet_id": str(pet_id)})

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

        query_embedding = np.array(embedding).astype("float32")
        requested_k = int(data.get("top_k", 5))

        if len(image_db) == 0:
            return jsonify({"matches": []})

        k = min(max(requested_k, 1), len(image_db))
        distances, indices = index.search(np.array([query_embedding]), k)

        matches = []
        for idx, distance in zip(indices[0], distances[0]):
            if 0 <= idx < len(image_db):
                pet = image_db[idx]
                score = 1 / (1 + float(distance))
                matches.append(
                    {
                        "pet_id": pet["pet_id"],
                        "score": score,
                    }
                )

        return jsonify({"matches": matches})
    except Exception as error:
        return jsonify({"error": str(error)}), 500


if __name__ == "__main__":
    port = int(os.getenv("AI_SERVICE_PORT", "8000"))
    app.run(host="0.0.0.0", port=port, debug=True)
