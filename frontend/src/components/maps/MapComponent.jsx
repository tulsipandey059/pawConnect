import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Button from '../ui/Button';

// Fix default blue marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Location to coordinates mapping based on pets data
const locationToCoords = (location) => {
  const coordsMap = {
    'Andheri, Mumbai': [19.1133, 72.8398],
    'Koramangala, Bangalore': [12.9279, 77.6285],
    'Lodhi Gardens, Delhi': [28.5870, 77.2253],
    'T Nagar, Chennai': [13.0429, 80.2610],
    'Salt Lake, Kolkata': [22.5764, 88.4190],
    'Banjara Hills, Hyderabad': [17.4182, 78.4102],
    'Koregaon Park, Pune': [18.5404, 73.9013],
    'MG Road, Gurgaon': [28.4350, 77.0217],
    'Jubilee Hills, Hyderabad': [17.4216, 78.3877],
    'Cubbon Park, Bangalore': [12.9759, 77.5923],
    'Vasant Kunj, Delhi': [28.5267, 77.1404],
    'Powai, Mumbai': [19.1238, 72.9078],
    'Bandra West, Mumbai': [19.0675, 72.8344],
    'Juhu Beach, Mumbai': [19.0965, 72.8243],
    'Versova, Mumbai': [19.1450, 72.7995],
    'Malad West, Mumbai': [19.1875, 72.8375],
    'Goregaon East, Mumbai': [19.1667, 72.8611],
    'Juhu, Mumbai': [19.1051, 72.8255],
    'Powder Nagar, Delhi': [28.5355, 77.2333],
    'Whitefield, Bangalore': [12.9698, 77.7630],
    'Anna Nagar, Chennai': [13.0833, 80.2000],
    'Sector 18, Noida': [28.5355, 77.3910],
    'Satellite, Ahmedabad': [23.0200, 72.5480],
    'Hinjewadi, Pune': [18.5990, 73.7150],
    'Kalyan Nagar, Bangalore': [12.9995, 77.6692],
    // Default to Mumbai
  };
  return coordsMap[location] || [19.0760, 72.8777];
};

const MapComponent = ({ center = [19.0760, 72.8777], zoom = 5, height = '500px', pets = [] }) => {
  const navigate = useNavigate();

  const handlePetDetails = (petId) => {
    navigate(`/pet/${petId}`);
  };

  // Filter pets with valid coords
  const petsWithCoords = pets.map(pet => ({
    ...pet,
    coords: locationToCoords(pet.location)
  })).filter(pet => pet.coords[0] !== undefined);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'lost': return 'bg-red-100 text-red-800 border-red-200';
      case 'found': return 'bg-green-100 text-green-800 border-green-200';
      case 'adoption': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="w-full h-[500px] rounded-xl overflow-hidden shadow-2xl">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height, width: '100%' }}
        className="rounded-xl"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {petsWithCoords.map((pet) => (
          <Marker key={pet.id} position={pet.coords}>
            <Popup maxWidth={300}>
              <div className="w-80 p-4">
                <div className="flex items-start space-x-3 mb-3">
                  <img
                    src={pet.image}
                    alt={pet.name}
                    className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-gray-900 truncate">{pet.name}</h3>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(pet.status)}`}>
                      {pet.status}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-4">
                  {pet.breed} • {pet.location}
                </div>
                <Button
                  onClick={() => handlePetDetails(pet.id)}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-2 px-4 rounded-xl transition-all duration-200"
                  size="sm"
                >
                  View Details
                </Button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;

