// Definir los roles disponibles en el sistema
export enum UserRole {
  ADMIN = "admin",
  COMERCIAL = "comercial",
  OPERADOR = "trader",
}

// Definir los permisos disponibles en el sistema
export enum Permission {
  VIEW_DASHBOARD = "view_dashboard",
  VIEW_ORDER = "view_order",
  CREATE_ORDER = "create_order",
  EDIT_ORDER = "edit_order",
  VIEW_TRADING = "view_trading",
  EXECUTE_ORDER = "execute_order",
  VIEW_CONFIG = "view_config",
  IMPORT_CLIENTS = "import_clients",
  IMPORT_ASSETS = "import_assets",
  MANAGE_USERS = "manage_users",
}
