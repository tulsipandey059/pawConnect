import React from 'react';

const AboutUsPage = () => {
  return (
    <div className="min-h-screen bg-warm-beige py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-text-dark mb-4">About PawConnect</h1>
          <p className="text-lg text-text-dark/70 max-w-2xl mx-auto">
            We are dedicated to helping pets find their way home and connecting loving families with pets in need.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-primary-orange/20 rounded-full flex items-center justify-center mr-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h2 className="text-2xl font-bold text-text-dark">Our Mission</h2>
          </div>
          <p className="text-text-dark/70 leading-relaxed">
            PawConnect is an AI-powered platform designed to bridge the gap between lost pets and their families, 
            while also facilitating pet adoption. We believe every pet deserves a loving home, and every family 
            deserves to be reunited with their furry friends. Our advanced AI technology helps identify pets 
            and match them with their owners faster than ever before.
          </p>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-primary-orange/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🔍</span>
            </div>
            <h3 className="text-lg font-semibold text-text-dark mb-2">Pet Recovery</h3>
            <p className="text-text-dark/70 text-sm">
              Help find lost pets using our AI-powered image recognition technology and community reporting system.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-primary-orange/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🏠</span>
            </div>
            <h3 className="text-lg font-semibold text-text-dark mb-2">Adoption</h3>
            <p className="text-text-dark/70 text-sm">
              Connect with pets in need of loving homes and find your perfect companion.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-primary-orange/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🤝</span>
            </div>
            <h3 className="text-lg font-semibold text-text-dark mb-2">Community</h3>
            <p className="text-text-dark/70 text-sm">
              Join a community of pet lovers dedicated to helping animals in need.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-primary-orange/20 rounded-full flex items-center justify-center mr-4">
              <span className="text-2xl">📋</span>
            </div>
            <h2 className="text-2xl font-bold text-text-dark">How It Works</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-primary-orange rounded-full flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">1</div>
              <div>
                <h4 className="font-semibold text-text-dark">Browse or Post</h4>
                <p className="text-text-dark/70 text-sm">Browse available pets or post about a lost/found pet</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 bg-primary-orange rounded-full flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">2</div>
              <div>
                <h4 className="font-semibold text-text-dark">AI Matching</h4>
                <p className="text-text-dark/70 text-sm">Our AI helps match lost pets with found reports and potential adopters</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 bg-primary-orange rounded-full flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">3</div>
              <div>
                <h4 className="font-semibold text-text-dark">Connect</h4>
                <p className="text-text-dark/70 text-sm">Connect with pet owners or adopters through chat or call</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 bg-primary-orange rounded-full flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">4</div>
              <div>
                <h4 className="font-semibold text-text-dark">Reunite or Adopt</h4>
                <p className="text-text-dark/70 text-sm">Help pets find their way home or find a loving new family</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-primary-orange/10 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-text-dark mb-4">Get In Touch</h2>
          <p className="text-text-dark/70 mb-6">
            Have questions or want to collaborate? We'd love to hear from you!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="mailto:hello@pawconnect.in" 
              className="inline-flex items-center justify-center px-6 py-3 bg-primary-orange text-white rounded-lg hover:bg-primary-orange/90 transition-colors duration-300"
            >
              <span className="mr-2">📧</span>
              hello@pawconnect.in
            </a>
            <a 
              href="tel:+919876543210" 
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary-orange border-2 border-primary-orange rounded-lg hover:bg-primary-orange/10 transition-colors duration-300"
            >
              <span className="mr-2">📞</span>
              +91 98765 43210
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;

