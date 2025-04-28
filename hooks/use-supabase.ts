"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/supabase/database.types"

export function useSupabase() {
  const [supabase] = useState(() => createClient())

  return { supabase }
}

export type TypedSupabaseClient = SupabaseClient<Database>
