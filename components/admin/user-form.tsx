"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { UserRole } from "@/lib/db/schema"
import { toast } from "@/hooks/use-toast"
import { getSupabaseUserById } from "@/lib/services/user-supabase-service"
import { createClient } from "@/lib/supabase/client"

// Esquema de validación para el formulario
const userFormSchema = z.object({
  email: z.string().email({ message: "Debe ser un correo electrónico válido" }),
  nombre: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  rol: z.nativeEnum(UserRole, { message: "Debe seleccionar un rol válido" }),
  activo: z.boolean().default(true),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }).optional(),
})

type UserFormValues = z.infer<typeof userFormSchema>

interface UserFormProps {
  userId?: string
  onSuccess: () => void
  onCancel: () => void
}

export function UserForm({ userId, onSuccess, onCancel }: UserFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  // Inicializar el formulario
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: "",
      nombre: "",
      rol: undefined,
      activo: true,
      password: "",
    },
  })

  // Cargar datos del usuario si se está editando
  useState(() => {
    if (userId) {
      setIsLoading(true)
      getSupabaseUserById(userId)
        .then((user) => {
          if (user) {
            form.reset({
              email: user.email,
              nombre: user.nombre || "",
              rol: user.rol as UserRole,
              activo: user.activo || false,
              password: "", // No cargar la contraseña por seguridad
            })
          }
        })
        .catch((error) => {
          console.error("Error al cargar usuario:", error)
          toast({
            title: "Error",
            description: "No se pudo cargar la información del usuario.",
            variant: "destructive",
          })
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [userId, form])

  // Función para manejar el envío del formulario
  const onSubmit = async (data: UserFormValues) => {
    setIsLoading(true)
    try {
      const supabase = createClient()

      if (userId) {
        // Actualizar usuario existente
        const updateData: any = {
          nombre: data.nombre,
          rol: data.rol,
          activo: data.activo,
        }

        // Solo incluir contraseña si se ha proporcionado una nueva
        if (data.password) {
          // En una implementación real, esto debería hacerse a través de una API segura
          // que maneje el hash de la contraseña en el servidor
          updateData.password = data.password
        }

        const { error } = await supabase.from("usuarios").update(updateData).eq("id", userId)

        if (error) throw error

        toast({
          title: "Usuario actualizado",
          description: "El usuario ha sido actualizado exitosamente.",
        })
      } else {
        // Crear nuevo usuario
        // En una implementación real, esto debería hacerse a través de una API segura
        // que maneje el registro de usuarios y el hash de contraseñas
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: data.email,
          password: data.password || "password123", // Contraseña temporal
          options: {
            data: {
              nombre: data.nombre,
              rol: data.rol,
            },
          },
        })

        if (authError) throw authError

        // Crear registro en la tabla de usuarios
        if (authData.user) {
          const { error } = await supabase.from("usuarios").insert({
            id: authData.user.id,
            email: data.email,
            nombre: data.nombre,
            rol: data.rol,
            activo: data.activo,
          })

          if (error) throw error
        }

        toast({
          title: "Usuario creado",
          description: "El usuario ha sido creado exitosamente.",
        })
      }

      onSuccess()
    } catch (error) {
      console.error("Error al guardar usuario:", error)
      toast({
        title: "Error",
        description: "No se pudo guardar el usuario. Por favor, intente de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo Electrónico</FormLabel>
              <FormControl>
                <Input
                  placeholder="correo@ejemplo.com"
                  {...field}
                  disabled={isLoading || !!userId} // Deshabilitar si se está editando
                />
              </FormControl>
              <FormDescription>El correo electrónico se utilizará para iniciar sesión.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Nombre del usuario" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rol"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rol</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un rol" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={UserRole.ADMIN}>Administrador</SelectItem>
                  <SelectItem value={UserRole.COMERCIAL}>Comercial</SelectItem>
                  <SelectItem value={UserRole.OPERADOR}>Operador</SelectItem>
                  <SelectItem value={UserRole.CONTROLADOR}>Controlador</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>El rol determina los permisos del usuario en el sistema.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="activo"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Usuario activo</FormLabel>
                <FormDescription>Los usuarios inactivos no pueden iniciar sesión en el sistema.</FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{userId ? "Nueva Contraseña" : "Contraseña"}</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder={userId ? "Dejar en blanco para mantener la actual" : "Contraseña"}
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>
                {userId
                  ? "Deje este campo en blanco si no desea cambiar la contraseña."
                  : "La contraseña debe tener al menos 6 caracteres."}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Guardando..." : userId ? "Actualizar" : "Crear"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
