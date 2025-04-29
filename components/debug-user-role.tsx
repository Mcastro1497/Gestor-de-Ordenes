"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export function DebugUserRole() {
  const [sessionInfo, setSessionInfo] = useState<any>(null)
  const [userInfo, setUserInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [storageKeys, setStorageKeys] = useState<string[]>([])

  const checkSession = async () => {
    try {
      setLoading(true)
      setError(null)

      // Verificar las claves en localStorage
      if (typeof window !== "undefined") {
        const keys = []
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (key) keys.push(key)
        }
        setStorageKeys(keys)
      }

      const supabase = createClient()

      // Verificar si hay una sesión activa
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

      console.log("Datos de sesión:", sessionData)
      setSessionInfo(sessionData)

      if (sessionError) {
        console.error("Error al obtener sesión:", sessionError)
        setError(`Error al obtener sesión: ${sessionError.message}`)
        return
      }

      if (!sessionData.session) {
        setError("No hay sesión activa")
        return
      }

      // Obtener el usuario de Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.getUser()

      if (authError) {
        console.error("Error al obtener usuario:", authError)
        setError(`Error al obtener usuario: ${authError.message}`)
        return
      }

      // Intentar obtener el usuario de la tabla usuarios por ID
      let { data: userData, error: userError } = await supabase
        .from("usuarios")
        .select("*")
        .eq("id", sessionData.session.user.id)
        .single()

      // Si no encontramos por ID, intentamos por email
      if (userError) {
        console.log("No se encontró usuario por ID, intentando por email")
        const result = await supabase.from("usuarios").select("*").eq("email", sessionData.session.user.email).single()

        userData = result.data
        userError = result.error
      }

      if (userError) {
        console.error("Error al obtener datos de usuario:", userError)
        setError(`No se encontró el usuario en la base de datos`)
        return
      }

      setUserInfo({
        auth: authData.user,
        userData: userData,
      })

      toast.success("Información de usuario obtenida correctamente")
    } catch (err: any) {
      console.error("Error en checkSession:", err)
      setError(`Error inesperado: ${err.message}`)
      toast.error(`Error inesperado: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkSession()
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
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Estado de la sesión:</h3>
              <p className={error ? "text-red-500" : "text-green-500"}>{error || "Sesión activa"}</p>
              <Button onClick={checkSession} className="mt-2" size="sm">
                Actualizar
              </Button>
            </div>

            <div>
              <h3 className="font-medium">Claves en localStorage:</h3>
              <ul className="list-disc pl-5 text-sm">
                {storageKeys.length > 0 ? (
                  storageKeys.map((key) => (
                    <li key={key} className="break-all">
                      {key}
                    </li>
                  ))
                ) : (
                  <li>No hay claves almacenadas</li>
                )}
              </ul>
            </div>

            {sessionInfo && (
              <div>
                <h3 className="font-medium">Datos de sesión:</h3>
                <pre className="bg-muted p-2 rounded text-xs overflow-auto max-h-40">
                  {JSON.stringify(sessionInfo, null, 2)}
                </pre>
              </div>
            )}

            {userInfo && (
              <>
                <div>
                  <h3 className="font-medium">Usuario Auth:</h3>
                  <pre className="bg-muted p-2 rounded text-xs overflow-auto max-h-40">
                    {JSON.stringify(userInfo.auth, null, 2)}
                  </pre>
                </div>
                <div>
                  <h3 className="font-medium">Datos de Usuario:</h3>
                  <pre className="bg-muted p-2 rounded text-xs overflow-auto max-h-40">
                    {JSON.stringify(userInfo.userData, null, 2)}
                  </pre>
                </div>
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded">
                  <p>
                    <strong>Rol:</strong> {userInfo.userData?.rol || "No definido"}
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
