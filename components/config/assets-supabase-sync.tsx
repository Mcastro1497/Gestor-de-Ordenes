"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertCircle, CheckCircle2, RefreshCw, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { createClient } from "@supabase/supabase-js"
import { mapAssetToDbSchema, deleteAllAssets } from "@/lib/services/asset-service"

export function AssetsSyncWithSupabase() {
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [syncStatus, setSyncStatus] = useState<"idle" | "success" | "error">("idle")
  const [syncMessage, setSyncMessage] = useState("")
  const { toast } = useToast()
  const [assets] = useLocalStorage<any[]>("assets", [])

  // Crear cliente de Supabase para el lado del cliente
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  const handleSync = async () => {
    if (!assets || assets.length === 0) {
      toast({
        title: "No hay activos para sincronizar",
        description: "Primero debe importar activos desde la API o cargar ejemplos.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setSyncStatus("idle")
    setSyncMessage("")

    try {
      // Primero eliminar todos los activos existentes
      await deleteAllAssets()

      // Luego insertar los nuevos activos
      const mappedAssets = assets.map(mapAssetToDbSchema)

      const { error } = await supabase.from("activos").insert(mappedAssets)

      if (error) {
        throw new Error(`Error al sincronizar activos: ${error.message}`)
      }

      setSyncStatus("success")
      setSyncMessage(`Se han sincronizado ${assets.length} activos con Supabase correctamente.`)

      toast({
        title: "Sincronización completada",
        description: `Se han sincronizado ${assets.length} activos con Supabase.`,
      })
    } catch (error: any) {
      console.error("Error al sincronizar activos:", error)
      setSyncStatus("error")
      setSyncMessage(error.message || "Ha ocurrido un error al sincronizar los activos.")

      toast({
        title: "Error de sincronización",
        description: error.message || "Ha ocurrido un error al sincronizar los activos.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAll = async () => {
    if (
      confirm("¿Está seguro de que desea eliminar todos los activos de Supabase? Esta acción no se puede deshacer.")
    ) {
      setIsDeleting(true)

      try {
        await deleteAllAssets()

        toast({
          title: "Activos eliminados",
          description: "Todos los activos han sido eliminados de Supabase.",
        })
      } catch (error: any) {
        console.error("Error al eliminar activos:", error)

        toast({
          title: "Error al eliminar",
          description: error.message || "Ha ocurrido un error al eliminar los activos.",
          variant: "destructive",
        })
      } finally {
        setIsDeleting(false)
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sincronizar Activos con Supabase</CardTitle>
        <CardDescription>
          Sincroniza los activos importados con la tabla "activos" en Supabase. Esta operación reemplazará todos los
          activos existentes en la base de datos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {syncStatus === "success" && (
          <Alert className="mb-4 bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Sincronización exitosa</AlertTitle>
            <AlertDescription className="text-green-700">{syncMessage}</AlertDescription>
          </Alert>
        )}

        {syncStatus === "error" && (
          <Alert className="mb-4" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error de sincronización</AlertTitle>
            <AlertDescription>{syncMessage}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-md bg-muted/50">
            <div>
              <p className="font-medium">Activos disponibles para sincronizar</p>
              <p className="text-sm text-muted-foreground">
                {assets.length > 0
                  ? `${assets.length} activos cargados en memoria local`
                  : "No hay activos cargados. Importe activos primero."}
              </p>
            </div>
            <div className="text-2xl font-bold">{assets.length}</div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleDeleteAll} disabled={isDeleting || isLoading}>
          {isDeleting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Eliminando...
            </>
          ) : (
            <>
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar Todos
            </>
          )}
        </Button>
        <Button onClick={handleSync} disabled={isLoading || assets.length === 0}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sincronizando...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Sincronizar con Supabase
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
