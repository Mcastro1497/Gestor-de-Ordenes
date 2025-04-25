// Estados de órdenes
export const ESTADOS_ORDEN = {
  PENDIENTE: "pendiente",
  EN_PROCESO: "en_proceso",
  COMPLETADA: "completada",
  CANCELADA: "cancelada",
  RECHAZADA: "rechazada",
} as const

export type EstadoOrden = (typeof ESTADOS_ORDEN)[keyof typeof ESTADOS_ORDEN]

// Colores para estados
export const COLORES_ESTADO: Record<EstadoOrden, string> = {
  pendiente: "bg-yellow-100 text-yellow-800 border-yellow-200",
  en_proceso: "bg-blue-100 text-blue-800 border-blue-200",
  completada: "bg-green-100 text-green-800 border-green-200",
  cancelada: "bg-red-100 text-red-800 border-red-200",
  rechazada: "bg-gray-100 text-gray-800 border-gray-200",
}

// Tipos de activos
export const TIPOS_ACTIVO = {
  ACCION: "accion",
  BONO: "bono",
  FONDO: "fondo",
  MONEDA: "moneda",
  OTRO: "otro",
} as const

export type TipoActivo = (typeof TIPOS_ACTIVO)[keyof typeof TIPOS_ACTIVO]

// Roles de usuario
export const ROLES_USUARIO = {
  ADMIN: "admin",
  TRADER: "trader",
  OPERADOR: "operador",
  CLIENTE: "cliente",
} as const

export type RolUsuario = (typeof ROLES_USUARIO)[keyof typeof ROLES_USUARIO]

// Configuración de paginación
export const ITEMS_POR_PAGINA = 10
export const OPCIONES_PAGINACION = [5, 10, 25, 50, 100]

// Rutas de navegación
export const RUTAS_NAVEGACION = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "LayoutDashboard",
    roles: [ROLES_USUARIO.ADMIN, ROLES_USUARIO.TRADER, ROLES_USUARIO.OPERADOR],
  },
  {
    title: "Órdenes",
    href: "/ordenes",
    icon: "FileText",
    roles: [ROLES_USUARIO.ADMIN, ROLES_USUARIO.TRADER, ROLES_USUARIO.OPERADOR],
  },
  {
    title: "Trading",
    href: "/trading",
    icon: "TrendingUp",
    roles: [ROLES_USUARIO.ADMIN, ROLES_USUARIO.TRADER],
  },
  {
    title: "Configuración",
    href: "/config",
    icon: "Settings",
    roles: [ROLES_USUARIO.ADMIN],
  },
  {
    title: "Administración",
    href: "/admin",
    icon: "Shield",
    roles: [ROLES_USUARIO.ADMIN],
  },
]
