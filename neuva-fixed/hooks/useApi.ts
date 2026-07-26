'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import {
  Party,
  TransactionType,
  Transaction,
  OutstandingTotal,
} from '@/types'
import toast from 'react-hot-toast'

// ---------- Parties ----------

export const useParties = () => {
  return useQuery<Party[]>({
    queryKey: ['parties'],
    queryFn: async () => {
      const { data } = await api.get('/parties')
      return data
    },
    staleTime: 5 * 60 * 1000,
  })
}

export const useCreateParty = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: { name: string; billingName?: string; location?: string }) => {
      const { data: response } = await api.post('/parties', data)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parties'] })
      toast.success('Party created successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to create party')
    },
  })
}

export const useUpdateParty = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: number; name: string; billingName?: string; location?: string }) => {
      const { data: response } = await api.put(`/parties/${id}`, data)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parties'] })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['outstanding-total'] })
      toast.success('Party updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update party')
    },
  })
}

export const useDeleteParty = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/parties/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parties'] })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['outstanding-total'] })
      toast.success('Party deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to delete party')
    },
  })
}

// ---------- Transaction Types ----------

export const useTransactionTypes = () => {
  return useQuery<TransactionType[]>({
    queryKey: ['transaction-types'],
    queryFn: async () => {
      const { data } = await api.get('/transaction-types')
      return data
    },
    staleTime: 5 * 60 * 1000,
  })
}

export const useCreateTransactionType = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: { note: string; type: 'add' | 'reduce' }) => {
      const { data: response } = await api.post('/transaction-types', data)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transaction-types'] })
      toast.success('Transaction type created successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to create transaction type')
    },
  })
}

export const useUpdateTransactionType = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: number; note: string; type: 'add' | 'reduce' }) => {
      const { data: response } = await api.put(`/transaction-types/${id}`, data)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transaction-types'] })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['outstanding-total'] })
      toast.success('Transaction type updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update transaction type')
    },
  })
}

export const useDeleteTransactionType = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/transaction-types/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transaction-types'] })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['outstanding-total'] })
      toast.success('Transaction type deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to delete transaction type')
    },
  })
}

// ---------- Transactions ----------

export const useTransactions = (filters?: { partyId?: number; tillDate?: Date }) => {
  return useQuery<Transaction[]>({
    queryKey: ['transactions', filters],
    queryFn: async () => {
      const params: any = {}
      if (filters?.partyId) params.partyId = filters.partyId
      if (filters?.tillDate) params.tillDate = filters.tillDate.toISOString()

      const { data } = await api.get('/transactions', { params })
      return data
    },
    staleTime: 2 * 60 * 1000,
  })
}

export const useCreateTransaction = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: {
      date: Date
      partyId: number
      transactionNote?: string
      typeId: number
      amount: number
    }) => {
      const { data: response } = await api.post('/transactions', data)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['outstanding-total'] })
      toast.success('Transaction created successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to create transaction')
    },
  })
}

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }: {
      id: number
      date: Date
      partyId: number
      transactionNote?: string
      typeId: number
      amount: number
    }) => {
      const { data: response } = await api.put(`/transactions/${id}`, data)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['outstanding-total'] })
      toast.success('Transaction updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update transaction')
    },
  })
}

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/transactions/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['outstanding-total'] })
      toast.success('Transaction deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to delete transaction')
    },
  })
}

// ---------- Outstanding Total ----------

export const useOutstandingTotal = (filters?: { partyId?: number; tillDate?: Date }) => {
  return useQuery<OutstandingTotal>({
    queryKey: ['outstanding-total', filters],
    queryFn: async () => {
      const params: any = {}
      if (filters?.partyId) params.partyId = filters.partyId
      if (filters?.tillDate) params.tillDate = filters.tillDate.toISOString()

      const { data } = await api.get('/transactions/outstanding/total', { params })
      return data
    },
    staleTime: 2 * 60 * 1000,
  })
}
