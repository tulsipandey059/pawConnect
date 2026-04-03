import React from 'react';
import MapComponent from '../../components/maps/MapComponent';
import { usePets } from '../../context/PetContext';

const MapPage = () => {
  const { pets } = usePets();

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-2xl font-semibold mb-6">Pet Map</h1>
      <MapComponent pets={pets} />
    </div>
  );
};

export default MapPage;

