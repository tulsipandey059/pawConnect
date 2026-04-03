import React from 'react';

const InfoCard = ({ icon, label, value }) => {
  return (
    <div className="bg-light-accent/30 rounded-2xl p-4 flex items-center space-x-4">
      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-soft">
        <span className="text-2xl">{icon}</span>
      </div>
      <div>
        <p className="text-sm text-text-dark/60">{label}</p>
        <p className="font-semibold text-text-dark">{value}</p>
      </div>
    </div>
  );
};

export default InfoCard;

