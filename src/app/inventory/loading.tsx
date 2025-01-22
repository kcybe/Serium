import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Inventory</h2>
        </div>
        <div className="space-y-4">
          <div className="rounded-md border">
            <div className="space-y-4">
              <div className="border-b p-4">
                <Skeleton className="h-8 w-[250px]" />
              </div>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="p-4">
                  <div className="space-y-3">
                    <Skeleton className="h-5 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}