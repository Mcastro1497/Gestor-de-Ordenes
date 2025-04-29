"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import type { AuthError, Provider, User } from "@supabase/supabase-js"
import { toast } from "sonner"

// Crear una instancia del cliente de Supabase
const supabase = createClient()

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<AuthError | null>(null)
  const router = useRouter()

  // Función para obtener el rol del usuario
  const fetchUserRole = useCallback(async (userId: string) => {
    try {
      console.log("Obteniendo rol para el usuario:", userId)
      const { data, error } = await supabase.from("usuarios").select("rol").eq("id", userId).single()

      if (error) {
        console.error("Error al obtener rol:", error)
        return null
      }

      console.log("Rol obtenido:", data?.rol)
      return data?.rol || null
    } catch (err) {
      console.error("Error en fetchUserRole:", err)
      return null
    }
  }, [])

  // Efecto para obtener y mantener la sesión del usuario
  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true)

        // Obtener la sesión actual
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
          console.log("Sesión encontrada:", session.user.email)
          setUser(session.user)

          // Obtener el rol del usuario
          const role = await fetchUserRole(session.user.id)
          setUserRole(role)
          console.log("Rol establecido:", role)
        } else {
          console.log("No hay sesión activa")
          setUser(null)
          setUserRole(null)
        }
      } catch (err) {
        console.error("Error al obtener usuario:", err)
        setError(err as AuthError)
      } finally {
        setLoading(false)
      }
    }

    // Obtener el usuario al montar el componente
    getUser()

    // Suscribirse a cambios en la autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Evento de autenticación:", event)

      if (session?.user) {
        console.log("Usuario autenticado:", session.user.email)
        setUser(session.user)

        // Obtener el rol del usuario
        const role = await fetchUserRole(session.user.id)
        setUserRole(role)
        console.log("Rol establecido:", role)
      } else {
        console.log("Usuario no autenticado")
        setUser(null)
        setUserRole(null)
      }

      setLoading(false)
    })

    // Limpiar la suscripción al desmontar
    return () => {
      subscription.unsubscribe()
    }
  }, [fetchUserRole])

  // Función para iniciar sesión
  const signIn = useCallback(
    async (email: string, password: string) => {
      setLoading(true)
      setError(null)

      try {
        console.log("Iniciando sesión con:", email)
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          console.error("Error al iniciar sesión:", error.message)
          setError(error)
          toast.error("Error al iniciar sesión: " + error.message)
          return { user: null, error }
        }

        console.log("Sesión iniciada correctamente")
        setUser(data.user)

        // Obtener el rol del usuario
        if (data.user) {
          const role = await fetchUserRole(data.user.id)
          setUserRole(role)
          console.log("Rol establecido:", role)
        }

        toast.success("Sesión iniciada correctamente")
        router.push("/dashboard")
        return { user: data.user, error: null }
      } catch (err) {
        console.error("Error en signIn:", err)
        setError(err as AuthError)
        toast.error("Error al iniciar sesión")
        return { user: null, error: err as AuthError }
      } finally {
        setLoading(false)
      }
    },
    [fetchUserRole, router],
  )

  // Función para cerrar sesión
  const signOut = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      console.log("Cerrando sesión")
      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error("Error al cerrar sesión:", error.message)
        setError(error)
        toast.error("Error al cerrar sesión: " + error.message)
        return { error }
      }

      console.log("Sesión cerrada correctamente")
      setUser(null)
      setUserRole(null)
      toast.success("Sesión cerrada correctamente")
      router.push("/login")
      return { error: null }
    } catch (err) {
      console.error("Error en signOut:", err)
      setError(err as AuthError)
      toast.error("Error al cerrar sesión")
      return { error: err as AuthError }
    } finally {
      setLoading(false)
    }
  }, [router])

  const signInWithProvider = useCallback(
    async (provider: Provider) => {
      setLoading(true)
      setError(null)

      try {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
          },
        })

        if (error) {
          setError(error)
          toast.error("Error al iniciar sesión con " + provider)
          return { data: null, error }
        }

        return { data, error: null }
      } catch (err) {
        console.error(`Error signing in with ${provider}:`, err)
        setError(err as AuthError)
        toast.error("Error al iniciar sesión con proveedor externo")
        return { data: null, error: err as AuthError }
      } finally {
        setLoading(false)
      }
    },
    [supabase],
  )

  const signUp = useCallback(
    async (email: string, password: string) => {
      setLoading(true)
      setError(null)

      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })

        if (error) {
          setError(error)
          toast.error("Error al registrarse: " + error.message)
          return { user: null, error }
        }

        toast.success("Registro exitoso. Por favor, verifica tu correo electrónico para confirmar tu cuenta.")
        return { user: data.user, error: null }
      } catch (err) {
        console.error("Error signing up:", err)
        setError(err as AuthError)
        toast.error("Error al registrarse")
        return { user: null, error: err as AuthError }
      } finally {
        setLoading(false)
      }
    },
    [supabase],
  )

  const resetPassword = useCallback(
    async (email: string) => {
      setLoading(true)
      setError(null)

      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        })

        if (error) {
          setError(error)
          toast.error("Error al enviar el correo de recuperación: " + error.message)
          return { error }
        }

        toast.success("Se ha enviado un correo de recuperación a tu dirección de email")
        return { error: null }
      } catch (err) {
        console.error("Error resetting password:", err)
        setError(err as AuthError)
        toast.error("Error al solicitar recuperación de contraseña")
        return { error: err as AuthError }
      } finally {
        setLoading(false)
      }
    },
    [supabase],
  )

  const updatePassword = useCallback(
    async (password: string) => {
      setLoading(true)
      setError(null)

      try {
        const { error } = await supabase.auth.updateUser({
          password,
        })

        if (error) {
          setError(error)
          toast.error("Error al actualizar la contraseña: " + error.message)
          return { error }
        }

        toast.success("Contraseña actualizada correctamente")
        return { error: null }
      } catch (err) {
        console.error("Error updating password:", err)
        setError(err as AuthError)
        toast.error("Error al actualizar la contraseña")
        return { error: err as AuthError }
      } finally {
        setLoading(false)
      }
    },
    [supabase],
  )

  return {
    user,
    userRole,
    loading,
    error,
    signIn,
    signOut,
    isAuthenticated: !!user,
  }
}
