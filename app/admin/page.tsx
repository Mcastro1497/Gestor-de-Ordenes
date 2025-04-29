import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserManagementTable } from "@/components/admin/user-management-table"
import { RolePermissionsInfo } from "@/components/admin/role-permissions-info"

export default function AdminPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Administración" description="Gestiona usuarios, roles y permisos del sistema" />

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Usuarios</TabsTrigger>
          <TabsTrigger value="roles">Roles y Permisos</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <UserManagementTable />
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <RolePermissionsInfo />
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
