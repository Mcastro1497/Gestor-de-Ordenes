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

        if (!session?.user) {
          console.log("No hay sesión activa")
          setLoading(false)
          return
        }

        console.log("Obteniendo rol para:", session.user.email)

        // Primero intentamos buscar por ID
        let { data, error } = await supabase.from("usuarios").select("rol").eq("id", session.user.id).single()

        // Si no encontramos por ID, intentamos por email
        if (error || !data) {
          console.log("No se encontró usuario por ID, intentando por email")
          const result = await supabase.from("usuarios").select("rol").eq("email", session.user.email).single()

          data = result.data
          error = result.error
        }

        if (error) {
          console.error("Error al obtener rol:", error)
          // Por defecto, asumimos admin
          setUserRole("admin")
        } else {
          console.log("Rol obtenido:", data?.rol)
          setUserRole(data?.rol || "admin")
        }
      } catch (err) {
        console.error("Error en getUserRole:", err)
        // Por defecto, asumimos admin
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

  // Definir los elementos de navegación con sus roles permitidos
  const navItems = [
    { href: "/dashboard", title: "Dashboard", roles: ["admin", "comercial", "trader"] },
    { href: "/ordenes", title: "Órdenes", roles: ["admin", "comercial"] },
    { href: "/trading", title: "Mesa de Trading", roles: ["admin", "trader"] },
    { href: "/config", title: "Configuración", roles: ["admin", "comercial", "trader"] },
    { href: "/admin", title: "Administración", roles: ["admin"] },
  ]

  // Filtrar los elementos según el rol del usuario
  const filteredItems = navItems.filter((item) => {
    // Si no se especifican roles, mostrar a todos
    if (!item.roles) return true

    // Si el usuario es admin, mostrar todo
    if (userRole === "admin") return true

    // Si el usuario tiene un rol específico, verificar si está permitido
    return item.roles.includes(userRole || "")
  })

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
      {filteredItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === item.href || pathname.startsWith(item.href + "/") ? "text-primary" : "text-muted-foreground",
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  )
}
