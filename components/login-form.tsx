"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { clientLogin } from "@/lib/auth/client-auth"
import { toast } from "sonner"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Simulamos la verificación con los datos de localStorage
      // En una implementación real, esto sería una llamada a la API
      const usersJson = localStorage.getItem("gestor_users")
      const users = usersJson ? JSON.parse(usersJson) : []

      const user = users.find((u: any) => u.email === email)

      if (!user) {
        setError("Usuario no encontrado")
        toast.error("Usuario no encontrado")
        return
      }

      if (user.password !== password) {
        setError("Contraseña incorrecta")
        toast.error("Contraseña incorrecta")
        return
      }

      if (!user.isActive) {
        setError("Usuario inactivo")
        toast.error("Usuario inactivo")
        return
      }

      // Generar un token simple (en una implementación real sería un JWT)
      const token = Math.random().toString(36).substring(2)

      // Guardar la sesión en el cliente
      clientLogin(token, user)

      toast.success("Inicio de sesión exitoso")

      // Redirigir al dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Error al iniciar sesión:", error)
      setError("Error al iniciar sesión")
      toast.error("Error al iniciar sesión")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-6 p-6 bg-white rounded-lg shadow-md">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Iniciar sesión</h1>
        <p className="text-gray-500">Ingresa tus credenciales para acceder al sistema</p>
      </div>
      <Tabs defaultValue="email" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="proveedores">Proveedores</TabsTrigger>
        </TabsList>
        <TabsContent value="email" className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="ejemplo@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
                <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>
          </form>
        </TabsContent>
        <TabsContent value="proveedores" className="space-y-4">
          <div className="space-y-2">
            <Button variant="outline" className="w-full">
              Continuar con Google
            </Button>
            <Button variant="outline" className="w-full">
              Continuar con Microsoft
            </Button>
          </div>
        </TabsContent>
      </Tabs>
      <div className="text-center text-sm">
        ¿No tienes una cuenta?{" "}
        <Link href="/auth/register" className="text-blue-600 hover:underline">
          Regístrate
        </Link>
      </div>
    </div>
  )
}
