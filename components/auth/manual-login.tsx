"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

export function ManualLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [sessionInfo, setSessionInfo] = useState<any>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()

      // Intentar iniciar sesión
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Error al iniciar sesión:", error.message)
        toast.error(`Error al iniciar sesión: ${error.message}`)
        return
      }

      // Verificar la sesión
      const { data: sessionData } = await supabase.auth.getSession()
      setSessionInfo(sessionData)

      toast.success("Sesión iniciada correctamente")
      console.log("Sesión iniciada:", data.user?.email)

      // Recargar la página para aplicar la sesión
      window.location.reload()
    } catch (err: any) {
      console.error("Error inesperado:", err.message)
      toast.error(`Error inesperado: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const checkSession = async () => {
    try {
      const supabase = createClient()
      const { data } = await supabase.auth.getSession()
      setSessionInfo(data)

      if (data.session) {
        toast.success("Sesión activa encontrada")
      } else {
        toast.error("No hay sesión activa")
      }
    } catch (err: any) {
      console.error("Error al verificar sesión:", err.message)
      toast.error(`Error al verificar sesión: ${err.message}`)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Iniciar Sesión Manual</CardTitle>
        <CardDescription>Inicia sesión con tu email y contraseña</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button variant="outline" onClick={checkSession} className="w-full">
          Verificar Sesión
        </Button>

        {sessionInfo && (
          <div className="w-full mt-4">
            <h3 className="font-medium mb-2">Estado de la sesión:</h3>
            <div className="bg-muted p-2 rounded text-xs overflow-auto max-h-40">
              <pre>{JSON.stringify(sessionInfo, null, 2)}</pre>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
