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

  useEffect(() => {
    // Verificar que el cliente se ha inicializado correctamente
    const checkClient = async () => {
      try {
        console.log("Verificando conexión con Supabase...")
        // Intenta una operación simple para verificar la conexión
        const { error } = await supabase.from("clients").select("count", { count: "exact", head: true })
        if (error) {
          console.error("Error al verificar la conexión con Supabase:", error)
        } else {
          console.log("Conexión con Supabase verificada correctamente")
        }
      } catch (err) {
        console.error("Error crítico al verificar la conexión con Supabase:", err)
      }
    }

    checkClient()
  }, [supabase])

  return { supabase }
}

export type TypedSupabaseClient = SupabaseClient<Database>
