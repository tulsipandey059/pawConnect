import React, { useMemo, useState } from 'react';
import Button from '../ui/Button';
import Loader from '../ui/Loader';

const breedOptions = {
  Dog: [
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
  ],
  Cat: [
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
  ],
};

const ReportForm = ({ type = 'lost', onSubmit, onImageUpload }) => {
  const [formData, setFormData] = useState({
    petName: '',
    species: 'Dog',
    breed: '',
    age: '',
    description: '',
    contactPhone: '',
    image: null,
    location: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const availableBreeds = useMemo(() => breedOptions[formData.species] || [], [formData.species]);

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSpeciesChange = (species) => {
    setFormData((prev) => ({ ...prev, species, breed: '' }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    handleFieldChange('image', file);
    setImagePreview(URL.createObjectURL(file));
    onImageUpload?.(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const title = type === 'lost' ? 'Report Lost Pet' : 'Report Found Pet';
  const subtitle =
    type === 'lost'
      ? 'Share the details that will help others recognize your pet quickly.'
      : 'Add clear details so the right owner can identify this pet fast.';

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-text-dark mb-3">{title}</h1>
        <p className="text-lg text-text-dark/70">{subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-3xl shadow-soft p-6 md:p-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-text-dark mb-2">Image *</label>
            <label className="block border-2 border-dashed border-light-accent rounded-3xl p-6 cursor-pointer hover:border-primary-orange transition-colors">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
                required
              />
              {imagePreview ? (
                <img src={imagePreview} alt="Pet preview" className="w-full h-64 object-cover rounded-2xl" />
              ) : (
                <div className="text-center text-text-dark/60">
                  <p className="text-lg font-semibold text-text-dark">Upload a clear pet photo</p>
                  <p className="mt-2">Tap to choose an image</p>
                </div>
              )}
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-text-dark mb-2">Pet Name</label>
              <input
                type="text"
                value={formData.petName}
                onChange={(event) => handleFieldChange('petName', event.target.value)}
                className="w-full px-4 py-3 rounded-2xl border-2 border-light-accent focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20 outline-none transition-all"
                placeholder="e.g. Buddy"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-dark mb-2">Location *</label>
              <input
                type="text"
                value={formData.location}
                onChange={(event) => handleFieldChange('location', event.target.value)}
                className="w-full px-4 py-3 rounded-2xl border-2 border-light-accent focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20 outline-none transition-all"
                placeholder="Area, street, landmark"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-dark mb-3">Type *</label>
            <div className="grid grid-cols-2 gap-3">
              {['Dog', 'Cat'].map((species) => (
                <button
                  key={species}
                  type="button"
                  onClick={() => handleSpeciesChange(species)}
                  className={`rounded-2xl border-2 px-4 py-3 font-semibold transition-all ${
                    formData.species === species
                      ? 'border-primary-orange bg-primary-orange text-white'
                      : 'border-light-accent bg-white text-text-dark hover:border-primary-orange'
                  }`}
                >
                  {species}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-text-dark mb-2">Breed *</label>
              <select
                value={formData.breed}
                onChange={(event) => handleFieldChange('breed', event.target.value)}
                className="w-full px-4 py-3 rounded-2xl border-2 border-light-accent focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20 outline-none transition-all"
                required
              >
                <option value="">Select {formData.species.toLowerCase()} breed</option>
                {availableBreeds.map((breed) => (
                  <option key={breed} value={breed}>
                    {breed}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-dark mb-2">Age *</label>
              <input
                type="text"
                value={formData.age}
                onChange={(event) => handleFieldChange('age', event.target.value)}
                className="w-full px-4 py-3 rounded-2xl border-2 border-light-accent focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20 outline-none transition-all"
                placeholder="e.g. 2 years"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-dark mb-2">Contact *</label>
              <input
                type="tel"
                value={formData.contactPhone}
                onChange={(event) => handleFieldChange('contactPhone', event.target.value)}
                className="w-full px-4 py-3 rounded-2xl border-2 border-light-accent focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20 outline-none transition-all"
                placeholder="+91 98765 43210"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-dark mb-2">Describe *</label>
            <textarea
              rows="5"
              value={formData.description}
              onChange={(event) => handleFieldChange('description', event.target.value)}
              className="w-full px-4 py-3 rounded-2xl border-2 border-light-accent focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20 outline-none transition-all resize-y"
              placeholder="Special markings, collar, behavior, last known details..."
              required
            />
          </div>
        </div>

        <div className="text-center pt-2">
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
