'use client'
import React, { useState } from 'react'
import {
  useParties,
  useTransactionTypes,
  useTransactions,
  useDeleteTransaction,
  useCreateTransaction,
  useUpdateTransaction,
} from '@/hooks/useApi'
import { OutstandingTotal } from './OutstandingTotal'
import { DashboardFilters } from './DashboardFilters'
import { TransactionTable } from './TransactionTable'
import { DropdownCard } from './ui/DropdownCard'
import { TransactionForm } from './forms/TransactionForm'
import { Transaction, TransactionInput } from '@/types'

export const Dashboard: React.FC = () => {
  const [filters, setFilters] = useState<{
    partyId?: number
    tillDate?: Date
  }>({})
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)

  const { data: parties = [], isLoading: partiesLoading } = useParties()
  const { data: transactionTypes = [], isLoading: typesLoading } = useTransactionTypes()
  const { data: transactions = [], isLoading: transactionsLoading } = useTransactions(filters)

  const deleteMutation = useDeleteTransaction()
  const createMutation = useCreateTransaction()
  const updateMutation = useUpdateTransaction()

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id)
  }

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingTransaction(null)
  }

  const handleSubmit = (data: TransactionInput & { date: Date }) => {
    if (editingTransaction) {
      updateMutation.mutate(
        { id: editingTransaction.id, ...data },
        { onSuccess: handleCloseForm }
      )
    } else {
      createMutation.mutate(data, { onSuccess: handleCloseForm })
    }
  }

  if (partiesLoading || typesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-12 w-12 border-4 border-primary-500 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="btn btn-primary"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Transaction
        </button>
      </div>

      {/* Outstanding Total */}
      <OutstandingTotal filters={filters} />

      {/* Filters */}
      <DashboardFilters
        parties={parties}
        selectedPartyId={filters.partyId}
        selectedDate={filters.tillDate}
        onPartyChange={(partyId) => setFilters(prev => ({ ...prev, partyId }))}
        onDateChange={(date) => setFilters(prev => ({ ...prev, tillDate: date }))}
      />

      {/* Transactions Table */}
      <TransactionTable
        transactions={transactions}
        parties={parties}
        transactionTypes={transactionTypes}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={transactionsLoading}
      />

      {/* Add/Edit Transaction Form */}
      <DropdownCard
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        title={editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
      >
        <TransactionForm
          initialData={editingTransaction}
          parties={parties}
          transactionTypes={transactionTypes}
          onSubmit={handleSubmit}
          onCancel={handleCloseForm}
          loading={createMutation.isPending || updateMutation.isPending}
        />
      </DropdownCard>
    </div>
  )
}
