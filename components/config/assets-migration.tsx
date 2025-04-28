"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/hooks/use-toast"
import { Database, AlertTriangle, CheckCircle2 } from "lucide-react"

export function AssetsMigration() {
  const [isLoading, setIsLoading] = useState(false)
  const [migrationStatus, setMigrationStatus] = useState<"idle" | "success" | "error">("idle")
  const [migrationMessage, setMigrationMessage] = useState("")

  const handleCreateTable = async () => {
    setIsLoading(true)
    setMigrationStatus("idle")
    setMigrationMessage("")

    try {
      const supabase = createClient()

      // Ejecutar SQL para crear la tabla si no existe
      const { error } = await supabase.rpc("create_activos_table")

      if (error) {
        throw new Error(`Error al crear la tabla: ${error.message}`)
      }

      setMigrationStatus("success")
      setMigrationMessage("La tabla 'activos' ha sido creada o actualizada correctamente.")

      toast({
        title: "Tabla creada",
        description: "La tabla 'activos' ha sido creada o actualizada correctamente.",
      })
    } catch (error) {
      setMigrationStatus("error")
      setMigrationMessage(error instanceof Error ? error.message : "Error desconocido al crear la tabla")

      toast({
        title: "Error de migración",
        description: error instanceof Error ? error.message : "Error desconocido al crear la tabla",
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
          <h3 className="text-lg font-medium">Estructura de la tabla</h3>
          <p className="text-sm text-muted-foreground">
            Crea o actualiza la estructura de la tabla 'activos' en Supabase
          </p>
        </div>
        <Button onClick={handleCreateTable} disabled={isLoading} variant="outline">
          {isLoading ? (
            <>
              <Database className="mr-2 h-4 w-4 animate-pulse" />
              Creando tabla...
            </>
          ) : (
            <>
              <Database className="mr-2 h-4 w-4" />
              Crear/Actualizar tabla
            </>
          )}
        </Button>
      </div>

      {migrationStatus === "success" && (
        <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900">
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertTitle>Operación exitosa</AlertTitle>
          <AlertDescription>{migrationMessage}</AlertDescription>
        </Alert>
      )}

      {migrationStatus === "error" && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error de migración</AlertTitle>
          <AlertDescription>{migrationMessage}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
