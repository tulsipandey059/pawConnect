import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { categories } from '../../data/pets';
import { usePets } from '../../context/PetContext';
import PetCard from '../../components/pets/PetCard';
import CategoryFilter from '../../components/search/CategoryFilter';

const BrowsePetsPage = () => {
  const { pets } = usePets();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredPets = pets.filter((pet) => {
    const matchesSearch = pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesCategory = true;
    if (selectedCategory === 'dog') {
      matchesCategory = pet.tags.includes('Dog');
    } else if (selectedCategory === 'cat') {
      matchesCategory = pet.tags.includes('Cat');
    } else if (selectedCategory === 'lost') {
      matchesCategory = pet.status === 'Lost';
    } else if (selectedCategory === 'adoption') {
      matchesCategory = pet.status === 'Adoption';
    }

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-warm-beige">
      {/* Header Section */}
      <div className="bg-white/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-text-dark text-center mb-4">
            Browse Pets
          </h1>
          <p className="text-text-dark/60 text-center max-w-2xl mx-auto mb-8">
            Find your perfect companion from our wide range of pets looking for loving homes.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, breed, or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 rounded-full bg-white shadow-soft border-2 border-transparent focus:border-primary-orange focus:outline-none transition-colors duration-300 text-text-dark placeholder-text-dark/40"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-orange text-white p-3 rounded-full hover:bg-orange-400 transition-colors duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </div>

      {/* Results Count */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <p className="text-text-dark/60">
          Showing {filteredPets.length} {filteredPets.length === 1 ? 'pet' : 'pets'}
        </p>
      </div>

      {/* Pet Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {filteredPets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPets.map((pet) => (
              <div key={pet.id} className="group relative">
                <PetCard pet={pet} />
                {pet.status === 'Lost' && (
                  <Link
                    to={`/report-sighting/${pet.id}`}
                    className="absolute inset-0 bg-black/20 hover:bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm rounded-3xl"
                  >
                    <div className="bg-primary-orange text-white px-6 py-3 rounded-full font-bold text-lg shadow-2xl hover:shadow-white/20 hover:scale-105 transition-all duration-300 transform">
                      👀 I Found This Pet!
                    </div>
                  </Link>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-text-dark mb-2">No pets found</h3>
            <p className="text-text-dark/60">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowsePetsPage;

