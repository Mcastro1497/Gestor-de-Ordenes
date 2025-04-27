"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentOrdersTable } from "@/components/dashboard/recent-orders-table"
import { OrderStatusChart } from "@/components/dashboard/order-status-chart"
import { OrderTypeChart } from "@/components/dashboard/order-type-chart"

export default function DashboardPage() {
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Si no está cargando y no está autenticado, redirigir a login
    if (!loading && !isAuthenticated) {
      console.log("Usuario no autenticado, redirigiendo a login")
      router.push("/auth/login")
    } else if (!loading && isAuthenticated) {
      console.log("Usuario autenticado:", user?.id)
      setIsLoading(false)
    }
  }, [loading, isAuthenticated, user, router])

  if (isLoading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Cargando dashboard...</h2>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          </div>
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>

        {/* Estadísticas generales */}
        <DashboardStats />

        {/* Gráficos y tablas */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          <OrderStatusChart />
          <OrderTypeChart />
        </div>

        {/* Órdenes recientes */}
        <RecentOrdersTable />
      </div>
    </DashboardShell>
  )
}
