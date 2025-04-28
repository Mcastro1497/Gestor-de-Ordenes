import { toast } from "sonner"
import type { PostgrestError } from "@supabase/supabase-js"

// Función para manejar errores de forma consistente
export function handleError(error: unknown, fallbackMessage = "Ha ocurrido un error") {
  console.error("Error:", error)

  if (typeof error === "string") {
    toast.error(error)
    return
  }

  if (error && typeof error === "object" && "message" in error && typeof error.message === "string") {
    toast.error(error.message)
    return
  }

  // Manejar errores específicos de Supabase
  if (isPostgrestError(error)) {
    toast.error(`Error de base de datos: ${error.message}`)
    return
  }

  toast.error(fallbackMessage)
}

// Type guard para errores de Supabase
function isPostgrestError(error: unknown): error is PostgrestError {
  return error !== null && typeof error === "object" && "code" in error && "message" in error && "details" in error
}

// Función para manejar errores en formularios
export function handleFormError(error: unknown, setError?: (field: string, error: { message: string }) => void) {
  handleError(error)

  // Si hay una función setError (de react-hook-form), establecer error general
  if (setError) {
    setError("root", { message: "Error al procesar el formulario" })
  }
}
