import React, { useState, useRef } from 'react';
import MapComponent from '../maps/MapComponent';
import Button from '../ui/Button';
import Loader from '../ui/Loader';

const ReportForm = ({ type = 'lost', onSubmit, onImageUpload }) => {
  const [formData, setFormData] = useState({
    petName: '',
    species: 'Dog',
    breed: '',
    age: '',
    color: '',
    date: '',
    description: '',
    contactPhone: '',
    contactEmail: '',
    image: null,
    location: { lat: 19.0760, lng: 72.8777, address: '' }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const mapRef = useRef();

  const handleLocationChange = (location) => {
    setFormData(prev => ({ ...prev, location }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
      if (onImageUpload) onImageUpload(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Mock API
      onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const title = type === 'lost' ? 'Report Lost Pet' : 'Report Found Pet';
  const subtitle = type === 'lost' ? 'Help us find your furry friend' : 'Help reunite a lost pet with their owner';

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-text-dark mb-3">{title}</h1>
        <p className="text-xl text-text-dark/70">{subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Pet Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-text-dark mb-2">Pet Name *</label>
            <input
              type="text"
              value={formData.petName}
              onChange={(e) => setFormData({...formData, petName: e.target.value})}
              className="w-full px-4 py-3 rounded-2xl border-2 border-light-accent focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20 outline-none transition-all"
              placeholder="e.g. Buddy"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-dark mb-2">Species *</label>
            <select
              value={formData.species}
              onChange={(e) => setFormData({...formData, species: e.target.value})}
              className="w-full px-4 py-3 rounded-2xl border-2 border-light-accent focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20 outline-none transition-all"
              required
            >
              <option value="Dog">Dog</option>
              <option value="Cat">Cat</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-text-dark mb-2">Breed</label>
            <input
              type="text"
              value={formData.breed}
              onChange={(e) => setFormData({...formData, breed: e.target.value})}
              className="w-full px-4 py-3 rounded-2xl border-2 border-light-accent focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20 outline-none transition-all"
              placeholder="e.g. Golden Retriever"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-dark mb-2">Age (approx)</label>
            <input
              type="text"
              value={formData.age}
              onChange={(e) => setFormData({...formData, age: e.target.value})}
              className="w-full px-4 py-3 rounded-2xl border-2 border-light-accent focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20 outline-none transition-all"
              placeholder="e.g. 2 years"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-text-dark mb-2">Color/Markings</label>
            <input
              type="text"
              value={formData.color}
              onChange={(e) => setFormData({...formData, color: e.target.value})}
              className="w-full px-4 py-3 rounded-2xl border-2 border-light-accent focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20 outline-none transition-all"
              placeholder="e.g. Black & White, Brown spots"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-dark mb-2">Date Seen *</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="w-full px-4 py-3 rounded-2xl border-2 border-light-accent focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20 outline-none transition-all"
              required
            />
          </div>
        </div>

        {/* Location - Map */}
        <div>
          <label className="block text-sm font-semibold text-text-dark mb-4">Last Seen Location *</label>
          <div className="relative">
            <MapComponent 
              ref={mapRef}
              height="300px" 
              onLocationSelect={handleLocationChange}
              defaultCenter={formData.location}
            />
            <p className="text-sm text-text-dark/60 mt-2">{formData.location.address || 'Click map to set location'}</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-dark mb-2">Date/Time *</label>
          <input
            type="datetime-local"
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
            className="w-full px-4 py-3 rounded-2xl border-2 border-light-accent focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20 outline-none transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-dark mb-2">Description *</label>
          <textarea
            rows="5"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full px-4 py-3 rounded-2xl border-2 border-light-accent focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20 outline-none transition-all resize-vertical"
            placeholder="Distinctive features, collar color, behavior, direction seen..."
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-text-dark mb-2">Contact Phone *</label>
            <input
              type="tel"
              value={formData.contactPhone}
              onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
              className="w-full px-4 py-3 rounded-2xl border-2 border-light-accent focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20 outline-none transition-all"
              placeholder="+91 98765 43210"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-dark mb-2">Email</label>
            <input
              type="email"
              value={formData.contactEmail}
              onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
              className="w-full px-4 py-3 rounded-2xl border-2 border-light-accent focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20 outline-none transition-all"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div className="text-center pt-4">
          <Button 
            type="submit" 
            variant="primary" 
            size="lg" 
            className="w-full max-w-md mx-auto"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader size="sm" color="white" className="mr-2" />
                {type === 'lost' ? 'Reporting Lost Pet...' : 'Reporting Found Pet...'}
              </>
            ) : (
              type === 'lost' ? 'Report Lost Pet' : 'Report Found Pet'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ReportForm;

