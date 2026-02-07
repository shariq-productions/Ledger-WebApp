/**
 * Left-side collapsible drawer with Edit Party and Edit Transaction Type options.
 * Hovering over either option shows a sub-drawer with search and list.
 */
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { partyAPI, transactionTypeAPI } from '../services/api';
import type { Party, TransactionType } from '../types';

interface EditDrawerProps {
  onEditParty: (party: Party) => void;
  onEditTransactionType: (tt: TransactionType) => void;
  onCollapseChange?: (collapsed: boolean) => void;
  onLogout: () => void;
}

export const EditDrawer: React.FC<EditDrawerProps> = ({
  onEditParty,
  onEditTransactionType,
  onCollapseChange,
  onLogout,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleCollapsed = () => {
    const next = !isCollapsed;
    setIsCollapsed(next);
    onCollapseChange?.(next);
  };
  const [hoveredOption, setHoveredOption] = useState<'party' | 'transactionType' | null>(null);
  const [partySearch, setPartySearch] = useState('');
  const [transactionTypeSearch, setTransactionTypeSearch] = useState('');

  const { data: parties = [] } = useQuery<Party[]>(['parties'], () =>
    partyAPI.getAll().then((res) => res.data)
  );
  const { data: transactionTypes = [] } = useQuery<TransactionType[]>(
    ['transaction-types'],
    () => transactionTypeAPI.getAll().then((res) => res.data)
  );

  const filteredParties = parties.filter((p) =>
    p.name.toLowerCase().includes(partySearch.toLowerCase())
  );
  const filteredTransactionTypes = transactionTypes.filter(
    (tt) =>
      tt.note.toLowerCase().includes(transactionTypeSearch.toLowerCase()) ||
      tt.type.toLowerCase().includes(transactionTypeSearch.toLowerCase())
  );

  return (
    <div className="fixed left-0 top-0 h-screen flex z-40">
      {/* Main collapsible drawer */}
      <div
        className={`bg-white border-r border-gray-200 shadow-lg transition-all duration-300 flex flex-col ${
          isCollapsed ? 'w-14' : 'w-48'
        }`}
      >
        <button
          onClick={toggleCollapsed}
          className="p-3 border-b border-gray-200 hover:bg-gray-50 flex items-center justify-center"
        >
          <span className="text-xl">{isCollapsed ? '»' : '«'}</span>
        </button>

        <div className="flex flex-col py-2 flex-1 min-h-0">
          <div
            className="relative"
            onMouseEnter={() => setHoveredOption('party')}
            onMouseLeave={() => setHoveredOption(null)}
          >
            <button
              className={`w-full py-3 text-left hover:bg-blue-50 flex items-center gap-2 ${
                isCollapsed ? 'px-2 justify-center' : 'px-4'
              }`}
              title="Edit Party"
            >
              <span className="text-blue-600 text-lg">👤</span>
              {!isCollapsed && <span>Edit Party</span>}
            </button>

              {hoveredOption === 'party' && (
                <div className="absolute left-full top-0 -ml-px w-72 bg-white border border-gray-200 rounded-r-lg shadow-xl z-50 py-2">
                  <div className="p-3 border-b border-gray-200">
                    <input
                      type="text"
                      placeholder="Search parties..."
                      value={partySearch}
                      onChange={(e) => setPartySearch(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="max-h-80 overflow-y-auto p-2">
                    {filteredParties.length === 0 ? (
                      <p className="px-3 py-4 text-sm text-gray-500">No parties found</p>
                    ) : (
                      filteredParties.map((party) => (
                        <button
                          key={party.id}
                          onClick={() => {
                            onEditParty(party);
                            setHoveredOption(null);
                          }}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-blue-50 rounded-md"
                        >
                          {party.name}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

          <div
            className="relative"
            onMouseEnter={() => setHoveredOption('transactionType')}
            onMouseLeave={() => setHoveredOption(null)}
          >
            <button
              className={`w-full py-3 text-left hover:bg-purple-50 flex items-center gap-2 ${
                isCollapsed ? 'px-2 justify-center' : 'px-4'
              }`}
              title="Edit Transaction Type"
            >
              <span className="text-purple-600 text-lg">📋</span>
              {!isCollapsed && <span>Edit Transaction Type</span>}
            </button>

              {hoveredOption === 'transactionType' && (
                <div className="absolute left-full top-0 -ml-px w-72 bg-white border border-gray-200 rounded-r-lg shadow-xl z-50 py-2">
                  <div className="p-3 border-b border-gray-200">
                    <input
                      type="text"
                      placeholder="Search transaction types..."
                      value={transactionTypeSearch}
                      onChange={(e) => setTransactionTypeSearch(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div className="max-h-80 overflow-y-auto p-2">
                    {filteredTransactionTypes.length === 0 ? (
                      <p className="px-3 py-4 text-sm text-gray-500">No transaction types found</p>
                    ) : (
                      filteredTransactionTypes.map((tt) => (
                        <button
                          key={tt.id}
                          onClick={() => {
                            onEditTransactionType(tt);
                            setHoveredOption(null);
                          }}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-purple-50 rounded-md"
                        >
                          {tt.note} <span className="text-gray-500">({tt.type})</span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
          </div>

          {/* Logout button at bottom */}
          <div className="mt-auto pt-4 border-t border-gray-200">
            <button
              onClick={onLogout}
              className={`w-full py-3 text-left hover:bg-red-50 flex items-center gap-2 text-red-600 ${
                isCollapsed ? 'px-2 justify-center' : 'px-4'
              }`}
              title="Logout"
            >
              <span className="text-lg">🚪</span>
              {!isCollapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
