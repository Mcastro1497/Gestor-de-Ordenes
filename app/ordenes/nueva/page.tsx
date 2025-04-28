import { getClientes } from "@/lib/services/cliente-service"
import { getAssets } from "@/lib/services/asset-service"
import { OrderCreationWizard } from "@/components/order-creation-wizard"

export default async function NuevaOrdenPage() {
  const clientes = await getClientes()
  const assets = await getAssets()

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Crear Nueva Orden</h1>
      <OrderCreationWizard clients={clientes} assets={assets} />
    </div>
  )
}
