"use client"

import Link from "next/link"
import { MainNav } from "@/components/main-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserNav } from "@/components/user-nav"
import { NotificationCenter } from "@/components/notification-center"
import { useAuth } from "@/hooks/use-auth"

export function SiteHeader() {
  const { isAuthenticated } = useAuth()

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold">Gestor de Órdenes</span>
          </Link>
          {isAuthenticated && <MainNav className="hidden md:flex" />}
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            {isAuthenticated && <NotificationCenter />}
            <ThemeToggle />
            <UserNav />
          </nav>
        </div>
      </div>
    </header>
  )
}
