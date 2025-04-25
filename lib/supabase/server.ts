import { createServerClient as createSupaServerClient } from "@supabase/ssr"
import type { Database } from "./database.types"

// Create a server-side only client that doesn't use cookies
export function createServerOnlyClient() {
  return createSupaServerClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
    auth: {
      persistSession: false,
    },
  })
}

// For compatibility with existing code
export const createClient = createServerOnlyClient
export const createServerClient = createServerOnlyClient
