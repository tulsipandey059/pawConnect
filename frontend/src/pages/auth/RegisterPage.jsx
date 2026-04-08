import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const roles = [
  { value: 'owner', label: 'Pet Owner', icon: 'Home' },
  { value: 'ngo', label: 'NGO', icon: 'NGO' },
  { value: 'volunteer', label: 'Volunteer', icon: 'Help' },
];

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'owner',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showLoginSuggestion, setShowLoginSuggestion] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setServerError('');

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
      };

      const result = await register(payload);

      if (result.success) {
        alert(`Welcome ${formData.name}! Account created.`);
        navigate('/', { replace: true });
      }
    } catch (error) {
      console.error('Registration error:', error);
      if (error.message?.toLowerCase().includes('exists')) {
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
            <span className="text-xl text-white">P</span>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-text-dark to-primary-orange bg-clip-text text-transparent mb-2">
            Join PawConnect
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="relative">
            <label className="block text-xs font-semibold text-text-dark mb-2">Password *</label>
            <input
              type={showPassword ? 'text' : 'password'}
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
              {showPassword ? 'Hide' : 'Show'}
            </button>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          <div className="relative">
            <label className="block text-xs font-semibold text-text-dark mb-2">Confirm Password *</label>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
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
              {showConfirmPassword ? 'Hide' : 'Show'}
            </button>
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {roles.map((role) => (
              <label key={role.value} className="flex items-center p-3 rounded-lg hover:bg-gray-100 cursor-pointer border border-gray-100">
                <input
                  type="radio"
                  name="role"
                  value={role.value}
                  checked={formData.role === role.value}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span>{role.label}</span>
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
            {loading ? 'Creating...' : 'Create Account'}
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
