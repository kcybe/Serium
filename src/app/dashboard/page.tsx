"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, PieChart, Pie, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts"
import { useInventoryData } from "./hooks/use-dashboard-data"
import { useTheme } from "next-themes"
import { PageTransition } from '@/components/ui/page-transition'

export default function DashboardPage() {
  const { inventoryStats, categoryDistribution, stockLevels, locationDistribution } = useInventoryData()
  const { theme } = useTheme()

  const textColor = theme === 'dark' ? 'hsl(var(--primary-foreground))' : 'hsl(var(--primary))'

  // Get Shadcn UI colors based on theme
  const getChartColor = () => {
    return theme === 'dark' ? 'var(--primary)' : 'var(--primary)' // Using primary color from globals.css
  }

  const axisStyle = {
    tick: { fill: textColor },
    axisLine: { stroke: 'hsl(var(--muted))' },
    tickLine: { stroke: 'hsl(var(--muted))' }
  }

  return (
    <PageTransition>
      <div className="flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="p-6 h-[400px] flex flex-col">
                <h3 className="text-lg font-semibold mb-4">Stock Levels</h3>
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stockLevels}>
                      <CartesianGrid 
                        strokeDasharray="3 3" 
                        className="stroke-muted"
                      />
                      <XAxis 
                        dataKey="name" 
                        className="text-xs"
                        {...axisStyle}
                      />
                      <YAxis 
                        className="text-xs"
                        {...axisStyle}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--background))',
                          borderColor: 'hsl(var(--border))',
                          borderRadius: 'var(--radius)',
                          color: 'hsl(var(--foreground))'
                        }}
                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                      />
                      <Bar 
                        dataKey="quantity" 
                        className="fill-primary"
                        radius={[4, 4, 0, 0]}
                      >
                        {stockLevels.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={getChartColor()}
                            fillOpacity={0.8}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              
              <Card className="p-6 h-[400px] flex flex-col">
                <h3 className="text-lg font-semibold mb-4">Category Distribution</h3>
                <div className="flex-1 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryDistribution}
                        dataKey="value"
                        nameKey="id"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        className="stroke-background"
                      >
                        {categoryDistribution.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={`hsl(var(--primary) / ${0.3 + (index * 0.1)})`}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--background))',
                          borderColor: 'hsl(var(--border))',
                          borderRadius: 'var(--radius)',
                          color: 'hsl(var(--foreground))'
                        }}
                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                      />
                      <Legend 
                        layout="horizontal"
                        verticalAlign="bottom"
                        align="center"
                        wrapperStyle={{ 
                          paddingTop: '1rem',
                          color: 'hsl(var(--foreground))' 
                        }}
                        iconType="circle"
                        formatter={(value) => (
                          <span className="text-sm">
                            {value}
                          </span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="p-6 h-[400px] flex flex-col">
                <h3 className="text-lg font-semibold mb-4">Location Distribution</h3>
                <div className="flex-1 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={locationDistribution}
                        dataKey="value"
                        nameKey="id"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        className="stroke-background"
                      >
                        {locationDistribution.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={`hsl(var(--primary) / ${0.3 + (index * 0.1)})`}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--background))',
                          borderColor: 'hsl(var(--border))',
                          borderRadius: 'var(--radius)',
                          color: 'hsl(var(--foreground))'
                        }}
                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                      />
                      <Legend 
                        layout="horizontal"
                        verticalAlign="bottom"
                        align="center"
                        wrapperStyle={{ 
                          paddingTop: '1rem',
                          color: 'hsl(var(--foreground))' 
                        }}
                        iconType="circle"
                        formatter={(value) => (
                          <span className="text-sm">
                            {value}
                          </span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
