"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts"
import { useInventoryData } from "./hooks/use-dashboard-data"
import { useTheme } from "next-themes"
import { PageTransition } from '@/components/ui/page-transition'
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { chartConfig } from "@/components/ui/chart-config"
import { useTranslation } from "@/hooks/use-translation"
import { useSettings } from "@/hooks/use-settings"

export default function DashboardPage() {
  const { inventoryStats, categoryDistribution, locationDistribution, statusDistribution } = useInventoryData()
  const { theme } = useTheme()
  const settings = useSettings()
  const { t } = useTranslation(settings)

  const getChartColors = (data: Array<{ id: string }>) => {
    return data.map((_, index) => 
      `hsl(var(--chart-${(index % 5) + 1}))`
    )
  }

  const renderPieChart = (title: string, data: Array<{ id: string, value: number }>) => (
    <Card className="h-[400px] flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer
          config={chartConfig}
          className="h-full w-full [&_.recharts-pie-label-text]:fill-foreground"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip 
                content={<ChartTooltip />}
                cursor={{ fill: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
              />
              <Pie
                data={data}
                dataKey="value"
                nameKey="id"
                cx="50%"
                cy="50%"
                innerRadius="35%"
                outerRadius="65%"
                paddingAngle={2}
                label
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getChartColors(data)[index]}
                  />
                ))}
              </Pie>
              <Legend 
                verticalAlign="bottom"
                content={({ payload }) => (
                  <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                    {payload?.map((entry, index) => (
                      <div key={`legend-${index}`} className="flex items-center gap-2 text-xs">
                        <div 
                          className="h-3 w-3 rounded-full" 
                          style={{ backgroundColor: entry.color }}
                        />
                        <span>{(entry.payload as any)?.id}</span>
                        <span className="text-muted-foreground">
                          ({(entry.payload as any)?.value ?? 0} {t('common.items')})
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )

  return (
    <PageTransition>
      <div className="flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">{t('dashboard.totalItems')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{inventoryStats.totalItems}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">{t('dashboard.lowStock')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{inventoryStats.lowStockItems}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">{t('dashboard.totalValue')}</CardTitle>
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
                  <CardTitle className="text-sm font-medium">{t('dashboard.categories')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{inventoryStats.totalCategories}</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {renderPieChart(t('dashboard.categoryDist'), categoryDistribution)}
              {renderPieChart(t('dashboard.locationDist'), locationDistribution)}
              {renderPieChart(t('dashboard.statusDist'), statusDistribution)}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
