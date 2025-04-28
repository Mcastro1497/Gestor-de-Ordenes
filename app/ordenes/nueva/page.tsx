import { Suspense } from "react"
import { OrderCreationForm } from "@/components/new-order-form/order-creation-form"
import { getClients } from "@/lib/services/cliente-service"
import { getAssets } from "@/lib/services/asset-service"
import { Skeleton } from "@/components/ui/skeleton"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function NuevaOrdenPage() {
  // Cargar clientes y activos desde Supabase
  const clientes = await getClients()
  const activos = await getAssets()

  // Mapear los activos al formato esperado por el componente
  const mappedActivos = activos.map((activo) => ({
    id: activo.id,
    ticker: activo.ticker,
    nombre: activo.nombre,
    mercado: activo.mercado,
    moneda: activo.moneda,
    tipo: activo.tipo,
    lastPrice: activo.precio_ultimo || 0,
  }))

  return (
    <div className="container py-6">
      <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
        <OrderCreationForm clientes={clientes} assets={mappedActivos} />
      </Suspense>
    </div>
  )
}
