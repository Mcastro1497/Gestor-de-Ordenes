import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"

export default function AdminPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Administración" text="Gestiona usuarios y configuraciones del sistema." />

      <div className="grid gap-4">
        <div className="border p-4 rounded-md">
          <h2 className="text-xl font-bold mb-4">Gestión de Usuarios</h2>
          <p>Aquí se mostrarán las opciones para gestionar usuarios.</p>
        </div>

        <div className="border p-4 rounded-md">
          <h2 className="text-xl font-bold mb-4">Configuración del Sistema</h2>
          <p>Aquí se mostrarán las opciones de configuración del sistema.</p>
        </div>
      </div>
    </DashboardShell>
  )
}
