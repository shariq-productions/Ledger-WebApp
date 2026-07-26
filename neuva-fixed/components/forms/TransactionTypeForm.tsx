'use client'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TransactionTypeSchema, TransactionTypeInput } from '@/utils/validation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { TransactionType } from '@/types'

interface TransactionTypeFormProps {
  initialData?: TransactionType | null
  onSubmit: (data: TransactionTypeInput) => void
  onCancel: () => void
  loading?: boolean
}

export const TransactionTypeForm: React.FC<TransactionTypeFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<TransactionTypeInput>({
    resolver: zodResolver(TransactionTypeSchema),
    defaultValues: {
      note: initialData?.note || '',
      type: initialData?.type || 'add',
    },
  })

  useEffect(() => {
    if (initialData) {
      reset({ note: initialData.note, type: initialData.type })
    } else {
      reset({ note: '', type: 'add' })
    }
  }, [initialData, reset])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Transaction Note *"
        placeholder="Enter transaction note"
        {...register('note')}
        error={errors.note?.message}
      />
      <div>
        <label className="form-label">Type *</label>
        <div className="flex space-x-4 mt-1">
          <label className="flex items-center space-x-2">
            <input type="radio" value="add" {...register('type')} className="h-4 w-4 text-primary-600 focus:ring-primary-500" />
            <span className="text-sm text-gray-700">Add (Credit)</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="radio" value="reduce" {...register('type')} className="h-4 w-4 text-primary-600 focus:ring-primary-500" />
            <span className="text-sm text-gray-700">Reduce (Debit)</span>
          </label>
        </div>
        {errors.type && <p className="form-error">{errors.type.message}</p>}
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
