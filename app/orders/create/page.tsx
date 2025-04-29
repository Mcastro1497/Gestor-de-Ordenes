"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { OrderCreationForm } from "@/components/new-order-form/order-creation-form"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { getClients, getAssets } from "@/lib/data"
import type { Client, Asset } from "@/lib/types"

export default function CreateOrderPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const [clientsData, assetsData] = await Promise.all([getClients(), getAssets()])
        setClients(clientsData)
        setAssets(assetsData)
        setError(null)
      } catch (err) {
        console.error("Error loading data:", err)
        setError("Error al cargar los datos. Por favor, intenta de nuevo.")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  return (
    <DashboardShell>
      <DashboardHeader heading="Crear Orden" text="Crea una nueva orden para un cliente." />
      <div className="grid gap-8">
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} />
        ) : (
          <OrderCreationForm clients={clients} assets={assets} />
        )}
      </div>
    </DashboardShell>
  )
}

function LoadingState() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  )
}

function ErrorState({ message }: { message: string }) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}
