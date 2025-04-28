"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { ExternalLink } from "lucide-react"

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

// Tipo para las órdenes
interface Orden {
  id: string
  cliente_nombre?: string
  cliente_cuenta?: string
  tipo_operacion?: string
  estado: string
  created_at: string
  detalles?: Array<{
    id: string
    orden_id: string
    ticker: string
    cantidad: number
    precio: number
    es_orden_mercado: boolean
    created_at: string
  }>
}

export function RecentOrdersTable() {
  const [orders, setOrders] = useState<Orden[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true)

        // Pequeño retraso para simular carga
        await new Promise((resolve) => setTimeout(resolve, 1200))

        // Cargar órdenes desde localStorage
        const orders = loadOrdersFromLocalStorage()

        // Si no hay órdenes, crear algunas de ejemplo
        if (orders.length === 0) {
          // Crear fechas válidas para los ejemplos
          const now = new Date().toISOString()
          const yesterday = new Date(Date.now() - 86400000).toISOString()
          const twoDaysAgo = new Date(Date.now() - 172800000).toISOString()

          const exampleOrders = [
            {
              id: "1",
              cliente_nombre: "Juan Pérez",
              cliente_cuenta: "JP-001",
              tipo_operacion: "Compra",
              estado: "pendiente",
              created_at: now,
              detalles: [
                {
                  id: "d1",
                  orden_id: "1",
                  ticker: "AAPL",
                  cantidad: 10,
                  precio: 150,
                  es_orden_mercado: false,
                  created_at: now,
                },
              ],
            },
            {
              id: "2",
              cliente_nombre: "María López",
              cliente_cuenta: "ML-002",
              tipo_operacion: "Venta",
              estado: "ejecutada",
              created_at: yesterday,
              detalles: [
                {
                  id: "d2",
                  orden_id: "2",
                  ticker: "MSFT",
                  cantidad: 5,
                  precio: 300,
                  es_orden_mercado: true,
                  created_at: yesterday,
                },
              ],
            },
            {
              id: "3",
              cliente_nombre: "Carlos Rodríguez",
              cliente_cuenta: "CR-003",
              tipo_operacion: "Compra",
              estado: "pendiente",
              created_at: twoDaysAgo,
              detalles: [
                {
                  id: "d3",
                  orden_id: "3",
                  ticker: "GOOGL",
                  cantidad: 2,
                  precio: 2500,
                  es_orden_mercado: false,
                  created_at: twoDaysAgo,
                },
              ],
            },
            {
              id: "4",
              cliente_nombre: "Ana Martínez",
              cliente_cuenta: "AM-004",
              tipo_operacion: "Swap",
              estado: "cancelada",
              created_at: yesterday,
              detalles: [
                {
                  id: "d4",
                  orden_id: "4",
                  ticker: "TSLA",
                  cantidad: 3,
                  precio: 800,
                  es_orden_mercado: false,
                  created_at: yesterday,
                },
                {
                  id: "d5",
                  orden_id: "4",
                  ticker: "AMZN",
                  cantidad: 1,
                  precio: 3200,
                  es_orden_mercado: false,
                  created_at: yesterday,
                },
              ],
            },
            {
              id: "5",
              cliente_nombre: "Pedro Gómez",
              cliente_cuenta: "PG-005",
              tipo_operacion: "Compra",
              estado: "ejecutada",
              created_at: now,
              detalles: [
                {
                  id: "d6",
                  orden_id: "5",
                  ticker: "NFLX",
                  cantidad: 8,
                  precio: 550,
                  es_orden_mercado: true,
                  created_at: now,
                },
              ],
            },
          ]
          localStorage.setItem("gestor_orders", JSON.stringify(exampleOrders))
          setOrders(exampleOrders)
        } else {
          setOrders(orders.slice(0, 5))
        }
      } catch (error) {
        console.error("Error al cargar órdenes recientes:", error)
        // Crear órdenes de ejemplo en caso de error
        const now = new Date().toISOString()
        const fallbackOrders = [
          {
            id: "1",
            cliente_nombre: "Juan Pérez",
            cliente_cuenta: "JP-001",
            tipo_operacion: "Compra",
            estado: "pendiente",
            created_at: now,
            detalles: [
              {
                id: "d1",
                orden_id: "1",
                ticker: "AAPL",
                cantidad: 10,
                precio: 150,
                es_orden_mercado: false,
                created_at: now,
              },
            ],
          },
          {
            id: "2",
            cliente_nombre: "María López",
            cliente_cuenta: "ML-002",
            tipo_operacion: "Venta",
            estado: "ejecutada",
            created_at: now,
            detalles: [
              {
                id: "d2",
                orden_id: "2",
                ticker: "MSFT",
                cantidad: 5,
                precio: 300,
                es_orden_mercado: true,
                created_at: now,
              },
            ],
          },
          {
            id: "3",
            cliente_nombre: "Carlos Rodríguez",
            cliente_cuenta: "CR-003",
            tipo_operacion: "Compra",
            estado: "pendiente",
            created_at: now,
            detalles: [
              {
                id: "d3",
                orden_id: "3",
                ticker: "GOOGL",
                cantidad: 2,
                precio: 2500,
                es_orden_mercado: false,
                created_at: now,
              },
            ],
          },
        ]
        setOrders(fallbackOrders)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  // Función para mostrar el estado con el color adecuado
  function getStatusBadge(status: string) {
    switch (status.toLowerCase()) {
      case "pendiente":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Pendiente
          </Badge>
        )
      case "tomada":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Tomada
          </Badge>
        )
      case "ejecutada":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Ejecutada
          </Badge>
        )
      case "ejecutada parcial":
        return (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
            Parcial
          </Badge>
        )
      case "cancelada":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Cancelada
          </Badge>
        )
      case "revisar":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            Revisar
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Función para formatear la fecha con manejo de errores
  function formatDate(dateString: string) {
    try {
      // Verificar si la fecha es válida
      if (!dateString) {
        return "Fecha no disponible"
      }

      const date = new Date(dateString)

      // Verificar si la fecha es válida después de la conversión
      if (isNaN(date.getTime())) {
        return "Fecha inválida"
      }

      return new Intl.DateTimeFormat("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date)
    } catch (error) {
      console.error("Error al formatear fecha:", error)
      return "Error de formato"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Órdenes Recientes</CardTitle>
        <CardDescription>Las últimas órdenes ingresadas en el sistema</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-full" />
                </div>
              ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">No hay órdenes recientes para mostrar</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Cuenta</TableHead>
                <TableHead>Activo</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.cliente_nombre || "Cliente sin nombre"}</TableCell>
                  <TableCell>{order.cliente_cuenta || "N/A"}</TableCell>
                  <TableCell>
                    {order.detalles && order.detalles.length > 0
                      ? order.detalles.map((d) => d.ticker).join(", ")
                      : "N/A"}
                  </TableCell>
                  <TableCell>{order.tipo_operacion || "N/A"}</TableCell>
                  <TableCell>{getStatusBadge(order.estado || "pendiente")}</TableCell>
                  <TableCell>{formatDate(order.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/ordenes/${order.id}`}>
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Ver
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <div className="mt-4 flex justify-end">
          <Button variant="outline" asChild>
            <Link href="/ordenes">Ver todas las órdenes</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
