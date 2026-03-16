import React, { useState } from 'react';

const BreedDetectionPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState(null);
  const [isDetecting, setIsDetecting] = useState(false);

  const breeds = [
    { name: 'Golden Retriever', description: 'Friendly and family-oriented dog known for loyalty and gentle temperament.' },
    { name: 'Labrador Retriever', description: 'Energetic, loving companion perfect for active families and outdoor adventures.' },
    { name: 'German Shepherd', description: 'Intelligent, courageous working dog often used in police and protection roles.' },
    { name: 'Bulldog', description: 'Loyal, courageous companion with a calm demeanor despite distinctive appearance.' },
    { name: 'Poodle', description: 'Elegant, intelligent breed known for hypoallergenic coat and athletic abilities.' },
    { name: 'Beagle', description: 'Merry, friendly hound with exceptional sense of smell and curious personality.' },
    { name: 'Rottweiler', description: 'Confident, powerful guardian breed with strong protective instincts.' },
    { name: 'Persian Cat', description: 'Elegant, affectionate cat with beautiful long fur and calm personality.' },
    { name: 'Siamese Cat', description: 'Vocal, social cat that forms strong bonds with vocal communication.' },
    { name: 'Maine Coon', description: 'Gentle giant known for sociable nature and impressive size.' }
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setShowResult(false);
      setResult(null);
    }
  };

  const handleDetect = () => {
    if (!selectedFile) return;
    
    setIsDetecting(true);
    setTimeout(() => {
      const randomBreed = breeds[Math.floor(Math.random() * breeds.length)];
      const confidence = Math.floor(Math.random() * 19) + 80; // 80-98%
      
      setResult({
        breed: randomBreed.name,
        confidence,
        description: randomBreed.description
      });
      setShowResult(true);
      setIsDetecting(false);
    }, 2000); // Simulate AI processing
  };

  const reset = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setShowResult(false);
    setResult(null);
    setIsDetecting(false);
  };

  return (
    <div className="min-h-screen bg-warm-beige py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-primary-orange/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🔍</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-text-dark mb-4">
            Detect Pet Breed
          </h1>
          <p className="text-text-dark/60 text-xl max-w-md mx-auto leading-relaxed">
            Upload your pet photo for instant AI-powered breed identification.
          </p>
        </div>

        {/* Upload & Form Card */}
        <div className="bg-white rounded-3xl shadow-soft p-8 lg:p-12 mb-8">
          <div className="space-y-8">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-text-dark mb-4">
                📸 Upload Pet Photo
              </label>
              <div className="border-2 border-dashed border-primary-orange/30 rounded-3xl p-8 text-center hover:border-primary-orange/50 transition-colors duration-300 bg-light-accent/20">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center space-y-4"
                >
                  {imagePreview ? (
                    <>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-48 h-48 object-cover rounded-2xl shadow-lg mx-auto"
                      />
                      <span className="text-text-dark font-medium">{selectedFile.name}</span>
                    </>
                  ) : (
                    <>
                      <div className="w-20 h-20 bg-primary-orange/20 rounded-2xl flex items-center justify-center mx-auto">
                        <span className="text-3xl">📷</span>
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-text-dark">Click to upload</p>
                        <p className="text-text-dark/50 text-sm">PNG, JPG up to 10MB</p>
                      </div>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* Detect Button */}
            <button
              onClick={handleDetect}
              disabled={!selectedFile || isDetecting}
              className={`w-full py-5 rounded-full font-semibold text-lg transition-all duration-300 shadow-soft hover:shadow-lg flex items-center justify-center ${
                selectedFile && !isDetecting
                  ? 'bg-primary-orange text-white hover:bg-orange-400 hover:-translate-y-1'
                  : 'bg-primary-orange/50 text-text-dark cursor-not-allowed'
              }`}
            >
              {isDetecting ? (
                <>
                  <span className="mr-3">⏳</span>
                  Detecting breed...
                </>
              ) : (
                <>
                  <span className="mr-3">🔮</span>
                  Detect Breed
                </>
              )}
            </button>
          </div>
        </div>

        {/* Result Card */}
        {showResult && result && (
          <div className="bg-gradient-to-r from-primary-orange/10 via-light-accent/20 to-primary-orange/10 rounded-3xl p-8 lg:p-12 border border-primary-orange/20">
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-primary-orange/30 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">📊</span>
              </div>
              <h2 className="text-3xl font-bold text-text-dark mb-2">Breed Detection Complete</h2>
              <p className="text-text-dark/60 text-lg">AI analysis results</p>
            </div>

            <div className="space-y-6">
              {/* Breed Name */}
              <div className="bg-white rounded-2xl p-6 shadow-inner">
                <p className="text-sm font-medium text-text-dark/70 uppercase tracking-wide mb-2">Detected Breed</p>
                <p className="text-2xl lg:text-3xl font-bold text-text-dark capitalize">{result.breed}</p>
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

              {/* Description */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-primary-orange/20">
                <p className="text-sm font-semibold text-text-dark/80 mb-3 flex items-center">
                  <span className="w-2 h-2 bg-primary-orange rounded-full mr-3"></span>
                  Breed Description
                </p>
                <p className="text-lg text-text-dark/90 font-medium leading-relaxed">{result.description}</p>
              </div>
            </div>

            {/* Reset Button */}
            <div className="text-center mt-8">
              <button
                onClick={reset}
                className="inline-flex items-center px-8 py-3 bg-white text-primary-orange border-2 border-primary-orange rounded-full font-semibold hover:bg-primary-orange hover:text-white transition-all duration-300 shadow-soft hover:shadow-lg hover:-translate-y-1"
              >
                🔄 Detect Another Breed
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BreedDetectionPage;

