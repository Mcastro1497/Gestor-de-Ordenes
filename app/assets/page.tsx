import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getAssets } from "@/lib/services/asset-service"

// Add a loading component
function LoadingAssets() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Assets</h1>
      <Card>
        <CardHeader>
          <CardTitle>Available Assets</CardTitle>
          <CardDescription>Loading assets...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[60vh] flex items-center justify-center">
            <div className="animate-pulse text-lg">Loading assets...</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Create a separate component for the assets display
async function AssetsDisplay() {
  const assets = await getAssets()

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Assets</h1>
      <Card>
        <CardHeader>
          <CardTitle>Available Assets</CardTitle>
          <CardDescription>View all available assets in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[60vh]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assets.map((asset) => (
                <Card key={asset.id} className="border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{asset.nombre || asset.name}</CardTitle>
                    <CardDescription>{asset.tipo || asset.type}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="font-medium">Symbol:</div>
                      <div>{asset.simbolo || asset.symbol}</div>
                      {(asset.isin || asset.isin) && (
                        <>
                          <div className="font-medium">ISIN:</div>
                          <div>{asset.isin}</div>
                        </>
                      )}
                      {(asset.moneda || asset.currency) && (
                        <>
                          <div className="font-medium">Currency:</div>
                          <div>{asset.moneda || asset.currency}</div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

// Main page component with suspense boundary
export default function AssetsPage() {
  return (
    <Suspense fallback={<LoadingAssets />}>
      <AssetsDisplay />
    </Suspense>
  )
}
