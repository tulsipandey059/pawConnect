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
    role: 'user'
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showLoginSuggestion, setShowLoginSuggestion] = useState(false);

const roles = [
    { value: 'owner', label: 'Pet Owner', icon: '🏠' },
    { value: 'ngo', label: 'NGO', icon: '🏢' },
    { value: 'volunteer', label: 'Volunteer', icon: '❤️' },
    { value: 'admin', label: 'Admin', icon: '👑' }
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
    else if (formData.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';

    if (!formData.confirmPassword)
      newErrors.confirmPassword = 'Please confirm password';
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setServerError('');

    try {
      // ✅ CLEAN PAYLOAD (FIXED)
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role
      };

      const result = await authService.register(payload);

      if (result.success) {
        window.dispatchEvent(new CustomEvent('login', { detail: result.user }));
        alert(`Welcome ${formData.name}! Account created.`);
        navigate('/dashboard');
      }

    } catch (error) {
      console.error('Registration error:', error);
      if (error.message === 'User already exists with this email') {
        setShowLoginSuggestion(true);
        setTimeout(() => setShowLoginSuggestion(false), 5000);
      } else {
        setServerError(error.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-beige to-primary-orange/10 flex items-center justify-center px-4 py-8 md:py-12">
      <div className="max-w-md w-full bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8 border border-white/50 max-h-screen overflow-hidden">

        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center justify-center w-14 h-14 bg-primary-orange rounded-2xl mb-4 mx-auto shadow-lg">
            <span className="text-xl text-white">🐾</span>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-text-dark to-primary-orange bg-clip-text text-transparent mb-2">
            Join PawConnect
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-text-dark mb-2">Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border"
            />
            {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-text-dark mb-2">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border"
            />
            {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-xs font-semibold text-text-dark mb-2">Password *</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pr-12 px-4 py-3 rounded-xl border"
            />
            <button
              type="button"
              className="absolute right-3 top-11 text-gray-400 hover:text-gray-600 p-1"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0 8.268-2.943-9.542-7z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542 7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L19 19" />
                </svg>
              )}
            </button>
          </div>

          {/* Confirm */}
          <div className="relative">
            <label className="block text-xs font-semibold text-text-dark mb-2">Confirm Password *</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full pr-12 px-4 py-3 rounded-xl border"
            />
            <button
              type="button"
              className="absolute right-3 top-11 text-gray-400 hover:text-gray-600 p-1"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0 8.268-2.943-9.542-7z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542 7a9.97 9.97 0 011.563-3.029m5.858 .908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L19 19" />
                </svg>
              )}
            </button>
          </div>

          {/* Role */}
          <div className="grid grid-cols-3 gap-2">
            {roles.map((role) => (
              <label key={role.value} className="flex items-center p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value={role.value}
                  checked={formData.role === role.value}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span>{role.icon} {role.label}</span>
              </label>
            ))}
          </div>

{serverError && <p className="text-red-500 bg-red-50 p-3 rounded-xl">{serverError}</p>}
          {showLoginSuggestion && (
            <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg text-sm text-gray-700">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-primary-orange hover:underline">Login here</Link>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-orange hover:bg-orange-600 text-white font-semibold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 text-lg"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="text-center mt-4">
          Already have an account? <Link to="/login">Login</Link>
        </p>

      </div>
    </div>
  );
};

export default RegisterPage;