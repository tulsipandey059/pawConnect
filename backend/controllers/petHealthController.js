const path = require("path");
const { predictDiseaseFromSymptoms } = require("../services/petDiseaseService");
const {
  analyzePetImageAndSymptoms,
} = require("../services/openaiVisionService");

const petHealthCheck = async (req, res) => {
  try {
    const { petType, age, symptoms, notes } = req.body;

    if (!petType) {
      return res.status(400).json({
        success: false,
        message: "Pet type is required",
      });
    }

    let parsedSymptoms = [];

    if (typeof symptoms === "string") {
      try {
        parsedSymptoms = JSON.parse(symptoms);
      } catch {
        parsedSymptoms = symptoms.split(",").map((item) => item.trim());
      }
    } else if (Array.isArray(symptoms)) {
      parsedSymptoms = symptoms;
    }

    const rulePrediction = predictDiseaseFromSymptoms(petType, parsedSymptoms);

    let aiResult = null;

    if (req.file) {
      const imagePath = path.resolve(req.file.path);
      console.log("Image uploaded:", imagePath);

      aiResult = await analyzePetImageAndSymptoms({
        imagePath,
        petType,
        age,
        symptoms: parsedSymptoms,
        notes,
        rulePrediction,
      });
    }

    const finalSuggestion = aiResult
      ? {
          possibleCondition:
            aiResult.possibleCondition || rulePrediction.condition,
          explanation: aiResult.explanation || rulePrediction.explanation,
          possibleCauses: aiResult.possibleCauses || [],
          basicCare: aiResult.basicCare || [],
          precautions: aiResult.precautions || rulePrediction.precautions,
          urgency: aiResult.urgency || rulePrediction.urgency,
          vetAdvice:
            aiResult.vetAdvice ||
            "Consult a veterinarian if symptoms continue or worsen.",
          disclaimer:
            aiResult.disclaimer ||
            "This is an AI-generated educational suggestion only and not a confirmed veterinary diagnosis.",
        }
      : {
          possibleCondition: rulePrediction.condition,
          explanation: rulePrediction.explanation,
          possibleCauses: [],
          basicCare: [
            "Keep the pet under observation",
            "Provide clean water",
            "Consult a vet if symptoms continue",
          ],
          precautions: rulePrediction.precautions,
          urgency: rulePrediction.urgency,
          vetAdvice:
            "This result is based mainly on symptom matching. Please consult a veterinarian for proper diagnosis.",
          disclaimer:
            "This is an educational suggestion only and not a confirmed veterinary diagnosis.",
        };

    return res.status(200).json({
      success: true,
      data: {
        petType,
        age,
        symptoms: parsedSymptoms,
        imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
        ruleBasedPrediction: {
          condition: rulePrediction.condition,
          explanation: rulePrediction.explanation,
          precautions: rulePrediction.precautions,
          urgency: rulePrediction.urgency,
          matchedSymptoms: rulePrediction.matchedSymptoms,
        },
        aiAnalysis: aiResult,
        finalSuggestion,
      },
    });
  } catch (error) {
    console.error("petHealthCheck error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while analyzing pet health",
    });
  }
};

module.exports = { petHealthCheck };
