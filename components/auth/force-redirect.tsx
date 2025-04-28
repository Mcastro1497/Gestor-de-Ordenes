"use client"

import { useEffect } from "react"
import { useSupabase } from "@/hooks/use-supabase"

export function ForceRedirect({ redirectTo = "/dashboard" }: { redirectTo?: string }) {
  const { supabase } = useSupabase()

  useEffect(() => {
    const checkSessionAndRedirect = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Error al verificar sesión:", error)
          return
        }

        if (data.session) {
          console.log("Sesión activa detectada, redirigiendo a:", redirectTo)
          // Usar window.location para una redirección forzada
          window.location.href = redirectTo
        }
      } catch (err) {
        console.error("Error inesperado al verificar sesión:", err)
      }
    }

    // Verificar inmediatamente
    checkSessionAndRedirect()

    // También configurar un temporizador de respaldo
    const redirectTimer = setTimeout(() => {
      console.log("Temporizador de respaldo activado, redirigiendo a:", redirectTo)
      window.location.href = redirectTo
    }, 3000) // Redirigir después de 3 segundos sin importar qué

    return () => clearTimeout(redirectTimer)
  }, [supabase, redirectTo])

  return null
}
