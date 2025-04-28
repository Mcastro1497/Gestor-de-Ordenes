import { createServerOnlyClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createServerOnlyClient()
    const { data: assets, error } = await supabase.from("activos").select("*").order("nombre")

    if (error) {
      console.error("Error fetching assets:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(assets || [])
  } catch (error) {
    console.error("Error in assets API route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
