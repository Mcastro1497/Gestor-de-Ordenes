"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { MainNav } from "./main-nav"
import { UserNav } from "./user-nav"

interface DashboardShellProps extends React.HTMLAttributes<HTMLDivElement> {
  showNav?: boolean
}

export function DashboardShell({ children, className, showNav = true, ...props }: DashboardShellProps) {
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean | null>(null)
  const [pendingOrders, setPendingOrders] = useState<number>(0)

  // Verificar la conexión con Supabase al montar el componente
  useEffect(() => {
    const checkSupabaseConnection = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase.from("ordenes").select("id").limit(1)

        if (error) {
          console.error("Error al conectar con Supabase:", error)
          setIsSupabaseConnected(false)
        } else {
          console.log("Conexión con Supabase establecida correctamente")
          setIsSupabaseConnected(true)
        }
      } catch (err) {
        console.error("Error al verificar la conexión con Supabase:", err)
        setIsSupabaseConnected(false)
      }
    }

    checkSupabaseConnection()
  }, [])

  // Cargar órdenes pendientes
  useEffect(() => {
    const loadPendingOrders = async () => {
      try {
        const supabase = createClient()
        // En lugar de buscar unreadUpdates, contamos las órdenes con estado "pendiente"
        const { count, error } = await supabase
          .from("ordenes")
          .select("*", { count: "exact", head: true })
          .eq("estado", "pendiente")

        if (error) {
          console.error("Error al cargar órdenes pendientes:", error)
        } else if (count !== null) {
          setPendingOrders(count)
        }
      } catch (err) {
        console.error("Error al cargar órdenes pendientes:", err)
      }
    }

    if (isSupabaseConnected) {
      loadPendingOrders()
    }
  }, [isSupabaseConnected])

  // Función para refrescar las órdenes
  const refreshOrders = async () => {
    try {
      const supabase = createClient()
      const { count, error } = await supabase
        .from("ordenes")
        .select("*", { count: "exact", head: true })
        .eq("estado", "pendiente")

      if (error) {
        console.error("Error al refrescar órdenes pendientes:", error)
      } else if (count !== null) {
        setPendingOrders(count)
      }
    } catch (err) {
      console.error("Error al refrescar órdenes pendientes:", err)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      {showNav && (
        <header className="sticky top-0 z-40 border-b bg-background">
          <div className="container flex h-16 items-center justify-between py-4">
            <MainNav pendingOrders={pendingOrders} onRefreshOrders={refreshOrders} />
            <UserNav />
          </div>
        </header>
      )}
      <div className={`container grid items-start gap-8 pb-8 pt-6 md:py-8 ${className || ""}`} {...props}>
        {isSupabaseConnected === false && (
          <div className="bg-destructive/15 text-destructive p-4 rounded-md mb-4">
            <p className="font-medium">Error de conexión con Supabase</p>
            <p className="text-sm">No se pudo establecer conexión con la base de datos. Verifica tu configuración.</p>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
