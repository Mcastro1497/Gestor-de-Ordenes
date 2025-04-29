import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export const dynamic = "force-dynamic" // Forzar renderizado dinámico

export default async function OrdersPage() {
  // Simulamos datos de órdenes para evitar errores
  const orders = [
    { id: 1, client: "Cliente 1", ticker: "AAPL", status: "Pendiente" },
    { id: 2, client: "Cliente 2", ticker: "MSFT", status: "Ejecutada" },
    { id: 3, client: "Cliente 3", ticker: "GOOGL", status: "Cancelada" },
  ]

  return (
    <DashboardShell>
      <DashboardHeader heading="Órdenes" text="Gestiona las órdenes de tus clientes.">
        <Link href="/orders/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Orden
          </Button>
        </Link>
      </DashboardHeader>

      <div className="grid gap-4">
        <h2 className="text-xl font-bold">Lista de órdenes</h2>
        <ul className="space-y-2">
          {orders.map((order) => (
            <li key={order.id} className="border p-4 rounded-md">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Orden #{order.id}</h3>
                  <p className="text-sm text-muted-foreground">
                    Cliente: {order.client} | Activo: {order.ticker} | Estado: {order.status}
                  </p>
                </div>
                <div className="space-x-2">
                  <Link href={`/orders/${order.id}`}>
                    <Button variant="outline" size="sm">
                      Ver detalles
                    </Button>
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </DashboardShell>
  )
}
