import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePets } from '../context/PetContext';
import InfoCard from '../components/InfoCard';

const PetDetailsPage = () => {
  const { id } = useParams();
  const { getPetById } = usePets();
  const pet = getPetById(id);

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
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Lost':
        return 'bg-red-100 text-red-600';
      case 'Found':
        return 'bg-blue-100 text-blue-600';
      case 'Adoption':
        return 'bg-green-100 text-green-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const isLostOrFound = pet.status === 'Lost' || pet.status === 'Found';
  const ctaButtonText = isLostOrFound ? 'Report Sighting' : 'Adopt Now';

  return (
    <div className="min-h-screen bg-warm-beige">
      {/* Banner Image */}
      <div className="relative h-64 md:h-80 lg:h-96 bg-gradient-to-b from-light-accent/30 to-warm-beige">
        <img 
          src={pet.image} 
          alt={pet.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <Link 
          to="/browse" 
          className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-colors duration-300"
        >
          <svg className="w-6 h-6 text-text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10 pb-16">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Image */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl overflow-hidden shadow-soft">
              <img 
                src={pet.image} 
                alt={pet.name}
                className="w-full h-80 md:h-96 object-cover"
              />
            </div>

            {/* Tags */}
            <div className="bg-white rounded-3xl p-6 shadow-soft">
              <h3 className="font-semibold text-text-dark mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {pet.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-4 py-2 bg-light-accent/30 text-text-dark/70 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Info */}
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-3xl p-6 shadow-soft">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-text-dark mb-2">{pet.name}</h1>
                  <p className="text-lg text-text-dark/60">{pet.breed}</p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(pet.status)}`}>
                  {pet.status}
                </span>
              </div>

              {pet.price && (
                <div className="mb-4">
                  <span className="text-3xl font-bold text-primary-orange">{pet.price}</span>
                  <span className="text-text-dark/60 ml-2">adoption fee</span>
                </div>
              )}

              <div className="flex items-center text-text-dark/60 mb-4">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {pet.location}
                <span className="mx-2">•</span>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                {pet.distance}
              </div>

              {/* CTA Button - Now a Link for Report Sighting */}
              {isLostOrFound ? (
                <Link 
                  to={`/report-sighting/${pet.id}`}
                  className="block w-full bg-primary-orange text-white py-4 rounded-full font-semibold text-lg text-center hover:bg-orange-400 transition-all duration-300 shadow-soft hover:shadow-lg hover:-translate-y-1"
                >
                  {ctaButtonText}
                </Link>
              ) : (
                <button className="w-full bg-primary-orange text-white py-4 rounded-full font-semibold text-lg hover:bg-orange-400 transition-all duration-300 shadow-soft hover:shadow-lg hover:-translate-y-1">
                  {ctaButtonText}
                </button>
              )}
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-2 gap-4">
              <InfoCard icon="♂️" label="Gender" value={pet.gender} />
              <InfoCard icon="🎂" label="Age" value={pet.age} />
              <InfoCard icon="🐕" label="Breed" value={pet.breed} />
              <InfoCard icon="📍" label="Status" value={pet.status} />
            </div>

            {/* About Section */}
            <div className="bg-white rounded-3xl p-6 shadow-soft">
              <h3 className="font-semibold text-text-dark mb-4">About {pet.name}</h3>
              <p className="text-text-dark/70 leading-relaxed">
                {pet.description}
              </p>
            </div>

            {/* Contact Section */}
            <div className="bg-white rounded-3xl p-6 shadow-soft">
              <h3 className="font-semibold text-text-dark mb-4">Contact Owner</h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to={`/call/${pet.id}`} className="flex-1 flex items-center justify-center bg-light-accent/50 text-text-dark py-3 rounded-full font-medium hover:bg-light-accent transition-colors duration-300">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call
                </Link>
                <Link to={`/chat/${pet.id}`} className="flex-1 flex items-center justify-center bg-primary-orange/10 text-primary-orange py-3 rounded-full font-medium hover:bg-primary-orange/20 transition-colors duration-300">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Message
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetDetailsPage;

