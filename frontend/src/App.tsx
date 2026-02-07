/**
 * Main App component
 */
import React, { useState } from 'react';
import { format } from 'date-fns';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './components/LoginPage';
import { OutstandingTotal } from './components/OutstandingTotal';
import { PartyForm } from './components/PartyForm';
import { TransactionTypeForm } from './components/TransactionTypeForm';
import { TransactionTable } from './components/TransactionTable';
import { EditDrawer } from './components/EditDrawer';
import type { Party, TransactionType } from './types';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const AppContent: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();

  const [partyFilter, setPartyFilter] = useState('');
  const [tillDate, setTillDate] = useState<Date | null>(null);
  const [drawerCollapsed, setDrawerCollapsed] = useState(true);
  const [isPartyFormOpen, setIsPartyFormOpen] = useState(false);
  const [isTransactionTypeFormOpen, setIsTransactionTypeFormOpen] = useState(false);
  const [editingParty, setEditingParty] = useState<Party | null>(null);
  const [editingTransactionType, setEditingTransactionType] = useState<TransactionType | null>(null);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const openAddParty = () => {
    setEditingParty(null);
    setIsPartyFormOpen(true);
  };
  const openEditParty = (party: Party) => {
    setEditingParty(party);
    setIsPartyFormOpen(true);
  };
  const openAddTransactionType = () => {
    setEditingTransactionType(null);
    setIsTransactionTypeFormOpen(true);
  };
  const openEditTransactionType = (tt: TransactionType) => {
    setEditingTransactionType(tt);
    setIsTransactionTypeFormOpen(true);
  };

  const tillDateStr = tillDate ? format(tillDate, 'yyyy-MM-dd') : null;

  return (
    <div className="min-h-screen bg-gray-100">
      <EditDrawer
        onEditParty={openEditParty}
        onEditTransactionType={openEditTransactionType}
        onCollapseChange={setDrawerCollapsed}
        onLogout={logout}
      />

      <div
        className={`p-4 md:p-8 transition-all duration-300 ${
          drawerCollapsed ? 'pl-20' : 'pl-52'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <header className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Ledger Web Application</h1>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="md:col-span-1">
              <OutstandingTotal partyFilter={partyFilter} tillDate={tillDateStr} />
            </div>

            <div className="md:col-span-2 flex flex-col gap-3">
              <button
                onClick={openAddParty}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Add Party
              </button>
              <button
                onClick={openAddTransactionType}
                className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition font-medium"
              >
                Add Transaction Type
              </button>
            </div>
          </div>

        <TransactionTable
          partyFilter={partyFilter}
          setPartyFilter={setPartyFilter}
          tillDate={tillDate}
          setTillDate={setTillDate}
        />

        <PartyForm
          isOpen={isPartyFormOpen}
          onClose={() => {
            setIsPartyFormOpen(false);
            setEditingParty(null);
          }}
          party={editingParty}
        />

        <TransactionTypeForm
          isOpen={isTransactionTypeFormOpen}
          onClose={() => {
            setIsTransactionTypeFormOpen(false);
            setEditingTransactionType(null);
          }}
          transactionType={editingTransactionType}
        />
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
