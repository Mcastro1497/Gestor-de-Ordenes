"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"

interface MainNavProps extends React.HTMLAttributes<HTMLElement> {
  items?: {
    href: string
    title: string
    roles?: string[]
  }[]
}

export function MainNav({ className, items, ...props }: MainNavProps) {
  const pathname = usePathname()
  const [userRole, setUserRole] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
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

        // Obtener el rol del usuario
        const { data, error } = await supabase.from("usuarios").select("rol").eq("id", session.user.id).single()

        if (error) {
          console.error("Error al obtener rol:", error)
          setLoading(false)
          return
        }

        console.log("Rol obtenido:", data?.rol)
        setUserRole(data?.rol || null)
      } catch (err) {
        console.error("Error en getUserRole:", err)
      } finally {
        setLoading(false)
      }
    }

    getUserRole()
  }, [])

  // Definir los elementos de navegación con sus roles permitidos
  const navItems = [
    { href: "/dashboard", title: "Dashboard", roles: ["admin", "comercial", "trader"] },
    { href: "/orders", title: "Órdenes", roles: ["admin", "comercial"] },
    { href: "/trading", title: "Mesa de Trading", roles: ["admin", "trader"] },
    { href: "/config", title: "Configuración", roles: ["admin", "comercial", "trader"] },
    { href: "/admin", title: "Administración", roles: ["admin"] },
  ]

  if (loading) {
    return (
      <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
        <div className="h-4 w-20 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-4 w-20 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-4 w-20 bg-gray-200 animate-pulse rounded"></div>
      </nav>
    )
  }

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
            pathname === item.href ? "text-primary" : "text-muted-foreground",
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  )
}
