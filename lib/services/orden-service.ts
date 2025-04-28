"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getOrdenes() {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("ordenes").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error al obtener órdenes:", error)
    return []
  }

  return data
}

export async function getOrdenById(id: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("ordenes").select("*").eq("id", id).single()

  if (error) {
    console.error("Error al obtener orden:", error)
    return null
  }

  return data
}

export async function createOrden(formData: FormData) {
  const supabase = createServerClient()

  try {
    const clienteId = formData.get("cliente_id") as string
    const observaciones = formData.get("observaciones") as string

    // Obtener todos los tipos, descripciones y valores
    const tipos = formData.getAll("tipo") as string[]
    const descripciones = formData.getAll("descripcion") as string[]
    const valores = formData.getAll("valor") as string[]

    // Crear un array de activos
    const activos = tipos.map((tipo, index) => ({
      tipo,
      descripcion: descripciones[index],
      valor: valores[index],
    }))

    // Insertar la orden en la base de datos
    const { data, error } = await supabase
      .from("ordenes")
      .insert([
        {
          cliente_id: clienteId,
          observaciones,
          activos,
          estado: "pendiente",
        },
      ])
      .select()

    if (error) {
      console.error("Error al crear orden:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/ordenes")
    return { success: true, data }
  } catch (error) {
    console.error("Error al crear orden:", error)
    return { success: false, error: "Error al procesar la solicitud" }
  }
}

export async function updateOrden(id: string, formData: FormData) {
  const supabase = createServerClient()

  const clienteId = formData.get("cliente_id") as string
  const observaciones = formData.get("observaciones") as string
  const estado = formData.get("estado") as string

  const { data, error } = await supabase
    .from("ordenes")
    .update({ cliente_id: clienteId, observaciones, estado })
    .eq("id", id)
    .select()

  if (error) {
    console.error("Error al actualizar orden:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/ordenes")
  revalidatePath(`/ordenes/${id}`)
  return { success: true, data }
}

export async function deleteOrden(id: string) {
  const supabase = createServerClient()

  const { error } = await supabase.from("ordenes").delete().eq("id", id)

  if (error) {
    console.error("Error al eliminar orden:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/ordenes")
  return { success: true }
}
