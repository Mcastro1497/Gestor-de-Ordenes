"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/supabase/database.types"

// Singleton pattern para el cliente de Supabase
let supabaseInstance: SupabaseClient<Database> | null = null

export function useSupabase() {
  const [supabase, setSupabase] = useState<SupabaseClient<Database>>(() => {
    if (supabaseInstance) {
      return supabaseInstance
    }

    // Crear una nueva instancia si no existe
    const newClient = createClient()
    supabaseInstance = newClient
    return newClient
  })

  const [connectionError, setConnectionError] = useState<Error | null>(null)
  const [isConnected, setIsConnected] = useState<boolean | null>(null)

  useEffect(() => {
    // Verificar que el cliente se ha inicializado correctamente
    const checkClient = async () => {
      try {
        console.log("Verificando conexión con Supabase...")

        // Usar un timeout para la verificación
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error("Timeout al verificar la conexión")), 5000)
        })

        // Intenta una operación simple para verificar la conexión
        const fetchPromise = supabase.auth.getSession()

        // Usar Promise.race para implementar un timeout
        const result = await Promise.race([fetchPromise, timeoutPromise])

        console.log("Conexión con Supabase verificada correctamente")
        setIsConnected(true)
        setConnectionError(null)
      } catch (err) {
        console.error("Error al verificar la conexión con Supabase:", err)
        setConnectionError(err instanceof Error ? err : new Error("Error desconocido"))
        setIsConnected(false)
        // No lanzamos el error para no interrumpir la renderización
      }
    }

    checkClient()
  }, [supabase])

  return {
    supabase,
    isConnected,
    connectionError,
  }
}

export type TypedSupabaseClient = SupabaseClient<Database>
