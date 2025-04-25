"use client"

import { useState } from "react"
import { useAssets, useAssetMutations } from "@/hooks/use-assets"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export function AssetsExample() {
  const { data: assets, loading, error, refetch } = useAssets()
  const { createAsset, updateAsset, deleteAsset } = useAssetMutations()
  const { toast } = useToast()
  const [newAssetName, setNewAssetName] = useState("")
  const [newAssetSymbol, setNewAssetSymbol] = useState("")

  const handleCreateAsset = async () => {
    if (!newAssetName || !newAssetSymbol) {
      toast({
        title: "Error",
        description: "Please provide both name and symbol",
        variant: "destructive",
      })
      return
    }

    const { data, error } = await createAsset({
      name: newAssetName,
      symbol: newAssetSymbol,
    })

    if (error) {
      toast({
        title: "Error creating asset",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Asset created",
        description: `Successfully created ${data?.name}`,
      })
      setNewAssetName("")
      setNewAssetSymbol("")
      refetch()
    }
  }

  const handleDeleteAsset = async (id: string) => {
    const { error } = await deleteAsset(id)

    if (error) {
      toast({
        title: "Error deleting asset",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Asset deleted",
        description: "Asset was successfully deleted",
      })
      refetch()
    }
  }

  if (loading) {
    return <div>Loading assets...</div>
  }

  if (error) {
    return <div>Error loading assets: {error.message}</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assets</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input placeholder="Asset Name" value={newAssetName} onChange={(e) => setNewAssetName(e.target.value)} />
            <Input placeholder="Symbol" value={newAssetSymbol} onChange={(e) => setNewAssetSymbol(e.target.value)} />
            <Button onClick={handleCreateAsset}>Add Asset</Button>
          </div>

          <div className="space-y-2">
            {assets?.map((asset) => (
              <div key={asset.id} className="flex items-center justify-between p-2 border rounded">
                <div>
                  <span className="font-medium">{asset.name}</span>
                  <span className="ml-2 text-sm text-muted-foreground">{asset.symbol}</span>
                </div>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteAsset(asset.id)}>
                  Delete
                </Button>
              </div>
            ))}

            {assets?.length === 0 && (
              <div className="text-center py-4 text-muted-foreground">No assets found. Add your first asset above.</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
