export const APP_NAME = 'Ledger Management System'
export const APP_VERSION = '1.0.0'

export const TRANSACTION_TYPES = {
  ADD: 'add',
  REDUCE: 'reduce',
} as const

export const DATE_FORMAT = 'dd/MM/yyyy'
export const DATE_FORMAT_INPUT = 'yyyy-MM-dd'
export const CURRENCY_CODE = 'INR'
export const CURRENCY_LOCALE = 'en-IN'
export const DEFAULT_PAGE_SIZE = 50
export const MAX_SEARCH_RESULTS = 10
export const TOAST_DURATION = 4000

export const API_ENDPOINTS = {
  LOGIN: '/api/auth/login',
  PARTIES: '/api/parties',
  TRANSACTION_TYPES: '/api/transaction-types',
  TRANSACTIONS: '/api/transactions',
  OUTSTANDING_TOTAL: '/api/transactions/outstanding/total',
} as const
