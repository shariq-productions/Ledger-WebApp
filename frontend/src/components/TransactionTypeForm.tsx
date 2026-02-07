/**
 * Transaction Type form component for adding/editing transaction types
 */
import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { transactionTypeAPI } from '../services/api';
import type { TransactionType } from '../types';
import { DropdownCard } from './DropdownCard';

interface TransactionTypeFormProps {
  isOpen: boolean;
  onClose: () => void;
  transactionType?: TransactionType | null;
}

export const TransactionTypeForm: React.FC<TransactionTypeFormProps> = ({ isOpen, onClose, transactionType }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    note: '',
    type: 'add' as 'add' | 'reduce',
  });

  useEffect(() => {
    if (transactionType) {
      setFormData({
        note: transactionType.note || '',
        type: transactionType.type || 'add',
      });
    } else {
      setFormData({
        note: '',
        type: 'add',
      });
    }
  }, [transactionType, isOpen]);

  const createMutation = useMutation(transactionTypeAPI.create, {
    onSuccess: () => {
      queryClient.invalidateQueries(['transaction-types']);
      handleClose();
      alert('Transaction Type saved successfully!');
    },
    onError: (error: any) => {
      alert(`Error: ${error.response?.data?.detail || 'Failed to save transaction type'}`);
    },
  });

  const updateMutation = useMutation(
    (data: Partial<TransactionType>) => transactionTypeAPI.update(transactionType!.id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['transaction-types']);
        queryClient.invalidateQueries(['transactions']);
        handleClose();
        alert('Transaction Type updated successfully!');
      },
      onError: (error: any) => {
        alert(`Error: ${error.response?.data?.detail || 'Failed to update transaction type'}`);
      },
    }
  );

  const deleteMutation = useMutation(
    () => transactionTypeAPI.delete(transactionType!.id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['transaction-types']);
        queryClient.invalidateQueries(['transactions']);
        queryClient.invalidateQueries(['outstanding-total']);
        handleClose();
        alert('Transaction Type deleted successfully!');
      },
      onError: (error: any) => {
        alert(`Error: ${error.response?.data?.detail || 'Failed to delete transaction type'}`);
      },
    }
  );

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this transaction type? All related transactions will also be deleted.')) {
      deleteMutation.mutate();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.note.trim()) {
      alert('Transaction Note is mandatory!');
      return;
    }

    if (transactionType) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleClose = () => {
    setFormData({ note: '', type: 'add' });
    onClose();
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? Changes will be lost.')) {
      handleClose();
    }
  };

  return (
    <DropdownCard
      isOpen={isOpen}
      onClose={handleClose}
      title={transactionType ? 'Edit Transaction Type' : 'Add Transaction Type'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Transaction Note <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="type"
                value="add"
                checked={formData.type === 'add'}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'add' | 'reduce' })}
                className="mr-2"
                required
              />
              <span>Add</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="type"
                value="reduce"
                checked={formData.type === 'reduce'}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'add' | 'reduce' })}
                className="mr-2"
                required
              />
              <span>Reduce</span>
            </label>
          </div>
        </div>

        <div className="flex gap-3 pt-4 flex-wrap">
          {transactionType && (
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
