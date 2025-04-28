import { getClientes } from "@/lib/services/cliente-service"
import { getAssets } from "@/lib/services/asset-service"
import { OrderCreationForm } from "@/components/new-order-form/order-creation-form"

export default async function NuevaOrdenPage() {
  const clientes = await getClientes()
  const assets = await getAssets()

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Crear Nueva Orden</h1>
      <OrderCreationForm clientes={clientes} assets={assets} />
    </div>
  )
}
