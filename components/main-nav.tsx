"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()
  const [userRole, setUserRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const supabase = createClient()

        // Obtener la sesión actual
        const { data: sessionData } = await supabase.auth.getSession()

        if (!sessionData.session) {
          console.log("No hay sesión activa")
          setUserRole(null)
          setLoading(false)
          return
        }

        // Obtener el usuario de la tabla usuarios
        const { data: userData, error } = await supabase
          .from("usuarios")
          .select("rol")
          .eq("id", sessionData.session.user.id)
          .single()

        if (error) {
          console.error("Error al obtener el rol:", error)
          // Por defecto, mostrar todo
          setUserRole("admin")
        } else if (userData) {
          console.log("Rol del usuario:", userData.rol)
          setUserRole(userData.rol)
        } else {
          console.log("No se encontró el usuario en la tabla usuarios")
          // Por defecto, mostrar todo
          setUserRole("admin")
        }
      } catch (error) {
        console.error("Error al verificar el rol:", error)
        // Por defecto, mostrar todo
        setUserRole("admin")
      } finally {
        setLoading(false)
      }
    }

    checkUserRole()
  }, [])

  // Mientras carga, mostrar un esqueleto del menú
  if (loading) {
    return (
      <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
        <div className="h-4 w-20 bg-muted rounded animate-pulse"></div>
        <div className="h-4 w-20 bg-muted rounded animate-pulse"></div>
        <div className="h-4 w-20 bg-muted rounded animate-pulse"></div>
      </nav>
    )
  }

  // Mostrar todas las opciones para admin
  const isAdmin = userRole === "admin"

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
      <Link
        href="/dashboard"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/dashboard" ? "text-primary" : "text-muted-foreground",
        )}
      >
        Dashboard
      </Link>

      <Link
        href="/ordenes"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/ordenes" || pathname.startsWith("/ordenes/") ? "text-primary" : "text-muted-foreground",
        )}
      >
        Órdenes
      </Link>

      <Link
        href="/trading"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/trading" ? "text-primary" : "text-muted-foreground",
        )}
      >
        Mesa de Trading
      </Link>

      <Link
        href="/config"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/config" || pathname.startsWith("/config/") ? "text-primary" : "text-muted-foreground",
        )}
      >
        Configuración
      </Link>

      {isAdmin && (
        <Link
          href="/admin"
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === "/admin" || pathname.startsWith("/admin/") ? "text-primary" : "text-muted-foreground",
          )}
        >
          Administración
        </Link>
      )}
    </nav>
  )
}
