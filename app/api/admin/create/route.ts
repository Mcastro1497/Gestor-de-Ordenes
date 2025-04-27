import { NextResponse } from "next/server"
import { createAdminUser } from "@/lib/scripts/create-admin-user"

export async function GET() {
  try {
    const result = await createAdminUser()

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        userId: result.userId,
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          message: result.message,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error en API route:", error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    )
  }
}
