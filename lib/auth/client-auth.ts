"use client"

import type { User } from "../db/schema"

// Clave para almacenar la sesión en localStorage
const SESSION_KEY = "gestor_session"
const USER_KEY = "gestor_user"

// Función para iniciar sesión en el cliente
export function clientLogin(token: string, user: User): void {
  try {
    // Guardar el token de sesión
    localStorage.setItem(SESSION_KEY, token)

    // Guardar los datos del usuario
    localStorage.setItem(USER_KEY, JSON.stringify(user))

    // Establecer una cookie para que el middleware pueda verificarla
    document.cookie = `gestor_session=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict`
  } catch (error) {
    console.error("Error al guardar la sesión:", error)
  }
}

// Función para cerrar sesión en el cliente
export function clientLogout(): void {
  try {
    // Eliminar el token de sesión
    localStorage.removeItem(SESSION_KEY)

    // Eliminar los datos del usuario
    localStorage.removeItem(USER_KEY)

    // Eliminar la cookie
    document.cookie = "gestor_session=; path=/; max-age=0; SameSite=Strict"
  } catch (error) {
    console.error("Error al cerrar la sesión:", error)
  }
}

// Función para verificar si hay una sesión activa
export function isAuthenticated(): boolean {
  try {
    return !!localStorage.getItem(SESSION_KEY)
  } catch (error) {
    return false
  }
}

// Función para obtener el usuario actual
export function getCurrentUser(): User | null {
  try {
    const userJson = localStorage.getItem(USER_KEY)
    return userJson ? JSON.parse(userJson) : null
  } catch (error) {
    console.error("Error al obtener el usuario:", error)
    return null
  }
}

// Función para obtener el token de sesión
export function getSessionToken(): string | null {
  try {
    return localStorage.getItem(SESSION_KEY)
  } catch (error) {
    console.error("Error al obtener el token de sesión:", error)
    return null
  }
}
