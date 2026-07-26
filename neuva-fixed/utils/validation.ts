import { z } from 'zod'

export const LoginSchema = z.object({
  loginId: z.string().min(1, 'Login ID is required'),
  password: z.string().min(1, 'Password is required'),
})

export const PartySchema = z.object({
  name: z.string().min(1, 'Party name is required'),
  billingName: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
})

export const TransactionTypeSchema = z.object({
  note: z.string().min(1, 'Note is required'),
  type: z.enum(['add', 'reduce'], {
    required_error: 'Type is required',
  }),
})

export const TransactionSchema = z.object({
  date: z.date({
    required_error: 'Date is required',
  }),
  partyId: z.number({
    required_error: 'Party is required',
  }),
  transactionNote: z.string().optional().nullable(),
  typeId: z.number({
    required_error: 'Transaction type is required',
  }),
  amount: z.number().int().positive('Amount must be a positive integer'),
})

export type LoginInput = z.infer<typeof LoginSchema>
export type PartyInput = z.infer<typeof PartySchema>
export type TransactionTypeInput = z.infer<typeof TransactionTypeSchema>
export type TransactionInput = z.infer<typeof TransactionSchema>
