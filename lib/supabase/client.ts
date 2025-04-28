import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

// Singleton pattern para evitar múltiples instancias
let supabaseClient: ReturnType<typeof createSupabaseClient<Database>> | null = null

// Mantener la función original para compatibilidad con código existente
export function createClient() {
  return getSupabaseClient()
}

// Nueva función con nombre más descriptivo
export function getSupabaseClient() {
  if (supabaseClient) return supabaseClient

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Faltan variables de entorno de Supabase:", {
      url: supabaseUrl ? "✓" : "✗",
      key: supabaseAnonKey ? "✓" : "✗",
    })
    throw new Error("Faltan variables de entorno de Supabase")
  }

  console.log("Inicializando cliente de Supabase con URL:", supabaseUrl)

  try {
    supabaseClient = createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })

    console.log("Cliente de Supabase inicializado correctamente")
    return supabaseClient
  } catch (error) {
    console.error("Error al inicializar el cliente de Supabase:", error)
    throw error
  }
}
