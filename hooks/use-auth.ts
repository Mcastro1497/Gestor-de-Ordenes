"use client"

import { useEffect, useState, useCallback } from "react"
import { useSupabase } from "./use-supabase"
import type { User, AuthError, Provider } from "@supabase/supabase-js"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function useAuth() {
  const { supabase } = useSupabase()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<AuthError | null>(null)
  const router = useRouter()

  // Fetch the user on mount
  useEffect(() => {
    let mounted = true

    const fetchUser = async () => {
      try {
        if (!mounted) return

        setLoading(true)
        console.log("Fetching user session...")

        // Primero intentamos obtener la sesión
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

        if (sessionError) {
          console.error("Error fetching session:", sessionError)
          if (mounted) {
            setError(sessionError)
            setLoading(false)
          }
          return
        }

        console.log("Session data:", sessionData)

        // Si hay una sesión, obtenemos el usuario
        if (sessionData.session) {
          const { data: userData, error: userError } = await supabase.auth.getUser()

          if (userError) {
            console.error("Error fetching user:", userError)
            if (mounted) {
              setError(userError)
              setLoading(false)
            }
            return
          }

          console.log("User data:", userData)

          if (mounted) {
            setUser(userData.user)
          }
        } else {
          console.log("No active session found")
          if (mounted) {
            setUser(null)
          }
        }
      } catch (err) {
        console.error("Unexpected error in fetchUser:", err)
        if (mounted) {
          setError(err as AuthError)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    fetchUser()

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session?.user?.id)

      if (mounted) {
        setUser(session?.user ?? null)
        setLoading(false)

        // Redirigir según el evento
        if (event === "SIGNED_IN" && session) {
          console.log("User signed in, redirecting to dashboard")
          router.refresh()
          router.push("/dashboard")
        } else if (event === "SIGNED_OUT") {
          console.log("User signed out, redirecting to login")
          router.refresh()
          router.push("/auth/login")
        }
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [supabase, router])

  const signIn = useCallback(
    async (email: string, password: string) => {
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
    },
    [supabase],
  )

  const signInWithProvider = useCallback(
    async (provider: Provider) => {
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
    },
    [supabase],
  )

  const signUp = useCallback(
    async (email: string, password: string) => {
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
    },
    [supabase],
  )

  const signOut = useCallback(async () => {
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
  }, [supabase])

  const resetPassword = useCallback(
    async (email: string) => {
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
    },
    [supabase],
  )

  const updatePassword = useCallback(
    async (password: string) => {
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
