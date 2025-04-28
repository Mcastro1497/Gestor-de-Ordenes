"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"

export function OrderStatusChart() {
  const [loading, setLoading] = useState(true)
  const [chartData, setChartData] = useState({
    pendiente: 0,
    completada: 0,
    cancelada: 0,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient()

        // Órdenes pendientes
        const { count: pendingCount, error: pendingError } = await supabase
          .from("ordenes")
          .select("*", { count: "exact", head: true })
          .eq("estado", "pendiente")

        // Órdenes completadas
        const { count: completedCount, error: completedError } = await supabase
          .from("ordenes")
          .select("*", { count: "exact", head: true })
          .eq("estado", "completada")

        // Órdenes canceladas
        const { count: cancelledCount, error: cancelledError } = await supabase
          .from("ordenes")
          .select("*", { count: "exact", head: true })
          .eq("estado", "cancelada")

        if (pendingError || completedError || cancelledError) {
          console.error("Error al obtener datos para el gráfico:", {
            pendingError,
            completedError,
            cancelledError,
          })
          return
        }

        setChartData({
          pendiente: pendingCount || 0,
          completada: completedCount || 0,
          cancelada: cancelledCount || 0,
        })
      } catch (error) {
        console.error("Error al obtener datos para el gráfico:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const total = chartData.pendiente + chartData.completada + chartData.cancelada
  const pendingPercentage = total > 0 ? Math.round((chartData.pendiente / total) * 100) : 0
  const completedPercentage = total > 0 ? Math.round((chartData.completada / total) * 100) : 0
  const cancelledPercentage = total > 0 ? Math.round((chartData.cancelada / total) * 100) : 0

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Estado de Órdenes</CardTitle>
          <CardDescription>Distribución de órdenes por estado</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estado de Órdenes</CardTitle>
        <CardDescription>Distribución de órdenes por estado</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
                <span>Pendientes</span>
              </div>
              <span className="font-bold">{chartData.pendiente}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: `${pendingPercentage}%` }}></div>
            </div>
            <div className="text-right text-xs text-muted-foreground">{pendingPercentage}%</div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                <span>Completadas</span>
              </div>
              <span className="font-bold">{chartData.completada}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${completedPercentage}%` }}></div>
            </div>
            <div className="text-right text-xs text-muted-foreground">{completedPercentage}%</div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
                <span>Canceladas</span>
              </div>
              <span className="font-bold">{chartData.cancelada}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${cancelledPercentage}%` }}></div>
            </div>
            <div className="text-right text-xs text-muted-foreground">{cancelledPercentage}%</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
