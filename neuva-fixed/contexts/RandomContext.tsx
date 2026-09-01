'use client'
import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'

interface RandomContextType {
  partyName: number
  setPartyName: (a:number) => void
}

export const RandomContext = createContext<RandomContextType | undefined>(undefined)

export const RandomProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [partyName, setPN] = useState(0);
    const setPartyName=(a:number)=>{
        setPN(a);
    }
  return (
    <RandomContext.Provider value={{ partyName, setPartyName }}>
      {children}
    </RandomContext.Provider>
  )
}

