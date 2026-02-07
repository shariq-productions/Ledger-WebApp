/**
 * Transaction form component for adding/editing transactions
 */
import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { transactionAPI, partyAPI, transactionTypeAPI } from '../services/api';
import type { Transaction, Party, TransactionType } from '../types';
import { DropdownCard } from './DropdownCard';
import { format } from 'date-fns';

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  transaction?: Transaction | null;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ isOpen, onClose, transaction }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    date: new Date(),
    party_id: 0,
    transaction_note: '',
    type_id: 0,
    amount: '',
  });
  const [partySearch, setPartySearch] = useState('');

  // Fetch parties and transaction types
  const { data: parties = [] } = useQuery<Party[]>(['parties'], () =>
    partyAPI.getAll().then((res) => res.data)
  );
  const { data: transactionTypes = [] } = useQuery<TransactionType[]>(
    ['transaction-types'],
    () => transactionTypeAPI.getAll().then((res) => res.data)
  );

  useEffect(() => {
    if (transaction) {
      setFormData({
        date: new Date(transaction.date),
        party_id: transaction.party_id,
        transaction_note: transaction.transaction_note || '',
        type_id: transaction.type_id,
        amount: transaction.amount.toString(),
      });
    } else {
      setFormData({
        date: new Date(),
        party_id: 0,
        transaction_note: '',
        type_id: 0,
        amount: '',
      });
    }
  }, [transaction, isOpen]);

  // Handle transaction type selection - auto-append note
  const handleTypeChange = (typeId: number) => {
    const selectedType = transactionTypes.find((t) => t.id === typeId);
    setFormData({
      ...formData,
      type_id: typeId,
      transaction_note: selectedType
        ? formData.transaction_note
          ? `${formData.transaction_note} ${selectedType.note}`
          : selectedType.note
        : formData.transaction_note,
    });
  };

  const createMutation = useMutation(transactionAPI.create, {
    onSuccess: () => {
      queryClient.invalidateQueries(['transactions']);
      queryClient.invalidateQueries(['outstanding-total']);
      handleClose();
      alert('Transaction saved successfully!');
    },
    onError: (error: any) => {
      alert(`Error: ${error.response?.data?.detail || 'Failed to save transaction'}`);
    },
  });

  const updateMutation = useMutation(
    (data: Partial<Transaction>) => transactionAPI.update(transaction!.id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['transactions']);
        queryClient.invalidateQueries(['outstanding-total']);
        handleClose();
        alert('Transaction updated successfully!');
      },
      onError: (error: any) => {
        alert(`Error: ${error.response?.data?.detail || 'Failed to update transaction'}`);
      },
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.party_id || !formData.type_id || !formData.amount) {
      alert('Please fill all required fields!');
      return;
    }

    const amount = parseInt(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      alert('Amount must be a positive integer!');
      return;
    }

    const submitData = {
      date: format(formData.date, 'yyyy-MM-dd'),
      party_id: formData.party_id,
      transaction_note: formData.transaction_note || undefined,
      type_id: formData.type_id,
      amount: amount,
    };

    if (transaction) {
      updateMutation.mutate(submitData);
    } else {
      createMutation.mutate(submitData);
    }
  };

  const handleClose = () => {
    setFormData({
      date: new Date(),
      party_id: 0,
      transaction_note: '',
      type_id: 0,
      amount: '',
    });
    setPartySearch('');
    onClose();
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? Changes will be lost.')) {
      handleClose();
    }
  };

  // Filter parties based on search
  const filteredParties = parties.filter((party) =>
    party.name.toLowerCase().includes(partySearch.toLowerCase())
  );

  return (
    <DropdownCard
      isOpen={isOpen}
      onClose={handleClose}
      title={transaction ? 'Edit Transaction' : 'Add Transaction'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date <span className="text-red-500">*</span>
          </label>
          <DatePicker
            selected={formData.date}
            onChange={(date: Date) => setFormData({ ...formData, date })}
            dateFormat="dd/MM/yyyy"
            maxDate={new Date()}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Party <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Search party..."
            value={partySearch}
            onChange={(e) => setPartySearch(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          />
          <select
            value={formData.party_id}
            onChange={(e) => setFormData({ ...formData, party_id: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value={0}>Select a party</option>
            {filteredParties.map((party) => (
              <option key={party.id} value={party.id}>
                {party.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Transaction Note
          </label>
          <input
            type="text"
            value={formData.transaction_note}
            onChange={(e) => setFormData({ ...formData, transaction_note: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.type_id}
            onChange={(e) => handleTypeChange(parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value={0}>Select a type</option>
            {transactionTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.note} ({type.type})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min="1"
            step="1"
            value={formData.amount}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '' || /^\d+$/.test(value)) {
                setFormData({ ...formData, amount: value });
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter amount (integer only)"
            required
          />
        </div>

        <div className="flex gap-3 pt-4">
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
