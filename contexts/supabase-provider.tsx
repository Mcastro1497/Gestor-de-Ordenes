"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useSupabase } from "@/hooks/use-supabase"
import type { TypedSupabaseClient } from "@/hooks/use-supabase"

type SupabaseContextType = {
  supabase: TypedSupabaseClient
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined)

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const { supabase } = useSupabase()

  return <SupabaseContext.Provider value={{ supabase }}>{children}</SupabaseContext.Provider>
}

export function useSupabaseContext() {
  const context = useContext(SupabaseContext)

  if (context === undefined) {
    throw new Error("useSupabaseContext must be used within a SupabaseProvider")
  }

  return context
}
