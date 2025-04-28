import { z } from "zod"

// Esquemas de validación reutilizables
export const idSchema = z.string().uuid()

export const emailSchema = z.string().min(1, "El email es requerido").email("Email inválido")

export const passwordSchema = z
  .string()
  .min(8, "La contraseña debe tener al menos 8 caracteres")
  .regex(/[A-Z]/, "La contraseña debe tener al menos una letra mayúscula")
  .regex(/[a-z]/, "La contraseña debe tener al menos una letra minúscula")
  .regex(/[0-9]/, "La contraseña debe tener al menos un número")

export const clienteSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  email: emailSchema.optional().nullable(),
  telefono: z.string().optional().nullable(),
  ID: z.string().optional().nullable(),
})

export const ordenSchema = z.object({
  cliente_id: idSchema,
  estado: z.string().min(1, "El estado es requerido"),
  observaciones: z.string().optional().nullable(),
})

export const activoSchema = z.object({
  orden_id: idSchema,
  tipo: z.string().min(1, "El tipo es requerido"),
  descripcion: z.string().optional().nullable(),
  valor: z.number().optional().nullable(),
})

// Función para validar datos
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): { data: T; success: true } | { error: z.ZodError; success: false } {
  const result = schema.safeParse(data)

  if (result.success) {
    return { data: result.data, success: true }
  }

  return { error: result.error, success: false }
}
