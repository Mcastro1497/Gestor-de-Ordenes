"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/hooks/use-toast"
import { loadAssetsFromStorage } from "@/lib/api-service"
import { CloudIcon as DatabaseCloud, AlertTriangle, CheckCircle2 } from "lucide-react"

export function AssetsSyncWithSupabase() {
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [syncStatus, setSyncStatus] = useState<"idle" | "success" | "error">("idle")
  const [syncMessage, setSyncMessage] = useState("")
  const [syncCount, setSyncCount] = useState(0)

  const handleSyncWithSupabase = async () => {
    setIsLoading(true)
    setProgress(10)
    setSyncStatus("idle")
    setSyncMessage("")
    setSyncCount(0)

    try {
      // Cargar activos desde localStorage
      const assets = loadAssetsFromStorage()

      if (!assets.length) {
        throw new Error("No hay activos para sincronizar. Importe activos primero.")
      }

      setProgress(30)

      // Inicializar cliente de Supabase
      const supabase = createClient()

      // Preparar los activos para inserción en Supabase
      // Mapear a la estructura existente de la tabla activos
      const assetsForSupabase = assets.map((asset) => ({
        ticker: asset.ticker,
        nombre: asset.name,
        descripcion: `${asset.name} - ${asset.type || ""}`,
        mercado: asset.market,
        moneda: asset.currency,
        tipo: asset.type,
        precio_ultimo: asset.lastPrice || 0,
        // No incluimos id ya que es un UUID generado automáticamente
      }))

      setProgress(50)

      // Primero, eliminar todos los registros existentes
      const { error: deleteError } = await supabase
        .from("activos")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000")

      if (deleteError) {
        throw new Error(`Error al limpiar la tabla de activos: ${deleteError.message}`)
      }

      setProgress(70)

      // Insertar los nuevos activos
      const { data, error } = await supabase.from("activos").insert(assetsForSupabase).select()

      if (error) {
        throw new Error(`Error al sincronizar activos: ${error.message}`)
      }

      setProgress(100)
      setSyncStatus("success")
      setSyncMessage(`Se han sincronizado ${assets.length} activos con Supabase correctamente.`)
      setSyncCount(assets.length)

      toast({
        title: "Sincronización exitosa",
        description: `Se han sincronizado ${assets.length} activos con Supabase.`,
      })
    } catch (error) {
      setProgress(0)
      setSyncStatus("error")
      setSyncMessage(error instanceof Error ? error.message : "Error desconocido al sincronizar activos")

      toast({
        title: "Error de sincronización",
        description: error instanceof Error ? error.message : "Error desconocido al sincronizar activos",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-lg font-medium">Sincronización con Supabase</h3>
          <p className="text-sm text-muted-foreground">
            Sincroniza los activos importados con la base de datos Supabase
          </p>
        </div>
        <Button onClick={handleSyncWithSupabase} disabled={isLoading} className="min-w-[180px]">
          {isLoading ? (
            <>
              <DatabaseCloud className="mr-2 h-4 w-4 animate-pulse" />
              Sincronizando...
            </>
          ) : (
            <>
              <DatabaseCloud className="mr-2 h-4 w-4" />
              Sincronizar con Supabase
            </>
          )}
        </Button>
      </div>

      {isLoading && (
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground">
            {progress < 50 ? "Preparando datos..." : "Sincronizando con Supabase..."}
          </p>
        </div>
      )}

      {syncStatus === "success" && (
        <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900">
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertTitle>Sincronización exitosa</AlertTitle>
          <AlertDescription>{syncMessage}</AlertDescription>
        </Alert>
      )}

      {syncStatus === "error" && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error de sincronización</AlertTitle>
          <AlertDescription>{syncMessage}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
