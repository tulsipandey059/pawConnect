import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-warm-beige">
      {/* Decorative Background Shapes */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-light-accent/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-orange/20 rounded-full blur-3xl"></div>
      <div className="absolute top-40 right-1/4 w-48 h-48 bg-light-accent/20 rounded-full blur-2xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="relative z-10">
            <div className="inline-flex items-center bg-light-accent/50 rounded-full px-4 py-2 mb-6">
              <span className="text-sm font-medium text-primary-orange">🤖 AI-Powered Platform</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-dark leading-tight mb-6">
              Find Your
              <span className="text-primary-orange block">Furry Favorite</span>
            </h1>
            
            <p className="text-lg text-text-dark/70 mb-8 max-w-lg">
              AI-powered pet recovery and adoption platform for India. Whether your pet is lost or you're looking to adopt, we're here to help reunite pets with their families across India.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/browse" 
                className="inline-flex items-center justify-center bg-primary-orange text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-orange-400 transition-all duration-300 shadow-soft hover:shadow-lg hover:-translate-y-1"
              >
                Get Started
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link 
                to="/add-pet" 
                className="inline-flex items-center justify-center bg-white text-text-dark border-2 border-light-accent px-8 py-4 rounded-full font-semibold text-lg hover:border-primary-orange hover:text-primary-orange transition-all duration-300"
              >
                Report Pet
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-primary-orange/20">
              <div>
                <div className="text-3xl font-bold text-primary-orange">2,500+</div>
                <div className="text-sm text-text-dark/60">Pets Reunited</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-orange">1,200+</div>
                <div className="text-sm text-text-dark/60">Adoptions</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-orange">98%</div>
                <div className="text-sm text-text-dark/60">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative lg:block">
            <div className="relative z-10">
              <img 
                src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=600&h=500&fit=crop" 
                alt="Happy dog and cat" 
                className="w-full h-auto rounded-3xl shadow-soft"
              />
            </div>
            {/* Floating Card */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-3xl p-4 shadow-soft max-w-xs">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">✓</span>
                </div>
                <div>
                  <p className="font-semibold text-text-dark">Pet Found!</p>
                  <p className="text-sm text-text-dark/60">Buddy reunited in Mumbai</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="bg-white/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text-dark mb-4">Why Choose PawConnect?</h2>
            <p className="text-text-dark/60 max-w-2xl mx-auto">
              Our platform uses advanced AI technology to help find lost pets and connect adopters with their perfect companions.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-3xl p-8 shadow-soft hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-light-accent/50 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-4xl">🤖</span>
              </div>
              <h3 className="text-xl font-semibold text-text-dark mb-3">AI Image Matching</h3>
              <p className="text-text-dark/60">
                Our advanced AI analyzes pet photos to match lost pets with found reports, increasing the chances of reunion by 85%.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-3xl p-8 shadow-soft hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-light-accent/50 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-4xl">📍</span>
              </div>
              <h3 className="text-xl font-semibold text-text-dark mb-3">Location-based Alerts</h3>
              <p className="text-text-dark/60">
                Get instant notifications when pets matching your criteria appear in your area. Never miss a reunion opportunity.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-3xl p-8 shadow-soft hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-light-accent/50 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-4xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold text-text-dark mb-3">Secure Adoption</h3>
              <p className="text-text-dark/60">
                Our verified adoption process ensures safe transfers. All pets are health-checked and vaccinated before listing.
              </p>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};

export default Hero;

