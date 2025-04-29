"use client"

import { useEffect, useState } from "react"
import { Permission } from "@/lib/db/schema"
import { createClient } from "@/lib/supabase/client"
import { useRouter, usePathname } from "next/navigation"

// Mapeo de roles a permisos
const rolePermissions: Record<string, Permission[]> = {
  admin: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_ORDER,
    Permission.CREATE_ORDER,
    Permission.EDIT_ORDER,
    Permission.VIEW_TRADING,
    Permission.EXECUTE_ORDER,
    Permission.VIEW_CONFIG,
    Permission.IMPORT_CLIENTS,
    Permission.IMPORT_ASSETS,
    Permission.MANAGE_USERS,
  ],
  comercial: [
    Permission.VIEW_DASHBOARD,
    Permission.CREATE_ORDER,
    Permission.EDIT_ORDER,
    Permission.VIEW_ORDER,
    Permission.VIEW_CONFIG,
    Permission.IMPORT_CLIENTS,
  ],
  trader: [
    Permission.VIEW_DASHBOARD,
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
  const [userRole, setUserRole] = useState<string | null>(null)
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

        if (error) {
          console.error("Error al obtener el rol del usuario:", error)
          setUserRole(null)
          return
        }

        if (userData && userData.rol) {
          console.log("Rol obtenido de Supabase:", userData.rol)
          setUserRole(userData.rol)
        } else {
          console.log("No se encontró un rol para el usuario")
          setUserRole(null)
        }
      } catch (error) {
        console.error("Error al cargar el rol del usuario:", error)
        setUserRole(null)
      } finally {
        setLoading(false)
      }
    }

    loadUserRole()
  }, [pathname])

  // Verificar si el usuario tiene un permiso específico
  const hasPermission = (permission: Permission): boolean => {
    if (!userRole || !rolePermissions[userRole]) {
      console.log("No hay rol de usuario o no hay permisos definidos para el rol:", userRole)
      return false
    }
    const hasPermission = rolePermissions[userRole].includes(permission)
    console.log(`Verificando permiso ${permission} para rol ${userRole}: ${hasPermission}`)
    return hasPermission
  }

  // Verificar si el usuario tiene alguno de los permisos especificados
  const hasAnyPermission = (permissions: Permission[]): boolean => {
    if (!userRole || !rolePermissions[userRole]) return false
    return permissions.some((permission) => rolePermissions[userRole].includes(permission))
  }

  // Verificar si el usuario tiene todos los permisos especificados
  const hasAllPermissions = (permissions: Permission[]): boolean => {
    if (!userRole || !rolePermissions[userRole]) return false
    return permissions.every((permission) => rolePermissions[userRole].includes(permission))
  }

  // Para depuración: obtener todos los permisos del rol actual
  const getUserPermissions = (): Permission[] => {
    if (!userRole || !rolePermissions[userRole]) return []
    return rolePermissions[userRole]
  }

  return {
    userRole,
    loading,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    getUserPermissions,
  }
}
