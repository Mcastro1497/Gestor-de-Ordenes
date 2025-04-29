"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ClientsImporter } from "@/components/config/clients-importer"
import { ClientsList } from "@/components/config/clients-list"
import { ClientsSupabaseSync } from "@/components/config/clients-supabase-sync"
import { AssetsImporter } from "@/components/config/assets-importer"
import { AssetsList } from "@/components/config/assets-list"
import { usePermissions } from "@/hooks/use-permissions"
import { Permission } from "@/lib/db/schema"
import { RouteGuard } from "@/components/auth/route-guard"

export default function ConfigPage() {
  const { hasPermission } = usePermissions()

  return (
    <RouteGuard requiredPermissions={[Permission.VIEW_CONFIG]}>
      <div className="container mx-auto py-6 space-y-8">
        <h1 className="text-3xl font-bold">Configuración</h1>

        <Tabs defaultValue={hasPermission(Permission.IMPORT_CLIENTS) ? "clients" : "assets"}>
          <TabsList>
            {hasPermission(Permission.IMPORT_CLIENTS) && <TabsTrigger value="clients">Clientes</TabsTrigger>}
            {hasPermission(Permission.IMPORT_ASSETS) && <TabsTrigger value="assets">Activos</TabsTrigger>}
            {hasPermission(Permission.MANAGE_USERS) && <TabsTrigger value="users">Usuarios</TabsTrigger>}
            <TabsTrigger value="settings">Ajustes</TabsTrigger>
          </TabsList>

          {hasPermission(Permission.IMPORT_CLIENTS) && (
            <TabsContent value="clients" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ClientsImporter />
                <ClientsSupabaseSync />
              </div>
              <ClientsList />
            </TabsContent>
          )}

          {hasPermission(Permission.IMPORT_ASSETS) && (
            <TabsContent value="assets" className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <AssetsImporter />
                <AssetsList />
              </div>
            </TabsContent>
          )}

          {hasPermission(Permission.MANAGE_USERS) && (
            <TabsContent value="users" className="space-y-6">
              <div className="p-4 border rounded-md bg-muted/50">
                <p className="text-muted-foreground">Configuración de usuarios próximamente</p>
              </div>
            </TabsContent>
          )}

          <TabsContent value="settings" className="space-y-6">
            <div className="p-4 border rounded-md bg-muted/50">
              <p className="text-muted-foreground">Ajustes generales próximamente</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </RouteGuard>
  )
}
