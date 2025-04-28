"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AssetsList } from "@/components/config/assets-list"
import { AssetsImporter } from "@/components/config/assets-importer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { AssetsSyncWithSupabase } from "@/components/config/assets-supabase-sync"

export default function AssetsConfigPage() {
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Simular carga inicial
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Configuración de Activos</h1>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="list">Lista de Activos</TabsTrigger>
          <TabsTrigger value="import">Importar Activos</TabsTrigger>
          <TabsTrigger value="sync">Sincronizar</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Activos Disponibles</CardTitle>
              <CardDescription>Gestione los activos disponibles en el sistema.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <AssetsList />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="import">
          <Card>
            <CardHeader>
              <CardTitle>Importar Activos</CardTitle>
              <CardDescription>Importe activos desde un archivo CSV o Excel.</CardDescription>
            </CardHeader>
            <CardContent>
              <AssetsImporter />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="sync">
          <Card>
            <CardHeader>
              <CardTitle>Sincronización con Supabase</CardTitle>
              <CardDescription>Sincroniza los activos importados con la base de datos Supabase.</CardDescription>
            </CardHeader>
            <CardContent>
              <AssetsSyncWithSupabase />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
