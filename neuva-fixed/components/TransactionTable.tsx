'use client'
import React, { useState } from 'react'
import { Transaction, Party, TransactionType } from '@/types'
import { formatDate, formatCurrency, getSerialDisplay } from '@/utils/formatting'
import { Button } from '@/components/ui/Button'
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog'

interface TransactionTableProps {
  transactions: Transaction[]
  parties: Party[]
  transactionTypes: TransactionType[]
  onEdit: (transaction: Transaction) => void
  onDelete: (id: number) => void
  loading?: boolean
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  parties,
  transactionTypes,
  onEdit,
  onDelete,
  loading = false,
}) => {
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const getPartyName = (partyId: number) => {
    const party = parties.find(p => p.id === partyId)
    return party?.name || 'Unknown'
  }

  const getTypeInfo = (typeId: number) => {
    const type = transactionTypes.find(t => t.id === typeId)
    return type || { note: 'Unknown', type: 'unknown' as const }
  }

  if (loading) {
    return (
      <div className="table-container">
        <div className="p-8 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2 text-sm text-gray-500">Loading transactions...</p>
        </div>
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="table-container">
        <div className="p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="mt-2 text-sm text-gray-500">No transactions found</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="table-container">
        <table className="table">
          <thead className="table-header">
            <tr>
              <th className="table-header-cell">#</th>
              <th className="table-header-cell">Date</th>
              <th className="table-header-cell">Party</th>
              <th className="table-header-cell">Note</th>
              <th className="table-header-cell">Type</th>
              <th className="table-header-cell text-right">Amount</th>
              <th className="table-header-cell text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {transactions.map((transaction) => {
              const typeInfo = getTypeInfo(transaction.typeId)
              const isAdd = typeInfo.type === 'add'
              return (
                <tr key={transaction.id} className="table-row">
                  <td className="table-cell font-medium">{getSerialDisplay(transaction.serialNumber)}</td>
                  <td className="table-cell">{formatDate(transaction.date)}</td>
                  <td className="table-cell">{getPartyName(transaction.partyId)}</td>
                  <td className="table-cell max-w-xs truncate">{transaction.transactionNote || '-'}</td>
                  <td className="table-cell">
                    <span className={`badge ${isAdd ? 'badge-add' : 'badge-reduce'}`}>{typeInfo.note}</span>
                  </td>
                  <td className="table-cell text-right font-medium">{formatCurrency(transaction.amount)}</td>
                  <td className="table-cell text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm" onClick={() => onEdit(transaction)}>Edit</Button>
                      <Button variant="danger" size="sm" onClick={() => setDeleteId(transaction.id)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <ConfirmationDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            onDelete(deleteId)
            setDeleteId(null)
          }
        }}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This action cannot be undone."
        confirmText="Delete"
        danger
      />
    </>
  )
}
