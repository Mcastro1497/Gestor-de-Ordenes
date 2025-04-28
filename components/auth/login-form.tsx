"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"
import { useSupabase } from "@/hooks/use-supabase"
import { Loader2, CheckCircle, AlertTriangle, RefreshCw } from "lucide-react"

export function LoginForm() {
  const { supabase, isConnected, connectionError } = useSupabase()
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [retryCount, setRetryCount] = useState(0)

  // Función para manejar la redirección manual
  const handleManualRedirect = () => {
    window.location.href = "/dashboard"
  }

  // Función para reintentar la conexión
  const handleRetryConnection = () => {
    setRetryCount((prev) => prev + 1)
    window.location.reload()
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setIsLoading(true)
    setLoginError(null)

    try {
      console.log("Intentando iniciar sesión con:", email)

      if (!isConnected) {
        throw new Error("No hay conexión con Supabase. Por favor, verifica tu conexión a internet.")
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Error al iniciar sesión:", error)
        setLoginError(error.message)
        return
      }

      console.log("Inicio de sesión exitoso:", data.user)
      setIsSuccess(true)
      toast.success("Sesión iniciada correctamente")

      // Redirigir después de un breve retraso
      setTimeout(() => {
        window.location.href = "/dashboard"
      }, 1500)
    } catch (err) {
      console.error("Error inesperado al iniciar sesión:", err)
      setLoginError(err instanceof Error ? err.message : "Error inesperado al iniciar sesión")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Iniciar sesión</h1>
        <p className="text-sm text-muted-foreground">Ingresa tus credenciales para acceder a tu cuenta</p>
      </div>

      {connectionError && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <AlertDescription>
            Error de conexión con el servidor. Por favor, verifica tu conexión a internet.
            <Button variant="outline" size="sm" className="ml-2" onClick={handleRetryConnection}>
              <RefreshCw className="h-4 w-4 mr-1" /> Reintentar
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {loginError && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{loginError}</AlertDescription>
        </Alert>
      )}

      {isSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative mb-4 flex items-center justify-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          <span>Sesión iniciada correctamente. Redirigiendo...</span>
        </div>
      )}

      <div className="grid gap-6">
        <form onSubmit={onSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="nombre@ejemplo.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isLoading || isSuccess}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <Input
                id="password"
                placeholder="••••••••"
                type="password"
                autoCapitalize="none"
                autoComplete="current-password"
                autoCorrect="off"
                disabled={isLoading || isSuccess}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button disabled={isLoading || isSuccess} type="submit">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Iniciando sesión...
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Redirigiendo...
                </>
              ) : (
                "Iniciar sesión"
              )}
            </Button>
          </div>
        </form>

        {isSuccess && (
          <Button variant="outline" onClick={handleManualRedirect}>
            Ir al Dashboard manualmente
          </Button>
        )}

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">O</span>
          </div>
        </div>
        <div className="text-center text-sm">
          ¿No tienes una cuenta?{" "}
          <Link href="/auth/register" className="font-medium text-primary underline-offset-4 hover:underline">
            Regístrate
          </Link>
        </div>
      </div>
    </div>
  )
}
