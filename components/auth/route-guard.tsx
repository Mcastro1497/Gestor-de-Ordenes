"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { canAccessRoute } from "@/lib/services/permission-service"
import type { UserRole } from "@/lib/db/schema"
import { Skeleton } from "@/components/ui/skeleton"

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [authorized, setAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkAuth() {
      try {
        const supabase = createClient()
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          // No hay sesión, redirigir a login
          router.push("/login")
          return
        }

        // Obtener el rol del usuario desde Supabase
        const { data: userData, error } = await supabase
          .from("usuarios")
          .select("rol")
          .eq("id", session.user.id)
          .single()

        if (error || !userData) {
          console.error("Error al obtener el rol del usuario:", error)
          router.push("/login")
          return
        }

        const userRole = userData.rol as UserRole

        // Verificar si el usuario tiene acceso a la ruta actual
        if (!canAccessRoute(userRole, pathname)) {
          // No tiene permiso, redirigir a una página de acceso denegado
          router.push("/access-denied")
          return
        }

        // Usuario autorizado
        setAuthorized(true)
      } catch (error) {
        console.error("Error al verificar autorización:", error)
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [pathname, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="space-y-4 w-full max-w-md">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    )
  }

  return authorized ? <>{children}</> : null
}
