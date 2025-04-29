"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RolePermissionsTable } from "./role-permissions-table"
import { UserRole, Permission } from "@/lib/db/schema"
import { getPermissionsForRole } from "@/lib/services/permission-service"
import { Badge } from "@/components/ui/badge"
import { CheckCircle } from "lucide-react"

export function RolePermissionsInfo() {
  // Definir los roles y sus descripciones
  const roles = [
    { role: UserRole.COMERCIAL, label: "Comercial", description: "Comercial/AP - Gestiona clientes y crea órdenes" },
    { role: UserRole.OPERADOR, label: "Operador", description: "Operador - Ejecuta órdenes en la mesa de trading" },
    {
      role: UserRole.CONTROLADOR,
      label: "Controlador",
      description: "Controlador - Supervisa operaciones y verifica cumplimiento",
    },
    { role: UserRole.ADMIN, label: "Administrador", description: "Administrador - Acceso completo al sistema" },
  ]

  // Mapeo de permisos a descripciones más detalladas
  const permissionDescriptions: Record<Permission, string> = {
    [Permission.VIEW_DASHBOARD]: "Acceso para ver el dashboard principal con estadísticas y órdenes recientes",
    [Permission.CREATE_ORDER]: "Capacidad para crear nuevas órdenes en el sistema",
    [Permission.EDIT_ORDER]: "Capacidad para modificar órdenes existentes",
    [Permission.DELETE_ORDER]: "Capacidad para eliminar órdenes del sistema",
    [Permission.EXECUTE_ORDER]: "Capacidad para marcar órdenes como ejecutadas y registrar detalles de ejecución",
    [Permission.VIEW_TRADING]: "Acceso a la vista de trading con órdenes en tiempo real",
    [Permission.VIEW_CONFIG]: "Acceso a la configuración del sistema",
    [Permission.IMPORT_ASSETS]: "Capacidad para importar y gestionar activos financieros",
    [Permission.IMPORT_CLIENTS]: "Capacidad para importar y gestionar clientes",
    [Permission.MANAGE_USERS]: "Capacidad para gestionar usuarios y sus roles",
  }

  // Obtener el color de la insignia según el rol
  const getRoleBadgeVariant = (role: UserRole) => {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Roles y Permisos</CardTitle>
        <CardDescription>Información detallada sobre los roles del sistema y sus permisos asociados</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="table">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="table">Tabla de Permisos</TabsTrigger>
            <TabsTrigger value="details">Detalles por Rol</TabsTrigger>
          </TabsList>
          <TabsContent value="table" className="pt-4">
            <RolePermissionsTable />
          </TabsContent>
          <TabsContent value="details" className="pt-4">
            <div className="grid gap-4">
              {roles.map((r) => {
                const rolePermissions = getPermissionsForRole(r.role)

                return (
                  <Card key={r.role}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          <Badge variant={getRoleBadgeVariant(r.role)} className="mr-2">
                            {r.label}
                          </Badge>
                        </CardTitle>
                      </div>
                      <CardDescription>{r.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <h4 className="text-sm font-medium mb-2">Permisos asignados:</h4>
                      <ul className="grid gap-2">
                        {rolePermissions.map((permission) => (
                          <li key={permission} className="flex items-start">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                            <div>
                              <span className="font-medium text-sm">
                                {permission
                                  .split("_")
                                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                                  .join(" ")}
                              </span>
                              <p className="text-xs text-muted-foreground">{permissionDescriptions[permission]}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
