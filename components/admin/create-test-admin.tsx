"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle } from "lucide-react"
import { UserRole } from "@/lib/db/schema"

export function CreateTestAdmin() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const createAdminUser = () => {
    try {
      // Verificar si localStorage está disponible
      if (typeof window === "undefined" || !window.localStorage) {
        throw new Error("localStorage no está disponible")
      }

      // Obtener usuarios existentes o inicializar array vacío
      const usersJson = localStorage.getItem("gestor_users")
      const users = usersJson ? JSON.parse(usersJson) : []

      // Verificar si ya existe un usuario con este email
      const existingUser = users.find((user: any) => user.email === "admin@test.com")

      if (existingUser) {
        setStatus("success")
        return // Si ya existe, simplemente indicamos éxito
      }

      // Crear nuevo usuario administrador
      const newUser = {
        id: `user-${Date.now()}`,
        email: "admin@test.com",
        name: "Administrador de Prueba",
        password: "admin123", // En producción usaríamos hash
        role: UserRole.ADMIN,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLogin: null,
      }

      // Guardar en localStorage
      localStorage.setItem("gestor_users", JSON.stringify([...users, newUser]))

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
        <CardTitle>Crear Usuario Administrador de Prueba</CardTitle>
        <CardDescription>Crea un usuario administrador para pruebas con acceso completo al sistema</CardDescription>
      </CardHeader>
      <CardContent>
        {status === "success" && (
          <Alert className="mb-4 bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Usuario creado con éxito</AlertTitle>
            <AlertDescription className="text-green-700">
              <p>Puedes iniciar sesión con las siguientes credenciales:</p>
              <p className="mt-2 font-mono bg-green-100 p-2 rounded">
                Email: admin@test.com
                <br />
                Contraseña: admin123
              </p>
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
                <span className="font-medium">Nombre:</span> Administrador de Prueba
              </li>
              <li>
                <span className="font-medium">Email:</span> admin@test.com
              </li>
              <li>
                <span className="font-medium">Contraseña:</span> admin123
              </li>
              <li>
                <span className="font-medium">Rol:</span> Administrador
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={createAdminUser} className="w-full" disabled={status === "success"}>
          {status === "success" ? "Usuario Creado" : "Crear Usuario Admin"}
        </Button>
      </CardFooter>
    </Card>
  )
}
