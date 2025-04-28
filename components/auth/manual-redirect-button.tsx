"use client"

import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

export function ManualRedirectButton({ redirectTo = "/dashboard" }: { redirectTo?: string }) {
  return (
    <Button onClick={() => (window.location.href = redirectTo)} className="w-full mt-4">
      <ExternalLink className="mr-2 h-4 w-4" />
      Ir al Dashboard manualmente
    </Button>
  )
}
