"use client"

import { useEffect, useState } from "react"
import { Permission, UserRole } from "@/lib/db/schema"
import { createClient } from "@/lib/supabase/client"
import { useRouter, usePathname } from "next/navigation"

// Mapeo de roles a permisos
const rolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: Object.values(Permission), // Admin tiene todos los permisos
  [UserRole.COMERCIAL]: [
    Permission.VIEW_DASHBOARD,
    Permission.CREATE_ORDER,
    Permission.EDIT_ORDER,
    Permission.VIEW_ORDER,
    Permission.VIEW_CONFIG,
    Permission.IMPORT_CLIENTS,
  ],
  [UserRole.OPERADOR]: [
    Permission.VIEW_TRADING,
    Permission.EXECUTE_ORDER,
    Permission.VIEW_CONFIG,
    Permission.IMPORT_ASSETS,
  ],
}

// Mapeo de rutas a permisos requeridos
const routePermissions: Record<string, Permission[]> = {
  "/dashboard": [Permission.VIEW_DASHBOARD],
  "/ordenes": [Permission.VIEW_ORDER],
  "/ordenes/nueva": [Permission.CREATE_ORDER],
  "/trading": [Permission.VIEW_TRADING],
  "/config": [Permission.VIEW_CONFIG],
  "/admin": [Permission.MANAGE_USERS],
}

export function usePermissions() {
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Cargar el rol del usuario desde Supabase
  useEffect(() => {
    async function loadUserRole() {
      try {
        setLoading(true)
        const supabase = createClient()

        // Obtener la sesión actual
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          setUserRole(null)
          return
        }

        // Obtener el usuario de la tabla usuarios
        const { data: userData, error } = await supabase
          .from("usuarios")
          .select("rol")
          .eq("id", session.user.id)
          .single()

        if (error || !userData) {
          console.error("Error al obtener el rol del usuario:", error)
          setUserRole(null)
          return
        }

        // Convertir el rol de la base de datos al enum UserRole
        const role = userData.rol as UserRole
        setUserRole(role)

        // Verificar si el usuario tiene permiso para acceder a la ruta actual
        checkRoutePermission(role, pathname)
      } catch (error) {
        console.error("Error al cargar el rol del usuario:", error)
        setUserRole(null)
      } finally {
        setLoading(false)
      }
    }

    loadUserRole()
  }, [pathname, router])

  // Verificar si el usuario tiene un permiso específico
  const hasPermission = (permission: Permission): boolean => {
    if (!userRole) return false
    return rolePermissions[userRole].includes(permission)
  }

  // Verificar si el usuario tiene alguno de los permisos especificados
  const hasAnyPermission = (permissions: Permission[]): boolean => {
    if (!userRole) return false
    return permissions.some((permission) => rolePermissions[userRole].includes(permission))
  }

  // Verificar si el usuario tiene todos los permisos especificados
  const hasAllPermissions = (permissions: Permission[]): boolean => {
    if (!userRole) return false
    return permissions.every((permission) => rolePermissions[userRole].includes(permission))
  }

  // Verificar si el usuario tiene permiso para acceder a una ruta
  const checkRoutePermission = (role: UserRole | null, path: string) => {
    // Si no hay rol o es una ruta pública, no hacer nada
    if (!role || path === "/login" || path === "/register") return

    // Encontrar la ruta más específica que coincida con el path actual
    const matchingRoutes = Object.keys(routePermissions)
      .filter((route) => path.startsWith(route))
      .sort((a, b) => b.length - a.length) // Ordenar por longitud descendente para obtener la más específica

    if (matchingRoutes.length > 0) {
      const requiredPermissions = routePermissions[matchingRoutes[0]]
      const hasAccess = requiredPermissions.some((permission) => rolePermissions[role].includes(permission))

      if (!hasAccess) {
        // Redirigir a una página de acceso denegado o al dashboard
        router.push("/dashboard")
      }
    }
  }

  return {
    userRole,
    loading,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  }
}
