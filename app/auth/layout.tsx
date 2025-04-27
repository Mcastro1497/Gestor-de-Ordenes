"use client"

import type React from "react"

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"
import { SupabaseProvider } from "@/contexts/supabase-provider"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <SupabaseProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Toaster richColors position="top-center" />
        {children}
      </ThemeProvider>
    </SupabaseProvider>
  )
}
