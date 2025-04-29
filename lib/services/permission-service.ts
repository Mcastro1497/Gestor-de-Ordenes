import { UserRole, Permission } from "../db/schema"

// Mapeo de roles a permisos según la tabla proporcionada
const rolePermissionsMap: Record<UserRole, Permission[]> = {
  [UserRole.COMERCIAL]: [
    Permission.VIEW_DASHBOARD,
    Permission.CREATE_ORDER,
    Permission.EDIT_ORDER,
    Permission.VIEW_CONFIG,
    Permission.IMPORT_CLIENTS,
  ],
  [UserRole.OPERADOR]: [
    Permission.EXECUTE_ORDER,
    Permission.VIEW_TRADING,
    Permission.VIEW_CONFIG,
    Permission.IMPORT_ASSETS,
  ],
  [UserRole.CONTROLADOR]: [Permission.VIEW_DASHBOARD, Permission.VIEW_TRADING, Permission.VIEW_CONFIG],
  [UserRole.ADMIN]: [
    Permission.VIEW_DASHBOARD,
    Permission.CREATE_ORDER,
    Permission.EDIT_ORDER,
    Permission.DELETE_ORDER,
    Permission.EXECUTE_ORDER,
    Permission.VIEW_TRADING,
    Permission.VIEW_CONFIG,
    Permission.IMPORT_ASSETS,
    Permission.IMPORT_CLIENTS,
    Permission.MANAGE_USERS,
  ],
}

/**
 * Verifica si un rol tiene un permiso específico
 * @param role Rol del usuario
 * @param permission Permiso a verificar
 * @returns true si el rol tiene el permiso, false en caso contrario
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  return rolePermissionsMap[role]?.includes(permission) || false
}

/**
 * Obtiene todos los permisos asociados a un rol
 * @param role Rol del usuario
 * @returns Array de permisos
 */
export function getPermissionsForRole(role: UserRole): Permission[] {
  return rolePermissionsMap[role] || []
}

/**
 * Verifica si un usuario tiene acceso a una ruta específica
 * @param role Rol del usuario
 * @param path Ruta a verificar
 * @returns true si el usuario tiene acceso, false en caso contrario
 */
export function canAccessRoute(role: UserRole, path: string): boolean {
  // Rutas que requieren permisos específicos
  const routePermissions: Record<string, Permission> = {
    "/dashboard": Permission.VIEW_DASHBOARD,
    "/orders/create": Permission.CREATE_ORDER,
    "/orders": Permission.VIEW_DASHBOARD,
    "/trading": Permission.VIEW_TRADING,
    "/config": Permission.VIEW_CONFIG,
    "/admin": Permission.MANAGE_USERS,
  }

  // Si la ruta no está en el mapa, permitir acceso por defecto
  if (!Object.keys(routePermissions).some((route) => path.startsWith(route))) {
    return true
  }

  // Verificar cada ruta que coincida con el inicio del path
  for (const [route, permission] of Object.entries(routePermissions)) {
    if (path.startsWith(route)) {
      return hasPermission(role, permission)
    }
  }

  return false
}
