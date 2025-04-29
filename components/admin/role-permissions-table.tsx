"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Check, X } from "lucide-react"
import { UserRole, Permission } from "@/lib/db/schema"
import { getPermissionsForRole } from "@/lib/services/permission-service"

export function RolePermissionsTable() {
  // Todos los roles disponibles
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

  // Todos los permisos disponibles
  const permissions = [
    { permission: Permission.VIEW_DASHBOARD, label: "Ver Dashboard" },
    { permission: Permission.CREATE_ORDER, label: "Crear Orden" },
    { permission: Permission.EDIT_ORDER, label: "Editar Orden" },
    { permission: Permission.DELETE_ORDER, label: "Eliminar Orden" },
    { permission: Permission.EXECUTE_ORDER, label: "Ejecutar Orden" },
    { permission: Permission.VIEW_TRADING, label: "Ver Trading" },
    { permission: Permission.VIEW_CONFIG, label: "Ver Configuración" },
    { permission: Permission.IMPORT_ASSETS, label: "Importar Activos" },
    { permission: Permission.IMPORT_CLIENTS, label: "Importar Clientes" },
    { permission: Permission.MANAGE_USERS, label: "Gestionar Usuarios" },
  ]

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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Rol</TableHead>
            <TableHead className="w-[250px]">Descripción</TableHead>
            {permissions.map((p) => (
              <TableHead key={p.permission} className="text-center whitespace-nowrap">
                {p.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.map((r) => {
            const rolePermissions = getPermissionsForRole(r.role)

            return (
              <TableRow key={r.role}>
                <TableCell>
                  <Badge variant={getRoleBadgeVariant(r.role)}>{r.label}</Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{r.description}</TableCell>
                {permissions.map((p) => (
                  <TableCell key={`${r.role}-${p.permission}`} className="text-center">
                    {rolePermissions.includes(p.permission) ? (
                      <Check className="h-4 w-4 text-green-500 mx-auto" />
                    ) : (
                      <X className="h-4 w-4 text-red-500 mx-auto" />
                    )}
                  </TableCell>
                ))}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
