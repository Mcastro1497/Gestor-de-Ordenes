"use client"

import { useState, useCallback } from "react"
import { handleError } from "@/lib/utils/error-handler"

type MutationFn<TData, TVariables> = (variables: TVariables) => Promise<{ data: TData | null; error: any }>

export function useOptimisticMutation<TData, TVariables>(
  mutationFn: MutationFn<TData, TVariables>,
  options: {
    onSuccess?: (data: TData) => void
    onError?: (error: any) => void
    optimisticUpdate?: (variables: TVariables) => void
    rollback?: () => void
  } = {},
) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<any>(null)

  const mutate = useCallback(
    async (variables: TVariables) => {
      setIsLoading(true)
      setError(null)

      try {
        // Aplicar actualización optimista si está configurada
        if (options.optimisticUpdate) {
          options.optimisticUpdate(variables)
        }

        const { data, error } = await mutationFn(variables)

        if (error) {
          setError(error)

          // Revertir cambios optimistas si hay error
          if (options.rollback) {
            options.rollback()
          }

          if (options.onError) {
            options.onError(error)
          } else {
            handleError(error)
          }

          return { data: null, error }
        }

        if (data && options.onSuccess) {
          options.onSuccess(data)
        }

        return { data, error: null }
      } catch (err) {
        setError(err)

        // Revertir cambios optimistas si hay error
        if (options.rollback) {
          options.rollback()
        }

        if (options.onError) {
          options.onError(err)
        } else {
          handleError(err)
        }

        return { data: null, error: err }
      } finally {
        setIsLoading(false)
      }
    },
    [mutationFn, options],
  )

  return {
    mutate,
    isLoading,
    error,
  }
}
