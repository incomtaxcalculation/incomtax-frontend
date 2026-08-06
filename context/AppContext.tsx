"use client"

import React, { createContext, useContext, ReactNode } from "react"

interface AppContextType {
  apiUrl: string
}

const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5000";

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <AppContext.Provider value={{ apiUrl }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider")
  }
  return context
}