import React, { useState, useEffect } from 'react';
import { dogBreeds, catBreeds } from '../../data/breeds';

const dogBreedsList = [
  'Golden Retriever',
  'Labrador',
  'German Shepherd',
  'Pug',
  'Beagle',
  'Indie',
  'Shih Tzu',
  'Husky',
  'Rottweiler',
  'Doberman',
];

const catBreedsList = [
  'Persian',
  'Siamese',
  'Maine Coon',
  'British Shorthair',
  'Ragdoll',
  'Bengal',
  'Domestic Shorthair',
  'Scottish Fold',
  'Sphynx',
  'Indie Cat',
];

const DashboardReportForm = ({ onContinue }) => {
  const [formData, setFormData] = useState({
    imagePreview: null,
    petName: '',
    type: 'dog',
    breed: '',
    location: '',
    contact: '',
    description: '',
  });
  const [dragActive, setDragActive] = useState(false);

  const breeds = formData.type === 'cat' ? catBreedsList : dogBreedsList;

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, imagePreview: preview }));
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        const preview = URL.createObjectURL(file);
        setFormData(prev => ({ ...prev, imagePreview: preview }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onContinue(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Image Upload */}
      <div>
        <label className="block text-sm font-semibold text-text-dark mb-2">Pet Photo</label>
        <div className="w-24 h-24 border-2 border-dashed border-light-accent rounded-xl bg-gray-50 hover:border-primary-orange transition-colors flex items-center justify-center cursor-pointer mx-auto mb-4 relative overflow-hidden"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            onChange={handleImageUpload}
          />
          {formData.imagePreview ? (
            <div className="w-full h-full rounded-lg overflow-hidden relative">
              <img 
                src={formData.imagePreview} 
                alt="Preview" 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                ✓ Selected
              </div>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center mb-2">
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-sm font-semibold text-text-dark">Add photo</div>
              <p className="text-xs text-text-dark/60">Square preview • Helps identify</p>
            </>
          )}
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-text-dark mb-1">Pet Name</label>
          <input
            type="text"
            value={formData.petName}
            onChange={(e) => setFormData(prev => ({ ...prev, petName: e.target.value }))}
            className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-primary-orange outline-none"
            placeholder="Buddy"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-text-dark mb-1">Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value, breed: '' }))}
            className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-primary-orange outline-none"
          >
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-text-dark mb-1">Breed</label>
          <select
            value={formData.breed}
            onChange={(e) => setFormData(prev => ({ ...prev, breed: e.target.value }))}
            className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-primary-orange outline-none"
          >
            <option value="">Select breed</option>
            {breeds.slice(0, 8).map((b, i) => (
              <option key={i} value={b}>{b}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-text-dark mb-1">Location</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-primary-orange outline-none"
            placeholder="Area, landmark"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-text-dark mb-1">Contact</label>
        <input
          type="tel"
          value={formData.contact}
          onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
          className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-primary-orange outline-none"
          placeholder="+91 98xxx xxxxx"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-text-dark mb-1">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-primary-orange outline-none resize-none h-20"
          placeholder="Color, markings, collar, behavior..."
        />
      </div>

      <button
        type="submit"
        className="w-full bg-primary-orange text-white py-3 px-6 rounded-xl font-semibold hover:bg-orange-500 transition-all shadow-md hover:shadow-lg text-sm"
      >
        Continue to Report
      </button>
    </form>
  );
};

export default DashboardReportForm;

