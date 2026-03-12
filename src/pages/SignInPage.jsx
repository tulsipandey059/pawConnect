import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SignInPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = 'Name is required';
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // For demo purposes, just navigate to home
      // In a real app, you would make an API call here
      console.log('Form submitted:', formData);
      navigate('/');
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setFormData({ email: '', password: '', name: '', confirmPassword: '' });
  };

  return (
    <div className="min-h-screen bg-warm-beige flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-12 h-12 bg-primary-orange rounded-full flex items-center justify-center">
              <span className="text-white text-2xl">🐾</span>
            </div>
            <span className="text-2xl font-bold text-text-dark">PawConnect</span>
          </Link>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-soft p-8">
          <h2 className="text-2xl font-bold text-text-dark text-center mb-2">
            {isLogin ? 'Welcome Back!' : 'Create Account'}
          </h2>
          <p className="text-gray-500 text-center mb-8">
            {isLogin 
              ? 'Sign in to continue to your account' 
              : 'Join us to help pets find their forever homes'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-text-dark mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={`w-full px-4 py-3 rounded-xl border ${errors.name ? 'border-red-500' : 'border-gray-200'} focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20 outline-none transition-all duration-300`}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-dark mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-500' : 'border-gray-200'} focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20 outline-none transition-all duration-300`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-dark mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full px-4 py-3 rounded-xl border ${errors.password ? 'border-red-500' : 'border-gray-200'} focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20 outline-none transition-all duration-300`}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-dark mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 rounded-xl border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200'} focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20 outline-none transition-all duration-300`}
                />
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>
            )}

            {isLogin && (
              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-sm text-primary-orange hover:text-orange-400 transition-colors">
                  Forgot password?
                </Link>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-primary-orange text-white py-3 rounded-xl font-medium hover:bg-orange-400 transition-all duration-300 shadow-soft hover:shadow-lg"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">or continue with</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center py-3 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-300">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            <button className="flex items-center justify-center py-3 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-300">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
              GitHub
            </button>
          </div>

          {/* Toggle Mode */}
          <p className="text-center mt-6 text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={toggleMode}
              className="text-primary-orange font-medium hover:text-orange-400 transition-colors"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>

        {/* Back to Home */}
        <p className="text-center mt-6">
          <Link to="/" className="text-gray-500 hover:text-primary-orange transition-colors">
            ← Back to Home
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;

