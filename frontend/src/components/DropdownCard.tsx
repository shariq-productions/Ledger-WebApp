/**
 * Reusable dropdown card component
 */
import React, { useEffect, useRef } from 'react';

interface DropdownCardProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const DropdownCard: React.FC<DropdownCardProps> = ({ isOpen, onClose, title, children }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end pt-16 pr-4" style={{ pointerEvents: 'none' }}>
      <div
        ref={cardRef}
        className="bg-white rounded-lg shadow-xl border border-gray-200 p-6 w-full max-w-md"
        style={{ pointerEvents: 'auto' }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
