import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'owner'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const roles = [
    { 
      value: 'petOwner', 
      label: 'Pet Owner', 
      icon: '🏠'
    },
    { 
      value: 'volunteer', 
      label: 'Volunteer', 
      icon: '❤️'
    },
    { 
      value: 'ngo', 
      label: 'NGO', 
      icon: '🏢'
    }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = { ...formData, id: Date.now() };
      localStorage.setItem('users', JSON.stringify([...users, user]));
      window.dispatchEvent(new CustomEvent('login', { detail: user }));
      
      alert(`Welcome ${formData.name}! Account created as ${formData.role.toUpperCase()}`);
      navigate('/dashboard');
    } catch (error) {
      alert('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-beige to-primary-orange/5 flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 border border-white/50">
        {/* Header */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center justify-center w-16 h-16 bg-primary-orange rounded-3xl mb-6 mx-auto shadow-lg">
            <span className="text-2xl text-white">🐾</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-text-dark via-text-dark to-primary-orange bg-clip-text text-transparent mb-3">
            Join PawConnect
          </h1>
          <p className="text-lg text-text-dark/70 max-w-sm mx-auto">
            Create your account to help reunite pets with their families
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-text-dark mb-3">Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className={`w-full px-5 py-4 rounded-2xl border-2 font-medium transition-all duration-300 focus:ring-4 focus:ring-primary-orange/20 focus:border-primary-orange outline-none shadow-inner ${
                errors.name ? 'border-red-400 bg-red-50' : 'border-light-accent hover:border-primary-orange/50'
              }`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-2 ml-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-text-dark mb-3">Email Address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={`w-full px-5 py-4 rounded-2xl border-2 font-medium transition-all duration-300 focus:ring-4 focus:ring-primary-orange/20 focus:border-primary-orange outline-none shadow-inner ${
                errors.email ? 'border-red-400 bg-red-50' : 'border-light-accent hover:border-primary-orange/50'
              }`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-2 ml-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-text-dark mb-3">Password *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                className={`w-full px-5 py-4 rounded-2xl border-2 font-medium transition-all duration-300 focus:ring-4 focus:ring-primary-orange/20 focus:border-primary-orange outline-none shadow-inner ${
                  errors.password ? 'border-red-400 bg-red-50' : 'border-light-accent hover:border-primary-orange/50'
                }`}
              />
              {errors.password && <p className="text-red-500 text-sm mt-2 ml-1">{errors.password}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-dark mb-3">Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat password"
                className={`w-full px-5 py-4 rounded-2xl border-2 font-medium transition-all duration-300 focus:ring-4 focus:ring-primary-orange/20 focus:border-primary-orange outline-none shadow-inner ${
                  errors.confirmPassword ? 'border-red-400 bg-red-50' : 'border-light-accent hover:border-primary-orange/50'
                }`}
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-2 ml-1">{errors.confirmPassword}</p>}
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-semibold text-text-dark mb-6">What best describes you? *</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 max-w-full h-24">
              {roles.map((role) => (
                <label 
                  key={role.value} 
                  className={`flex flex-col items-center p-2 rounded-lg border-2 cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md hover:scale-[1.005] group gap-1 h-full ${
                    formData.role === role.value 
                      ? 'border-primary-orange bg-primary-orange/10 shadow-primary-orange/20 ring-2 ring-primary-orange/20' 
                      : 'border-light-accent/50 hover:border-primary-orange/60'
                  } min-w-0 w-full`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={role.value}
                    checked={formData.role === role.value}
                    onChange={handleChange}
                    className="w-6 h-6 text-primary-orange bg-white border-3 border-gray-300 focus:ring-primary-orange focus:ring-3 flex-shrink-0 rounded-full"
                  />
                  <div className="flex flex-col items-center gap-2 mt-2">
                    <span className="text-xl">{role.icon}</span>
                    <div className="font-bold text-text-dark group-hover:text-primary-orange text-sm text-center break-words">{role.label}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary-orange to-orange-500 text-white py-5 px-6 rounded-2xl font-bold text-xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center mt-8 pt-8 border-t border-light-accent">
          <p className="text-gray-600">
            Already have an account? <Link to="/login" className="font-semibold text-primary-orange hover:text-orange-400 transition-colors">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

