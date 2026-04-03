import React from 'react';
import Button from './Button';

const Modal = ({ isOpen, onClose, title, children, showFooter = true }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-text-dark">{title}</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {children}
        </div>

        {/* Footer */}
        {showFooter && (
          <div className="p-6 border-t border-gray-100 bg-gray-50/50 rounded-b-3xl flex gap-3 justify-end">
            <Button variant="outline" onClick={onClose} size="md">
              Cancel
            </Button>
            <Button variant="primary" size="md">
              Save
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;

