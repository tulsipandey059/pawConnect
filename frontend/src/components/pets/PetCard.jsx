import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PetCard = ({ pet, similarity }) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  const getStatusColor = (status) => {
    const displayStatus = status.charAt(0).toUpperCase() + status.slice(1);
    switch (status) {
      case 'lost':
        return `text-red-500 bg-white shadow`;
      case 'found':
        return `text-blue-500 bg-white shadow`;
      case 'adoption':
        return `text-green-600 bg-white shadow`;
      default:
        return `text-gray-600 bg-white shadow`;
    }
  };

  const toggleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <div
      onClick={() => navigate(`/pets/${pet.id}`)}
      className="group relative block bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer flex flex-col"
    >
      {/* Image Section */}
      <div className="relative rounded-xl overflow-hidden" style={{ height: '16rem' }}>
        <img 
          src={pet.image || '/src/assets/images/pets/placeholder.jpg'} 
          alt={pet.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Status Badge */}
        <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(pet.status)} z-10`}>
          {pet.status.charAt(0).toUpperCase() + pet.status.slice(1)}
        </div>
        {/* Favorite Heart */}
        <button
          onClick={toggleFavorite}
          className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-lg z-10 hover:bg-gray-50 transition-colors"
          aria-label="Toggle favorite"
        >
          <svg
            className={`w-5 h-5 transition-colors ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-500'}`}
            fill={isFavorite ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
        {/* Optional Similarity Badge */}
        {similarity && (
          <div className="absolute top-20 right-3 bg-gradient-to-r from-emerald-400 to-emerald-500 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-md z-10">
            {similarity}%
          </div>
        )}
        {/* Optional Price Badge */}
        {pet.price && (
          <div className="absolute bottom-3 right-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-2.5 py-1 rounded-full text-xs font-semibold shadow-md z-10">
            {pet.price}
          </div>
        )}
      </div>

      {/* Pet Information */}
      <div className="px-1 mt-2">
        <h3 className="font-semibold text-base truncate">
          {pet.name}
        </h3>
        <p className="text-sm text-gray-600">
          {pet.breed}
        </p>
        <p className="text-sm text-gray-500">
          📍 {pet.location}
        </p>
        <p className="text-sm text-gray-500">
          {pet.age}
        </p>
      </div>

      {/* Tags (preserve if exist) */}
      {pet.tags && (
        <div className="px-1 mt-2 flex gap-2 flex-wrap">
          {pet.tags.map((tag, index) => (
            <span 
              key={index}
              className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Note: For pages rendering multiple cards, use: grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 */}
    </div>
  );
};

export default PetCard;

