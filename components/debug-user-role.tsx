"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function DebugUserRole() {
  const [userInfo, setUserInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sessionChecked, setSessionChecked] = useState(false)

  const checkUserInfo = async () => {
    try {
      setLoading(true)
      setError(null)

      const supabase = createClient()

      // Obtener la sesión actual
      const { data: sessionData } = await supabase.auth.getSession()
      console.log("Datos de sesión:", sessionData)

      if (!sessionData.session) {
        setError("No hay sesión activa")
        setSessionChecked(true)
        return
      }

      // Obtener el usuario de Supabase Auth
      const { data: authUser } = await supabase.auth.getUser()
      console.log("Usuario autenticado:", authUser)

      // Obtener el usuario de la tabla usuarios
      const { data: userData, error } = await supabase
        .from("usuarios")
        .select("*")
        .eq("id", sessionData.session.user.id)
        .single()

      console.log("Datos de usuario:", userData, "Error:", error)

      if (error) {
        // Intentar buscar por email como alternativa
        const { data: userByEmail, error: emailError } = await supabase
          .from("usuarios")
          .select("*")
          .eq("email", sessionData.session.user.email)
          .single()

        if (emailError || !userByEmail) {
          setError(`Error al obtener datos de usuario: ${error.message}`)
          setSessionChecked(true)
          return
        }

        setUserInfo({
          auth: authUser.user,
          userData: userByEmail,
          note: "Usuario encontrado por email, no por ID",
        })
      } else {
        setUserInfo({
          auth: authUser.user,
          userData: userData,
        })
      }

      setSessionChecked(true)
    } catch (err: any) {
      console.error("Error en checkUserInfo:", err)
      setError(`Error: ${err.message}`)
      setSessionChecked(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkUserInfo()
  }, [])

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Información de Usuario</CardTitle>
        <CardDescription>Datos del usuario actual y su rol</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Cargando información...</p>
        ) : error ? (
          <div>
            <p className="text-red-500">{error}</p>
            <p className="text-sm mt-2">Sesión verificada: {sessionChecked ? "Sí" : "No"}</p>
            <Button onClick={checkUserInfo} className="mt-2">
              Reintentar
            </Button>
          </div>
        ) : userInfo ? (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Usuario Auth:</h3>
              <pre className="bg-muted p-2 rounded text-xs overflow-auto">{JSON.stringify(userInfo.auth, null, 2)}</pre>
            </div>
            <div>
              <h3 className="font-medium">Datos de Usuario:</h3>
              <pre className="bg-muted p-2 rounded text-xs overflow-auto">
                {JSON.stringify(userInfo.userData, null, 2)}
              </pre>
            </div>
            {userInfo.note && <p className="text-amber-500 text-sm">{userInfo.note}</p>}
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded">
              <p>
                <strong>Rol:</strong> {userInfo.userData?.rol || "No definido"}
              </p>
            </div>
          </div>
        ) : (
          <p>No se encontró información del usuario</p>
        )}
      </CardContent>
    </Card>
  )
}
