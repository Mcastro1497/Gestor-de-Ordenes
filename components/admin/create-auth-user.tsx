"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { useSupabase } from "@/hooks/use-supabase"

// Datos del usuario administrador de prueba
const TEST_ADMIN = {
  email: "admin@test.com",
  password: "Admin123!",
  name: "Administrador de Prueba",
  role: "admin",
}

export function CreateAuthUser() {
  const { supabase } = useSupabase()
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [userId, setUserId] = useState<string | null>(null)

  const createAdminUser = async () => {
    try {
      setStatus("loading")

      console.log("Creando usuario administrador en Auth...")

      // Crear el usuario en Auth
      const { data, error } = await supabase.auth.signUp({
        email: TEST_ADMIN.email,
        password: TEST_ADMIN.password,
        options: {
          data: {
            name: TEST_ADMIN.name,
            role: TEST_ADMIN.role,
          },
        },
      })

      if (error) {
        throw new Error(`Error al crear usuario en Auth: ${error.message}`)
      }

      if (!data.user) {
        throw new Error("No se pudo crear el usuario en Auth")
      }

      console.log("Usuario creado en Auth:", data.user.id)
      setUserId(data.user.id)
      setStatus("success")
    } catch (error) {
      console.error("Error al crear usuario admin:", error)
      setStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Error desconocido")
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Crear Usuario en Autenticación</CardTitle>
        <CardDescription>
          Crea un usuario de autenticación para el administrador ya creado en la base de datos
        </CardDescription>
      </CardHeader>
      <CardContent>
        {status === "success" && (
          <Alert className="mb-4 bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Usuario creado con éxito</AlertTitle>
            <AlertDescription className="text-green-700">
              <p>Puedes iniciar sesión con las siguientes credenciales:</p>
              <p className="mt-2 font-mono bg-green-100 p-2 rounded">
                Email: {TEST_ADMIN.email}
                <br />
                Contraseña: {TEST_ADMIN.password}
              </p>
              {userId && <p className="mt-2 text-xs">ID de usuario: {userId}</p>}
            </AlertDescription>
          </Alert>
        )}

        {status === "error" && (
          <Alert className="mb-4 bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-800">Error al crear usuario</AlertTitle>
            <AlertDescription className="text-red-700">{errorMessage}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="border p-3 rounded-md bg-gray-50">
            <h3 className="font-medium">Detalles del usuario:</h3>
            <ul className="mt-2 space-y-1 text-sm">
              <li>
                <span className="font-medium">Email:</span> {TEST_ADMIN.email}
              </li>
              <li>
                <span className="font-medium">Contraseña:</span> {TEST_ADMIN.password}
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={createAdminUser} className="w-full" disabled={status === "loading" || status === "success"}>
          {status === "loading" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {status === "success" ? "Usuario Creado" : status === "loading" ? "Creando Usuario..." : "Crear Usuario Auth"}
        </Button>
      </CardFooter>
    </Card>
  )
}
