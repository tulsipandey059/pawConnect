import React from 'react';
import { Link } from 'react-router-dom';
import PetCard from './PetCard';

const PetMatchCard = ({ pet, similarity, onViewDetails }) => {
  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden shadow-soft hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
      <PetCard pet={pet} similarity={similarity} />
      <div className="absolute bottom-4 left-4 right-4 p-4 bg-black/60 backdrop-blur-sm rounded-b-3xl text-white opacity-0 group-hover:opacity-100 transition-all duration-300">
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-lg">{similarity}% Match</span>
          <span className="text-sm bg-green-500 px-2 py-1 rounded-full font-medium">AI Match</span>
        </div>
        <p className="text-xs opacity-90 mb-3">{pet.matchReason}</p>
        <div className="flex gap-2">
          <Link
            to={`/pet/${pet.id}`}
            className="flex-1 bg-primary-orange text-white py-2 px-4 rounded-2xl text-center font-semibold text-sm hover:bg-orange-400 transition-colors"
          >
            View Details
          </Link>
          <button
            onClick={() => onViewDetails(pet)}
            className="px-4 py-2 bg-white/20 text-white rounded-2xl font-semibold text-sm hover:bg-white/30 transition-colors"
          >
            Contact Owner
          </button>
        </div>
      </div>
    </div>
  );
};

export default PetMatchCard;
