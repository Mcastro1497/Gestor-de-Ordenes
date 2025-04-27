"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useSupabase } from "@/hooks/use-supabase"

export function RegisterForm() {
  const router = useRouter()
  const { supabase } = useSupabase()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setIsLoading(true)

    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden")
      setIsLoading(false)
      return
    }

    try {
      console.log("Attempting to sign up with:", email)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        console.error("Sign up error:", error)
        toast.error("Error al registrarse: " + error.message)
        return
      }

      console.log("Sign up result:", data)

      // Check if email confirmation is required
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        toast.error("Este correo ya está registrado. Por favor, inicia sesión o recupera tu contraseña.")
        return
      }

      if (data.user && !data.session) {
        toast.success("Registro exitoso. Por favor, verifica tu correo electrónico para confirmar tu cuenta.")
        router.push("/auth/login")
      } else if (data.user && data.session) {
        toast.success("Registro exitoso. Has iniciado sesión automáticamente.")
        router.push("/dashboard")
        router.refresh()
      }
    } catch (err) {
      console.error("Error signing up:", err)
      toast.error("Error inesperado al registrarse")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Crear una cuenta</h1>
        <p className="text-sm text-muted-foreground">Ingresa tus datos para crear una nueva cuenta</p>
      </div>
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
                disabled={isLoading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                placeholder="••••••••"
                type="password"
                autoCapitalize="none"
                autoComplete="new-password"
                autoCorrect="off"
                disabled={isLoading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirmar contraseña</Label>
              <Input
                id="confirm-password"
                placeholder="••••••••"
                type="password"
                autoCapitalize="none"
                autoComplete="new-password"
                autoCorrect="off"
                disabled={isLoading}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button disabled={isLoading} type="submit">
              {isLoading ? "Registrando..." : "Registrarse"}
            </Button>
          </div>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">O</span>
          </div>
        </div>
        <div className="text-center text-sm">
          ¿Ya tienes una cuenta?{" "}
          <Link href="/auth/login" className="font-medium text-primary underline-offset-4 hover:underline">
            Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  )
}
