import React from 'react';

const Button = ({ children, variant = 'primary', size = 'md', onClick, disabled, className = '', ...props }) => {
  const base = 'font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-orange/20 shadow-soft hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 disabled:transform-none';
  
  const variants = {
    primary: 'bg-primary-orange text-white hover:bg-orange-400 disabled:bg-gray-400 disabled:cursor-not-allowed',
    secondary: 'bg-white border-2 border-primary-orange text-primary-orange hover:bg-primary-orange hover:text-white disabled:border-gray-400 disabled:text-gray-400',
    danger: 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-200 disabled:bg-gray-100 disabled:text-gray-400',
    outline: 'border-2 border-gray-300 text-text-dark hover:bg-gray-50 disabled:border-gray-200 disabled:text-gray-400'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg',
    xl: 'px-12 py-4 text-xl'
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

