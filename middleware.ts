import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Función para verificar si hay una sesión activa en localStorage
function isAuthenticated(request: NextRequest): boolean {
  // En el middleware no podemos acceder a localStorage directamente
  // Verificamos si existe la cookie de sesión
  const sessionCookie = request.cookies.get("gestor_session")
  return !!sessionCookie?.value
}

export async function middleware(request: NextRequest) {
  // Rutas protegidas que requieren autenticación
  const protectedRoutes = ["/dashboard", "/orders", "/ordenes", "/config", "/admin", "/trading"]

  // Verificar si la ruta actual está protegida
  const isProtectedRoute = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))

  // Si es una ruta protegida y no hay sesión, redirigir al login
  if (isProtectedRoute && !isAuthenticated(request)) {
    const redirectUrl = new URL("/auth/login", request.url)
    redirectUrl.searchParams.set("redirectedFrom", request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Si hay sesión y el usuario intenta acceder a login, redirigir al dashboard
  if (isAuthenticated(request) && request.nextUrl.pathname === "/auth/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

// Configurar las rutas que deben usar el middleware
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/orders/:path*",
    "/ordenes/:path*",
    "/config/:path*",
    "/admin/:path*",
    "/trading/:path*",
    "/auth/login",
  ],
}
