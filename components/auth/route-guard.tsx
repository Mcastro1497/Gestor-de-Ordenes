"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { Permission } from "@/lib/db/schema"
import { usePermissions } from "@/hooks/use-permissions"
import { Skeleton } from "@/components/ui/skeleton"

interface RouteGuardProps {
  children: React.ReactNode
  requiredPermissions: Permission[]
  requireAll?: boolean
}

export function RouteGuard({ children, requiredPermissions, requireAll = false }: RouteGuardProps) {
  const router = useRouter()
  const { loading, hasAnyPermission, hasAllPermissions } = usePermissions()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    // Verificar autorización
    const checkAuth = () => {
      if (loading) return

      const hasPermission = requireAll ? hasAllPermissions(requiredPermissions) : hasAnyPermission(requiredPermissions)

      if (!hasPermission) {
        setAuthorized(false)
        router.push("/dashboard")
      } else {
        setAuthorized(true)
      }
    }

    checkAuth()
  }, [loading, hasAnyPermission, hasAllPermissions, requiredPermissions, requireAll, router])

  // Mostrar un estado de carga mientras se verifica la autorización
  if (loading) {
    return (
      <div className="w-full p-8 space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  // Renderizar los hijos solo si está autorizado
  return authorized ? <>{children}</> : null
}
