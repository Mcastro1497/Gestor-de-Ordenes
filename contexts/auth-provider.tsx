"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useSupabase } from "@/hooks/use-supabase"
import type { User, AuthError } from "@supabase/supabase-js"
import { toast } from "sonner"

type AuthContextType = {
  user: User | null
  loading: boolean
  error: AuthError | null
  signIn: (email: string, password: string) => Promise<{ user: User | null; error: AuthError | null }>
  signUp: (email: string, password: string) => Promise<{ user: User | null; error: AuthError | null }>
  signOut: () => Promise<{ error: AuthError | null }>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
  updatePassword: (password: string) => Promise<{ error: AuthError | null }>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { supabase } = useSupabase()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<AuthError | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true)
        console.log("Fetching session...")

        // Primero intentamos obtener la sesión
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

        if (sessionError) {
          console.error("Error fetching session:", sessionError)
          setError(sessionError)
          return
        }

        console.log("Session data:", sessionData)

        // Si hay una sesión, obtenemos el usuario
        if (sessionData.session) {
          const { data: userData, error: userError } = await supabase.auth.getUser()

          if (userError) {
            console.error("Error fetching user:", userError)
            setError(userError)
            return
          }

          console.log("User data:", userData)
          setUser(userData.user)
        } else {
          console.log("No active session found")
          setUser(null)
        }
      } catch (err) {
        console.error("Unexpected error in fetchUser:", err)
        setError(err as AuthError)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session?.user?.id)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
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
      const authError = err as AuthError
      setError(authError)
      toast.error("Error al iniciar sesión")
      return { user: null, error: authError }
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
      const authError = err as AuthError
      setError(authError)
      toast.error("Error al registrarse")
      return { user: null, error: authError }
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
      const authError = err as AuthError
      setError(authError)
      toast.error("Error al cerrar sesión")
      return { error: authError }
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
      const authError = err as AuthError
      setError(authError)
      toast.error("Error al solicitar recuperación de contraseña")
      return { error: authError }
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
      const authError = err as AuthError
      setError(authError)
      toast.error("Error al actualizar la contraseña")
      return { error: authError }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updatePassword,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider")
  }
  return context
}
