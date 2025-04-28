import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

// Singleton pattern para evitar múltiples instancias
let supabaseClient: ReturnType<typeof createSupabaseClient<Database>> | null = null

export function createClient() {
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
        storageKey: "supabase.auth.token",
        storage: {
          getItem: (key) => {
            if (typeof window === "undefined") {
              return null
            }
            try {
              const item = localStorage.getItem(key)
              console.log(`Auth storage getItem: ${key}`, item ? "✓" : "✗")
              return item
            } catch (error) {
              console.error(`Error al acceder a localStorage.getItem(${key}):`, error)
              return null
            }
          },
          setItem: (key, value) => {
            if (typeof window !== "undefined") {
              try {
                console.log(`Auth storage setItem: ${key}`)
                localStorage.setItem(key, value)
              } catch (error) {
                console.error(`Error al acceder a localStorage.setItem(${key}):`, error)
              }
            }
          },
          removeItem: (key) => {
            if (typeof window !== "undefined") {
              try {
                console.log(`Auth storage removeItem: ${key}`)
                localStorage.removeItem(key)
              } catch (error) {
                console.error(`Error al acceder a localStorage.removeItem(${key}):`, error)
              }
            }
          },
        },
      },
      global: {
        fetch: (...args) => {
          return fetch(...args).catch((error) => {
            console.error("Error en fetch de Supabase:", error)
            throw error
          })
        },
      },
    })

    console.log("Cliente de Supabase inicializado correctamente")
    return supabaseClient
  } catch (error) {
    console.error("Error al inicializar el cliente de Supabase:", error)
    throw error
  }
}
