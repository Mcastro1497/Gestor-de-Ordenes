"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()

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
      <Link
        href="/admin"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/admin" || pathname.startsWith("/admin/") ? "text-primary" : "text-muted-foreground",
        )}
      >
        Administración
      </Link>
    </nav>
  )
}
