import React, { useState } from 'react';
import Button from '../ui/Button';
import PetTags from '../pets/PetTags';

const PetForm = ({ onSubmit, initialData = {}, isEdit = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    age: '',
    gender: 'Male',
    status: 'Lost',
    location: '',
    description: '',
    tags: [],
    ...initialData
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addTag = (tag) => {
    if (!formData.tags.includes(tag)) {
      setFormData({...formData, tags: [...formData.tags, tag] });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-text-dark mb-2">Pet Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full px-4 py-3 rounded-2xl border-2 border-light-accent focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20 outline-none transition-all"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-text-dark mb-2">Breed</label>
          <input
            type="text"
            value={formData.breed}
            onChange={(e) => setFormData({...formData, breed: e.target.value})}
            className="w-full px-4 py-3 rounded-2xl border-2 border-light-accent focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20 outline-none transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-text-dark mb-2">Age</label>
          <input
            type="text"
            value={formData.age}
            onChange={(e) => setFormData({...formData, age: e.target.value})}
            className="w-full px-4 py-3 rounded-2xl border-2 border-light-accent focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20 outline-none transition-all"
            placeholder="e.g. 2 years"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-text-dark mb-2">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value})}
            className="w-full px-4 py-3 rounded-2xl border-2 border-light-accent focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20 outline-none transition-all"
          >
            <option>Lost</option>
            <option>Found</option>
            <option>Adoption</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-text-dark mb-2">Location</label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => setFormData({...formData, location: e.target.value})}
          className="w-full px-4 py-3 rounded-2xl border-2 border-light-accent focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20 outline-none transition-all"
          placeholder="e.g. Andheri, Mumbai"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-text-dark mb-2">Description</label>
        <textarea
          rows="4"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          className="w-full px-4 py-3 rounded-2xl border-2 border-light-accent focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20 outline-none transition-all resize-vertical"
          placeholder="Tell us about your pet..."
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-text-dark mb-4">Tags</label>
        <PetTags tags={formData.tags} />
        <div className="flex gap-2 mt-3">
          <input
            type="text"
            placeholder="Add tag (e.g. Friendly)"
            className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-orange focus:ring-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                addTag(e.target.value);
                e.target.value = '';
              }
            }}
          />
          <Button type="button" variant="secondary" size="sm">
            Add
          </Button>
        </div>
      </div>

      <Button type="submit" variant="primary" size="lg" className="w-full">
        {isEdit ? 'Update Pet' : 'Report Pet'}
      </Button>
    </form>
  );
};

export default PetForm;

