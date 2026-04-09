const buildServiceUrl = (path = "") => {
  const baseUrl =
    process.env.IMAGE_SIM_SERVICE_URL || "http://127.0.0.1:8000";
  return `${baseUrl.replace(/\/+$/, "")}${path}`;
};

const parseJsonResponse = async (response) => {
  const text = await response.text();

  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { error: text || "Invalid response from AI service" };
  }
};

const handleServiceError = (error) => {
  if (error?.cause?.code) {
    error.code = error.cause.code;
  }

  if (!error.message) {
    error.message = "Image similarity service request failed";
  }

  throw error;
};

const getEmbedding = async ({ imageUrl, petId }) => {
  try {
    const response = await fetch(buildServiceUrl("/embedding"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image_url: imageUrl,
        pet_id: petId,
      }),
    });

    const data = await parseJsonResponse(response);

    if (!response.ok) {
      const error = new Error(
        data.error || "Failed to generate image embedding"
      );
      error.status = response.status;
      throw error;
    }

    return data;
  } catch (error) {
    handleServiceError(error);
  }
};

const searchEmbedding = async ({ embedding, topK = 10 }) => {
  try {
    const response = await fetch(buildServiceUrl("/search"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        embedding,
        top_k: topK,
      }),
    });

    const data = await parseJsonResponse(response);

    if (!response.ok) {
      const error = new Error(data.error || "AI similarity search failed");
      error.status = response.status;
      throw error;
    }

    return data;
  } catch (error) {
    handleServiceError(error);
  }
};

module.exports = {
  getEmbedding,
  searchEmbedding,
};
