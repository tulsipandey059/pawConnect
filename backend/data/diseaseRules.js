const diseaseRules = {
  dog: [
    {
      condition: "Skin Allergy / Dermatitis",
      symptoms: ["itching", "skin rash", "hair loss", "redness"],
      explanation:
        "This may be caused by allergy, skin irritation, insect bites, or poor hygiene.",
      precautions: [
        "Keep the affected area clean",
        "Do not use random creams",
        "Prevent scratching as much as possible",
      ],
      urgency: "Medium",
    },
    {
      condition: "Ear Infection",
      symptoms: ["ear scratching", "ear discharge", "bad smell", "head shaking"],
      explanation:
        "This may happen due to bacterial or fungal infection, or dirt buildup inside the ear.",
      precautions: [
        "Keep the ears clean and dry",
        "Do not insert sharp objects",
        "Consult a vet if discharge continues",
      ],
      urgency: "Medium",
    },
    {
      condition: "Respiratory Infection",
      symptoms: ["coughing", "fever", "nasal discharge", "sneezing"],
      explanation:
        "This may indicate a respiratory infection that affects normal breathing and comfort.",
      precautions: [
        "Keep the pet warm",
        "Give clean water",
        "Monitor breathing closely",
      ],
      urgency: "High",
    },
    {
      condition: "Wound / External Injury",
      symptoms: ["wound", "swelling", "bleeding", "limping"],
      explanation:
        "This may be an external injury, cut, or trauma that needs proper cleaning and care.",
      precautions: [
        "Clean the wound gently",
        "Avoid touching it too much",
        "Visit a vet if bleeding is severe",
      ],
      urgency: "High",
    },
  ],
  cat: [
    {
      condition: "Skin Allergy / Fungal Infection",
      symptoms: ["itching", "hair loss", "redness", "skin rash"],
      explanation:
        "This may happen due to fungal infection, allergy, mites, or skin irritation.",
      precautions: [
        "Keep the area clean",
        "Avoid using human medicines",
        "Prevent contact with other pets if infection is suspected",
      ],
      urgency: "Medium",
    },
    {
      condition: "Eye Infection / Irritation",
      symptoms: ["eye discharge", "redness", "swelling"],
      explanation:
        "This may be caused by irritation, allergy, or an eye infection.",
      precautions: [
        "Clean the eye area gently",
        "Do not use random eye drops",
        "Visit a vet if swelling increases",
      ],
      urgency: "High",
    },
    {
      condition: "Upper Respiratory Infection",
      symptoms: ["sneezing", "eye discharge", "fever", "nasal discharge"],
      explanation:
        "This is a common condition in cats and may affect breathing, eyes, and appetite.",
      precautions: [
        "Keep the cat warm",
        "Clean discharge carefully",
        "Watch for breathing problems",
      ],
      urgency: "High",
    },
  ],
};

module.exports = diseaseRules;
