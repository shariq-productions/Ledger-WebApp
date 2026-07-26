'use client'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PartySchema, PartyInput } from '@/utils/validation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Party } from '@/types'

interface PartyFormProps {
  initialData?: Party | null
  onSubmit: (data: PartyInput) => void
  onCancel: () => void
  loading?: boolean
}

export const PartyForm: React.FC<PartyFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PartyInput>({
    resolver: zodResolver(PartySchema),
    defaultValues: {
      name: initialData?.name || '',
      billingName: initialData?.billingName || '',
      location: initialData?.location || '',
    },
  })

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        billingName: initialData.billingName || '',
        location: initialData.location || '',
      })
    } else {
      reset({ name: '', billingName: '', location: '' })
    }
  }, [initialData, reset])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Party Name *"
        placeholder="Enter party name"
        {...register('name')}
        error={errors.name?.message}
      />
      <Input
        label="Billing Name"
        placeholder="Enter billing name"
        {...register('billingName')}
        error={errors.billingName?.message}
      />
      <Input
        label="Location"
        placeholder="Enter location"
        {...register('location')}
        error={errors.location?.message}
      />
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
