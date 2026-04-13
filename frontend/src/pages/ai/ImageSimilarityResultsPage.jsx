import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ImageUpload from '../../components/similarity/ImageUpload';
import ImageSimilarityCard from '../../components/similarity/ImageSimilarityCard';
import PetDetailsFields from '../../components/similarity/PetDetailsFields';
import { aiService } from '../../services/aiService';
import {
  loadSearchPayload,
  saveSearchPayload,
} from '../../utils/searchState';

function ImageSimilarityResultsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialFilters = useMemo(
    () => {
      const storedFilters = location.state?.filters || loadSearchPayload();
      return storedFilters
        ? { status: 'all', ...storedFilters }
        : null;
    },
    [location.state]
  );
  const [filters, setFilters] = useState(
    initialFilters ? { ...initialFilters, imageFile: null } : null
  );
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleChange = (field, value) => {
    setFilters((current) => {
      if (!current) {
        return current;
      }

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

  const runSearch = useCallback(async (activeFilters) => {
    const imageData = activeFilters?.imageFile
      ? await convertFileToBase64(activeFilters.imageFile)
      : activeFilters?.imageData;

    if (!imageData || !activeFilters.location.trim() || !activeFilters.breed) {
      setError(
        'Search details are incomplete. Please start again from the search page.'
      );
      return;
    }

    setLoading(true);
    setError('');

    try {
      const persistedFilters = {
        status: activeFilters.status || 'all',
        location: activeFilters.location.trim(),
        type: activeFilters.type,
        breed: activeFilters.breed,
        imageData,
      };

      saveSearchPayload(persistedFilters);
      setFilters({ ...persistedFilters, imageFile: null });

      const response = await aiService.checkSimilarPets(
        imageData,
        activeFilters.status || 'all',
        {
        location: activeFilters.location.trim(),
        type: activeFilters.type,
        breed: activeFilters.breed,
        }
      );

      setResults(response.matches || []);
      setMessage(response.message || '');
      setHasSearched(true);
    } catch (searchError) {
      console.error(searchError);
      setError(searchError.message || 'Search failed. Please try again.');
      setResults([]);
      setMessage('');
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initialFilters) {
      return;
    }

    runSearch({ ...initialFilters, imageFile: null });
  }, [initialFilters, runSearch]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await runSearch(filters);
  };

  if (!filters) {
    return (
      <section className="page-section">
        <div className="shell empty-state card">
          <h1>No search request found</h1>
          <p>
            Start a new search so we can collect the image and pet details needed
            for similarity matching.
          </p>
          <button className="button" onClick={() => navigate('/ai/image-search')}>
            Go to search
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="page-section">
      <div className="shell results-layout">
        <aside className="card form-card form-card--sidebar">
          <div className="page-intro page-intro--compact">
            <span className="eyebrow">Refine search</span>
            <h1>Search filters</h1>
          </div>

          <form onSubmit={handleSubmit}>
            <PetDetailsFields
              values={filters}
              onChange={handleChange}
              includeName={false}
              imageField={
                <ImageUpload
                  label="Search image"
                  hint="Swap the image if you want to rerun the similarity match."
                  file={filters.imageFile}
                  previewUrl={filters.imageData}
                  onChange={(file) => handleChange('imageFile', file)}
                  required
                />
              }
            />
            {error ? <p className="form-error">{error}</p> : null}
            <div className="form-actions">
              <button type="submit" className="button" disabled={loading}>
                {loading ? 'Finding matches...' : 'Run search again'}
              </button>
            </div>
          </form>
        </aside>

        <div className="results-panel">
          <div className="results-panel__header">
            <div>
              <span className="eyebrow">Match results</span>
              <h2>Similar pets</h2>
            </div>
            {hasSearched ? (
              <p>
                {results.length} match{results.length === 1 ? '' : 'es'} found
              </p>
            ) : null}
          </div>

          {message ? (
            <div className="card empty-state empty-state--info">
              <p>{message}</p>
            </div>
          ) : null}

          {loading ? (
            <div className="card empty-state">
              <p>Running the similarity search and applying your filters...</p>
            </div>
          ) : null}

          {!loading && hasSearched && results.length === 0 ? (
            <div className="card empty-state">
              <h3>No similar matches found</h3>
              <p>
                Try another photo or broaden the location and breed details to
                see more potential matches.
              </p>
            </div>
          ) : null}

          {!loading && results.length > 0 ? (
            <div className="results-grid">
              {results.map((pet) => (
                <ImageSimilarityCard key={pet.id} pet={pet} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default ImageSimilarityResultsPage;
