"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()

  // Definir todas las rutas que queremos mostrar en la navegación
  const routes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      active: pathname === "/dashboard",
    },
    {
      href: "/orders",
      label: "Órdenes",
      active: pathname === "/orders" || pathname.startsWith("/orders/"),
    },
    {
      href: "/trading",
      label: "Mesa de Trading",
      active: pathname === "/trading",
    },
    {
      href: "/config",
      label: "Configuración",
      active: pathname === "/config" || pathname.startsWith("/config/"),
    },
    {
      href: "/admin",
      label: "Administración",
      active: pathname === "/admin" || pathname.startsWith("/admin/"),
    },
  ]

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            route.active ? "text-black dark:text-white" : "text-muted-foreground",
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  )
}
