import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { OrderDetails } from "@/components/order-details"
import { getOrderById } from "@/lib/data"

export const dynamic = "force-dynamic" // Forzar renderizado dinámico

export default async function OrderPage({ params }: { params: { id: string } }) {
  console.log("Renderizando página de orden con ID:", params.id)

  try {
    // Intentar obtener la orden
    const order = await getOrderById(params.id)

    // Si no se encuentra la orden, mostrar una orden temporal en lugar de 404
    if (!order) {
      console.error(`Orden con ID ${params.id} no encontrada`)
      return (
        <DashboardShell>
          <DashboardHeader
            heading={`Orden #${params.id.substring(0, 8)}...`}
            text="No se pudo encontrar esta orden en el sistema."
          />
          <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-destructive">
            <h3 className="text-lg font-medium">Orden no encontrada</h3>
            <p className="mt-2">La orden con ID {params.id} no existe en el sistema o ha sido eliminada.</p>
          </div>
        </DashboardShell>
      )
    }

    // Renderizar la página con los detalles de la orden
    return (
      <DashboardShell>
        <DashboardHeader heading={`Orden #${order.id}`} text="Detalles de la orden." />
        <OrderDetails order={order} />
      </DashboardShell>
    )
  } catch (error) {
    console.error(`Error al obtener la orden con ID ${params.id}:`, error)
    return (
      <DashboardShell>
        <DashboardHeader heading="Error al cargar la orden" text={`No se pudo cargar la orden con ID ${params.id}`} />
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          <h3 className="text-lg font-medium">Error del sistema</h3>
          <p className="mt-2">
            Ocurrió un error al intentar cargar esta orden. Por favor, inténtelo de nuevo más tarde.
          </p>
          <p className="mt-1 text-sm opacity-80">
            Detalles: {error instanceof Error ? error.message : "Error desconocido"}
          </p>
        </div>
      </DashboardShell>
    )
  }
}
