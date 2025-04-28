"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { createClient } from "@/lib/supabase/client"
import { Skeleton } from "@/components/ui/skeleton"

export type AssetOption = {
  value: string
  label: string
  ticker: string
  nombre: string
  mercado?: string
  moneda?: string
  tipo?: string
}

interface AssetSelectFromSupabaseProps {
  value?: string
  onValueChange: (value: string, asset?: AssetOption) => void
  placeholder?: string
  disabled?: boolean
  required?: boolean
  filter?: (asset: AssetOption) => boolean
}

export function AssetSelectFromSupabase({
  value,
  onValueChange,
  placeholder = "Seleccionar activo...",
  disabled = false,
  required = false,
  filter,
}: AssetSelectFromSupabaseProps) {
  const [open, setOpen] = React.useState(false)
  const [assets, setAssets] = React.useState<AssetOption[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState("")

  // Cargar activos desde Supabase
  React.useEffect(() => {
    const fetchAssets = async () => {
      setLoading(true)
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("activos")
          .select("id, ticker, nombre, mercado, moneda, tipo")
          .order("ticker")

        if (error) {
          console.error("Error al cargar activos:", error)
          return
        }

        const formattedAssets = data.map((asset) => ({
          value: asset.id,
          label: `${asset.ticker} - ${asset.nombre}`,
          ticker: asset.ticker,
          nombre: asset.nombre,
          mercado: asset.mercado,
          moneda: asset.moneda,
          tipo: asset.tipo,
        }))

        setAssets(formattedAssets)
      } catch (error) {
        console.error("Error al cargar activos:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAssets()
  }, [])

  // Filtrar activos según el criterio proporcionado
  const filteredAssets = React.useMemo(() => {
    let result = assets

    // Aplicar filtro personalizado si se proporciona
    if (filter) {
      result = result.filter(filter)
    }

    // Aplicar filtro de búsqueda
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (asset) =>
          asset.ticker.toLowerCase().includes(query) ||
          asset.nombre.toLowerCase().includes(query) ||
          asset.mercado?.toLowerCase().includes(query) ||
          asset.moneda?.toLowerCase().includes(query) ||
          asset.tipo?.toLowerCase().includes(query),
      )
    }

    return result
  }, [assets, filter, searchQuery])

  // Encontrar el activo seleccionado
  const selectedAsset = React.useMemo(() => {
    return assets.find((asset) => asset.value === value)
  }, [assets, value])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", !value && "text-muted-foreground")}
          disabled={disabled}
        >
          {loading ? (
            <Skeleton className="h-4 w-[150px]" />
          ) : value && selectedAsset ? (
            <span className="truncate">{selectedAsset.label}</span>
          ) : (
            <span>{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command shouldFilter={false}>
          <CommandInput placeholder="Buscar activo..." value={searchQuery} onValueChange={setSearchQuery} />
          <CommandList>
            <CommandEmpty>No se encontraron activos.</CommandEmpty>
            <CommandGroup>
              {loading ? (
                <div className="p-2 space-y-1">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ) : (
                filteredAssets.map((asset) => (
                  <CommandItem
                    key={asset.value}
                    value={asset.value}
                    onSelect={() => {
                      onValueChange(asset.value, asset)
                      setOpen(false)
                    }}
                  >
                    <Check className={cn("mr-2 h-4 w-4", value === asset.value ? "opacity-100" : "opacity-0")} />
                    <div className="flex flex-col">
                      <span className="font-medium">{asset.ticker}</span>
                      <span className="text-xs text-muted-foreground truncate">{asset.nombre}</span>
                    </div>
                  </CommandItem>
                ))
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
