import { DashboardShell } from "@/components/dashboard-shell"

export default function DashboardPage() {
  return (
    <DashboardShell>
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Tarjetas de estadísticas */}
          <div className="rounded-xl border bg-card text-card-foreground shadow">
            <div className="p-6 flex flex-col space-y-2">
              <p className="text-sm text-muted-foreground">Órdenes Totales</p>
              <h3 className="text-2xl font-bold">--</h3>
            </div>
          </div>
          <div className="rounded-xl border bg-card text-card-foreground shadow">
            <div className="p-6 flex flex-col space-y-2">
              <p className="text-sm text-muted-foreground">Órdenes Pendientes</p>
              <h3 className="text-2xl font-bold">--</h3>
            </div>
          </div>
          <div className="rounded-xl border bg-card text-card-foreground shadow">
            <div className="p-6 flex flex-col space-y-2">
              <p className="text-sm text-muted-foreground">Clientes Activos</p>
              <h3 className="text-2xl font-bold">--</h3>
            </div>
          </div>
          <div className="rounded-xl border bg-card text-card-foreground shadow">
            <div className="p-6 flex flex-col space-y-2">
              <p className="text-sm text-muted-foreground">Activos Disponibles</p>
              <h3 className="text-2xl font-bold">--</h3>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
            <h3 className="text-lg font-medium mb-4">Estado de Órdenes</h3>
            <div className="h-[200px] flex items-center justify-center">
              <p className="text-muted-foreground">Cargando datos...</p>
            </div>
          </div>
          <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
            <h3 className="text-lg font-medium mb-4">Tipos de Órdenes</h3>
            <div className="h-[200px] flex items-center justify-center">
              <p className="text-muted-foreground">Cargando datos...</p>
            </div>
          </div>
        </div>

        {/* Tabla de órdenes recientes */}
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium mb-4">Órdenes Recientes</h3>
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-muted">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      ID
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Cliente
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Tipo
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Estado
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Fecha
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white dark:bg-gray-800">
                    <td className="px-6 py-4" colSpan={5}>
                      <div className="text-center py-4">
                        <p className="text-muted-foreground">Cargando órdenes recientes...</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
