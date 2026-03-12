import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { indianCities } from '../data/pets';
import { usePets } from '../context/PetContext';

const AddPetPage = () => {
  const { addPet } = usePets();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    age: '',
    location: '',
    status: 'lost',
    description: '',
    image: null
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [showSimilar, setShowSimilar] = useState(false);

  const similarPets = [
    {
      id: 'similar-1',
      name: 'Buddy',
      breed: 'Golden Retriever',
      age: '2 years',
      location: 'Andheri, Mumbai',
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop',
      status: 'Lost',
      similarity: 92
    },
    {
      id: 'similar-2',
      name: 'Max',
      breed: 'German Shepherd',
      age: '3 years',
      location: 'Lodhi Gardens, Delhi',
      image: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=400&h=300&fit=crop',
      status: 'Found',
      similarity: 87
    },
    {
      id: 'similar-3',
      name: 'Charlie',
      breed: 'Beagle',
      age: '5 years',
      location: 'Koregaon Park, Pune',
      image: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=400&h=300&fit=crop',
      status: 'Found',
      similarity: 81
    }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFindSimilar = () => {
    setShowSimilar(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create pet object with proper status
    const petData = {
      name: formData.name,
      breed: formData.breed,
      age: formData.age,
      location: formData.location,
      status: formData.status,
      description: formData.description,
      image: imagePreview || 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop',
      price: formData.status === 'adoption' ? formData.price : null
    };

    // Add pet to context (global state)
    addPet(petData);
    
    // Show success message
    const message = formData.status === 'adoption' 
      ? 'Pet submitted for adoption successfully! You can view it in the browse section.'
      : 'Pet reported as lost successfully! You can view it in the browse section.';
    alert(message);
    
    // Navigate to browse page to see the new pet
    navigate('/browse');
  };

  return (
    <div className="min-h-screen bg-warm-beige py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-text-dark mb-4">
            {formData.status === 'lost' ? 'Report Lost Pet' : 'Put Up for Adoption'}
          </h1>
          <p className="text-text-dark/60 max-w-xl mx-auto">
            Help reunite a lost pet with their family or find a loving home for a pet in need.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-soft">
          {/* Status Selection */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-text-dark mb-3">What would you like to do?</label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, status: 'lost' }))}
                className={`flex-1 py-4 rounded-2xl font-medium transition-all duration-300 ${
                  formData.status === 'lost'
                    ? 'bg-red-100 text-red-600 border-2 border-red-300'
                    : 'bg-light-accent/30 text-text-dark/60 hover:bg-light-accent/50'
                }`}
              >
                🔍 Report Lost Pet
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, status: 'adoption' }))}
                className={`flex-1 py-4 rounded-2xl font-medium transition-all duration-300 ${
                  formData.status === 'adoption'
                    ? 'bg-green-100 text-green-600 border-2 border-green-300'
                    : 'bg-light-accent/30 text-text-dark/60 hover:bg-light-accent/50'
                }`}
              >
                🏠 Put Up for Adoption
              </button>
            </div>
          </div>

          {/* Image Upload */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-text-dark mb-3">Pet Photo</label>
            <div className="border-2 border-dashed border-primary-orange/30 rounded-3xl p-8 text-center hover:border-primary-orange/60 transition-colors duration-300 relative">
              {imagePreview ? (
                <div className="relative">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="max-h-64 mx-auto rounded-2xl"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setFormData(prev => ({ ...prev, image: null }));
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-300"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <>
                  <div className="text-5xl mb-4">📷</div>
                  <p className="text-text-dark/60 mb-2">Drag and drop or click to upload</p>
                  <p className="text-sm text-text-dark/40">PNG, JPG up to 5MB</p>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Find Similar Pets Button */}
          <div className="mb-8">
            <button
              type="button"
              onClick={handleFindSimilar}
              disabled={!imagePreview}
              className={`w-full py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center space-x-3 ${
                imagePreview 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:shadow-lg hover:-translate-y-1 shadow-soft'
                  : 'bg-light-accent/30 text-text-dark/50 cursor-not-allowed'
              }`}
            >
              <span>🔍</span>
              <span>Find Similar Pets</span>
            </button>
          </div>

          {/* Similar Pets Results */}
          {showSimilar && (
            <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-6 border border-blue-200">
              <h3 className="text-2xl font-bold text-text-dark mb-6 text-center">Similar Pets Found</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {similarPets.map((pet) => (
                  <div className="relative group">
                    <PetCard pet={pet} />
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-green-400 to-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg transform group-hover:scale-105 transition-all duration-300 z-10">
                      {pet.similarity}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-text-dark mb-3">Pet Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter pet's name"
              className="w-full px-6 py-4 rounded-2xl bg-light-accent/20 border-2 border-transparent focus:border-primary-orange focus:outline-none transition-colors duration-300 text-text-dark placeholder-text-dark/40"
              required
            />
          </div>

          {/* Breed and Age */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-text-dark mb-3">Breed</label>
              <input
                type="text"
                name="breed"
                value={formData.breed}
                onChange={handleChange}
                placeholder="e.g., Golden Retriever"
                className="w-full px-6 py-4 rounded-2xl bg-light-accent/20 border-2 border-transparent focus:border-primary-orange focus:outline-none transition-colors duration-300 text-text-dark placeholder-text-dark/40"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-dark mb-3">Age</label>
              <input
                type="text"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="e.g., 2 years"
                className="w-full px-6 py-4 rounded-2xl bg-light-accent/20 border-2 border-transparent focus:border-primary-orange focus:outline-none transition-colors duration-300 text-text-dark placeholder-text-dark/40"
                required
              />
            </div>
          </div>

          {/* Location - Dropdown with Indian Cities */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-text-dark mb-3">Location</label>
            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-6 py-4 rounded-2xl bg-light-accent/20 border-2 border-transparent focus:border-primary-orange focus:outline-none transition-colors duration-300 text-text-dark"
              required
            >
              <option value="">Select your city</option>
              {indianCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-text-dark mb-3">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your pet, including any distinguishing features, behavior, or medical conditions..."
              rows={5}
              className="w-full px-6 py-4 rounded-2xl bg-light-accent/20 border-2 border-transparent focus:border-primary-orange focus:outline-none transition-colors duration-300 text-text-dark placeholder-text-dark/40 resize-none"
              required
            />
          </div>

          {/* Adoption Fee (only show if adoption) */}
          {formData.status === 'adoption' && (
            <div className="mb-8">
              <label className="block text-sm font-medium text-text-dark mb-3">Adoption Fee (optional)</label>
              <input
                type="text"
                name="price"
                value={formData.price || ''}
                onChange={handleChange}
                placeholder="e.g., ₹2,000"
                className="w-full px-6 py-4 rounded-2xl bg-light-accent/20 border-2 border-transparent focus:border-primary-orange focus:outline-none transition-colors duration-300 text-text-dark placeholder-text-dark/40"
              />
            </div>
          )}

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              className="flex-1 bg-primary-orange text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-orange-400 transition-all duration-300 shadow-soft hover:shadow-lg hover:-translate-y-1"
            >
              {formData.status === 'lost' ? 'Report Pet' : 'Submit for Adoption'}
            </button>
            <Link
              to="/browse"
              className="flex-1 text-center bg-light-accent/30 text-text-dark px-8 py-4 rounded-full font-semibold text-lg hover:bg-light-accent/50 transition-all duration-300"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPetPage;

