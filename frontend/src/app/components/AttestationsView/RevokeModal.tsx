import React from 'react';

interface RevokeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

function RevokeModal({ isOpen, onClose, onConfirm }: RevokeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 font-serif flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-100 to-blue-300 dark:from-gray-800 dark:to-gray-900 opacity-90"></div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border shadow-lg z-50 relative">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Revoke Attestation</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Are you sure you want to revoke this attestation?</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-300 dark:bg-gray-700 py-2 px-4 rounded text-gray-800 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-600 transition duration-300 ease-in-out"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="bg-blue-600 py-2 px-4 rounded text-white hover:bg-blue-700 transition duration-300 ease-in-out"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}

export default RevokeModal;
