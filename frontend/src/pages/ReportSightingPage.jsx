import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePets } from '../context/PetContext';

const ReportSightingPage = () => {
  const { petId } = useParams();
  const { getPetById } = usePets();
  const pet = getPetById(petId);
  
  const [formData, setFormData] = useState({
    location: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    notes: '',
    contactName: '',
    contactPhone: '',
    contactEmail: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would send data to a backend
    console.log('Sighting report submitted:', { petId, ...formData });
    setSubmitted(true);
  };

  if (!pet) {
    return (
      <div className="min-h-screen bg-warm-beige flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😿</div>
          <h2 className="text-2xl font-bold text-text-dark mb-2">Pet Not Found</h2>
          <Link to="/browse" className="text-primary-orange hover:underline">
            Browse other pets
          </Link>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-warm-beige flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 shadow-soft max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">✓</span>
          </div>
          <h2 className="text-2xl font-bold text-text-dark mb-2">Report Submitted!</h2>
          <p className="text-text-dark/60 mb-6">
            Thank you for reporting the sighting. The owner will be notified and may contact you for more details.
          </p>
          <div className="space-y-3">
            <Link 
              to={`/pet/${petId}`}
              className="block w-full bg-primary-orange text-white py-3 rounded-full font-semibold hover:bg-orange-400 transition-colors duration-300"
            >
              Back to {pet.name}'s Page
            </Link>
            <Link 
              to="/browse"
              className="block w-full bg-light-accent/30 text-text-dark py-3 rounded-full font-semibold hover:bg-light-accent/50 transition-colors duration-300"
            >
              Browse More Pets
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-beige py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <Link 
          to={`/pet/${petId}`}
          className="inline-flex items-center text-text-dark/70 hover:text-primary-orange transition-colors duration-300 mb-6"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to {pet.name}
        </Link>

        {/* Header */}
        <div className="bg-white rounded-3xl p-6 shadow-soft mb-6">
          <div className="flex items-center space-x-4">
            <img 
              src={pet.image} 
              alt={pet.name}
              className="w-16 h-16 rounded-xl object-cover"
            />
            <div>
              <h1 className="text-2xl font-bold text-text-dark">Report Sighting</h1>
              <p className="text-text-dark/60">Saw {pet.name}? Let us know!</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 shadow-soft space-y-6">
          {/* Pet Info Alert */}
          <div className="bg-primary-orange/10 border border-primary-orange/20 rounded-2xl p-4">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">📍</span>
              <div>
                <p className="font-medium text-text-dark">You are reporting a sighting for:</p>
                <p className="text-text-dark/70">{pet.name} - Last seen near {pet.location}</p>
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-text-dark font-medium mb-2">
              Where did you see them? *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              placeholder="Enter the location (area, landmark, street name)"
              className="w-full px-5 py-3 rounded-2xl bg-light-accent/20 border-2 border-transparent focus:border-primary-orange focus:outline-none transition-colors duration-300 text-text-dark placeholder-text-dark/40"
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-text-dark font-medium mb-2">
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-5 py-3 rounded-2xl bg-light-accent/20 border-2 border-transparent focus:border-primary-orange focus:outline-none transition-colors duration-300 text-text-dark"
              />
            </div>
            <div>
              <label className="block text-text-dark font-medium mb-2">
                Time *
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="w-full px-5 py-3 rounded-2xl bg-light-accent/20 border-2 border-transparent focus:border-primary-orange focus:outline-none transition-colors duration-300 text-text-dark"
              />
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-text-dark font-medium mb-2">
              Additional Details
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              placeholder="Describe what you saw - behavior, condition, any tags or collar, etc."
              className="w-full px-5 py-3 rounded-2xl bg-light-accent/20 border-2 border-transparent focus:border-primary-orange focus:outline-none transition-colors duration-300 text-text-dark placeholder-text-dark/40 resize-none"
            />
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-text-dark mb-4">Your Contact Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-text-dark font-medium mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  required
                  placeholder="Enter your name"
                  className="w-full px-5 py-3 rounded-2xl bg-light-accent/20 border-2 border-transparent focus:border-primary-orange focus:outline-none transition-colors duration-300 text-text-dark placeholder-text-dark/40"
                />
              </div>
              <div>
                <label className="block text-text-dark font-medium mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  required
                  placeholder="Enter your phone number"
                  className="w-full px-5 py-3 rounded-2xl bg-light-accent/20 border-2 border-transparent focus:border-primary-orange focus:outline-none transition-colors duration-300 text-text-dark placeholder-text-dark/40"
                />
              </div>
              <div>
                <label className="block text-text-dark font-medium mb-2">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  className="w-full px-5 py-3 rounded-2xl bg-light-accent/20 border-2 border-transparent focus:border-primary-orange focus:outline-none transition-colors duration-300 text-text-dark placeholder-text-dark/40"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            className="w-full bg-primary-orange text-white py-4 rounded-full font-semibold text-lg hover:bg-orange-400 transition-all duration-300 shadow-soft hover:shadow-lg hover:-translate-y-1"
          >
            Submit Report
          </button>

          <p className="text-center text-text-dark/50 text-sm">
            Your information will only be shared with the pet owner.
          </p>
        </form>
      </div>
    </div>
  );
};

export default ReportSightingPage;

