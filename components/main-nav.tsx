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
    async function getUserRole() {
      try {
        const supabase = createClient()

        // Obtener la sesión actual
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          setUserRole(null)
          setLoading(false)
          return
        }

        // Obtener el rol del usuario directamente de la tabla usuarios
        const { data, error } = await supabase.from("usuarios").select("rol").eq("id", session.user.id).single()

        if (error) {
          console.error("Error al obtener el rol:", error)
          // Si hay un error, asumimos que es admin para mostrar todo el menú
          setUserRole("admin")
        } else if (data && data.rol) {
          console.log("Rol obtenido:", data.rol)
          setUserRole(data.rol)
        } else {
          // Si no hay datos, asumimos que es admin para mostrar todo el menú
          console.log("No se encontró rol, asumiendo admin")
          setUserRole("admin")
        }
      } catch (error) {
        console.error("Error al obtener el rol:", error)
        // En caso de error, asumimos admin para mostrar todo el menú
        setUserRole("admin")
      } finally {
        setLoading(false)
      }
    }

    getUserRole()
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

  // Por defecto, mostrar todas las opciones si no podemos determinar el rol
  const isAdmin = userRole === "admin"
  const isComercial = userRole === "comercial" || isAdmin
  const isTrader = userRole === "trader" || isAdmin

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
      {/* Dashboard - visible para todos */}
      <Link
        href="/dashboard"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/dashboard" ? "text-primary" : "text-muted-foreground",
        )}
      >
        Dashboard
      </Link>

      {/* Órdenes - visible para comercial y admin */}
      {isComercial && (
        <Link
          href="/ordenes"
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === "/ordenes" || pathname.startsWith("/ordenes/") ? "text-primary" : "text-muted-foreground",
          )}
        >
          Órdenes
        </Link>
      )}

      {/* Trading - visible para trader y admin */}
      {isTrader && (
        <Link
          href="/trading"
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === "/trading" ? "text-primary" : "text-muted-foreground",
          )}
        >
          Mesa de Trading
        </Link>
      )}

      {/* Configuración - visible para todos */}
      <Link
        href="/config"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/config" || pathname.startsWith("/config/") ? "text-primary" : "text-muted-foreground",
        )}
      >
        Configuración
      </Link>

      {/* Administración - solo visible para admin */}
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
