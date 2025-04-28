"use client"

import { useCallback } from "react"
import { useSupabaseQuery } from "./use-supabase-query"
import { useSupabaseSubscription } from "./use-supabase-subscription"
import type { TypedSupabaseClient } from "./use-supabase"
import type { Database } from "@/lib/supabase/database.types"
import { useSupabase } from "./use-supabase"

type Asset = Database["public"]["Tables"]["assets"]["Row"]

// Hook to fetch all assets
export function useAssets(options = {}) {
  return useSupabaseQuery<Asset[]>(async (supabase) => {
    const { data, error } = await supabase.from("assets").select("*").order("name")

    return { data, error }
  }, options)
}

// Hook to fetch a single asset by ID
export function useAsset(id: string, options = {}) {
  return useSupabaseQuery<Asset>(async (supabase) => {
    const { data, error } = await supabase.from("assets").select("*").eq("id", id).single()

    return { data, error }
  }, options)
}

// Hook to subscribe to asset changes
export function useAssetsSubscription(
  options: {
    onInsert?: (asset: Asset) => void
    onUpdate?: (newAsset: Asset, oldAsset: Asset) => void
    onDelete?: (asset: Asset) => void
    enabled?: boolean
  } = {},
) {
  const subscriptionFn = useCallback((supabase: TypedSupabaseClient) => {
    return supabase
      .channel("assets-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "assets" }, () => {})
  }, [])

  return useSupabaseSubscription<Asset>(subscriptionFn, {
    onInsert: options.onInsert ? (payload) => options.onInsert?.(payload.new) : undefined,
    onUpdate: options.onUpdate ? (payload) => options.onUpdate?.(payload.new, payload.old) : undefined,
    onDelete: options.onDelete ? (payload) => options.onDelete?.(payload.old) : undefined,
    enabled: options.enabled,
  })
}

// Hook to create, update, and delete assets
export function useAssetMutations() {
  const { supabase } = useSupabase()

  const createAsset = useCallback(
    async (asset: Omit<Asset, "id" | "created_at">) => {
      const { data, error } = await supabase.from("assets").insert(asset).select().single()

      return { data, error }
    },
    [supabase],
  )

  const updateAsset = useCallback(
    async (id: string, updates: Partial<Omit<Asset, "id" | "created_at">>) => {
      const { data, error } = await supabase.from("assets").update(updates).eq("id", id).select().single()

      return { data, error }
    },
    [supabase],
  )

  const deleteAsset = useCallback(
    async (id: string) => {
      const { error } = await supabase.from("assets").delete().eq("id", id)

      return { error }
    },
    [supabase],
  )

  return {
    createAsset,
    updateAsset,
    deleteAsset,
  }
}
