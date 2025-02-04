import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex justify-center p-8">
      <div className="w-full max-w-7xl space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32 mx-auto" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-24 mx-auto" />
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[400px]">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-6 w-48 mb-4 mx-auto" />
              <Skeleton className="h-full w-full" />
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}