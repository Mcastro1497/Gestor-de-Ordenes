"use client"

import { useCallback } from "react"
import { useSupabaseQuery } from "./use-supabase-query"
import { useSupabaseSubscription } from "./use-supabase-subscription"
import { useSupabase } from "./use-supabase"
import type { TypedSupabaseClient } from "./use-supabase"
import type { Database } from "@/lib/supabase/database.types"

type Order = Database["public"]["Tables"]["orders"]["Row"]

// Hook to fetch all orders
export function useOrders(options = {}) {
  return useSupabaseQuery<Order[]>(async (supabase) => {
    const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false })

    return { data, error }
  }, options)
}

// Hook to fetch recent orders
export function useRecentOrders(limit = 10, options = {}) {
  return useSupabaseQuery<Order[]>(async (supabase) => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit)

    return { data, error }
  }, options)
}

// Hook to fetch a single order by ID
export function useOrder(id: string, options = {}) {
  return useSupabaseQuery<Order>(async (supabase) => {
    const { data, error } = await supabase.from("orders").select("*").eq("id", id).single()

    return { data, error }
  }, options)
}

// Hook to fetch orders by client ID
export function useClientOrders(clientId: string, options = {}) {
  return useSupabaseQuery<Order[]>(
    async (supabase) => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false })

      return { data, error }
    },
    {
      ...options,
      enabled: !!clientId,
    },
  )
}

// Hook to fetch orders by status
export function useOrdersByStatus(status: string, options = {}) {
  return useSupabaseQuery<Order[]>(
    async (supabase) => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("status", status)
        .order("created_at", { ascending: false })

      return { data, error }
    },
    {
      ...options,
      enabled: !!status,
    },
  )
}

// Hook to subscribe to order changes
export function useOrdersSubscription(
  options: {
    onInsert?: (order: Order) => void
    onUpdate?: (newOrder: Order, oldOrder: Order) => void
    onDelete?: (order: Order) => void
    enabled?: boolean
    clientId?: string
  } = {},
) {
  const subscriptionFn = useCallback(
    (supabase: TypedSupabaseClient) => {
      return supabase.channel("orders-changes").on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
          filter: options.clientId ? `client_id=eq.${options.clientId}` : undefined,
        },
        () => {},
      )
    },
    [options.clientId],
  )

  return useSupabaseSubscription<Order>(subscriptionFn, {
    onInsert: options.onInsert ? (payload) => options.onInsert?.(payload.new) : undefined,
    onUpdate: options.onUpdate ? (payload) => options.onUpdate?.(payload.new, payload.old) : undefined,
    onDelete: options.onDelete ? (payload) => options.onDelete?.(payload.old) : undefined,
    enabled: options.enabled,
  })
}

// Hook to create, update, and delete orders
export function useOrderMutations() {
  const { supabase } = useSupabase()

  const createOrder = useCallback(
    async (order: Omit<Order, "id" | "created_at">) => {
      const { data, error } = await supabase.from("orders").insert(order).select().single()

      return { data, error }
    },
    [supabase],
  )

  const updateOrder = useCallback(
    async (id: string, updates: Partial<Omit<Order, "id" | "created_at">>) => {
      const { data, error } = await supabase.from("orders").update(updates).eq("id", id).select().single()

      return { data, error }
    },
    [supabase],
  )

  const updateOrderStatus = useCallback(
    async (id: string, status: string) => {
      const { data, error } = await supabase.from("orders").update({ status }).eq("id", id).select().single()

      return { data, error }
    },
    [supabase],
  )

  const deleteOrder = useCallback(
    async (id: string) => {
      const { error } = await supabase.from("orders").delete().eq("id", id)

      return { error }
    },
    [supabase],
  )

  return {
    createOrder,
    updateOrder,
    updateOrderStatus,
    deleteOrder,
  }
}
