import { format, formatDistance, formatRelative, isToday, isYesterday } from "date-fns"
import { es } from "date-fns/locale"

// Formatear fecha en formato legible con manejo de errores
export function formatDate(date: string | Date | null | undefined, formatStr = "dd/MM/yyyy"): string {
  try {
    if (!date) return "Fecha no disponible"

    const dateObj = typeof date === "string" ? new Date(date) : date

    // Verificar si la fecha es válida
    if (isNaN(dateObj.getTime())) {
      return "Fecha inválida"
    }

    return format(dateObj, formatStr, { locale: es })
  } catch (error) {
    console.error("Error al formatear fecha:", error)
    return "Error de formato"
  }
}

// Formatear fecha y hora con manejo de errores
export function formatDateTime(date: string | Date | null | undefined): string {
  try {
    if (!date) return "Fecha no disponible"

    const dateObj = typeof date === "string" ? new Date(date) : date

    // Verificar si la fecha es válida
    if (isNaN(dateObj.getTime())) {
      return "Fecha inválida"
    }

    return format(dateObj, "dd/MM/yyyy HH:mm", { locale: es })
  } catch (error) {
    console.error("Error al formatear fecha y hora:", error)
    return "Error de formato"
  }
}

// Formatear fecha relativa (hace X tiempo) con manejo de errores
export function formatRelativeTime(date: string | Date | null | undefined): string {
  try {
    if (!date) return "Fecha no disponible"

    const dateObj = typeof date === "string" ? new Date(date) : date

    // Verificar si la fecha es válida
    if (isNaN(dateObj.getTime())) {
      return "Fecha inválida"
    }

    if (isToday(dateObj)) {
      return `Hoy, ${format(dateObj, "HH:mm", { locale: es })}`
    }

    if (isYesterday(dateObj)) {
      return `Ayer, ${format(dateObj, "HH:mm", { locale: es })}`
    }

    return formatRelative(dateObj, new Date(), { locale: es })
  } catch (error) {
    console.error("Error al formatear tiempo relativo:", error)
    return "Error de formato"
  }
}

// Formatear tiempo transcurrido (hace 5 minutos, etc.) con manejo de errores
export function formatTimeAgo(date: string | Date | null | undefined): string {
  try {
    if (!date) return "Fecha no disponible"

    const dateObj = typeof date === "string" ? new Date(date) : date

    // Verificar si la fecha es válida
    if (isNaN(dateObj.getTime())) {
      return "Fecha inválida"
    }

    return formatDistance(dateObj, new Date(), { addSuffix: true, locale: es })
  } catch (error) {
    console.error("Error al formatear tiempo transcurrido:", error)
    return "Error de formato"
  }
}
