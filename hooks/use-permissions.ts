"use client"

import { useEffect, useState } from "react"
import type { Permission, UserRole } from "@/lib/db/schema"
import { hasPermission as checkPermission, getPermissionsForRole } from "@/lib/services/permission-service"
import { createClient } from "@/lib/supabase/client"

export function usePermissions() {
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUserRole() {
      try {
        const supabase = createClient()
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session) {
          // Obtener el rol del usuario desde Supabase
          const { data: userData, error } = await supabase
            .from("usuarios")
            .select("rol")
            .eq("id", session.user.id)
            .single()

          if (userData && userData.rol) {
            setUserRole(userData.rol as UserRole)
          } else {
            console.error("Error al obtener el rol del usuario:", error)
          }
        }
      } catch (error) {
        console.error("Error al verificar permisos:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserRole()
  }, [])

  const hasPermission = (permission: Permission): boolean => {
    if (!userRole) return false
    return checkPermission(userRole, permission)
  }

  const getUserPermissions = (): Permission[] => {
    if (!userRole) return []
    return getPermissionsForRole(userRole)
  }

  return {
    userRole,
    loading,
    hasPermission,
    getUserPermissions,
  }
}
