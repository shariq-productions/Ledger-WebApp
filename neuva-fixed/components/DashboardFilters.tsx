'use client'
import React from 'react'
import { Party } from '@/types'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

interface DashboardFiltersProps {
  parties: Party[]
  selectedPartyId?: number
  selectedDate?: Date
  onPartyChange: (partyId: number | undefined) => void
  onDateChange: (date: Date | undefined) => void
}

export const DashboardFilters: React.FC<DashboardFiltersProps> = ({
  parties,
  selectedPartyId,
  selectedDate,
  onPartyChange,
  onDateChange,
}) => {
  return (
    <div className="flex flex-wrap gap-4 items-end">
      <div className="flex-1 min-w-[200px]">
        <label className="form-label">Filter by Party</label>
        <select
          className="form-input"
          value={selectedPartyId || ''}
          onChange={(e) => {
            const value = e.target.value
            onPartyChange(value ? parseInt(value) : undefined)
          }}
        >
          <option value="">All Parties</option>
          {parties.map((party) => (
            <option key={party.id} value={party.id}>
              {party.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1 min-w-[200px]">
        <label className="form-label">Till Date</label>
        <DatePicker
          selected={selectedDate}
          onChange={onDateChange}
          dateFormat="dd/MM/yyyy"
          className="form-input"
          placeholderText="Select date"
          isClearable
        />
      </div>
      {(selectedPartyId || selectedDate) && (
        <button
          onClick={() => {
            onPartyChange(undefined)
            onDateChange(undefined)
          }}
          className="btn btn-outline btn-sm"
        >
          Clear Filters
        </button>
      )}
    </div>
  )
}
