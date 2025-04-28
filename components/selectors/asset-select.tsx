"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { Asset } from "@/lib/types"

interface AssetSelectProps {
  assets: Asset[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export function AssetSelect({
  assets,
  value,
  onChange,
  placeholder = "Seleccionar activo...",
  disabled = false,
}: AssetSelectProps) {
  const [open, setOpen] = React.useState(false)

  // Encontrar el activo seleccionado para mostrar su nombre
  const selectedAsset = React.useMemo(() => {
    return assets.find((asset) => asset.id === value || asset.ticker === value)
  }, [assets, value])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {selectedAsset ? (
            <span className="flex items-center">
              <span className="font-medium">{selectedAsset.ticker}</span>
              {selectedAsset.nombre && <span className="ml-2 text-muted-foreground">{selectedAsset.nombre}</span>}
            </span>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Buscar activo..." />
          <CommandList>
            <CommandEmpty>No se encontraron activos.</CommandEmpty>
            <CommandGroup className="max-h-[300px] overflow-y-auto">
              {assets.map((asset) => (
                <CommandItem
                  key={asset.id || asset.ticker}
                  value={asset.ticker}
                  onSelect={() => {
                    onChange(asset.id || asset.ticker)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === asset.id || value === asset.ticker ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <span className="font-medium">{asset.ticker}</span>
                  {asset.nombre && <span className="ml-2 text-muted-foreground">{asset.nombre}</span>}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
