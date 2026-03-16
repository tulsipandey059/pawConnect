import React from 'react';
import PetCard from './PetCard';

const PetGallery = ({ pets, columns = 4 }) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4'
  };

  return (
    <div className={`grid gap-6 ${gridCols[columns]} md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5`}>
      {pets.map((pet) => (
        <PetCard key={pet.id} pet={pet} />
      ))}
    </div>
  );
};

export default PetGallery;

