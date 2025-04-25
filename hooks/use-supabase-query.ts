"use client"

import { useState, useEffect, useCallback } from "react"
import { useSupabase, type TypedSupabaseClient } from "./use-supabase"
import type { PostgrestError } from "@supabase/supabase-js"

type QueryFn<T> = (supabase: TypedSupabaseClient) => Promise<{
  data: T | null
  error: PostgrestError | null
}>

export function useSupabaseQuery<T>(
  queryFn: QueryFn<T>,
  options: {
    enabled?: boolean
    refetchInterval?: number
  } = {},
) {
  const { supabase } = useSupabase()
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<PostgrestError | null>(null)
  const [loading, setLoading] = useState(true)

  const { enabled = true, refetchInterval } = options

  const fetchData = useCallback(async () => {
    if (!enabled) {
      setLoading(false)
      return
    }

    setLoading(true)

    try {
      const { data, error } = await queryFn(supabase)

      if (error) {
        setError(error)
      } else {
        setData(data)
        setError(null)
      }
    } catch (err) {
      console.error("Error fetching data:", err)
      setError(err as PostgrestError)
    } finally {
      setLoading(false)
    }
  }, [enabled, queryFn, supabase])

  // Initial fetch
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Set up refetch interval if specified
  useEffect(() => {
    if (!refetchInterval) return

    const intervalId = setInterval(fetchData, refetchInterval)

    return () => {
      clearInterval(intervalId)
    }
  }, [fetchData, refetchInterval])

  return {
    data,
    error,
    loading,
    refetch: fetchData,
  }
}
