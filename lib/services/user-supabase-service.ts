"use client"

import { createClient } from "@/lib/supabase/client"
import type { UserRole } from "@/lib/db/schema"

// Interfaz para el usuario de Supabase
interface SupabaseUser {
  id: string
  email: string
  nombre?: string
  rol?: UserRole
  activo?: boolean
  created_at?: string
  updated_at?: string
}

/**
 * Obtiene todos los usuarios desde Supabase
 * @returns Lista de usuarios
 */
export async function getAllSupabaseUsers() {
  try {
    const supabase = createClient()
    const { data, error } = await supabase.from("usuarios").select("*").order("created_at", { ascending: false })

    if (error) {
      throw error
    }

    return data || []
  } catch (error) {
    console.error("Error al obtener usuarios:", error)
    return []
  }
}

/**
 * Obtiene un usuario por su ID
 * @param id ID del usuario
 * @returns Usuario o null si no existe
 */
export async function getSupabaseUserById(id: string) {
  try {
    const supabase = createClient()
    const { data, error } = await supabase.from("usuarios").select("*").eq("id", id).single()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error(`Error al obtener usuario ${id}:`, error)
    return null
  }
}

/**
 * Actualiza el rol de un usuario
 * @param id ID del usuario
 * @param role Nuevo rol
 * @returns Resultado de la operación
 */
export async function updateUserRole(id: string, role: UserRole) {
  try {
    const supabase = createClient()
    const { data, error } = await supabase.from("usuarios").update({ rol: role }).eq("id", id)

    if (error) {
      throw error
    }

    return { success: true, message: "Rol actualizado correctamente" }
  } catch (error) {
    console.error(`Error al actualizar rol del usuario ${id}:`, error)
    return { success: false, error: "Error al actualizar el rol del usuario" }
  }
}

/**
 * Activa o desactiva un usuario
 * @param id ID del usuario
 * @param isActive Estado de activación
 * @returns Resultado de la operación
 */
export async function toggleUserActive(id: string, isActive: boolean) {
  try {
    const supabase = createClient()
    const { data, error } = await supabase.from("usuarios").update({ activo: isActive }).eq("id", id)

    if (error) {
      throw error
    }

    return { success: true, message: `Usuario ${isActive ? "activado" : "desactivado"} correctamente` }
  } catch (error) {
    console.error(`Error al ${isActive ? "activar" : "desactivar"} usuario ${id}:`, error)
    return { success: false, error: `Error al ${isActive ? "activar" : "desactivar"} el usuario` }
  }
}
