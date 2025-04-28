"use client"

import { useEffect } from "react"

export function DirectRedirect({ to = "/dashboard" }: { to?: string }) {
  useEffect(() => {
    // Usar window.location.href para una redirección completa
    window.location.href = to
  }, [to])

  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Redirigiendo...</h2>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4">
          Si no eres redirigido automáticamente,{" "}
          <a href={to} className="text-primary hover:underline">
            haz clic aquí
          </a>
        </p>
      </div>
    </div>
  )
}
