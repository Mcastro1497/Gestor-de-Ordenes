"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { SupabaseProvider } from "./supabase-provider"
import { ThemeProvider } from "next-themes"
import { Toaster } from "sonner"

type AppContextType = {
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Evitar problemas de hidratación
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <AppContext.Provider value={{ isLoading, setIsLoading }}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <SupabaseProvider>
          <Toaster position="top-right" closeButton richColors />
          {children}
        </SupabaseProvider>
      </ThemeProvider>
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)

  if (context === undefined) {
    throw new Error("useAppContext debe usarse dentro de un AppProvider")
  }

  return context
}
