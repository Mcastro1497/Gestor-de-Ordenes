import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { canAccessRoute } from "./lib/services/permission-service"
import type { UserRole } from "./lib/db/schema"

export async function middleware(request: NextRequest) {
  // Create a response to modify
  const res = NextResponse.next()

  // Create a Supabase client configured to use cookies
  const supabase = createMiddlewareClient({ req: request, res })

  // Refresh session if expired
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Lista de rutas públicas que no requieren autenticación
  const publicRoutes = ["/login", "/register", "/forgot-password", "/reset-password", "/access-denied"]
  const isPublicRoute = publicRoutes.some((route) => request.nextUrl.pathname === route)

  // Si no hay sesión y la ruta no es pública, redirigir a login
  if (!session && !isPublicRoute) {
    const redirectUrl = new URL("/login", request.url)
    return NextResponse.redirect(redirectUrl)
  }

  // Si hay sesión y la ruta es pública, redirigir al dashboard
  if (session && isPublicRoute && request.nextUrl.pathname !== "/access-denied") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Si hay sesión, verificar permisos para rutas protegidas
  if (session && !isPublicRoute) {
    try {
      // Obtener el rol del usuario
      const { data: userData, error } = await supabase.from("usuarios").select("rol").eq("id", session.user.id).single()

      if (error || !userData) {
        console.error("Error al obtener el rol del usuario:", error)
        return NextResponse.redirect(new URL("/login", request.url))
      }

      const userRole = userData.rol as UserRole

      // Verificar si el usuario tiene acceso a la ruta
      if (!canAccessRoute(userRole, request.nextUrl.pathname)) {
        return NextResponse.redirect(new URL("/access-denied", request.url))
      }
    } catch (error) {
      console.error("Error en middleware:", error)
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return res
}

// Specify the paths that should be checked by the middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}
