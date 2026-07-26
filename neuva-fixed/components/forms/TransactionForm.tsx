'use client'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TransactionSchema, TransactionInput } from '@/utils/validation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Party, TransactionType, Transaction } from '@/types'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

interface TransactionFormProps {
  initialData?: Transaction | null
  parties: Party[]
  transactionTypes: TransactionType[]
  onSubmit: (data: TransactionInput & { date: Date }) => void
  onCancel: () => void
  loading?: boolean
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  initialData,
  parties,
  transactionTypes,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TransactionInput>({
    resolver: zodResolver(TransactionSchema),
    defaultValues: {
      date: initialData ? new Date(initialData.date) : new Date(),
      partyId: initialData?.partyId || undefined,
      transactionNote: initialData?.transactionNote || '',
      typeId: initialData?.typeId || undefined,
      amount: initialData?.amount || undefined,
    },
  })

  const selectedTypeIdValue = watch('typeId')
  const currentNote = watch('transactionNote')

  // Auto-append note when type changes (only for new transactions)
  useEffect(() => {
    if (selectedTypeIdValue && !initialData) {
      const type = transactionTypes.find(t => t.id === selectedTypeIdValue)
      if (type && !currentNote) {
        setValue('transactionNote', type.note)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTypeIdValue])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="form-label">Date *</label>
        <DatePicker
          selected={watch('date')}
          onChange={(date) => setValue('date', date || new Date())}
          dateFormat="dd/MM/yyyy"
          className="form-input"
          maxDate={new Date()}
          placeholderText="Select date"
        />
        {errors.date && (
          <p className="form-error">{errors.date.message}</p>
        )}
      </div>

      <div>
        <label className="form-label">Party *</label>
        <select
          {...register('partyId', { valueAsNumber: true })}
          className="form-input"
        >
          <option value="">Select a party</option>
          {parties.map((party) => (
            <option key={party.id} value={party.id}>
              {party.name}
            </option>
          ))}
        </select>
        {errors.partyId && (
          <p className="form-error">{errors.partyId.message}</p>
        )}
      </div>

      <Input
        label="Transaction Note"
        placeholder="Enter transaction note"
        {...register('transactionNote')}
        error={errors.transactionNote?.message}
      />

      <div>
        <label className="form-label">Type *</label>
        <select
          {...register('typeId', { valueAsNumber: true })}
          className="form-input"
        >
          <option value="">Select a type</option>
          {transactionTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.note} ({type.type})
            </option>
          ))}
        </select>
        {errors.typeId && (
          <p className="form-error">{errors.typeId.message}</p>
        )}
      </div>

      <div>
        <label className="form-label">Amount *</label>
        <input
          type="number"
          {...register('amount', { valueAsNumber: true })}
          className="form-input"
          placeholder="Enter amount"
          min="1"
          step="1"
        />
        {errors.amount && (
          <p className="form-error">{errors.amount.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button variant="outline" onClick={onCancel} type="button">
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {initialData ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  )
}
