'use client'
import React, { useState } from 'react'
import {
  useParties,
  useTransactionTypes,
  useCreateParty,
  useUpdateParty,
  useCreateTransactionType,
  useUpdateTransactionType,
} from '@/hooks/useApi'
import { PartyForm } from './forms/PartyForm'
import { TransactionTypeForm } from './forms/TransactionTypeForm'
import { DropdownCard } from './ui/DropdownCard'
import { ConfirmationDialog } from './ui/ConfirmationDialog'
import { Button } from './ui/Button'
import { Party, TransactionType } from '@/types'

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
  onLogout: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  onLogout,
}) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [showPartyForm, setShowPartyForm] = useState(false)
  const [showTypeForm, setShowTypeForm] = useState(false)
  const [editingParty, setEditingParty] = useState<Party | null>(null)
  const [editingType, setEditingType] = useState<TransactionType | null>(null)
  const [partySearch, setPartySearch] = useState('')
  const [typeSearch, setTypeSearch] = useState('')

  const { data: parties = [] } = useParties()
  const { data: transactionTypes = [] } = useTransactionTypes()

  const createParty = useCreateParty()
  const updateParty = useUpdateParty()
  const createType = useCreateTransactionType()
  const updateType = useUpdateTransactionType()

  const filteredParties = parties.filter(p =>
    p.name.toLowerCase().includes(partySearch.toLowerCase())
  )
  const filteredTypes = transactionTypes.filter(t =>
    t.note.toLowerCase().includes(typeSearch.toLowerCase())
  )

  const closePartyForm = () => {
    setShowPartyForm(false)
    setEditingParty(null)
  }

  const closeTypeForm = () => {
    setShowTypeForm(false)
    setEditingType(null)
  }

  const handlePartySubmit = (data: { name: string; billingName?: string | null; location?: string | null }) => {
    if (editingParty) {
      updateParty.mutate({ id: editingParty.id, ...data }, { onSuccess: closePartyForm })
    } else {
      createParty.mutate(data, { onSuccess: closePartyForm })
    }
  }

  const handleTypeSubmit = (data: { note: string; type: 'add' | 'reduce' }) => {
    if (editingType) {
      updateType.mutate({ id: editingType.id, ...data }, { onSuccess: closeTypeForm })
    } else {
      createType.mutate(data, { onSuccess: closeTypeForm })
    }
  }

  return (
    <>
      <aside
        className={`drawer ${!isOpen && 'drawer-collapsed'}`}
        style={{ width: isOpen ? '280px' : '64px' }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            {isOpen && (
              <h1 className="text-xl font-bold text-primary-600">Ledger</h1>
            )}
            <button
              onClick={onToggle}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                )}
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
            {isOpen ? (
              <div className="space-y-6">
                {/* Parties Section */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-sm font-semibold text-gray-600">Parties</h2>
                    <button
                      onClick={() => {
                        setEditingParty(null)
                        setShowPartyForm(true)
                      }}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      + Add
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search parties..."
                      value={partySearch}
                      onChange={(e) => setPartySearch(e.target.value)}
                      className="form-input text-sm"
                    />
                  </div>
                  <div className="mt-2 space-y-1 max-h-40 overflow-y-auto scrollbar-thin">
                    {filteredParties.slice(0, 10).map((party) => (
                      <button
                        key={party.id}
                        onClick={() => {
                          setEditingParty(party)
                          setShowPartyForm(true)
                        }}
                        className="w-full text-left px-2 py-1 text-sm hover:bg-gray-100 rounded transition-colors"
                      >
                        {party.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Transaction Types Section */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-sm font-semibold text-gray-600">Types</h2>
                    <button
                      onClick={() => {
                        setEditingType(null)
                        setShowTypeForm(true)
                      }}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      + Add
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search types..."
                      value={typeSearch}
                      onChange={(e) => setTypeSearch(e.target.value)}
                      className="form-input text-sm"
                    />
                  </div>
                  <div className="mt-2 space-y-1 max-h-40 overflow-y-auto scrollbar-thin">
                    {filteredTypes.slice(0, 10).map((type) => (
                      <button
                        key={type.id}
                        onClick={() => {
                          setEditingType(type)
                          setShowTypeForm(true)
                        }}
                        className="w-full text-left px-2 py-1 text-sm hover:bg-gray-100 rounded transition-colors"
                      >
                        <span className="flex items-center justify-between">
                          <span>{type.note}</span>
                          <span className={`badge ${type.type === 'add' ? 'badge-add' : 'badge-reduce'}`}>
                            {type.type}
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-4 pt-4">
                <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
                  <span className="text-xl">👤</span>
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
                  <span className="text-xl">📋</span>
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t p-4">
            <Button
              variant="danger"
              className="w-full"
              onClick={() => setShowLogoutConfirm(true)}
            >
              {isOpen ? 'Logout' : '🚪'}
            </Button>
          </div>
        </div>
      </aside>

      {/* Party Form Dropdown */}
      <DropdownCard
        isOpen={showPartyForm}
        onClose={closePartyForm}
        title={editingParty ? 'Edit Party' : 'Add Party'}
      >
        <PartyForm
          initialData={editingParty}
          onSubmit={handlePartySubmit}
          onCancel={closePartyForm}
          loading={createParty.isPending || updateParty.isPending}
        />
      </DropdownCard>

      {/* Transaction Type Form Dropdown */}
      <DropdownCard
        isOpen={showTypeForm}
        onClose={closeTypeForm}
        title={editingType ? 'Edit Transaction Type' : 'Add Transaction Type'}
      >
        <TransactionTypeForm
          initialData={editingType}
          onSubmit={handleTypeSubmit}
          onCancel={closeTypeForm}
          loading={createType.isPending || updateType.isPending}
        />
      </DropdownCard>

      {/* Logout Confirmation */}
      <ConfirmationDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={onLogout}
        title="Logout"
        message="Are you sure you want to logout?"
        confirmText="Logout"
      />
    </>
  )
}
