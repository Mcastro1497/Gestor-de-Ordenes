"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { UserRole } from "@/lib/db/schema"
import { Edit, MoreHorizontal, UserPlus, UserX, Trash2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { UserForm } from "./user-form"
import { getAllSupabaseUsers, toggleUserActive } from "@/lib/services/user-supabase-service"

interface SupabaseUser {
  id: string
  email: string
  nombre?: string
  rol?: UserRole
  activo?: boolean
  created_at?: string
  updated_at?: string
}

export function UserManagementTable() {
  const [users, setUsers] = useState<SupabaseUser[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Cargar usuarios
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsLoading(true)
        const loadedUsers = await getAllSupabaseUsers()
        setUsers(loadedUsers)
      } catch (error) {
        console.error("Error al cargar usuarios:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los usuarios.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadUsers()
  }, [])

  // Función para obtener el color de la insignia según el rol
  const getRoleBadgeVariant = (role?: UserRole) => {
    if (!role) return "secondary"

    switch (role) {
      case UserRole.ADMIN:
        return "default"
      case UserRole.COMERCIAL:
        return "blue" as any
      case UserRole.OPERADOR:
        return "green" as any
      case UserRole.CONTROLADOR:
        return "yellow" as any
      default:
        return "secondary"
    }
  }

  // Función para obtener la descripción del rol
  const getRoleDescription = (role?: UserRole) => {
    if (!role) return "Sin rol asignado"

    switch (role) {
      case UserRole.ADMIN:
        return "Administrador - Acceso completo al sistema"
      case UserRole.COMERCIAL:
        return "Comercial/AP - Gestiona clientes y crea órdenes"
      case UserRole.OPERADOR:
        return "Operador - Ejecuta órdenes en la mesa de trading"
      case UserRole.CONTROLADOR:
        return "Controlador - Supervisa operaciones y verifica cumplimiento"
      default:
        return role
    }
  }

  // Función para desactivar un usuario
  const handleToggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      const result = await toggleUserActive(userId, isActive)

      if (result.success) {
        // Actualizar la lista de usuarios
        setUsers(users.map((user) => (user.id === userId ? { ...user, activo: isActive } : user)))

        toast({
          title: isActive ? "Usuario activado" : "Usuario desactivado",
          description: `El usuario ha sido ${isActive ? "activado" : "desactivado"} exitosamente.`,
        })
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado del usuario.",
        variant: "destructive",
      })
    }
  }

  // Función para abrir el formulario de edición
  const handleEditUser = (userId: string) => {
    setSelectedUserId(userId)
    setIsFormOpen(true)
  }

  // Función para abrir el formulario de creación
  const handleCreateUser = () => {
    setSelectedUserId(null)
    setIsFormOpen(true)
  }

  // Función para confirmar eliminación
  const handleDeleteConfirm = (userId: string) => {
    setSelectedUserId(userId)
    setIsDeleteDialogOpen(true)
  }

  // Función para eliminar un usuario
  const handleDeleteUser = async () => {
    if (!selectedUserId) return

    try {
      // En lugar de eliminar, desactivamos el usuario
      const result = await toggleUserActive(selectedUserId, false)

      if (result.success) {
        // Actualizar la lista de usuarios
        setUsers(users.map((user) => (user.id === selectedUserId ? { ...user, activo: false } : user)))

        toast({
          title: "Usuario desactivado",
          description: "El usuario ha sido desactivado exitosamente.",
        })
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo desactivar el usuario.",
        variant: "destructive",
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setSelectedUserId(null)
    }
  }

  // Función para refrescar la lista de usuarios
  const refreshUsers = async () => {
    try {
      const loadedUsers = await getAllSupabaseUsers()
      setUsers(loadedUsers)
      setIsFormOpen(false)
      setSelectedUserId(null)
    } catch (error) {
      console.error("Error al refrescar usuarios:", error)
    }
  }

  // Asegurarnos de que el componente no intente renderizar datos antes de que estén disponibles
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleCreateUser}>
          <UserPlus className="mr-2 h-4 w-4" />
          Nuevo Usuario
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Cargando usuarios...</div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Correo Electrónico</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha Creación</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.nombre || "Sin nombre"}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(user.rol)}>{user.rol || "Sin rol"}</Badge>
                      <div className="text-xs text-muted-foreground mt-1">{getRoleDescription(user.rol)}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.activo ? "default" : "destructive"}>
                        {user.activo ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.created_at ? new Date(user.created_at).toLocaleDateString() : "-"}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menú</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEditUser(user.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar usuario
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {user.activo ? (
                            <DropdownMenuItem onClick={() => handleToggleUserStatus(user.id, false)}>
                              <UserX className="mr-2 h-4 w-4" />
                              Desactivar usuario
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => handleToggleUserStatus(user.id, true)}>
                              <UserPlus className="mr-2 h-4 w-4" />
                              Activar usuario
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteConfirm(user.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar usuario
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No hay usuarios registrados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Diálogo para el formulario de usuario */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedUserId ? "Editar Usuario" : "Crear Nuevo Usuario"}</DialogTitle>
            <DialogDescription>
              {selectedUserId
                ? "Actualice la información del usuario."
                : "Complete el formulario para crear un nuevo usuario."}
            </DialogDescription>
          </DialogHeader>
          <UserForm
            userId={selectedUserId || undefined}
            onSuccess={refreshUsers}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmación para eliminar usuario */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente el usuario y no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive text-destructive-foreground">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
