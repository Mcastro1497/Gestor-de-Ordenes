"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/hooks/use-supabase"

export function AuthRedirect({ redirectTo = "/dashboard" }: { redirectTo?: string }) {
  const router = useRouter()
  const { supabase } = useSupabase()

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Error al verificar sesión:", error)
          return
        }

        if (data.session) {
          console.log("Sesión activa detectada, redirigiendo a:", redirectTo)
          router.push(redirectTo)
        }
      } catch (err) {
        console.error("Error inesperado al verificar sesión:", err)
      }
    }

    checkSession()
  }, [supabase, router, redirectTo])

  return null
}
