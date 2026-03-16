import React from 'react';

const PetTags = ({ tags, className = '' }) => {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag, index) => (
        <span key={index} className="px-3 py-1 bg-primary-orange/10 text-primary-orange text-xs font-medium rounded-full">
          {tag}
        </span>
      ))}
    </div>
  );
};

export default PetTags;

