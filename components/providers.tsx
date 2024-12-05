'use client'

import { createContext, useContext, useState, ReactNode } from "react"

type RefreshContextType = {
  refresh: boolean
  setRefresh: (refresh: boolean) => void
}

const RefreshContext = createContext<RefreshContextType | undefined>(undefined)

export const RefreshProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [refresh, setRefresh] = useState(false)

  return (
    <RefreshContext.Provider value={{ refresh, setRefresh }}>
      {children}
    </RefreshContext.Provider>
  )
}

export const useRefresh = () => {
  const context = useContext(RefreshContext)
  if (context === undefined) {
    throw new Error("useRefresh must be used within a RefreshProvider")
  }
  return context
}
