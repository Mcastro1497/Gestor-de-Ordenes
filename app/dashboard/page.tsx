import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { OrderStatusChart } from "@/components/dashboard/order-status-chart"
import { OrderTypeChart } from "@/components/dashboard/order-type-chart"
import { RecentOrdersTable } from "@/components/dashboard/recent-orders-table"
import { DebugUserRole } from "@/components/debug-user-role"

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <DashboardStats />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <OrderStatusChart />
        <OrderTypeChart />
      </div>

      <RecentOrdersTable />

      {/* Componente de depuración para verificar el rol */}
      <DebugUserRole />
    </div>
  )
}
