"use client"

import { useState } from "react"
import { useClients, useClientMutations } from "@/hooks/use-clients"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export function ClientsExample() {
  const { data: clients, loading, error, refetch } = useClients()
  const { createClient, deleteClient } = useClientMutations()
  const { toast } = useToast()
  const [newClientName, setNewClientName] = useState("")
  const [newClientEmail, setNewClientEmail] = useState("")

  const handleCreateClient = async () => {
    if (!newClientName) {
      toast({
        title: "Error",
        description: "Please provide a client name",
        variant: "destructive",
      })
      return
    }

    const { data, error } = await createClient({
      name: newClientName,
      email: newClientEmail || null,
    })

    if (error) {
      toast({
        title: "Error creating client",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Client created",
        description: `Successfully created ${data?.name}`,
      })
      setNewClientName("")
      setNewClientEmail("")
      refetch()
    }
  }

  const handleDeleteClient = async (id: string) => {
    const { error } = await deleteClient(id)

    if (error) {
      toast({
        title: "Error deleting client",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Client deleted",
        description: "Client was successfully deleted",
      })
      refetch()
    }
  }

  if (loading) {
    return <div>Loading clients...</div>
  }

  if (error) {
    return <div>Error loading clients: {error.message}</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Clients</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input placeholder="Client Name" value={newClientName} onChange={(e) => setNewClientName(e.target.value)} />
            <Input
              placeholder="Email (optional)"
              value={newClientEmail}
              onChange={(e) => setNewClientEmail(e.target.value)}
            />
            <Button onClick={handleCreateClient}>Add Client</Button>
          </div>

          <div className="space-y-2">
            {clients?.map((client) => (
              <div key={client.id} className="flex items-center justify-between p-2 border rounded">
                <div>
                  <span className="font-medium">{client.name}</span>
                  {client.email && <span className="ml-2 text-sm text-muted-foreground">{client.email}</span>}
                </div>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteClient(client.id)}>
                  Delete
                </Button>
              </div>
            ))}

            {clients?.length === 0 && (
              <div className="text-center py-4 text-muted-foreground">
                No clients found. Add your first client above.
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
