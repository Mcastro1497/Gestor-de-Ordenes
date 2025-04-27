"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/supabase/database.types"

type SupabaseContext = {
  supabase: SupabaseClient<Database>
}

const Context = createContext<SupabaseContext | undefined>(undefined)

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => createClient())
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verificar la sesión al cargar
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Error al verificar la sesión en SupabaseProvider:", error)
        } else {
          console.log("Sesión verificada en SupabaseProvider:", data.session ? "Activa" : "Inactiva")
        }
      } catch (err) {
        console.error("Error crítico al verificar la sesión en SupabaseProvider:", err)
      } finally {
        setIsReady(true)
      }
    }

    checkAuth()
  }, [supabase])

  return <Context.Provider value={{ supabase }}>{isReady ? children : <div>Cargando...</div>}</Context.Provider>
}

export function useSupabase() {
  const context = useContext(Context)
  if (context === undefined) {
    throw new Error("useSupabase debe usarse dentro de un SupabaseProvider")
  }
  return context
}
