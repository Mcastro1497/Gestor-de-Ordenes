"use client"

import type React from "react"

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"
import { SupabaseProvider } from "@/contexts/supabase-provider"
import { AuthProvider } from "@/contexts/auth-provider"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <SupabaseProvider>
      <AuthProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Toaster richColors position="top-center" />
          {children}
        </ThemeProvider>
      </AuthProvider>
    </SupabaseProvider>
  )
}
