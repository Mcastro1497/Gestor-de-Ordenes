"use client"
import { usePathname } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserNav } from "@/components/user-nav"
import { useAuth } from "@/hooks/use-auth"

export function SiteHeader() {
  const pathname = usePathname()
  const { isAuthenticated } = useAuth()

  // Si no está autenticado y no está en una ruta de autenticación, no mostrar el header
  if (!isAuthenticated && !pathname.startsWith("/auth")) {
    return null
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <ThemeToggle />
            <UserNav />
          </nav>
        </div>
      </div>
    </header>
  )
}
