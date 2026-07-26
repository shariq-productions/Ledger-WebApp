'use client'
import React from 'react'
import { useOutstandingTotal } from '@/hooks/useApi'
import { formatCurrency } from '@/utils/formatting'

interface OutstandingTotalProps {
  filters?: { partyId?: number; tillDate?: Date }
}

export const OutstandingTotal: React.FC<OutstandingTotalProps> = ({ filters }) => {
  const { data, isLoading } = useOutstandingTotal(filters)

  if (isLoading) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="card">
      <div className="card-body">
        <h3 className="text-sm font-medium text-gray-500">Outstanding Total</h3>
        <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(data.total)}</p>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500">Add (Credit)</p>
            <p className="text-sm font-semibold text-success-600">{formatCurrency(data.addTotal)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Reduce (Debit)</p>
            <p className="text-sm font-semibold text-danger-600">{formatCurrency(data.reduceTotal)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
