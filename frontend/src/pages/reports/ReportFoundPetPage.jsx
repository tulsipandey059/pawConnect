import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Loader from '../../components/ui/Loader';
import ReportForm from '../../components/forms/ReportForm';
import PetMatchCard from '../../components/pets/PetMatchCard';
import PetGallery from '../../components/pets/PetGallery';
import { aiService } from '../../services/aiService';
import { usePets } from '../../context/PetContext';
import { useAuth } from '../../context/AuthContext';

const ReportFoundPetPage = () => {
  const [step, setStep] = useState('form'); // 'form' | 'matching' | 'success'
  const [matches, setMatches] = useState([]);
  const [isMatching, setIsMatching] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [submitError, setSubmitError] = useState('');
  const { pets, addPet } = usePets();
  const { currentUser } = useAuth();
  const lostPets = pets.filter((p) => p.status?.toLowerCase() === 'lost').slice(0, 8);

  const handleFormSubmit = async (formData) => {
    setSubmitError('');

    try {
      await addPet({
        ...formData,
        name: formData.petName || `${formData.species} report`,
        status: 'found',
        distance: '0 km',
        tags: [formData.species, formData.breed],
        contact: formData.contactPhone,
        ownerId: currentUser?.id ?? currentUser?._id,
        ownerEmail: currentUser?.email,
      });

      if (formData.image) {
        setIsMatching(true);
        try {
          const result = await aiService.checkSimilarPets(formData.image, 'found', {
            location: formData.location,
            type: formData.species.toLowerCase(),
            breed: formData.breed,
          });
          if (result.success) {
            setMatches(result.matches);
            setUploadedImage(formData.image);
            setStep('matching');
          }
        } catch (error) {
          console.error('AI matching failed:', error);
          setStep('success');
        } finally {
          setIsMatching(false);
        }
      } else {
        setStep('success');
      }
    } catch (error) {
      console.error('Pet report failed:', error);
      setSubmitError(
        error.message || 'Could not submit the found pet report. Please try again.'
      );
      setIsMatching(false);
    }
  };

  const handleViewDetails = (pet) => {
    // Navigate or open modal
    window.open(`/pet/${pet.id}`, '_blank');
  };

  const handleSkipMatching = () => {
    setStep('success');
  };

  if (step === 'matching') {
    return (
      <div className="min-h-screen bg-warm-beige py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <Link to="/pets" className="inline-flex items-center text-text-dark/70 hover:text-primary-orange mb-8">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Pets
          </Link>

          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent mb-6">
              Possible Lost Pet Matches
            </h1>
            <p className="text-xl text-text-dark/70 max-w-2xl mx-auto">
              Check if any of these lost pets match the one you found. Contact owners if you see a match!
            </p>
            {isMatching && (
              <div className="mt-8 flex items-center justify-center space-x-3 text-green-600">
                <Loader />
                <span>AI analyzing image...</span>
              </div>
            )}
          </div>

          {matches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {matches.map((pet) => (
                <PetMatchCard
                  key={pet.id}
                  pet={pet}
                  similarity={pet.similarity}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-6">✅</div>
              <h3 className="text-2xl font-bold text-text-dark mb-4">Great Job!</h3>
              <p className="text-text-dark/60 mb-8 max-w-md mx-auto">
                Check these recent lost reports that might match:
              </p>
            </div>
          )}

          {/* Always show recent lost pets for found reports */}
          {lostPets.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-text-dark mb-8 text-center">Recent Lost Pet Reports</h2>
              <PetGallery pets={lostPets} columns={3} />
            </div>
          )}

          <div className="text-center mt-16 space-y-4">
            <button
              onClick={handleSkipMatching}
              className="inline-flex items-center bg-emerald-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-600 transition-all shadow-lg hover:shadow-xl"
            >
              Continue
            </button>
            <Link to="/map" className="text-primary-orange hover:underline font-semibold">
              Check Lost Pets Map
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-warm-beige flex items-center justify-center py-12">
        <div className="text-center max-w-md mx-auto p-12 bg-white rounded-3xl shadow-2xl">
          <div className="w-24 h-24 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <svg className="w-12 h-12 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-text-dark mb-4">Perfect!</h1>
          <p className="text-lg text-text-dark/70 mb-8">
            Your found pet report is live. Lost pet owners have been notified and AI matching is active.
          </p>
          <Link 
            to="/pets" 
            className="inline-block bg-primary-orange text-white px-8 py-4 rounded-2xl font-semibold hover:bg-orange-400 transition-all w-full text-center"
          >
            Browse Lost Pets
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-beige py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/pets" className="inline-flex items-center text-text-dark/70 hover:text-primary-orange mb-8">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Pets
        </Link>

        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent mb-6">
            Found Pet Report
          </h1>
          <p className="text-xl text-text-dark/70 max-w-2xl mx-auto">
            Help reunite a lost pet with their family. Upload a photo for AI matching!
          </p>
        </div>
        {submitError ? (
          <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
            {submitError}
          </div>
        ) : null}
        <ReportForm 
          type="found" 
          onSubmit={handleFormSubmit}
          onImageUpload={setUploadedImage}
        />
      </div>
    </div>
  );
};

export default ReportFoundPetPage;

