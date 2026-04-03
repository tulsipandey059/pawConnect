import React, { useState } from 'react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    ngoInterest: false
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Mock API
    setSubmitted(true);
    setLoading(false);
  };

  const handleNGOInterest = (e) => {
    setFormData({...formData, ngoInterest: e.target.checked});
  };

  return (
    <div className="min-h-screen bg-warm-beige py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-text-dark mb-6">Get In Touch</h1>
          <p className="text-xl text-text-dark/60 max-w-2xl mx-auto mb-8">
            We'd love to hear from you. Send us a message and we'll respond within 24 hours.
          </p>
        </div>

        {submitted ? (
          <div className="bg-white rounded-3xl shadow-2xl p-16 text-center max-w-2xl mx-auto">
            <div className="text-7xl mb-8">✅</div>
            <h2 className="text-3xl font-bold text-text-dark mb-4">Thank you!</h2>
            <p className="text-xl text-text-dark/70 mb-8">Your message has been sent successfully. We'll get back to you soon.</p>
            <button
              onClick={() => {
                setFormData({name: '', email: '', message: '', ngoInterest: false});
                setSubmitted(false);
              }}
              className="bg-primary-orange text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-orange-400 transition-all"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Contact Form */}
            <div className="bg-white rounded-3xl shadow-soft p-10">
              <h2 className="text-2xl font-bold text-text-dark mb-8">Send us a message</h2>
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-text-dark mb-3">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-5 py-4 rounded-2xl border-2 border-light-accent focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20 outline-none transition-all text-lg"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-dark mb-3">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-5 py-4 rounded-2xl border-2 border-light-accent focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20 outline-none transition-all text-lg"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-dark mb-3">Message</label>
                    <textarea
                      required
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full px-5 py-4 rounded-2xl border-2 border-light-accent focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20 outline-none transition-all resize-vertical text-lg"
                      placeholder="Tell us how we can help..."
                    />
                  </div>
                  <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-2xl">
                    <input
                      id="ngo-interest"
                      type="checkbox"
                      checked={formData.ngoInterest}
                      onChange={handleNGOInterest}
                      className="mt-1 h-5 w-5 text-primary-orange rounded focus:ring-primary-orange/20"
                    />
                    <label htmlFor="ngo-interest" className="text-text-dark font-medium cursor-pointer">
                      Interested in NGO partnership or volunteering?
                    </label>
                  </div>
                  <button
                    disabled={loading}
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary-orange to-orange-500 text-white py-5 px-8 rounded-3xl font-bold text-xl shadow-xl hover:shadow-2xl disabled:opacity-50 transition-all"
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div className="bg-primary-orange/10 p-8 rounded-2xl">
                <h3 className="text-2xl font-bold text-text-dark mb-4">Quick Contact</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl">📧</span>
                    <div>
                      <p className="font-semibold text-text-dark">Email</p>
                      <a href="mailto:hello@pawconnect.in" className="text-primary-orange hover:underline">hello@pawconnect.in</a>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl">📱</span>
                    <div>
                      <p className="font-semibold text-text-dark">Phone</p>
                      <a href="tel:+919876543210" className="text-primary-orange hover:underline">+91 98765 43210</a>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl">📍</span>
                    <p className="text-text-dark">Mumbai, Maharashtra</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-soft">
                <h3 className="text-2xl font-bold text-text-dark mb-6">NGO Partnership</h3>
                <p className="text-text-dark/70 mb-6">Partner with PawConnect to expand your reach and save more lives.</p>
                <ul className="space-y-3 text-text-dark/70">
                  <li>• Joint adoption drives</li>
                  <li>• AI health screening for shelters</li>
                  <li>• Volunteer coordination tools</li>
                  <li>• Lost pet matching network</li>
                </ul>
                <button className="mt-6 w-full bg-primary-orange text-white py-4 px-8 rounded-2xl font-bold hover:bg-orange-400 transition-all">
                  Become a Partner
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactPage;

