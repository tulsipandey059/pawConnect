const fs = require("fs");
const OpenAI = require("openai");
const { buildPetHealthPrompt } = require("../utils/promptBuilder");

const apiKey = process.env.OPENAI_API_KEY;

let client = null;

if (apiKey) {
  client = new OpenAI({ apiKey });
}

const analyzePetImageAndSymptoms = async ({
  imagePath,
  petType,
  age,
  symptoms,
  notes,
  rulePrediction,
}) => {
  if (!client || !imagePath) {
    return null;
  }

  const imageBuffer = fs.readFileSync(imagePath);
  const base64Image = imageBuffer.toString("base64");

  const prompt = buildPetHealthPrompt({
    petType,
    age,
    symptoms,
    notes,
    rulePrediction,
  });

  const response = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "You are a careful veterinary guidance assistant. Give safe educational guidance only.",
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: prompt,
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${base64Image}`,
            },
          },
        ],
      },
    ],
  });

  const content = response.choices?.[0]?.message?.content;

  if (!content) {
    return null;
  }

  return JSON.parse(content);
};

module.exports = { analyzePetImageAndSymptoms };
