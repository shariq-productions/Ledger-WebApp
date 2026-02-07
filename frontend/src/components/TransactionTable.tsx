/**
 * Transaction Table component with search/filter and edit functionality
 */
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { transactionAPI, partyAPI, transactionTypeAPI } from '../services/api';
import type { Transaction, Party, TransactionType } from '../types';
import { TransactionForm } from './TransactionForm';
import { format } from 'date-fns';

interface TransactionTableProps {
  partyFilter: string;
  setPartyFilter: (v: string) => void;
  tillDate: Date | null;
  setTillDate: (v: Date | null) => void;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  partyFilter,
  setPartyFilter,
  tillDate,
  setTillDate,
}) => {
  const queryClient = useQueryClient();
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const tillDateStr = tillDate ? format(tillDate, 'yyyy-MM-dd') : undefined;

  // Fetch transactions with filters (till date = show from beginning up to this date)
  const { data: transactions = [], isLoading } = useQuery<Transaction[]>(
    ['transactions', partyFilter, tillDateStr],
    () =>
      transactionAPI
        .getAll({
          party_filter: partyFilter || undefined,
          date_end: tillDateStr,
        })
        .then((res) => res.data)
  );

  // Fetch parties and transaction types for display
  const { data: parties = [] } = useQuery<Party[]>(['parties'], () =>
    partyAPI.getAll().then((res) => res.data)
  );
  const { data: transactionTypes = [] } = useQuery<TransactionType[]>(
    ['transaction-types'],
    () => transactionTypeAPI.getAll().then((res) => res.data)
  );

  const deleteMutation = useMutation(transactionAPI.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries(['transactions']);
      queryClient.invalidateQueries(['outstanding-total']);
      alert('Transaction deleted successfully!');
    },
    onError: (error: any) => {
      alert(`Error: ${error.response?.data?.detail || 'Failed to delete transaction'}`);
    },
  });

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteMutation.mutate(id);
    }
  };

  const getPartyName = (partyId: number) => {
    return parties.find((p) => p.id === partyId)?.name || 'Unknown';
  };

  const getTransactionType = (typeId: number) => {
    return transactionTypes.find((t) => t.id === typeId);
  };

  const handleAddClick = () => {
    setEditingTransaction(null);
    setIsFormOpen(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Transactions</h2>
        <button
          onClick={handleAddClick}
          className="bg-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-green-700 transition text-2xl font-bold"
          title="Add Transaction"
        >
          +
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Party
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Search party..."
              value={partyFilter}
              onChange={(e) => setPartyFilter(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Till Date
          </label>
          <DatePicker
            selected={tillDate}
            onChange={(date: Date | null) => setTillDate(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="Show transactions till this date"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            isClearable
          />
        </div>
      </div>

      {/* Transaction Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Serial No.
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Party
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transaction Note
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  No transactions found
                </td>
              </tr>
            ) : (
              transactions.map((transaction) => {
                const transactionType = getTransactionType(transaction.type_id);
                return (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {transaction.serial_number}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {format(new Date(transaction.date), 'dd/MM/yyyy')}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {getPartyName(transaction.party_id)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {transaction.transaction_note || '-'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 rounded ${
                          transactionType?.type === 'add'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {transactionType?.type || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      ₹{transaction.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleEdit(transaction)}
                        className="text-blue-600 hover:text-blue-800 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <TransactionForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTransaction(null);
        }}
        transaction={editingTransaction}
      />
    </div>
  );
};
