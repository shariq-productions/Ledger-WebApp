import { format } from 'date-fns'

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export const formatDate = (date: string | Date): string => {
  return format(new Date(date), 'dd/MM/yyyy')
}

export const formatDateForInput = (date: string | Date): string => {
  return format(new Date(date), 'yyyy-MM-dd')
}

export const getSerialDisplay = (serialNumber: number): string => {
  return `#${String(serialNumber).padStart(4, '0')}`
}
