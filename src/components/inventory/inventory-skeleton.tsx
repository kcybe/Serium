// src/app/inventory/components/inventory-skeleton.tsx
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function InventorySkeleton() {
  return (
    <div className="flex justify-center space-y-4 p-8 pt-8">
      <Card className="w-full max-w-7xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <Skeleton className="h-8 w-[100px]" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-[100px]" />
            <Skeleton className="h-10 w-[100px]" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
