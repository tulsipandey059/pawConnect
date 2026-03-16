import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePets } from '../../context/PetContext';
import { indianCities } from '../../data/pets';

const AddPetPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    age: '',
    gender: 'Male',
    status: 'Lost',
    location: '',
    tags: [],
    description: '',
    image: '',
    price: '',
    contact: ''
  });
  const [loading, setLoading] = useState(false);
  const { addPet } = usePets();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newPet = addPet(formData);
      alert('Pet added successfully!');
      navigate(`/pet/${newPet.id}`);
    } catch (error) {
      alert('Error adding pet. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTagToggle = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  return (
    <div className="min-h-screen bg-warm-beige py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-text-dark mb-4">
              {formData.status === 'Lost' ? 'Report Lost Pet' : formData.status === 'Found' ? 'Report Found Pet' : 'Add Pet for Adoption'}
            </h1>
            <p className="text-xl text-text-dark/60">
              Help reunite pets with their families or find them loving homes
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-text-dark mb-2">Pet Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-4 border border-light-accent rounded-2xl focus:ring-2 focus:ring-primary-orange focus:border-transparent transition-all"
                  placeholder="Buddy, Whiskers, etc."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-dark mb-2">Breed *</label>
                <input
                  type="text"
                  required
                  value={formData.breed}
                  onChange={(e) => setFormData({...formData, breed: e.target.value})}
                  className="w-full p-4 border border-light-accent rounded-2xl focus:ring-2 focus:ring-primary-orange focus:border-transparent transition-all"
                  placeholder="Golden Retriever, Persian, Indie, etc."
                />
              </div>
            </div>

            {/* Age & Gender */}
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-text-dark mb-2">Age</label>
                <input
                  type="text"
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  className="w-full p-4 border border-light-accent rounded-2xl focus:ring-2 focus:ring-primary-orange focus:border-transparent transition-all"
                  placeholder="2 years, 6 months, etc."
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-text-dark mb-2">Status *</label>
                <select
                  required
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full p-4 border border-light-accent rounded-2xl focus:ring-2 focus:ring-primary-orange focus:border-transparent transition-all appearance-none bg-white"
                >
                  <option value="Lost">Lost Pet</option>
                  <option value="Found">Found Pet</option>
                  <option value="Adoption">For Adoption</option>
                </select>
              </div>
            </div>

            {/* Location & Contact */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-text-dark mb-2">Location *</label>
                <input
                  type="text"
                  list="cities"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full p-4 border border-light-accent rounded-2xl focus:ring-2 focus:ring-primary-orange focus:border-transparent transition-all"
                  placeholder="Andheri, Mumbai, etc."
                />
                <datalist id="cities">
                  {indianCities.map(city => (
                    <option key={city} value={city} />
                  ))}
                </datalist>
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-dark mb-2">Contact Number</label>
                <input
                  type="tel"
                  value={formData.contact}
                  onChange={(e) => setFormData({...formData, contact: e.target.value})}
                  className="w-full p-4 border border-light-accent rounded-2xl focus:ring-2 focus:ring-primary-orange focus:border-transparent transition-all"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-text-dark mb-2">Pet Photo</label>
              <div className="border-2 border-dashed border-light-accent rounded-3xl p-12 text-center hover:border-primary-orange transition-colors cursor-pointer bg-gray-50 hover:bg-primary-orange/5">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({...formData, image: e.target.files[0]})}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="text-4xl mb-4">📸</div>
                  <p className="text-lg font-semibold text-text-dark mb-1">Upload Pet Photo</p>
                  <p className="text-text-dark/60">High quality photos help with AI matching (Max 10MB)</p>
                </label>
              </div>
              {formData.image && (
                <p className="mt-2 text-sm text-primary-orange font-medium">
                  {formData.image.name} selected
                </p>
              )}
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-semibold text-text-dark mb-4">Tags</label>
              <div className="flex flex-wrap gap-3">
                {['Dog', 'Cat', 'Friendly', 'Vaccinated', 'Indoor', 'Playful', 'Trained'].map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagToggle(tag)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      formData.tags.includes(tag)
                        ? 'bg-primary-orange text-white shadow-md'
                        : 'bg-light-accent/50 text-text-dark hover:bg-primary-orange/20'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <p className="text-xs text-text-dark/50 mt-2">Selected: {formData.tags.join(', ') || 'None'}</p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-text-dark mb-2">Description</label>
              <textarea
                rows="4"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full p-4 border border-light-accent rounded-3xl focus:ring-2 focus:ring-primary-orange focus:border-transparent transition-all resize-vertical"
                placeholder="Any identifying features, personality, last seen location, etc..."
              />
            </div>

            {/* Price (for adoption) */}
            {formData.status === 'Adoption' && (
              <div>
                <label className="block text-sm font-semibold text-text-dark mb-2">Adoption Fee (optional)</label>
                <input
                  type="text"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full p-4 border border-light-accent rounded-2xl focus:ring-2 focus:ring-primary-orange focus:border-transparent transition-all"
                  placeholder="₹3,000 (leave empty for free adoption)"
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-orange text-white py-6 px-8 rounded-3xl font-bold text-xl shadow-lg hover:bg-orange-500 hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  <span>Adding Pet...</span>
                </>
              ) : (
                'Submit Pet Report'
              )}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center text-sm text-text-dark/50">
          <p>By submitting, you agree to our <Link to="/terms" className="text-primary-orange hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-primary-orange hover:underline">Privacy Policy</Link></p>
        </div>
      </div>
    </div>
  );
};

export default AddPetPage;

