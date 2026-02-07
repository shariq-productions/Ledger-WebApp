/**
 * Type definitions for the application
 */

export interface Party {
  id: number;
  name: string;
  billing_name?: string;
  location?: string;
  created_at: string;
  updated_at?: string;
}

export interface TransactionType {
  id: number;
  note: string;
  type: "add" | "reduce";
  created_at: string;
  updated_at?: string;
}

export interface Transaction {
  id: number;
  serial_number: number;
  date: string;
  party_id: number;
  transaction_note?: string;
  type_id: number;
  amount: number;
  created_at: string;
  updated_at?: string;
}

export interface TransactionWithRelations extends Transaction {
  party?: Party;
  transaction_type?: TransactionType;
}

export interface OutstandingTotal {
  total: number;
}
