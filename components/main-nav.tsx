"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { usePermissions } from "@/hooks/use-permissions"
import { Permission } from "@/lib/db/schema"

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()
  const { hasPermission } = usePermissions()

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
      {hasPermission(Permission.VIEW_DASHBOARD) && (
        <Link
          href="/dashboard"
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === "/dashboard" ? "text-primary" : "text-muted-foreground",
          )}
        >
          Dashboard
        </Link>
      )}

      {hasPermission(Permission.VIEW_ORDER) && (
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

      {hasPermission(Permission.VIEW_TRADING) && (
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

      {hasPermission(Permission.VIEW_CONFIG) && (
        <Link
          href="/config"
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === "/config" || pathname.startsWith("/config/") ? "text-primary" : "text-muted-foreground",
          )}
        >
          Configuración
        </Link>
      )}

      {hasPermission(Permission.MANAGE_USERS) && (
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
