import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../../components/HeroSection';
import PetCard from '../../components/PetCard';
import { petsData } from '../../data/pets';

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [featuredPets, setFeaturedPets] = useState([]);

  // Filter featured pets from data
  useEffect(() => {
    const featured = petsData.filter(pet => pet.featured || !('featured' in pet));
    setFeaturedPets(featured.slice(0, 6));
  }, []);

  const howItWorksSteps = [
    {
      number: '01',
      title: 'Report Pet',
      description: 'Report your lost or found pet with photos and location details',
      icon: '📸'
    },
    {
      number: '02',
      title: 'AI Matching',
      description: 'Our AI scans and matches pet images instantly',
      icon: '🤖'
    },
    {
      number: '03',
      title: 'Get Alerts',
      description: 'Nearby users receive real-time notifications',
      icon: '🔔'
    },
    {
      number: '04',
      title: 'Reunite',
      description: 'Pet gets reunited or happily adopted!',
      icon: '❤️'
    }
  ];

  const testimonials = [
    {
      quote: '"PawConnect found my lost dog Charlie in just 24 hours! The AI matching is incredible."',
      author: 'Priya S., Mumbai',
      pet: '🐶 Charlie'
    },
    {
      quote: '"Adopted Luna through PawConnect. The process was smooth and she\'s perfect for our family!"',
      author: 'Rohan K., Bangalore',
      pet: '🐱 Luna'
    },
    {
      quote: '"Found a lost kitten near my home and reunited it with its owner using the platform."',
      author: 'Anita D., Delhi',
      pet: '🐾 Community Helper'
    }
  ];

  return (
    <div className="bg-warm-beige min-h-screen">
      <HeroSection />

      {/* Search Section */}
      <section className="py-20 bg-white/50">
        <div className="max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text-dark mb-4">Find Pets Near You</h2>
            <p className="text-xl text-text-dark/60 max-w-2xl mx-auto">
              Search by pet name, breed, or location
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by pet name, breed, or location"
                className="w-full p-6 text-xl rounded-3xl border-2 border-light-accent focus:border-primary-orange focus:outline-none shadow-soft transition-all duration-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-text-dark/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-4 gap-6">
            <Link to="/add-pet" className="group bg-primary-orange text-white p-8 rounded-3xl text-center hover:bg-orange-500 transition-all duration-300 shadow-soft hover:shadow-lg hover:-translate-y-2">
              <div className="text-4xl mb-4">📢</div>
              <h3 className="text-xl font-bold mb-2">Report Lost Pet</h3>
              <p className="text-primary-orange/80">Help find missing pets</p>
            </Link>
            <Link to="/add-pet" className="group bg-gradient-to-br from-blue-500 to-blue-600 text-white p-8 rounded-3xl text-center hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-soft hover:shadow-lg hover:-translate-y-2">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-bold mb-2">Report Found Pet</h3>
              <p className="opacity-90">Found a stray pet?</p>
            </Link>
            <Link to="/browse" className="group bg-green-500 text-white p-8 rounded-3xl text-center hover:bg-green-600 transition-all duration-300 shadow-soft hover:shadow-lg hover:-translate-y-2">
              <div className="text-4xl mb-4">🐾</div>
              <h3 className="text-xl font-bold mb-2">Browse Pets</h3>
              <p className="opacity-90">See available pets</p>
            </Link>
            <Link to="/browse" className="group bg-purple-500 text-white p-8 rounded-3xl text-center hover:bg-purple-600 transition-all duration-300 shadow-soft hover:shadow-lg hover:-translate-y-2">
              <div className="text-4xl mb-4">🏠</div>
              <h3 className="text-xl font-bold mb-2">Adopt a Pet</h3>
              <p className="opacity-90">Find your companion</p>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-text-dark mb-6">How PawConnect Works</h2>
            <p className="text-xl text-text-dark/60 max-w-3xl mx-auto">
              Simple 4-step process to reunite lost pets or find perfect adoptions
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {howItWorksSteps.map((step, index) => (
              <div key={index} className="text-center group">
                <div className="w-24 h-24 bg-primary-orange text-white rounded-3xl flex flex-col items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-all duration-300">
                  <div className="text-2xl mb-1">{step.icon}</div>
                  <div className="text-sm font-bold">{step.number}</div>
                </div>
                <h3 className="text-2xl font-bold text-text-dark mb-4">{step.title}</h3>
                <p className="text-text-dark/60 max-w-sm mx-auto">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Pets */}
      <section className="py-24 bg-white/50">
        <div className="max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text-dark mb-6">Featured Pets</h2>
            <p className="text-xl text-text-dark/60">
              Meet some pets waiting for their forever homes or owners
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>
        </div>
      </section>

      {/* Adoption Highlight */}
      <section className="py-24 bg-gradient-to-r from-primary-orange/10 to-light-accent/50">
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-5xl mb-8">🐾 ❤️</div>
          <h2 className="text-4xl font-bold text-text-dark mb-8">Why Adopt from PawConnect?</h2>
          <div className="grid md:grid-cols-2 gap-12 mb-12">
            <div>
              <h3 className="text-2xl font-bold text-text-dark mb-6">Save a Life Today</h3>
              <ul className="space-y-3 text-text-dark/70">
                <li>• All pets are vaccinated and health-checked</li>
                <li>• 100% verified listings and secure process</li>
                <li>• Trial period and return policy</li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-text-dark mb-6">Benefits of Shelter Adoption</h3>
              <ul className="space-y-3 text-text-dark/70">
                <li>• Lower adoption fees</li>
                <li>• Pre-spayed/neutered pets</li>
                <li>• Support animal welfare</li>
              </ul>
            </div>
          </div>
          <Link to="/browse" className="inline-flex items-center bg-primary-orange text-white px-10 py-5 rounded-full font-bold text-xl hover:bg-orange-500 transition-all duration-300 shadow-lg hover:shadow-xl">
            Start Adopting Now
            <svg className="w-6 h-6 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="max-w-[92rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-text-dark mb-6">Happy Reunions & Adoptions</h2>
            <p className="text-xl text-text-dark/60">
              Real stories from our community
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-3xl p-10 shadow-soft hover:shadow-lg transition-all duration-300 text-center">
                <div className="text-5xl mb-6">{testimonial.pet}</div>
                <p className="text-xl italic text-text-dark/70 mb-8">"{testimonial.quote}"</p>
                <div className="font-semibold text-text-dark">{testimonial.author}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
