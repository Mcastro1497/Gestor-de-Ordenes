"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import type { AuthError, Provider } from "@supabase/supabase-js"
import { toast } from "sonner"

export function useAuth() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()
  const [error, setError] = useState<AuthError | null>(null)

  useEffect(() => {
    async function getUser() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
          setUser(session.user)

          // Obtener el rol del usuario desde la tabla usuarios
          const { data: userData, error } = await supabase
            .from("usuarios")
            .select("rol")
            .eq("id", session.user.id)
            .single()

          if (!error && userData) {
            console.log("Rol del usuario obtenido:", userData.rol)
            setUserRole(userData.rol)
          } else {
            console.error("Error al obtener rol:", error)
            setUserRole(null)
          }
        } else {
          setUser(null)
          setUserRole(null)
        }
      } catch (error) {
        console.error("Error en getUser:", error)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user)
        // Obtener el rol al cambiar el estado de autenticación
        supabase
          .from("usuarios")
          .select("rol")
          .eq("id", session.user.id)
          .single()
          .then(({ data, error }) => {
            if (!error && data) {
              setUserRole(data.rol)
            }
          })
      } else {
        setUser(null)
        setUserRole(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router])

  // Asegúrate de que la función signIn redirija correctamente después de iniciar sesión
  const signIn = useCallback(
    async (email: string, password: string) => {
      setLoading(true)
      setError(null)

      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          setError(error)
          toast.error("Error al iniciar sesión: " + error.message)
          return { user: null, error }
        }

        setUser(data.user)
        toast.success("Sesión iniciada correctamente")
        return { user: data.user, error: null }
      } catch (err) {
        console.error("Error signing in:", err)
        setError(err as AuthError)
        toast.error("Error al iniciar sesión")
        return { user: null, error: err as AuthError }
      } finally {
        setLoading(false)
      }
    },
    [supabase],
  )

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

  const signOut = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signOut()

      if (error) {
        setError(error)
        toast.error("Error al cerrar sesión: " + error.message)
        return { error }
      }

      setUser(null)
      toast.success("Sesión cerrada correctamente")
      return { error: null }
    } catch (err) {
      console.error("Error signing out:", err)
      setError(err as AuthError)
      toast.error("Error al cerrar sesión")
      return { error: err as AuthError }
    } finally {
      setLoading(false)
    }
  }, [supabase])

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
    loading,
    error,
    signIn,
    signInWithProvider,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    isAuthenticated: !!user,
    userRole,
  }
}
