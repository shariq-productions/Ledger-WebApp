/**
 * React hook for WebSocket real-time updates
 */
import { useEffect } from 'react';
import { wsService } from '../services/websocket';
import { useQueryClient } from 'react-query';

export const useWebSocket = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Connect WebSocket
    wsService.connect();

    // Listen for party updates
    const handlePartyCreated = () => {
      queryClient.invalidateQueries(['parties']);
      queryClient.invalidateQueries(['outstanding-total']);
    };
    const handlePartyUpdated = () => {
      queryClient.invalidateQueries(['parties']);
      queryClient.invalidateQueries(['transactions']);
      queryClient.invalidateQueries(['outstanding-total']);
    };
    const handlePartyDeleted = () => {
      queryClient.invalidateQueries(['parties']);
      queryClient.invalidateQueries(['transactions']);
      queryClient.invalidateQueries(['outstanding-total']);
    };

    // Listen for transaction type updates
    const handleTransactionTypeCreated = () => {
      queryClient.invalidateQueries(['transaction-types']);
    };
    const handleTransactionTypeUpdated = () => {
      queryClient.invalidateQueries(['transaction-types']);
      queryClient.invalidateQueries(['transactions']);
      queryClient.invalidateQueries(['outstanding-total']);
    };
    const handleTransactionTypeDeleted = () => {
      queryClient.invalidateQueries(['transaction-types']);
      queryClient.invalidateQueries(['transactions']);
      queryClient.invalidateQueries(['outstanding-total']);
    };

    // Listen for transaction updates
    const handleTransactionCreated = () => {
      queryClient.invalidateQueries(['transactions']);
      queryClient.invalidateQueries(['outstanding-total']);
    };
    const handleTransactionUpdated = () => {
      queryClient.invalidateQueries(['transactions']);
      queryClient.invalidateQueries(['outstanding-total']);
    };
    const handleTransactionDeleted = () => {
      queryClient.invalidateQueries(['transactions']);
      queryClient.invalidateQueries(['outstanding-total']);
    };

    // Listen for outstanding total updates
    const handleOutstandingTotal = (data: { total: number }) => {
      queryClient.setQueryData(['outstanding-total'], { total: data.total });
    };

    // Register event listeners
    wsService.on('party_created', handlePartyCreated);
    wsService.on('party_updated', handlePartyUpdated);
    wsService.on('party_deleted', handlePartyDeleted);
    wsService.on('transaction_type_created', handleTransactionTypeCreated);
    wsService.on('transaction_type_updated', handleTransactionTypeUpdated);
    wsService.on('transaction_type_deleted', handleTransactionTypeDeleted);
    wsService.on('transaction_created', handleTransactionCreated);
    wsService.on('transaction_updated', handleTransactionUpdated);
    wsService.on('transaction_deleted', handleTransactionDeleted);
    wsService.on('outstanding_total', handleOutstandingTotal);

    // Cleanup on unmount
    return () => {
      wsService.off('party_created', handlePartyCreated);
      wsService.off('party_updated', handlePartyUpdated);
      wsService.off('party_deleted', handlePartyDeleted);
      wsService.off('transaction_type_created', handleTransactionTypeCreated);
      wsService.off('transaction_type_updated', handleTransactionTypeUpdated);
      wsService.off('transaction_type_deleted', handleTransactionTypeDeleted);
      wsService.off('transaction_created', handleTransactionCreated);
      wsService.off('transaction_updated', handleTransactionUpdated);
      wsService.off('transaction_deleted', handleTransactionDeleted);
      wsService.off('outstanding_total', handleOutstandingTotal);
      wsService.disconnect();
    };
  }, [queryClient]);
};
