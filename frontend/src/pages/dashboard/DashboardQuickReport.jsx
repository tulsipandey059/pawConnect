import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usePets } from '../../context/PetContext';

const breeds = {
  dog: [
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
  cat: [
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

const createInitialFormData = (contact = '') => ({
  imageFile: null,
  imagePreview: '',
  petName: '',
  status: 'lost',
  type: 'dog',
  breed: '',
  location: '',
  contact,
  description: '',
});

const DashboardQuickReport = ({ onSubmitted }) => {
  const { currentUser } = useAuth();
  const { addPet } = usePets();
  const defaultContact = currentUser?.phone || currentUser?.email || '';
  const [formData, setFormData] = useState(() => createInitialFormData(defaultContact));
  const [dragActive, setDragActive] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const currentBreeds = breeds[formData.type] || [];

  useEffect(() => {
    return () => {
      if (formData.imagePreview) {
        URL.revokeObjectURL(formData.imagePreview);
      }
    };
  }, [formData.imagePreview]);

  useEffect(() => {
    setFormData((prev) => (prev.contact ? prev : { ...prev, contact: defaultContact }));
  }, [defaultContact]);

  const updateImage = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      return;
    }

    const preview = URL.createObjectURL(file);
    setError('');
    setFormData((prev) => {
      if (prev.imagePreview) {
        URL.revokeObjectURL(prev.imagePreview);
      }

      return { ...prev, imageFile: file, imagePreview: preview };
    });
  };

  const handleImageUpload = (event) => {
    updateImage(event.target.files?.[0] || null);
  };

  const handleDrag = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(event.type === 'dragenter' || event.type === 'dragover');
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    updateImage(event.dataTransfer.files?.[0] || null);
  };

  const handleChange = (field, value) => {
    setError('');
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      ...(field === 'type' ? { breed: '' } : {}),
    }));
  };

  const resetForm = () => {
    setFormData((prev) => {
      if (prev.imagePreview) {
        URL.revokeObjectURL(prev.imagePreview);
      }

      return createInitialFormData(defaultContact);
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !formData.imageFile ||
      !formData.location.trim() ||
      !formData.breed ||
      !formData.contact.trim()
    ) {
      setError(
        'Please add the image, location, breed, and contact details before submitting.'
      );
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const pet = await addPet({
        name: formData.petName.trim() || `${formData.breed} ${formData.type}`,
        status: formData.status,
        location: formData.location.trim(),
        type: formData.type,
        breed: formData.breed,
        image: formData.imageFile,
        contact: formData.contact.trim(),
        contactDetails: formData.contact.trim(),
        description:
          formData.description.trim() ||
          `${formData.status === 'lost' ? 'Lost' : 'Found'} ${formData.type} report near ${formData.location.trim()}.`,
        ownerId: currentUser?.id ?? currentUser?._id,
        ownerEmail: currentUser?.email,
        tags: [formData.type === 'dog' ? 'Dog' : 'Cat', formData.breed],
      });

      resetForm();
      onSubmitted?.(pet);
    } catch (submitError) {
      console.error('Dashboard report submission failed:', submitError);
      setError(
        submitError?.message || 'Could not submit the report. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      className="grid grid-cols-1 items-start gap-8 rounded-3xl bg-white p-8 shadow-soft lg:grid-cols-12"
      onSubmit={handleSubmit}
    >
      <div className="lg:col-span-5">
        <label className="mb-4 block text-sm font-semibold text-gray-900">Pet Photo</label>
        <div
          className={`relative flex h-[28rem] w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 bg-gradient-to-br from-gray-50 to-gray-100 transition-all hover:border-orange-400 ${
            dragActive
              ? 'scale-[1.02] border-orange-500 ring-2 ring-orange-200 shadow-xl'
              : 'border-dashed border-gray-300'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
            onChange={handleImageUpload}
          />
          {formData.imagePreview ? (
            <>
              <img
                src={formData.imagePreview}
                alt="Preview"
                className="h-full w-full object-cover"
              />
              <div className="absolute right-4 top-4 rounded-full bg-green-500 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-lg">
                Selected
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center p-8 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-200 shadow-md">
                <svg
                  className="h-8 w-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <span className="mb-2 text-lg font-semibold text-gray-700">
                Upload Pet Photo
              </span>
              <span className="text-sm text-gray-500">PNG, JPG up to 5MB</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4 lg:col-span-7">
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-900">Pet Name</label>
          <input
            type="text"
            value={formData.petName}
            onChange={(event) => handleChange('petName', event.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500"
            placeholder="Buddy"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-900">
              Report Type
            </label>
            <select
              value={formData.status}
              onChange={(event) => handleChange('status', event.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500"
            >
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-900">Type</label>
            <select
              value={formData.type}
              onChange={(event) => handleChange('type', event.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500"
            >
              <option value="dog">Dog</option>
              <option value="cat">Cat</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-900">Breed</label>
            <select
              value={formData.breed}
              onChange={(event) => handleChange('breed', event.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select breed</option>
              {currentBreeds.slice(0, 8).map((breed) => (
                <option key={breed} value={breed}>
                  {breed}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-900">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(event) => handleChange('location', event.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500"
              placeholder="Area, street, landmark"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-900">Contact</label>
            <input
              type="text"
              value={formData.contact}
              onChange={(event) => handleChange('contact', event.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500"
              placeholder="Phone number or email"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-900">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(event) => handleChange('description', event.target.value)}
            className="h-24 w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500"
            placeholder="Special markings, collar details, behavior, last seen..."
            rows="4"
          />
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:from-orange-600 hover:to-orange-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? 'Submitting report...' : 'Submit Report'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default DashboardQuickReport;
