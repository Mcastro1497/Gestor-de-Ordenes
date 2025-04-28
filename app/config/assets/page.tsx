"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AssetsList } from "@/components/config/assets-list"
import { AssetsImporter } from "@/components/config/assets-importer"
import { AssetsSyncWithSupabase } from "@/components/config/assets-supabase-sync"
import { AssetsMigration } from "@/components/config/assets-migration"

export default function AssetsConfigPage() {
  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Configuración de Activos</h1>

      <Tabs defaultValue="list">
        <TabsList className="mb-4">
          <TabsTrigger value="list">Lista</TabsTrigger>
          <TabsTrigger value="import">Importar</TabsTrigger>
          <TabsTrigger value="sync">Sincronizar</TabsTrigger>
          <TabsTrigger value="migration">Migración</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <AssetsList />
        </TabsContent>

        <TabsContent value="import">
          <AssetsImporter />
        </TabsContent>

        <TabsContent value="sync">
          <AssetsSyncWithSupabase />
        </TabsContent>

        <TabsContent value="migration">
          <AssetsMigration />
        </TabsContent>
      </Tabs>
    </div>
  )
}
