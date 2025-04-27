import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function middleware(request: NextRequest) {
  try {
    // Create a Supabase client configured to use cookies
    const supabase = createServerClient()

    // Refresh session if expired - required for Server Components
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error) {
      console.error("Error en middleware al obtener sesión:", error)
    }

    // Log the current path and session status for debugging
    console.log(`Middleware: Path=${request.nextUrl.pathname}, Session=${session ? "✓" : "✗"}`)

    // If there's no session and the user is trying to access a protected route
    if (!session && !request.nextUrl.pathname.startsWith("/auth")) {
      console.log("Redirigiendo a login: no hay sesión activa")
      // Redirect to login page
      const redirectUrl = new URL("/auth/login", request.url)
      redirectUrl.searchParams.append("redirectedFrom", request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // If there's a session and the user is trying to access auth pages
    if (session && request.nextUrl.pathname.startsWith("/auth")) {
      console.log("Redirigiendo a dashboard: sesión activa")
      // Redirect to dashboard
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    return NextResponse.next()
  } catch (error) {
    console.error("Error crítico en middleware:", error)
    // En caso de error, permitir el acceso y dejar que la página maneje el error
    return NextResponse.next()
  }
}

// Specify the paths that should be protected or checked by the middleware
export const config = {
  matcher: [
    // Protected routes that require authentication
    "/dashboard/:path*",
    "/orders/:path*",
    "/config/:path*",
    "/trading/:path*",
    "/admin/:path*",
    // Auth routes that should redirect to dashboard if already authenticated
    "/auth/:path*",
  ],
}
