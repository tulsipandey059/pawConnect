import React, { useState } from 'react';
import authService from '../../services/authService.js';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'petOwner'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const roles = [
    { value: 'petOwner', label: 'Pet Owner', icon: '🏠' },
    { value: 'volunteer', label: 'Volunteer', icon: '❤️' },
    { value: 'ngo', label: 'NGO', icon: '🏢' }
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
        const result = await authService.register(formData);
        if (result.success) {
          window.dispatchEvent(new CustomEvent('login', { detail: result.user }));
          alert(`Welcome ${formData.name}! Account created.`);
          navigate('/dashboard');
        }
    } catch (error) {
      alert('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-beige to-primary-orange/10 flex items-center justify-center px-4 py-8 md:py-12">
      <div className="max-w-md w-full bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8 border border-white/50 max-h-screen overflow-hidden">
        {/* Header - Compact */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center justify-center w-14 h-14 bg-primary-orange rounded-2xl mb-4 mx-auto shadow-lg">
            <span className="text-xl text-white">🐾</span>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-text-dark to-primary-orange bg-clip-text text-transparent mb-2">
            Join PawConnect
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name & Email - Compact grid */}
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block text-xs font-semibold text-text-dark mb-2">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className={`w-full px-4 py-3 rounded-xl border font-medium focus:ring-2 focus:ring-primary-orange/20 focus:border-primary-orange outline-none shadow-sm ${errors.name ? 'border-red-400 bg-red-50' : 'border-light-accent hover:border-primary-orange/50'}`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-dark mb-2">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`w-full px-4 py-3 rounded-xl border font-medium focus:ring-2 focus:ring-primary-orange/20 focus:border-primary-orange outline-none shadow-sm ${errors.email ? 'border-red-400 bg-red-50' : 'border-light-accent hover:border-primary-orange/50'}`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
          </div>

          {/* Passwords - Compact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-text-dark mb-2">Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 chars"
                  className={`w-full pr-10 py-3 rounded-xl border font-medium focus:ring-2 focus:ring-primary-orange/20 focus:border-primary-orange outline-none shadow-sm ${errors.password ? 'border-red-400 bg-red-50' : 'border-light-accent hover:border-primary-orange/50'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-dark mb-2">Confirm *</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat password"
                  className={`w-full pr-10 py-3 rounded-xl border font-medium focus:ring-2 focus:ring-primary-orange/20 focus:border-primary-orange outline-none shadow-sm ${errors.confirmPassword ? 'border-red-400 bg-red-50' : 'border-light-accent hover:border-primary-orange/50'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>
          </div>

          {/* Role Selection - Compact */}
          <div>
            <label className="block text-xs font-semibold text-text-dark mb-3">Your role *</label>
            <div className="grid grid-cols-3 gap-2">
              {roles.map((role) => (
                <label key={role.value} className={`flex flex-col items-center p-3 rounded-lg border cursor-pointer transition-all shadow-sm hover:shadow-md hover:scale-[1.02] gap-1 h-20 ${formData.role === role.value ? 'border-primary-orange bg-primary-orange/10 ring-2 ring-primary-orange/20' : 'border-light-accent/50 hover:border-primary-orange/60'}`}>
                  <input
                    type="radio"
                    name="role"
                    value={role.value}
                    checked={formData.role === role.value}
                    onChange={handleChange}
                    className="w-5 h-5 text-primary-orange bg-white border-2 rounded-full focus:ring-primary-orange"
                  />
                  <span className="text-lg">{role.icon}</span>
                  <div className="font-bold text-xs text-text-dark text-center">{role.label}</div>
                </label>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary-orange to-orange-500 text-white py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Single Google Button - Matches Login styling */}
        <div className="space-y-3 mt-4 pt-4 border-t border-light-accent/50">
          <button 
            onClick={() => window.location.href = 'http://localhost:5000/api/auth/google'}
            className="flex items-center justify-center py-3 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-300 w-full">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
          <p className="text-xs text-gray-600 text-center">
            Already have an account? <Link to="/login" className="font-semibold text-primary-orange hover:text-orange-400 transition-colors">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
