/**
 * Party form component for adding/editing parties
 */
import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { partyAPI } from '../services/api';
import type { Party } from '../types';
import { DropdownCard } from './DropdownCard';

interface PartyFormProps {
  isOpen: boolean;
  onClose: () => void;
  party?: Party | null;
}

export const PartyForm: React.FC<PartyFormProps> = ({ isOpen, onClose, party }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: '',
    billing_name: '',
    location: '',
  });

  useEffect(() => {
    if (party) {
      setFormData({
        name: party.name || '',
        billing_name: party.billing_name || '',
        location: party.location || '',
      });
    } else {
      setFormData({
        name: '',
        billing_name: '',
        location: '',
      });
    }
  }, [party, isOpen]);

  const createMutation = useMutation(partyAPI.create, {
    onSuccess: () => {
      queryClient.invalidateQueries(['parties']);
      handleClose();
      alert('Party saved successfully!');
    },
    onError: (error: any) => {
      alert(`Error: ${error.response?.data?.detail || 'Failed to save party'}`);
    },
  });

  const updateMutation = useMutation(
    (data: Partial<Party>) => partyAPI.update(party!.id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['parties']);
        queryClient.invalidateQueries(['transactions']);
        handleClose();
        alert('Party updated successfully!');
      },
      onError: (error: any) => {
        alert(`Error: ${error.response?.data?.detail || 'Failed to update party'}`);
      },
    }
  );

  const deleteMutation = useMutation(
    () => partyAPI.delete(party!.id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['parties']);
        queryClient.invalidateQueries(['transactions']);
        queryClient.invalidateQueries(['outstanding-total']);
        handleClose();
        alert('Party deleted successfully!');
      },
      onError: (error: any) => {
        alert(`Error: ${error.response?.data?.detail || 'Failed to delete party'}`);
      },
    }
  );

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this party? All related transactions will also be deleted.')) {
      deleteMutation.mutate();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Party Name is mandatory!');
      return;
    }

    if (party) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleClose = () => {
    setFormData({ name: '', billing_name: '', location: '' });
    onClose();
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? Changes will be lost.')) {
      handleClose();
    }
  };

  return (
    <DropdownCard isOpen={isOpen} onClose={handleClose} title={party ? 'Edit Party' : 'Add Party'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Party Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Party Billing Name
          </label>
          <input
            type="text"
            value={formData.billing_name}
            onChange={(e) => setFormData({ ...formData, billing_name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-3 pt-4 flex-wrap">
          {party && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteMutation.isLoading}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition disabled:opacity-50"
            >
              {deleteMutation.isLoading ? 'Deleting...' : 'Delete'}
            </button>
          )}
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createMutation.isLoading || updateMutation.isLoading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
          >
            {createMutation.isLoading || updateMutation.isLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </DropdownCard>
  );
};
