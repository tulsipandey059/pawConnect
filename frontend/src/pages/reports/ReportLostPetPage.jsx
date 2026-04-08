import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Loader from '../../components/ui/Loader';
import ReportForm from '../../components/forms/ReportForm';
import PetMatchCard from '../../components/pets/PetMatchCard';
import PetGallery from '../../components/pets/PetGallery';
import { aiService } from '../../services/aiService';
import { usePets } from '../../context/PetContext';
import { useAuth } from '../../context/AuthContext';

const ReportLostPetPage = () => {
  const [step, setStep] = useState('form'); // 'form' | 'matching' | 'success'
  const [matches, setMatches] = useState([]);
  const [isMatching, setIsMatching] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const { pets, addPet } = usePets();
  const { currentUser } = useAuth();
  const lostPets = pets.filter(p => p.status === 'Lost').slice(0, 8);

  const handleFormSubmit = async (formData) => {
    // Add pet to context
    await addPet({
      ...formData,
      name: formData.petName || `${formData.species} report`,
      status: 'Lost',
      id: Date.now(),
      distance: '0 km',
      tags: [formData.species, formData.breed],
      contact: formData.contactPhone,
      ownerId: currentUser?.id ?? currentUser?._id,
      ownerEmail: currentUser?.email,
      image: formData.image ? URL.createObjectURL(formData.image) : 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop'
    });

    if (formData.image && step === 'form') {
      setIsMatching(true);
      try {
        const result = await aiService.checkSimilarPets(formData.image, 'lost');
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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              AI Pet Matching
            </h1>
            <p className="text-xl text-text-dark/70 max-w-2xl mx-auto">
              Found potential matches for your lost pet report. Review them below!
            </p>
            {isMatching && (
              <div className="mt-8 flex items-center justify-center space-x-3 text-blue-600">
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
              <div className="text-6xl mb-6">🤔</div>
              <h3 className="text-2xl font-bold text-text-dark mb-4">No AI matches found</h3>
              <p className="text-text-dark/60 mb-8 max-w-md mx-auto">
                Your report has been posted. Check these recent lost pets from community:
              </p>
            </div>
          )}

          {/* Always show community lost pets */}
          {lostPets.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-text-dark mb-8 text-center">Recent Lost Pets in Area</h2>
              <PetGallery pets={lostPets} columns={3} />
            </div>
          )}

          <div className="text-center mt-16 space-y-4">
            <button
              onClick={handleSkipMatching}
              className="inline-flex items-center bg-primary-orange text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-orange-400 transition-all shadow-lg hover:shadow-xl"
            >
              Continue to Success
            </button>
            <Link to="/pets" className="text-primary-orange hover:underline font-semibold">
              Browse All Pets
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-warm-beige flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-12 shadow-2xl max-w-2xl w-full text-center">
          <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-green-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-text-dark mb-6">Lost Pet Reported!</h1>
          <p className="text-xl text-text-dark/70 mb-8 max-w-lg mx-auto leading-relaxed">
            Your lost pet report has been posted. Community members and AI matching will help find your furry friend.
          </p>
          <div className="space-y-4">
            <Link
              to="/my-pets"
              className="block w-full bg-primary-orange text-white py-4 rounded-2xl font-bold text-lg hover:bg-orange-400 transition-all shadow-lg hover:shadow-xl"
            >
              View My Report
            </Link>
            <Link
              to="/map"
              className="block w-full bg-light-accent text-text-dark py-4 rounded-2xl font-bold text-lg hover:bg-light-accent/50 transition-all border border-light-accent/50"
            >
              Check Map
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-beige py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Link to="/pets" className="inline-flex items-center text-text-dark/70 hover:text-primary-orange mb-8">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Pets
        </Link>

        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent mb-6">
            Report Lost Pet
          </h1>
          <p className="text-2xl text-text-dark/70 max-w-3xl mx-auto">
            Help us find your furry family member. Our AI and community will work together.
          </p>
        </div>

        <ReportForm 
          type="lost"
          onSubmit={handleFormSubmit}
          onImageUpload={setUploadedImage}
        />
      </div>
    </div>
  );
};

export default ReportLostPetPage;

