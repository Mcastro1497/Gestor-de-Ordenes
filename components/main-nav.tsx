"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { usePermissions } from "@/hooks/use-permissions"
import { Permission } from "@/lib/db/schema"
import { BarChart2, FileText, Settings, Users, Home } from "lucide-react"

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()
  const { hasPermission, loading } = usePermissions()

  // Definir los elementos de navegación con sus permisos requeridos
  const navItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <Home className="mr-2 h-4 w-4" />,
      permission: Permission.VIEW_DASHBOARD,
    },
    {
      href: "/orders",
      label: "Órdenes",
      icon: <FileText className="mr-2 h-4 w-4" />,
      permission: Permission.VIEW_DASHBOARD,
    },
    {
      href: "/trading",
      label: "Trading",
      icon: <BarChart2 className="mr-2 h-4 w-4" />,
      permission: Permission.VIEW_TRADING,
    },
    {
      href: "/config",
      label: "Configuración",
      icon: <Settings className="mr-2 h-4 w-4" />,
      permission: Permission.VIEW_CONFIG,
    },
    {
      href: "/admin",
      label: "Administración",
      icon: <Users className="mr-2 h-4 w-4" />,
      permission: Permission.MANAGE_USERS,
    },
  ]

  if (loading) {
    return (
      <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
        <div className="h-4 w-20 bg-muted rounded animate-pulse"></div>
        <div className="h-4 w-20 bg-muted rounded animate-pulse"></div>
      </nav>
    )
  }

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
      {navItems.map((item) => {
        // Solo mostrar elementos para los que el usuario tiene permiso
        if (!hasPermission(item.permission)) return null

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center text-sm font-medium transition-colors hover:text-primary",
              pathname === item.href || pathname.startsWith(`${item.href}/`) ? "text-primary" : "text-muted-foreground",
            )}
          >
            {item.icon}
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
