"use client"

import { useCallback } from "react"
import { useSupabaseQuery } from "./use-supabase-query"
import { useSupabaseSubscription } from "./use-supabase-subscription"
import type { TypedSupabaseClient } from "./use-supabase"
import type { Database } from "@/lib/supabase/database.types"
import { useSupabase } from "./use-supabase"

type Client = Database["public"]["Tables"]["clients"]["Row"]

// Hook to fetch all clients
export function useClients(options = {}) {
  return useSupabaseQuery<Client[]>(async (supabase) => {
    const { data, error } = await supabase.from("clients").select("*").order("name")

    return { data, error }
  }, options)
}

// Hook to fetch a single client by ID
export function useClient(id: string, options = {}) {
  return useSupabaseQuery<Client>(async (supabase) => {
    const { data, error } = await supabase.from("clients").select("*").eq("id", id).single()

    return { data, error }
  }, options)
}

// Hook to search clients
export function useSearchClients(searchTerm: string, options = {}) {
  return useSupabaseQuery<Client[]>(
    async (supabase) => {
      const { data, error } = await supabase.from("clients").select("*").ilike("name", `%${searchTerm}%`).order("name")

      return { data, error }
    },
    {
      ...options,
      enabled: !!searchTerm && searchTerm.length > 2,
    },
  )
}

// Hook to subscribe to client changes
export function useClientsSubscription(
  options: {
    onInsert?: (client: Client) => void
    onUpdate?: (newClient: Client, oldClient: Client) => void
    onDelete?: (client: Client) => void
    enabled?: boolean
  } = {},
) {
  const subscriptionFn = useCallback((supabase: TypedSupabaseClient) => {
    return supabase
      .channel("clients-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "clients" }, () => {})
  }, [])

  return useSupabaseSubscription<Client>(subscriptionFn, {
    onInsert: options.onInsert ? (payload) => options.onInsert?.(payload.new) : undefined,
    onUpdate: options.onUpdate ? (payload) => options.onUpdate?.(payload.new, payload.old) : undefined,
    onDelete: options.onDelete ? (payload) => options.onDelete?.(payload.old) : undefined,
    enabled: options.enabled,
  })
}

// Hook to create, update, and delete clients
export function useClientMutations() {
  const { supabase } = useSupabase()

  const createClient = useCallback(
    async (client: Omit<Client, "id" | "created_at">) => {
      const { data, error } = await supabase.from("clients").insert(client).select().single()

      return { data, error }
    },
    [supabase],
  )

  const updateClient = useCallback(
    async (id: string, updates: Partial<Omit<Client, "id" | "created_at">>) => {
      const { data, error } = await supabase.from("clients").update(updates).eq("id", id).select().single()

      return { data, error }
    },
    [supabase],
  )

  const deleteClient = useCallback(
    async (id: string) => {
      const { error } = await supabase.from("clients").delete().eq("id", id)

      return { error }
    },
    [supabase],
  )

  return {
    createClient,
    updateClient,
    deleteClient,
  }
}
