"use client"

import { Button } from "@/components/ui/button"
import { UserRole } from "@/lib/db/schema"
import { useState } from "react"
import { toast } from "sonner"

export function AdminTestButton() {
  const [isCreating, setIsCreating] = useState(false)

  const createAdminUser = () => {
    setIsCreating(true)

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
        toast.success("Usuario admin ya existe", {
          description: "Email: admin@test.com, Contraseña: admin123",
        })
        setIsCreating(false)
        return
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

      toast.success("Usuario admin creado", {
        description: "Email: admin@test.com, Contraseña: admin123",
      })
    } catch (error) {
      console.error("Error al crear usuario admin:", error)
      toast.error("Error al crear usuario admin", {
        description: error instanceof Error ? error.message : "Error desconocido",
      })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={createAdminUser} disabled={isCreating}>
      {isCreating ? "Creando..." : "Crear Admin Test"}
    </Button>
  )
}
