import { createClient } from "@/lib/supabase/server"
import type { Database } from "@/lib/supabase/database.types"

/**
 * Fetches all assets from the database
 * @returns Array of assets
 */
export async function getAssets() {
  try {
    const supabase = createClient()
    const { data: assets, error } = await supabase.from("activos").select("*").order("ticker")

    if (error) {
      console.error("Error al obtener activos:", error)
      throw new Error(`Error al obtener activos: ${error.message}`)
    }

    return assets || []
  } catch (error) {
    console.error("Error en getAssets:", error)
    return []
  }
}

/**
 * Fetches an asset by its ID
 * @param id Asset ID
 * @returns Asset object or null if not found
 */
export async function getAssetById(id: string) {
  const supabase = createClient()

  const { data, error } = await supabase.from("activos").select("*").eq("id", id).single()

  if (error && error.code !== "PGSQL_ERROR_NO_ROWS") {
    console.error("Error al obtener activo por ID:", error)
    throw new Error(`Error al obtener activo: ${error.message}`)
  }

  return data
}

/**
 * Creates a new asset in the database
 * @param asset Asset data to create
 * @returns Created asset
 */
export async function createAsset(asset: Omit<Database["public"]["Tables"]["activos"]["Insert"], "id">) {
  const supabase = createClient()

  const { data, error } = await supabase.from("activos").insert(asset).select().single()

  if (error) {
    console.error("Error al crear activo:", error)
    throw new Error(`Error al crear activo: ${error.message}`)
  }

  return data
}

/**
 * Updates an existing asset in the database
 * @param id Asset ID
 * @param asset Updated asset data
 * @returns Updated asset
 */
export async function updateAsset(id: string, asset: Partial<Database["public"]["Tables"]["activos"]["Update"]>) {
  const supabase = createClient()

  const { data, error } = await supabase.from("activos").update(asset).eq("id", id).select().single()

  if (error) {
    console.error("Error al actualizar activo:", error)
    throw new Error(`Error al actualizar activo: ${error.message}`)
  }

  return data
}

/**
 * Deletes an asset from the database
 * @param id Asset ID to delete
 * @returns Success status
 */
export async function deleteAsset(id: string) {
  const supabase = createClient()

  const { error } = await supabase.from("activos").delete().eq("id", id)

  if (error) {
    console.error("Error al eliminar activo:", error)
    throw new Error(`Error al eliminar activo: ${error.message}`)
  }

  return true
}

/**
 * Deletes all assets from the database
 * @returns Success status
 */
export async function deleteAllAssets() {
  const supabase = createClient()

  const { error } = await supabase.from("activos").delete().neq("id", "00000000-0000-0000-0000-000000000000")

  if (error) {
    console.error("Error al eliminar todos los activos:", error)
    throw new Error(`Error al eliminar todos los activos: ${error.message}`)
  }

  return true
}

/**
 * Maps a local asset to the database schema
 * @param asset Local asset object
 * @returns Asset object formatted for the database
 */
export function mapAssetToDbSchema(asset: any) {
  return {
    ticker: asset.ticker || asset.symbol,
    nombre: asset.name || asset.nombre,
    descripcion: asset.description || asset.descripcion || "",
    mercado: asset.market || asset.mercado || "",
    moneda: asset.currency || asset.moneda || "",
    tipo: asset.type || asset.tipo || "",
    precio_ultimo: asset.lastPrice || asset.precio_ultimo || 0,
  }
}
