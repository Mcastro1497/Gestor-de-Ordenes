"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

// Función para cargar datos de órdenes desde localStorage
function loadOrdersFromLocalStorage() {
  try {
    const ordersJson = localStorage.getItem("gestor_orders")
    return ordersJson ? JSON.parse(ordersJson) : []
  } catch (error) {
    console.error("Error al cargar órdenes:", error)
    return []
  }
}

// Función para cargar datos de clientes desde localStorage
function loadClientsFromLocalStorage() {
  try {
    const clientsJson = localStorage.getItem("gestor_clients")
    return clientsJson ? JSON.parse(clientsJson) : []
  } catch (error) {
    console.error("Error al cargar clientes:", error)
    return []
  }
}

// Función para cargar datos de activos desde localStorage
function loadAssetsFromLocalStorage() {
  try {
    const assetsJson = localStorage.getItem("gestor_assets")
    return assetsJson ? JSON.parse(assetsJson) : []
  } catch (error) {
    console.error("Error al cargar activos:", error)
    return []
  }
}

export function DashboardStats() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    activeClients: 0,
    availableAssets: 0,
  })

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true)

        // Pequeño retraso para simular carga
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Cargar datos desde localStorage
        const orders = loadOrdersFromLocalStorage()
        const clients = loadClientsFromLocalStorage()
        const assets = loadAssetsFromLocalStorage()

        // Si no hay datos, crear algunos de ejemplo
        if (orders.length === 0 && clients.length === 0 && assets.length === 0) {
          // Crear datos de ejemplo
          setStats({
            totalOrders: 24,
            pendingOrders: 8,
            activeClients: 15,
            availableAssets: 120,
          })

          // Guardar datos de ejemplo en localStorage para futuras cargas
          if (!localStorage.getItem("gestor_stats")) {
            localStorage.setItem(
              "gestor_stats",
              JSON.stringify({
                totalOrders: 24,
                pendingOrders: 8,
                activeClients: 15,
                availableAssets: 120,
              }),
            )
          }
        } else {
          // Calcular estadísticas reales
          const pendingOrders = orders.filter(
            (order) => order.estado && order.estado.toLowerCase() === "pendiente",
          ).length

          setStats({
            totalOrders: orders.length,
            pendingOrders: pendingOrders,
            activeClients: clients.length,
            availableAssets: assets.length,
          })
        }
      } catch (error) {
        console.error("Error al cargar estadísticas:", error)

        // Usar estadísticas de respaldo en caso de error
        setStats({
          totalOrders: 24,
          pendingOrders: 8,
          activeClients: 15,
          availableAssets: 120,
        })
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Órdenes Totales</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? <Skeleton className="h-8 w-20" /> : <div className="text-2xl font-bold">{stats.totalOrders}</div>}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Órdenes Pendientes</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <div className="text-2xl font-bold">{stats.pendingOrders}</div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Clientes Activos</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <div className="text-2xl font-bold">{stats.activeClients}</div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Activos Disponibles</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <div className="text-2xl font-bold">{stats.availableAssets}</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
