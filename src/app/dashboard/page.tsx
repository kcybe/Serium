"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveBar } from "@nivo/bar"
import { ResponsivePie } from "@nivo/pie"
import { useInventoryData } from "./hooks/use-dashboard-data"

export default function DashboardPage() {
  const { inventoryStats, categoryDistribution, stockLevels } = useInventoryData()

  return (
    <div className="p-8 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventoryStats.totalItems}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventoryStats.lowStockItems}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {inventoryStats.totalValue.toLocaleString("en-US", {
                style: "currency",
                currency: "USD"
              })}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventoryStats.totalCategories}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6 h-[400px] flex flex-col">
          <h3 className="text-lg font-semibold mb-4">Stock Levels</h3>
          <div className="flex-1">
            <ResponsiveBar
              data={stockLevels}
              keys={["quantity"]}
              indexBy="name"
              layout="horizontal"
              margin={{ top: 20, right: 20, bottom: 40, left: 80 }}
              padding={0.3}
              colors={{ scheme: "nivo" }}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
              }}
              labelSkipWidth={12}
              labelSkipHeight={12}
            />
          </div>
        </Card>
        
        <Card className="p-6 h-[400px] flex flex-col">
          <h3 className="text-lg font-semibold mb-4">Category Distribution</h3>
          <div className="flex-1 relative">
            <ResponsivePie
              data={categoryDistribution}
              margin={{ top: 0, right: 20, bottom: 40, left: 20 }}
              innerRadius={0.5}
              padAngle={0.5}
              cornerRadius={2}
              colors={{ scheme: "nivo" }}
              enableArcLabels={false}
              arcLinkLabelsSkipAngle={15}
              arcLinkLabelsThickness={2}
              legends={[
                {
                  anchor: 'bottom',
                  direction: 'row',
                  translateY: 30,
                  translateX: 20,
                  itemWidth: 80,
                  itemHeight: 14,
                  symbolSize: 10,
                  symbolShape: 'circle',
                  itemTextColor: '#999',
                }
              ]}
            />
          </div>
        </Card>
      </div>
    </div>
  )
}
