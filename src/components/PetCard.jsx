import React from 'react';
import { Link } from 'react-router-dom';

const PetCard = ({ pet }) => {
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

  return (
    <Link 
      to={`/pet/${pet.id}`} 
      className="group block bg-white rounded-3xl overflow-hidden shadow-soft hover:shadow-lg transition-all duration-300 hover:-translate-y-2"
    >
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden">
        <img 
          src={pet.image} 
          alt={pet.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        {/* Status Badge */}
        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(pet.status)}`}>
          {pet.status}
        </div>
        {/* Price Badge */}
        {pet.price && (
          <div className="absolute top-4 right-4 bg-primary-orange text-white px-3 py-1 rounded-full text-sm font-medium">
            {pet.price}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Name and Distance */}
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-text-dark group-hover:text-primary-orange transition-colors duration-300">
            {pet.name}
          </h3>
          <div className="flex items-center text-text-dark/60 text-sm">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {pet.distance}
          </div>
        </div>

        {/* Breed and Age */}
        <p className="text-text-dark/60 mb-4">{pet.breed} • {pet.age}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {pet.tags.slice(0, 3).map((tag, index) => (
            <span 
              key={index}
              className="px-3 py-1 bg-light-accent/30 text-text-dark/70 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Location */}
        <div className="flex items-center text-text-dark/60 text-sm border-t border-primary-orange/20 pt-4">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {pet.location}
        </div>
      </div>
    </Link>
  );
};

export default PetCard;

