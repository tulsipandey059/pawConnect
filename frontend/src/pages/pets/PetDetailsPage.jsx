import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { usePets } from '../../context/PetContext';

const PetDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pets, getPetById } = usePets();
  const [isFavorite, setIsFavorite] = useState(false);
  
  const pet = getPetById(id);

  if (!pet) {
    return (
      <div className="min-h-screen bg-warm-beige flex items-center justify-center px-4 py-12">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">🐾</div>
          <h1 className="text-3xl font-bold text-text-dark mb-4">Pet Not Found</h1>
          <p className="text-text-dark/60 mb-8">The pet you're looking for doesn't exist.</p>
          <Link 
            to="/browse" 
            className="inline-flex items-center bg-primary-orange text-white px-8 py-4 rounded-full font-semibold hover:bg-orange-500 transition-all shadow-lg"
          >
            Browse All Pets
          </Link>
        </div>
      </div>
    );
  }

  const statusLower = pet.status?.toLowerCase() || 'unknown';
  const displayStatus = statusLower.charAt(0).toUpperCase() + statusLower.slice(1);

  const toggleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const getActionButton = () => {
    switch (statusLower) {
      case 'lost':
        return (
          <Link to={`/report-sighting/${pet.id}`} className="w-full py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors block text-center">
            I Found This Pet
          </Link>
        );
      case 'found':
        return (
          <Link to={`/pet/${pet.id}/call`} className="w-full py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors block text-center">
            This Is My Pet
          </Link>
        );
      case 'adoption':
        return (
          <Link to="/adoption/apply" className="w-full py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors block text-center">
            Apply for Adoption
          </Link>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-warm-beige pt-12 pb-20">
      {/* Back Navigation */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-text-dark hover:text-primary-orange font-semibold transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Pet Header */}
        <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm">
          <div>
            <h1 className="text-4xl font-bold text-text-dark">{pet.name}</h1>
            <p className="text-xl text-text-dark/70 mt-1">
              {pet.breed} • {pet.age} • {displayStatus}
            </p>
          </div>
          <button onClick={toggleFavorite} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
            <svg
              className={`w-7 h-7 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`}
              fill={isFavorite ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>

        {/* Image Gallery */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
          <img 
            src={pet.image || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500&fit=crop&crop=entropy&auto=format'} 
            alt={pet.name}
            className="w-full h-[420px] object-cover rounded-xl shadow-lg"
          />
          {/* Thumbnails if multiple images */}
          {pet.images && pet.images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto p-2 -m-2">
              {pet.images.map((img, idx) => (
                <img key={idx} src={img} alt={`${pet.name} ${idx + 1}`} className="w-20 h-20 object-cover rounded-lg flex-shrink-0 cursor-pointer hover:ring-2 ring-blue-500 hover:shadow-md transition-all" />
              ))}
            </div>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
          {/* Left Column - Pet Information (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-2xl font-bold text-text-dark mb-4">About {pet.name}</h3>
              <p className="text-lg text-text-dark/80 leading-relaxed">
                {pet.description || 'No description available for this pet.'}
              </p>
            </div>

            {/* Pet Details */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-2xl font-bold text-text-dark mb-6">Pet Details</h3>
              <div className="grid md:grid-cols-2 gap-6 text-sm">
                <div>
                  <span className="text-text-dark/70 block font-medium mb-1">Breed</span>
                  <p className="font-semibold text-lg">{pet.breed}</p>
                </div>
                <div>
                  <span className="text-text-dark/70 block font-medium mb-1">Age</span>
                  <p className="font-semibold text-lg">{pet.age}</p>
                </div>
                <div>
                  <span className="text-text-dark/70 block font-medium mb-1">Location</span>
                  <p className="font-semibold text-lg">{pet.location}</p>
                </div>
                <div>
                  <span className="text-text-dark/70 block font-medium mb-1">Color</span>
                  <p className="font-semibold text-lg">{pet.color || 'Not specified'}</p>
                </div>
                <div className="md:col-span-2">
                  <span className="text-text-dark/70 block font-medium mb-1">Medical History</span>
                  <p className="font-semibold text-lg">{pet.medicalHistory || 'Not provided'}</p>
                </div>
                <div className="md:col-span-2">
                  <span className="text-text-dark/70 block font-medium mb-1">Vaccination Status</span>
                  <p className="font-semibold text-lg">{pet.vaccination || 'Up to date'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Action Card (1 col, sticky) */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow sticky top-24">
              <div className="mb-6 pb-6 border-b border-gray-100">
                <h4 className="font-bold text-lg text-text-dark mb-3">Quick Info</h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-text-dark/70 block text-sm mb-1">Location</span>
                    <p className="font-semibold">{pet.location}</p>
                  </div>
                  <div>
                    <span className="text-text-dark/70 block text-sm mb-1">Status</span>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      statusLower === 'lost' ? 'bg-red-100 text-red-700' :
                      statusLower === 'found' ? 'bg-blue-100 text-blue-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {displayStatus}
                    </span>
                  </div>
                  <div>
                    <span className="text-text-dark/70 block text-sm mb-1">Contact</span>
                    <p className="font-semibold">{pet.contact || '+91 98765 43210'}</p>
                  </div>
                </div>
              </div>

              {/* Primary Action Button */}
              {getActionButton()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetDetailsPage;

