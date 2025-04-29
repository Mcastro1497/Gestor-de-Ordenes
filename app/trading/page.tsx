"use client"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"

export default function TradingPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Mesa de Trading" text="Gestiona las operaciones en tiempo real." />

      <div className="grid gap-4">
        <div className="border p-4 rounded-md">
          <h2 className="text-xl font-bold mb-4">Órdenes Pendientes</h2>
          <p>Aquí se mostrarán las órdenes pendientes para ejecutar.</p>
        </div>

        <div className="border p-4 rounded-md">
          <h2 className="text-xl font-bold mb-4">Órdenes Ejecutadas Hoy</h2>
          <p>Aquí se mostrarán las órdenes ejecutadas durante el día.</p>
        </div>
      </div>
    </DashboardShell>
  )
}
