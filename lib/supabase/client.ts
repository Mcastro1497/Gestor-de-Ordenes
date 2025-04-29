import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

// Singleton pattern para evitar múltiples instancias
let supabaseClient: ReturnType<typeof createSupabaseClient<Database>> | null = null

export function createClient() {
  if (supabaseClient) return supabaseClient

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Faltan variables de entorno de Supabase")
  }

  supabaseClient = createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: {
        getItem: (key) => {
          if (typeof window === "undefined") {
            return null
          }
          const value = localStorage.getItem(key)
          console.log(`[Storage] Obteniendo ${key}:`, value ? "Existe" : "No existe")
          return value
        },
        setItem: (key, value) => {
          if (typeof window === "undefined") {
            return
          }
          console.log(`[Storage] Guardando ${key}`)
          localStorage.setItem(key, value)
        },
        removeItem: (key) => {
          if (typeof window === "undefined") {
            return
          }
          console.log(`[Storage] Eliminando ${key}`)
          localStorage.removeItem(key)
        },
      },
    },
  })

  return supabaseClient
}
