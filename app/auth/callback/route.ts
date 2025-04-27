import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get("code")
    const error = requestUrl.searchParams.get("error")
    const error_description = requestUrl.searchParams.get("error_description")

    // Log the callback parameters for debugging
    console.log("Auth callback:", { code: code ? "✓" : "✗", error, error_description })

    if (error) {
      console.error("Error en callback de autenticación:", error, error_description)
      return NextResponse.redirect(
        requestUrl.origin + "/auth/login?error=" + encodeURIComponent(error_description || error),
      )
    }

    if (code) {
      const cookieStore = cookies()
      const supabase = createServerClient()

      try {
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) {
          console.error("Error al intercambiar código por sesión:", error)
          return NextResponse.redirect(requestUrl.origin + "/auth/login?error=" + encodeURIComponent(error.message))
        }
        console.log("Sesión creada correctamente")
      } catch (err) {
        console.error("Error inesperado al intercambiar código:", err)
        return NextResponse.redirect(requestUrl.origin + "/auth/login?error=Error+inesperado")
      }
    }

    // URL to redirect to after sign in process completes
    return NextResponse.redirect(requestUrl.origin + "/dashboard")
  } catch (error) {
    console.error("Error crítico en callback:", error)
    return NextResponse.redirect(new URL("/auth/login?error=Error+crítico", request.url))
  }
}
