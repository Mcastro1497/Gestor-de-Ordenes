"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function ResetPasswordForm() {
  const router = useRouter()
  const { updatePassword, loading } = useAuth()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres")
      return
    }

    const { error } = await updatePassword(password)

    if (!error) {
      setSuccess(true)
      setTimeout(() => {
        router.push("/auth/login")
      }, 3000)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Restablecer contraseña</CardTitle>
        <CardDescription>Crea una nueva contraseña para tu cuenta</CardDescription>
      </CardHeader>
      <CardContent>
        {success ? (
          <div className="text-center space-y-4">
            <div className="rounded-full bg-green-100 p-3 w-12 h-12 flex items-center justify-center mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6 text-green-600"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-medium">Contraseña actualizada</h3>
            <p className="text-sm text-muted-foreground">
              Tu contraseña ha sido actualizada correctamente. Serás redirigido a la página de inicio de sesión.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Nueva contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className="text-sm text-red-500">{error}</div>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Actualizando...
                </>
              ) : (
                "Actualizar contraseña"
              )}
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter>
        <Link
          href="/auth/login"
          className="text-sm text-primary hover:underline flex items-center w-full justify-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a inicio de sesión
        </Link>
      </CardFooter>
    </Card>
  )
}
