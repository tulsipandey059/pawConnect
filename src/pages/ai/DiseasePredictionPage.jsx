import React, { useState } from 'react';

const DiseasePredictionPage = () => {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setResult(null);
  };

  const handlePredict = async () => {
    if (!image) return;
    
    setLoading(true);
    // Simulate AI prediction
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock results
    const predictions = [
      'Healthy - No visible symptoms',
      'Possible skin infection - Consult vet',
      'Eye infection detected',
      'Dental issues visible'
    ];
    setResult(predictions[Math.floor(Math.random() * predictions.length)]);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-warm-beige py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-text-dark mb-6">AI Pet Health Scanner</h1>
          <p className="text-xl text-text-dark/60 max-w-2xl mx-auto mb-8">
            Upload a photo of your pet to detect potential health issues instantly
          </p>
          <div className="inline-flex bg-primary-orange/90 text-white px-6 py-3 rounded-full text-lg font-semibold">
            Powered by AI Vision
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-3xl mx-auto">
          {/* Upload Area */}
          <div className="border-4 border-dashed border-light-accent rounded-3xl p-20 text-center hover:border-primary-orange transition-all duration-300 hover:bg-primary-orange/5 mb-12">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="pet-image"
            />
            <label htmlFor="pet-image" className="cursor-pointer block">
              <div className="text-6xl mb-6">🩺</div>
              <h3 className="text-2xl font-bold text-text-dark mb-2">Upload Pet Photo</h3>
              <p className="text-lg text-text-dark/60 mb-4">High-quality close-up photos work best</p>
              {image ? (
                <div className="mt-6">
                  <p className="text-primary-orange font-semibold">{image.name}</p>
                </div>
              ) : (
                <p className="text-text-dark/50">JPG, PNG up to 10MB</p>
              )}
            </label>
          </div>

          {/* Prediction Button */}
          {image && !loading && (
            <button
              onClick={handlePredict}
              className="w-full bg-gradient-to-r from-primary-orange to-orange-500 text-white py-6 px-8 rounded-3xl font-bold text-xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 mb-12"
            >
              🔍 Analyze Pet Health
            </button>
          )}

          {/* Loading */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-primary-orange mb-6"></div>
              <p className="text-xl text-text-dark/70">AI analyzing your pet's photo...</p>
              <p className="text-sm text-text-dark/50 mt-2">This takes about 3-5 seconds</p>
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-3xl p-10 text-center">
              <div className="text-6xl mb-6">✅</div>
              <h2 className="text-3xl font-bold text-green-800 mb-4">Analysis Complete!</h2>
              <p className="text-xl text-green-700 mb-8 leading-relaxed max-w-2xl mx-auto">
                {result}
              </p>
              <div className="space-y-2 text-green-700">
                <p>• Results are AI-generated estimates only</p>
                <p>• Always consult a licensed veterinarian for diagnosis</p>
                <p>• Accuracy improves with clear, well-lit photos</p>
              </div>
              <button
                onClick={() => setImage(null)}
                className="mt-8 bg-green-500 text-white px-8 py-3 rounded-2xl font-semibold hover:bg-green-600 transition-all"
              >
                Analyze Another Photo
              </button>
            </div>
          )}
        </div>

        <div className="mt-16 text-center text-sm text-text-dark/50 space-y-2">
          <p><strong>Disclaimer:</strong> PawConnect AI Health Scanner provides preliminary insights only.</p>
          <p>Professional veterinary diagnosis is essential for accurate treatment.</p>
        </div>
      </div>
    </div>
  );
};

export default DiseasePredictionPage;

