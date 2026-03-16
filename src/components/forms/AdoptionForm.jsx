import React, { useState } from 'react';
import Button from '../ui/Button';

const AdoptionForm = ({ petId, petName, onSubmit }) => {
  const [formData, setFormData] = useState({
    applicantName: '',
    phone: '',
    email: '',
    address: '',
    reason: '',
    hasChildren: false,
    hasPets: false,
    experience: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, petId, petName });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-text-dark">Adopt {petName}</h2>
        <p className="text-text-dark/70">Fill out this form to express your interest in adopting this pet.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-text-dark mb-2">Full Name *</label>
          <input
            type="text"
            value={formData.applicantName}
            onChange={(e) => setFormData({...formData, applicantName: e.target.value})}
            className="w-full px-4 py-3 rounded-2xl border-2 border-light-accent focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20 outline-none transition-all"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-text-dark mb-2">Phone *</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            className="w-full px-4 py-3 rounded-2xl border-2 border-light-accent focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20 outline-none transition-all"
            placeholder="+91 98765 43210"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-text-dark mb-2">Email *</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className="w-full px-4 py-3 rounded-2xl border-2 border-light-accent focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20 outline-none transition-all"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-text-dark mb-2">Home Address *</label>
        <textarea
          rows="3"
          value={formData.address}
          onChange={(e) => setFormData({...formData, address: e.target.value})}
          className="w-full px-4 py-3 rounded-2xl border-2 border-light-accent focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20 outline-none transition-all resize-vertical"
          placeholder="Full address including city, state"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-text-dark">Household</label>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={formData.hasChildren}
              onChange={(e) => setFormData({...formData, hasChildren: e.target.checked})}
              className="w-5 h-5 text-primary-orange border-gray-300 rounded focus:ring-primary-orange"
            />
            <span className="text-sm text-text-dark">Children at home</span>
          </label>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={formData.hasPets}
              onChange={(e) => setFormData({...formData, hasPets: e.target.checked})}
              className="w-5 h-5 text-primary-orange border-gray-300 rounded focus:ring-primary-orange"
            />
            <span className="text-sm text-text-dark">Other pets at home</span>
          </label>
        </div>
        <div>
          <label className="block text-sm font-semibold text-text-dark mb-2">Pet Care Experience</label>
          <textarea
            rows="3"
            value={formData.experience}
            onChange={(e) => setFormData({...formData, experience: e.target.value})}
            className="w-full px-4 py-3 rounded-2xl border-2 border-light-accent focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20 outline-none transition-all resize-vertical"
            placeholder="Tell us about your experience with pets..."
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-text-dark mb-2">Why do you want to adopt this pet? *</label>
        <textarea
          rows="4"
          value={formData.reason}
          onChange={(e) => setFormData({...formData, reason: e.target.value})}
          className="w-full px-4 py-3 rounded-2xl border-2 border-light-accent focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20 outline-none transition-all resize-vertical"
          required
        />
      </div>

      <Button type="submit" variant="primary" size="lg" className="w-full">
        Submit Adoption Request
      </Button>
    </form>
  );
};

export default AdoptionForm;

