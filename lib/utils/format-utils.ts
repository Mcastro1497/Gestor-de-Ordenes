// Formatear número como moneda
export function formatCurrency(value: number, currency = "ARS"): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(value)
}

// Formatear número con separadores de miles
export function formatNumber(value: number, decimals = 2): string {
  return new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

// Formatear porcentaje
export function formatPercent(value: number, decimals = 2): string {
  return new Intl.NumberFormat("es-AR", {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100)
}

// Truncar texto largo
export function truncateText(text: string, maxLength = 50): string {
  if (!text) return ""
  if (text.length <= maxLength) return text

  return `${text.substring(0, maxLength)}...`
}

// Formatear nombre completo
export function formatFullName(firstName?: string, lastName?: string): string {
  if (!firstName && !lastName) return ""
  if (!firstName) return lastName || ""
  if (!lastName) return firstName

  return `${firstName} ${lastName}`
}
