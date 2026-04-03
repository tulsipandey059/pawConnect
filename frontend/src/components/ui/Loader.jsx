import React from 'react';

const Loader = ({ size = 'md', color = 'primary', className = '' }) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  const colors = {
    primary: 'border-primary-orange',
    gray: 'border-gray-300',
    orange: 'border-orange-400'
  };

  return (
    <div className={`animate-spin rounded-full border-4 border-gray-200 ${colors[color]} border-t-transparent ${sizes[size]} ${className}`} />
  );
};

export default Loader;

