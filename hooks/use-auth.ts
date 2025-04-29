"use client"

import { useEffect, useState, useCallback } from "react"
import { useSupabase } from "./use-supabase"
import type { User, AuthError, Provider } from "@supabase/supabase-js"
import { toast } from "sonner"

export function useAuth() {
  const { supabase } = useSupabase()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<AuthError | null>(null)

  // Fetch the user on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true)
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser()

        if (error) {
          setError(error)
        } else {
          setUser(user)
        }
      } catch (err) {
        console.error("Error fetching user:", err)
        setError(err as AuthError)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

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
  }
}
