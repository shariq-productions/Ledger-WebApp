'use client'
import React, { useEffect, useRef } from 'react'

interface DropdownCardProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export const DropdownCard: React.FC<DropdownCardProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4">
      <div className="fixed inset-0 bg-black bg-opacity-25" onClick={onClose} />
      <div ref={cardRef} className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}
