import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePets } from '../../context/PetContext';

const CallPage = () => {
  const { petId } = useParams();
  const { getPetById } = usePets();
  const pet = getPetById(petId);

  if (!pet) {
    return (
      <div className="min-h-screen bg-warm-beige flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😿</div>
          <h2 className="text-2xl font-bold text-text-dark mb-2">Pet Not Found</h2>
          <Link to="/browse" className="text-primary-orange hover:underline">
            Browse other pets
          </Link>
        </div>
      </div>
    );
  };

  const handleCall = () => {
    window.location.href = `tel:${pet.contact}`;
  };

  return (
    <div className="min-h-screen bg-warm-beige py-8 px-4">
      <div className="max-w-lg mx-auto">
        {/* Back Button */}
        <Link 
          to={`/pet/${petId}`}
          className="inline-flex items-center text-text-dark/70 hover:text-primary-orange mb-6 transition-colors duration-300"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to {pet.name}
        </Link>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-soft overflow-hidden">
          {/* Pet Image Banner */}
          <div className="relative h-48 bg-gradient-to-r from-primary-orange/20 to-light-accent/30">
            <img 
              src={pet.image} 
              alt={pet.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            <div className="absolute bottom-4 left-6">
              <h1 className="text-3xl font-bold text-white">{pet.name}</h1>
              <p className="text-white/80">{pet.breed}</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="p-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-primary-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-primary-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-text-dark mb-2">Call Owner</h2>
              <p className="text-text-dark/60 mb-4">Get in touch with {pet.name}'s owner</p>
              
              {/* Phone Number Display */}
              <div className="bg-light-accent/30 rounded-2xl p-4 mb-6">
                <p className="text-sm text-text-dark/60 mb-1">Phone Number</p>
                <p className="text-2xl font-bold text-text-dark">{pet.contact}</p>
              </div>

              {/* Call Button */}
              <button 
                onClick={handleCall}
                className="w-full bg-primary-orange text-white py-4 rounded-full font-semibold text-lg hover:bg-orange-400 transition-all duration-300 shadow-soft hover:shadow-lg hover:-translate-y-1 flex items-center justify-center"
              >
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call Now
              </button>
            </div>

            {/* Pet Details Summary */}
            <div className="border-t border-light-accent/30 pt-6">
              <h3 className="font-semibold text-text-dark mb-4">Pet Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-light-accent/20 rounded-xl p-3">
                  <p className="text-text-dark/60">Status</p>
                  <p className="font-medium text-text-dark">{pet.status}</p>
                </div>
                <div className="bg-light-accent/20 rounded-xl p-3">
                  <p className="text-text-dark/60">Location</p>
                  <p className="font-medium text-text-dark">{pet.location}</p>
                </div>
                <div className="bg-light-accent/20 rounded-xl p-3">
                  <p className="text-text-dark/60">Gender</p>
                  <p className="font-medium text-text-dark">{pet.gender}</p>
                </div>
                <div className="bg-light-accent/20 rounded-xl p-3">
                  <p className="text-text-dark/60">Age</p>
                  <p className="font-medium text-text-dark">{pet.age}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alternative Contact Option */}
        <div className="mt-6 text-center">
          <p className="text-text-dark/60 mb-3">Prefer to send a message?</p>
          <Link 
            to={`/chat/${petId}`}
            className="inline-flex items-center text-primary-orange hover:text-orange-400 font-medium transition-colors duration-300"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Chat Instead
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CallPage;

