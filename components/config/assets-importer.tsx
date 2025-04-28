"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertCircle, CheckCircle2, Download, Database } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { createClient } from "@supabase/supabase-js"
import { mapAssetToDbSchema, deleteAllAssets } from "@/lib/services/asset-service"

// Ejemplo de activos para cargar
const exampleAssets = [
  {
    ticker: "AAPL",
    name: "Apple Inc.",
    description: "Empresa tecnológica que diseña y produce equipos electrónicos y software.",
    market: "NASDAQ",
    currency: "USD",
    type: "EQUITY",
    lastPrice: 175.25,
  },
  {
    ticker: "MSFT",
    name: "Microsoft Corporation",
    description: "Empresa multinacional de tecnología que desarrolla software y hardware.",
    market: "NASDAQ",
    currency: "USD",
    type: "EQUITY",
    lastPrice: 325.76,
  },
  {
    ticker: "GOOGL",
    name: "Alphabet Inc.",
    description: "Conglomerado de empresas cuya principal filial es Google.",
    market: "NASDAQ",
    currency: "USD",
    type: "EQUITY",
    lastPrice: 138.45,
  },
  {
    ticker: "AMZN",
    name: "Amazon.com, Inc.",
    description: "Compañía estadounidense de comercio electrónico y servicios de computación en la nube.",
    market: "NASDAQ",
    currency: "USD",
    type: "EQUITY",
    lastPrice: 145.2,
  },
  {
    ticker: "TSLA",
    name: "Tesla, Inc.",
    description: "Empresa estadounidense que diseña, fabrica y vende automóviles eléctricos.",
    market: "NASDAQ",
    currency: "USD",
    type: "EQUITY",
    lastPrice: 245.65,
  },
  {
    ticker: "AL30",
    name: "Bono Argentino 2030 Ley Argentina",
    description: "Bono soberano de Argentina con vencimiento en 2030.",
    market: "BYMA",
    currency: "ARS",
    type: "BOND",
    lastPrice: 12500.5,
  },
  {
    ticker: "GD30",
    name: "Bono Global 2030 Ley Nueva York",
    description: "Bono soberano de Argentina con vencimiento en 2030 bajo ley de Nueva York.",
    market: "BYMA",
    currency: "USD",
    type: "BOND",
    lastPrice: 42.75,
  },
  {
    ticker: "YPFD",
    name: "YPF S.A.",
    description:
      "Empresa argentina dedicada a la exploración, explotación, destilación, distribución y producción de energía eléctrica, gas, petróleo y derivados de los hidrocarburos.",
    market: "BYMA",
    currency: "ARS",
    type: "EQUITY",
    lastPrice: 8750.25,
  },
  {
    ticker: "GGAL",
    name: "Grupo Financiero Galicia S.A.",
    description: "Holding financiero argentino que opera principalmente a través del Banco Galicia.",
    market: "BYMA",
    currency: "ARS",
    type: "EQUITY",
    lastPrice: 3450.75,
  },
  {
    ticker: "PAMP",
    name: "Pampa Energía S.A.",
    description: "Empresa integrada de electricidad y energía de Argentina.",
    market: "BYMA",
    currency: "ARS",
    type: "EQUITY",
    lastPrice: 5680.3,
  },
]

export function AssetsImporter() {
  const [apiUrl, setApiUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [importStatus, setImportStatus] = useState<"idle" | "success" | "error">("idle")
  const [importMessage, setImportMessage] = useState("")
  const [autoSync, setAutoSync] = useState(false)
  const { toast } = useToast()
  const [assets, setAssets] = useLocalStorage<any[]>("assets", [])

  // Crear cliente de Supabase para el lado del cliente
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  const handleImportFromApi = async () => {
    if (!apiUrl) {
      toast({
        title: "URL no válida",
        description: "Por favor, ingrese una URL válida para importar activos.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setImportStatus("idle")
    setImportMessage("")

    try {
      const response = await fetch(apiUrl)

      if (!response.ok) {
        throw new Error(`Error al obtener datos: ${response.statusText}`)
      }

      const data = await response.json()

      if (!data || !Array.isArray(data)) {
        throw new Error("Los datos recibidos no tienen el formato esperado.")
      }

      setAssets(data)
      setImportStatus("success")
      setImportMessage(`Se han importado ${data.length} activos correctamente.`)

      toast({
        title: "Importación completada",
        description: `Se han importado ${data.length} activos.`,
      })

      // Si autoSync está activado, sincronizar con Supabase
      if (autoSync) {
        await syncWithSupabase(data)
      }
    } catch (error: any) {
      console.error("Error al importar activos:", error)
      setImportStatus("error")
      setImportMessage(error.message || "Ha ocurrido un error al importar los activos.")

      toast({
        title: "Error de importación",
        description: error.message || "Ha ocurrido un error al importar los activos.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoadExamples = async () => {
    setIsLoading(true)
    setImportStatus("idle")
    setImportMessage("")

    try {
      setAssets(exampleAssets)
      setImportStatus("success")
      setImportMessage(`Se han cargado ${exampleAssets.length} activos de ejemplo correctamente.`)

      toast({
        title: "Carga de ejemplos completada",
        description: `Se han cargado ${exampleAssets.length} activos de ejemplo.`,
      })

      // Si autoSync está activado, sincronizar con Supabase
      if (autoSync) {
        await syncWithSupabase(exampleAssets)
      }
    } catch (error: any) {
      console.error("Error al cargar ejemplos:", error)
      setImportStatus("error")
      setImportMessage(error.message || "Ha ocurrido un error al cargar los activos de ejemplo.")

      toast({
        title: "Error al cargar ejemplos",
        description: error.message || "Ha ocurrido un error al cargar los activos de ejemplo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const syncWithSupabase = async (assetsToSync: any[]) => {
    try {
      // Primero eliminar todos los activos existentes
      await deleteAllAssets()

      // Luego insertar los nuevos activos
      const mappedAssets = assetsToSync.map(mapAssetToDbSchema)

      const { error } = await supabase.from("activos").insert(mappedAssets)

      if (error) {
        throw new Error(`Error al sincronizar activos: ${error.message}`)
      }

      toast({
        title: "Sincronización completada",
        description: `Se han sincronizado ${assetsToSync.length} activos con Supabase.`,
      })
    } catch (error: any) {
      console.error("Error al sincronizar activos:", error)

      toast({
        title: "Error de sincronización",
        description: error.message || "Ha ocurrido un error al sincronizar los activos.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Importar Activos</CardTitle>
        <CardDescription>Importa activos desde una API externa o carga ejemplos predefinidos.</CardDescription>
      </CardHeader>
      <CardContent>
        {importStatus === "success" && (
          <Alert className="mb-4 bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Importación exitosa</AlertTitle>
            <AlertDescription className="text-green-700">{importMessage}</AlertDescription>
          </Alert>
        )}

        {importStatus === "error" && (
          <Alert className="mb-4" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error de importación</AlertTitle>
            <AlertDescription>{importMessage}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="api" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="api">Importar desde API</TabsTrigger>
            <TabsTrigger value="examples">Cargar Ejemplos</TabsTrigger>
          </TabsList>

          <TabsContent value="api" className="space-y-4">
            <div className="space-y-2">
              <Input
                type="url"
                placeholder="URL de la API (ej: https://api.ejemplo.com/activos)"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </TabsContent>

          <TabsContent value="examples" className="space-y-4">
            <div className="p-4 border rounded-md bg-muted/50">
              <p className="text-sm">
                Se cargarán {exampleAssets.length} activos de ejemplo predefinidos, incluyendo acciones y bonos de
                mercados locales e internacionales.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex items-center space-x-2 mt-6">
          <Switch id="auto-sync" checked={autoSync} onCheckedChange={setAutoSync} />
          <Label htmlFor="auto-sync" className="cursor-pointer">
            Sincronizar automáticamente con Supabase después de importar
          </Label>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">{assets.length > 0 && `${assets.length} activos cargados`}</div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleLoadExamples} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            Cargar Ejemplos
          </Button>
          <Button onClick={handleImportFromApi} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Database className="mr-2 h-4 w-4" />}
            Importar desde API
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
