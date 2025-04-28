import { format, formatDistance, formatRelative, isToday, isYesterday } from "date-fns"
import { es } from "date-fns/locale"

// Formatear fecha en formato legible
export function formatDate(date: string | Date, formatStr = "dd/MM/yyyy"): string {
  const dateObj = typeof date === "string" ? new Date(date) : date
  return format(dateObj, formatStr, { locale: es })
}

// Formatear fecha y hora
export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date
  return format(dateObj, "dd/MM/yyyy HH:mm", { locale: es })
}

// Formatear fecha relativa (hace X tiempo)
export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date

  if (isToday(dateObj)) {
    return `Hoy, ${format(dateObj, "HH:mm", { locale: es })}`
  }

  if (isYesterday(dateObj)) {
    return `Ayer, ${format(dateObj, "HH:mm", { locale: es })}`
  }

  return formatRelative(dateObj, new Date(), { locale: es })
}

// Formatear tiempo transcurrido (hace 5 minutos, etc.)
export function formatTimeAgo(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date
  return formatDistance(dateObj, new Date(), { addSuffix: true, locale: es })
}
