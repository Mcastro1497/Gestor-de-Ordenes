"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"
import Link from "next/link"

interface Order {
  id: string
  cliente: string
  activo: string
  tipo: string
  estado: string
  fecha: string
  monto: number
}

export function RecentOrdersTable() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("ordenes")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5)

        if (error) {
          console.error("Error al obtener órdenes recientes:", error)
          return
        }

        // Transformar los datos si es necesario
        const formattedOrders = data.map((order) => ({
          id: order.id,
          cliente: order.cliente_nombre || "Cliente no especificado",
          activo: order.activo_nombre || "Activo no especificado",
          tipo: order.tipo || "No especificado",
          estado: order.estado || "pendiente",
          fecha: new Date(order.created_at).toLocaleDateString(),
          monto: order.monto || 0,
        }))

        setOrders(formattedOrders)
      } catch (error) {
        console.error("Error al obtener órdenes recientes:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "completada":
        return <Badge className="bg-green-500">Completada</Badge>
      case "pendiente":
        return <Badge className="bg-yellow-500">Pendiente</Badge>
      case "cancelada":
        return <Badge className="bg-red-500">Cancelada</Badge>
      default:
        return <Badge className="bg-gray-500">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="rounded-md border">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Cargando órdenes recientes...</span>
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-md border">
        <div className="flex flex-col items-center justify-center h-64">
          <h3 className="text-lg font-medium">No hay órdenes recientes</h3>
          <p className="text-sm text-muted-foreground mt-2">Las órdenes recientes aparecerán aquí</p>
          <Button className="mt-4" asChild>
            <Link href="/orders/create">Crear nueva orden</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Órdenes Recientes</h3>
        <Button asChild>
          <Link href="/orders">Ver todas</Link>
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Activo</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-right">Monto</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">
                  <Link href={`/orders/${order.id}`} className="text-primary hover:underline">
                    {order.id.substring(0, 8)}...
                  </Link>
                </TableCell>
                <TableCell>{order.cliente}</TableCell>
                <TableCell>{order.activo}</TableCell>
                <TableCell>{order.tipo}</TableCell>
                <TableCell>{getStatusBadge(order.estado)}</TableCell>
                <TableCell>{order.fecha}</TableCell>
                <TableCell className="text-right">${order.monto.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
