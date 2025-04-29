"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"

export function DebugUserRole() {
  const [sessionInfo, setSessionInfo] = useState<any>(null)
  const [userInfo, setUserInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUserInfo = async () => {
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      // Obtener la sesión actual
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError) {
        throw new Error(`Error al obtener la sesión: ${sessionError.message}`)
      }

      setSessionInfo(session)

      if (!session) {
        setLoading(false)
        return
      }

      // Obtener información del usuario desde la tabla usuarios
      const { data: userData, error: userError } = await supabase
        .from("usuarios")
        .select("*")
        .eq("email", session.user.email)
        .single()

      if (userError && userError.code !== "PGRST116") {
        console.error("Error al obtener información del usuario:", userError)
      }

      setUserInfo(userData || null)
    } catch (err: any) {
      console.error("Error en fetchUserInfo:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserInfo()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información de Usuario</CardTitle>
        <p className="text-sm text-muted-foreground">Datos del usuario actual y su rol</p>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Cargando información...</p>
        ) : error ? (
          <div>
            <p className="text-red-500">{error}</p>
            <Button onClick={fetchUserInfo} className="mt-2">
              Reintentar
            </Button>
          </div>
        ) : !sessionInfo ? (
          <div>
            <p className="text-red-500">No hay sesión activa</p>
            <p>Sesión verificada: {sessionInfo ? "Sí" : "No"}</p>
            <Button onClick={fetchUserInfo} className="mt-2">
              Reintentar
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Sesión:</h3>
              <p>ID de Usuario: {sessionInfo.user.id}</p>
              <p>Email: {sessionInfo.user.email}</p>
              <p>Autenticado: Sí</p>
            </div>

            {userInfo ? (
              <div>
                <h3 className="font-medium">Datos de Usuario:</h3>
                <p>Nombre: {userInfo.nombre}</p>
                <p>Rol: {userInfo.rol}</p>
                <p>Creado: {new Date(userInfo.created_at).toLocaleString()}</p>
              </div>
            ) : (
              <p>No se encontró información adicional del usuario en la tabla usuarios.</p>
            )}

            <Button onClick={fetchUserInfo}>Actualizar</Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
