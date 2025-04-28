"use client"

import { useState, useEffect, useCallback } from "react"
import { useSupabase, type TypedSupabaseClient } from "./use-supabase"
import type { RealtimeChannel } from "@supabase/supabase-js"

type SubscriptionFn = (supabase: TypedSupabaseClient) => RealtimeChannel

export function useSupabaseSubscription<T>(
  subscriptionFn: SubscriptionFn,
  options: {
    onInsert?: (payload: { new: T }) => void
    onUpdate?: (payload: { new: T; old: T }) => void
    onDelete?: (payload: { old: T }) => void
    enabled?: boolean
  } = {},
) {
  const { supabase } = useSupabase()
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)
  const [connected, setConnected] = useState(false)

  const { onInsert, onUpdate, onDelete, enabled = true } = options

  useEffect(() => {
    if (!enabled) return

    const newChannel = subscriptionFn(supabase).on("presence", { event: "sync" }, () => {
      setConnected(true)
    })

    if (onInsert) {
      newChannel.on("postgres_changes", { event: "INSERT", schema: "public" }, (payload) => {
        onInsert(payload as { new: T })
      })
    }

    if (onUpdate) {
      newChannel.on("postgres_changes", { event: "UPDATE", schema: "public" }, (payload) => {
        onUpdate(payload as { new: T; old: T })
      })
    }

    if (onDelete) {
      newChannel.on("postgres_changes", { event: "DELETE", schema: "public" }, (payload) => {
        onDelete(payload as { old: T })
      })
    }

    newChannel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        setConnected(true)
      } else {
        setConnected(false)
      }
    })

    setChannel(newChannel)

    return () => {
      newChannel.unsubscribe()
    }
  }, [enabled, onDelete, onInsert, onUpdate, subscriptionFn, supabase])

  const unsubscribe = useCallback(() => {
    if (channel) {
      channel.unsubscribe()
      setChannel(null)
      setConnected(false)
    }
  }, [channel])

  return {
    connected,
    unsubscribe,
  }
}
