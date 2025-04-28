"use client"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { AssetSelectFromSupabase, type AssetOption } from "./asset-select-from-supabase"
import { useFormContext } from "react-hook-form"

interface AssetSelectFieldProps {
  name: string
  label?: string
  description?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  filter?: (asset: AssetOption) => boolean
  onAssetChange?: (asset?: AssetOption) => void
}

export function AssetSelectField({
  name,
  label,
  description,
  placeholder,
  required = false,
  disabled = false,
  filter,
  onAssetChange,
}: AssetSelectFieldProps) {
  const form = useFormContext()

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && (
            <FormLabel>
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </FormLabel>
          )}
          <FormControl>
            <AssetSelectFromSupabase
              value={field.value}
              onValueChange={(value, asset) => {
                field.onChange(value)
                if (onAssetChange) {
                  onAssetChange(asset)
                }
              }}
              placeholder={placeholder}
              disabled={disabled}
              required={required}
              filter={filter}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
