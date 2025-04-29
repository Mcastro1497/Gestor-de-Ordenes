// Esquema de la base de datos para usuarios, roles y permisos

// Añadir estas definiciones de roles y permisos al archivo

// Roles de usuario
export enum UserRole {
  ADMIN = "admin",
  COMERCIAL = "comercial",
  OPERADOR = "trader",
}

// Permisos disponibles en el sistema
export enum Permission {
  // Dashboard
  VIEW_DASHBOARD = "view_dashboard",

  // Órdenes
  CREATE_ORDER = "create_order",
  EDIT_ORDER = "edit_order",
  VIEW_ORDER = "view_order",

  // Trading
  VIEW_TRADING = "view_trading",
  EXECUTE_ORDER = "execute_order",

  // Configuración
  VIEW_CONFIG = "view_config",
  IMPORT_CLIENTS = "import_clients",
  IMPORT_ASSETS = "import_assets",

  // Administración
  MANAGE_USERS = "manage_users",
  ASSIGN_ROLES = "assign_roles",
}

// Tipo para la tabla de roles
export interface Role {
  id: string
  name: UserRole
  description: string
  permissions: Permission[]
}

// Actualizar la interfaz User para incluir el rol
export interface User {
  id: string
  email: string
  name: string
  password?: string
  role: UserRole
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Session {
  id: string
  userId: string
  token: string
  expiresAt: Date
  createdAt: Date
}
