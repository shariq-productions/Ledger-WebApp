export interface Admin {
  id: number
  loginId: string
  createdAt: string
  updatedAt: string
}

export interface Party {
  id: number
  name: string
  billingName: string | null
  location: string | null
  createdAt: string
  updatedAt: string
}

export interface TransactionType {
  id: number
  note: string
  type: 'add' | 'reduce'
  createdAt: string
  updatedAt: string
}

export interface Transaction {
  id: number
  serialNumber: number
  date: string
  partyId: number
  transactionNote: string | null
  typeId: number
  amount: number
  createdAt: string
  updatedAt: string
  party?: Party
  transactionType?: TransactionType
}

export interface TransactionWithRelations extends Transaction {
  party: Party
  transactionType: TransactionType
}

export interface OutstandingTotal {
  total: number
  addTotal: number
  reduceTotal: number
}

export interface AuthResponse {
  access_token: string
  token_type: string
  expires_in_hours: number
}

export interface ApiError {
  error: string
  message?: string
}
