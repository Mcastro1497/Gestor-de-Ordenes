"use client"

import { useEffect, useState } from "react"
import { useSupabase } from "./use-supabase"
import type { User } from "@supabase/supabase-js"
import type { AuthError, Provider } from "@supabase/supabase-js"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function useAuth() {
  const { supabase } = useSupabase()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Verificar si hay una sesión activa al cargar el componente
    const checkSession = async () => {
      try {
        setLoading(true)

        // Obtener la sesión actual
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) {
          throw sessionError
        }

        // Actualizar el estado con el usuario de la sesión
        setUser(session?.user || null)

        // Configurar el listener para cambios en la autenticación
        const {
          data: { subscription },
        } = await supabase.auth.onAuthStateChange((_event, session) => {
          setUser(session?.user || null)
        })

        return () => {
          subscription.unsubscribe()
        }
      } catch (err) {
        console.error("Error al verificar la sesión:", err)
        setError(err instanceof Error ? err : new Error("Error desconocido"))
      } finally {
        setLoading(false)
      }
    }

    checkSession()
  }, [supabase])

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    setError(null)

    try {
      console.log("Attempting to sign in with:", email)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Sign in error:", error)
        setError(error)
        toast.error("Error al iniciar sesión: " + error.message)
        return { user: null, error }
      }

      console.log("Sign in successful:", data.user)
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
  }

  const signInWithProvider = async (provider: Provider) => {
    setLoading(true)
    setError(null)

    try {
      console.log(`Attempting to sign in with provider: ${provider}`)
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        console.error(`Sign in with ${provider} error:`, error)
        setError(error)
        toast.error("Error al iniciar sesión con " + provider)
        return { data: null, error }
      }

      console.log(`Sign in with ${provider} initiated:`, data)
      return { data, error: null }
    } catch (err) {
      console.error(`Error signing in with ${provider}:`, err)
      setError(err as AuthError)
      toast.error("Error al iniciar sesión con proveedor externo")
      return { data: null, error: err as AuthError }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string) => {
    setLoading(true)
    setError(null)

    try {
      console.log("Attempting to sign up with:", email)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        console.error("Sign up error:", error)
        setError(error)
        toast.error("Error al registrarse: " + error.message)
        return { user: null, error }
      }

      console.log("Sign up result:", data)

      // Check if email confirmation is required
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        toast.error("Este correo ya está registrado. Por favor, inicia sesión o recupera tu contraseña.")
        return { user: null, error: { message: "Email already registered" } as AuthError }
      }

      if (data.user && !data.session) {
        toast.success("Registro exitoso. Por favor, verifica tu correo electrónico para confirmar tu cuenta.")
      } else if (data.user && data.session) {
        setUser(data.user)
        toast.success("Registro exitoso. Has iniciado sesión automáticamente.")
      }

      return { user: data.user, error: null }
    } catch (err) {
      console.error("Error signing up:", err)
      setError(err as AuthError)
      toast.error("Error al registrarse")
      return { user: null, error: err as AuthError }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    setError(null)

    try {
      console.log("Attempting to sign out")
      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error("Sign out error:", error)
        setError(error)
        toast.error("Error al cerrar sesión: " + error.message)
        return { error }
      }

      console.log("Sign out successful")
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
  }

  const resetPassword = async (email: string) => {
    setLoading(true)
    setError(null)

    try {
      console.log("Attempting to reset password for:", email)
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) {
        console.error("Reset password error:", error)
        setError(error)
        toast.error("Error al enviar el correo de recuperación: " + error.message)
        return { error }
      }

      console.log("Reset password email sent")
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
  }

  const updatePassword = async (password: string) => {
    setLoading(true)
    setError(null)

    try {
      console.log("Attempting to update password")
      const { error } = await supabase.auth.updateUser({
        password,
      })

      if (error) {
        console.error("Update password error:", error)
        setError(error)
        toast.error("Error al actualizar la contraseña: " + error.message)
        return { error }
      }

      console.log("Password updated successfully")
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
  }

  return {
    user,
    loading,
    isAuthenticated: !!user,
    error,
    signIn,
    signInWithProvider,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
  }
}
