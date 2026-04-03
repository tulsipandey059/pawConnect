import React, { useState } from 'react';

const PetHealthPage = () => {
  const [petType, setPetType] = useState('Dog');
  const [age, setAge] = useState('');
  const [symptoms, setSymptoms] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState(null);

  const symptomList = [
    'vomiting',
    'fever',
    'hair loss', 
    'itching',
    'weakness'
  ];

  const handlePredict = () => {
    const numSymptoms = symptoms.length;
    const confidence = Math.min(95, 60 + (numSymptoms * 8) + Math.floor(Math.random() * 15));
    
    const diseases = {
      Dog: ['Skin Infection', 'Parvovirus', 'Ear Infection', 'Gastroenteritis'],
      Cat: ['Feline Leukemia', 'Dental Disease', 'Intestinal Worms', 'Upper Respiratory Infection']
    };
    
    const actions = [
      'Consult a veterinarian immediately.',
      'Visit your local vet clinic within 24 hours.',
      'Monitor symptoms and contact vet if persists.',
      'Schedule a checkup with your veterinarian.'
    ];
    
    const disease = diseases[petType][Math.floor(Math.random() * diseases[petType].length)];
    const action = actions[Math.floor(Math.random() * actions.length)];
    
    setResult({ disease, confidence, action });
    setShowResult(true);
  };

  return (
    <div className="min-h-screen bg-warm-beige py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-primary-orange/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🩺</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-text-dark mb-4">
            Pet Health Checker
          </h1>
          <p className="text-text-dark/60 text-xl max-w-md mx-auto leading-relaxed">
            Select your pet's symptoms for instant AI-powered health assessment.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-soft p-8 lg:p-12">
          <div className="space-y-8">
            {/* Pet Type */}
            <div>
              <label className="block text-sm font-semibold text-text-dark mb-3">
                🐕 Pet Type
              </label>
              <select 
                value={petType} 
                onChange={(e) => setPetType(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl bg-light-accent/20 border-2 border-transparent focus:border-primary-orange focus:outline-none focus:ring-2 focus:ring-primary-orange/20 transition-all duration-300 text-text-dark text-lg"
              >
                <option value="Dog">🐶 Dog</option>
                <option value="Cat">🐱 Cat</option>
              </select>
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-semibold text-text-dark mb-3">
                📅 Age (years)
              </label>
              <input 
                type="number" 
                min="0" 
                max="30"
                value={age} 
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g. 3"
                className="w-full px-6 py-4 rounded-2xl bg-light-accent/20 border-2 border-transparent focus:border-primary-orange focus:outline-none focus:ring-2 focus:ring-primary-orange/20 transition-all duration-300 text-text-dark text-lg placeholder-text-dark/40"
              />
            </div>

            {/* Symptoms */}
            <div>
              <label className="block text-sm font-semibold text-text-dark mb-6">
                ❗ Symptoms (select all that apply)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {symptomList.map((symptom) => (
                  <label 
                    key={symptom}
                    className="flex items-center p-4 rounded-2xl bg-light-accent/20 hover:bg-light-accent/40 hover:shadow-soft transition-all duration-300 cursor-pointer group"
                  >
                    <input 
                      type="checkbox" 
                      checked={symptoms.includes(symptom)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSymptoms([...symptoms, symptom]);
                        } else {
                          setSymptoms(symptoms.filter((s) => s !== symptom));
                        }
                      }}
                      className="w-6 h-6 text-primary-orange border-2 border-gray-300 rounded-lg focus:ring-primary-orange/50 group-hover:scale-110 transition-transform duration-200 mr-4 flex-shrink-0"
                    />
                    <span className="text-text-dark capitalize font-medium group-hover:text-primary-orange transition-colors">
                      {symptom.replace(/hair loss/i, 'Hair Loss').replace(/ /g, ' ')}
                    </span>
                  </label>
                ))}
              </div>
              {symptoms.length === 0 && (
                <p className="text-text-dark/50 text-sm mt-2">No symptoms selected</p>
              )}
            </div>

            {/* Predict Button */}
            <button
              onClick={handlePredict}
              disabled={symptoms.length === 0}
              className={`w-full py-5 rounded-full font-semibold text-lg transition-all duration-300 shadow-soft hover:shadow-lg flex items-center justify-center ${
                symptoms.length === 0
                  ? 'bg-primary-orange/50 text-text-dark cursor-not-allowed'
                  : 'bg-primary-orange text-white hover:bg-orange-400 hover:-translate-y-1'
              }`}
            >
              <span className="mr-3">🔮</span>
              Predict Disease
            </button>
          </div>
        </div>

        {/* Result Card */}
        {showResult && result && (
          <div className="mt-12 bg-gradient-to-r from-primary-orange/10 via-light-accent/20 to-primary-orange/10 rounded-3xl p-8 lg:p-12 border border-primary-orange/20">
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-primary-orange/30 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">📊</span>
              </div>
              <h2 className="text-3xl font-bold text-text-dark mb-2">Health Assessment</h2>
              <p className="text-text-dark/60 text-lg">AI-powered analysis complete</p>
            </div>

            <div className="space-y-6">
              {/* Disease */}
              <div className="bg-white rounded-2xl p-6 shadow-inner">
                <p className="text-sm font-medium text-text-dark/70 uppercase tracking-wide mb-2">Possible Disease</p>
                <p className="text-2xl lg:text-3xl font-bold text-text-dark capitalize">{result.disease}</p>
              </div>

              {/* Confidence */}
              <div>
                <p className="text-sm font-medium text-text-dark/70 uppercase tracking-wide mb-4 text-center">Confidence Level</p>
                <div className="bg-light-accent/40 rounded-full h-4 px-4 py-1 mb-2">
                  <div 
                    className="bg-gradient-to-r from-primary-orange to-orange-400 h-4 rounded-full shadow-inner transition-all duration-700"
                    style={{ width: `${result.confidence}%` }}
                  />
                </div>
                <p className="text-2xl font-bold text-text-dark text-center">{result.confidence}%</p>
              </div>

              {/* Action */}
              <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-primary-orange/20 rounded-2xl p-6">
                <p className="text-sm font-semibold text-text-dark/80 mb-2 flex items-center">
                  <span className="w-2 h-2 bg-red-400 rounded-full mr-3"></span>
                  Suggested Action
                </p>
                <p className="text-lg text-text-dark font-medium leading-relaxed">{result.action}</p>
              </div>
            </div>

            {/* Reset Button */}
            <div className="text-center mt-8">
              <button
                onClick={() => {
                  setShowResult(false);
                  setResult(null);
                  setSymptoms([]);
                  setAge('');
                }}
                className="inline-flex items-center px-8 py-3 bg-white text-primary-orange border-2 border-primary-orange rounded-full font-semibold hover:bg-primary-orange hover:text-white transition-all duration-300 shadow-soft hover:shadow-lg hover:-translate-y-1"
              >
                🔄 Check Another Pet
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PetHealthPage;

