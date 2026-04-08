const diseaseRules = require("../data/diseaseRules");

const predictDiseaseFromSymptoms = (petType, symptoms = []) => {
  const normalizedPetType = (petType || "").toLowerCase();
  const normalizedSymptoms = symptoms.map((symptom) =>
    symptom.toLowerCase().trim()
  );

  const rules = diseaseRules[normalizedPetType] || [];

  let bestMatch = null;
  let bestScore = 0;

  for (const rule of rules) {
    const matchedSymptoms = rule.symptoms.filter((ruleSymptom) =>
      normalizedSymptoms.includes(ruleSymptom.toLowerCase())
    );

    const score = matchedSymptoms.length;

    if (score > bestScore) {
      bestScore = score;
      bestMatch = {
        ...rule,
        matchedSymptoms,
      };
    }
  }

  if (!bestMatch) {
    return {
      condition: "No strong match found",
      explanation:
        "The selected symptoms do not strongly match the current disease rules.",
      precautions: [
        "Monitor the pet carefully",
        "Note down all visible symptoms",
        "Consult a veterinarian for proper diagnosis",
      ],
      urgency: "Medium",
      matchedSymptoms: [],
    };
  }

  return bestMatch;
};

module.exports = { predictDiseaseFromSymptoms };
