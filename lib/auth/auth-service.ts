import type { User, Session } from "../db/schema"
import { createClient } from "@/lib/supabase/client"

// Clave para la cookie de sesión
const SESSION_COOKIE_NAME = "gestor_session"

// Clave para almacenar sesiones en localStorage
const SESSIONS_STORAGE_KEY = "gestor_sessions"

// Función para obtener todas las sesiones
function getAllSessions(): Session[] {
  if (typeof window === "undefined") return []

  try {
    const sessionsJson = localStorage.getItem(SESSIONS_STORAGE_KEY)
    return sessionsJson ? JSON.parse(sessionsJson) : []
  } catch (error) {
    console.error("Error al obtener sesiones:", error)
    return []
  }
}

// Función para guardar sesiones
function saveSessions(sessions: Session[]): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions))
  } catch (error) {
    console.error("Error al guardar sesiones:", error)
  }
}

// Función para iniciar sesión
export async function login(
  email: string,
  password: string,
): Promise<{ success: boolean; message: string; user?: User }> {
  try {
    // Usar Supabase para autenticar
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { success: false, message: error.message }
    }

    if (!data.user) {
      return { success: false, message: "No se pudo obtener la información del usuario" }
    }

    // Obtener el rol del usuario desde la tabla usuarios
    const { data: userData, error: userError } = await supabase
      .from("usuarios")
      .select("*")
      .eq("id", data.user.id)
      .single()

    if (userError || !userData) {
      // Si no existe en la tabla usuarios, cerrar sesión
      await supabase.auth.signOut()
      return { success: false, message: "Usuario no encontrado en el sistema" }
    }

    // Verificar si el usuario está activo
    if (!userData.activo) {
      await supabase.auth.signOut()
      return { success: false, message: "Usuario inactivo" }
    }

    // Crear un objeto de usuario con los datos de Supabase
    const user: User = {
      id: data.user.id,
      email: data.user.email || "",
      name: userData.nombre || data.user.email?.split("@")[0] || "",
      role: userData.rol,
      isActive: userData.activo,
      createdAt: new Date(data.user.created_at),
      updatedAt: new Date(),
    }

    return { success: true, message: "Inicio de sesión exitoso", user }
  } catch (error) {
    console.error("Error en login:", error)
    return { success: false, message: "Error al iniciar sesión" }
  }
}

// Función para cerrar sesión
export async function logout(): Promise<void> {
  try {
    const supabase = createClient()
    await supabase.auth.signOut()
  } catch (error) {
    console.error("Error al cerrar sesión:", error)
  }
}

// Función para obtener el usuario actual
export async function getCurrentUser(): Promise<User | null> {
  try {
    const supabase = createClient()
    const { data } = await supabase.auth.getUser()

    if (!data.user) {
      return null
    }

    // Obtener datos adicionales del usuario desde la tabla usuarios
    const { data: userData, error } = await supabase.from("usuarios").select("*").eq("id", data.user.id).single()

    if (error || !userData) {
      return null
    }

    // Crear un objeto de usuario con los datos de Supabase
    const user: User = {
      id: data.user.id,
      email: data.user.email || "",
      name: userData.nombre || data.user.email?.split("@")[0] || "",
      role: userData.rol,
      isActive: userData.activo,
      createdAt: new Date(data.user.created_at),
      updatedAt: new Date(),
    }

    return user
  } catch (error) {
    console.error("Error al obtener usuario actual:", error)
    return null
  }
}

// Función para generar un token aleatorio
function generateToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}
