import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageUpload from '../../components/similarity/ImageUpload';
import PetDetailsFields from '../../components/similarity/PetDetailsFields';
import { saveSearchPayload } from '../../utils/searchState';

const initialSearch = {
  location: '',
  type: 'dog',
  breed: '',
  imageFile: null,
  imageData: '',
};

function ImageSimilaritySearchPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState(initialSearch);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setFilters((current) => {
      if (field === 'type') {
        return { ...current, type: value, breed: '' };
      }

      if (field === 'imageFile') {
        return { ...current, imageFile: value };
      }

      return { ...current, [field]: value };
    });
  };

  const convertFileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!filters.imageFile || !filters.location.trim() || !filters.breed) {
      setError(
        'Please provide an image, location, type, and breed to search for similar matches.'
      );
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const imageData = await convertFileToBase64(filters.imageFile);
      const payload = {
        location: filters.location.trim(),
        type: filters.type,
        breed: filters.breed,
        imageData,
      };

      saveSearchPayload(payload);
      navigate('/ai/image-search/results', { state: { filters: payload } });
    } catch (submitError) {
      console.error(submitError);
      setError('We could not read the selected image. Please try another file.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="page-section">
      <div className="shell page-stack">
        <div className="page-intro">
          <span className="eyebrow">Search workflow</span>
          <h1>Search for similar pet matches</h1>
          <p>
            Upload the pet photo and refine the similarity query with the pet&apos;s
            location, type, and breed before running the search.
          </p>
        </div>

        <form className="card form-card" onSubmit={handleSubmit}>
          <PetDetailsFields
            values={filters}
            onChange={handleChange}
            includeName={false}
            imageField={
              <ImageUpload
                label="Search image"
                hint="Use the clearest photo available for stronger visual matching."
                file={filters.imageFile}
                onChange={(file) => handleChange('imageFile', file)}
                required
              />
            }
          />

          {error ? <p className="form-error">{error}</p> : null}

          <div className="form-actions">
            <button type="submit" className="button" disabled={submitting}>
              {submitting ? 'Preparing search...' : 'Find similar matches'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default ImageSimilaritySearchPage;
