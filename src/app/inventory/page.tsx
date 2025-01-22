"use client"

import { useState, useEffect } from "react"
import { DataTable } from "@/components/inventory/data-table"
import { columns, type InventoryItem } from "@/components/inventory/columns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AddItemDialog } from "@/components/inventory/add-item-dialog"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { db } from "@/lib/db"
import { Skeleton } from "@/components/ui/skeleton"
import { exportToJson } from "@/lib/utils"
import { DataActions } from "@/components/inventory/data-actions"

export default function InventoryPage() {
  const [data, setData] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadItems = async () => {
      try {
        const items = await db.inventory.toArray()
        setData(items)
      } catch (error) {
        console.error("Failed to load items:", error)
      } finally {
        setLoading(false)
      }
    }

    loadItems()
  }, [])

  const handleAddItem = (newItem: InventoryItem) => {
    setData(prev => [...prev, newItem])
  }

  const handleExport = () => {
    exportToJson(data, `inventory-${new Date().toISOString().split('T')[0]}.json`)
  }

  if (loading) {
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
    )
  }

  const handleUpdateItem = (updatedItem: InventoryItem) => {
    setData(prev => prev.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    ))
  }

  const handleDeleteItem = (deletedItem: InventoryItem) => {
    setData(prev => prev.filter(item => item.id !== deletedItem.id))
  }

  return (
    <div className="flex justify-center space-y-4 p-8 pt-8">
      <Card className="w-full max-w-7xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Inventory</CardTitle>
          <div className="flex items-center gap-2">
            <AddItemDialog onAddItem={handleAddItem} />
            <DataActions 
              data={data} 
              onDataImported={(items: InventoryItem[]) => setData(prev => [...prev, ...items])} 
            />
          </div>
        </CardHeader>
        <CardContent>
        <DataTable 
            columns={columns} 
            data={data} 
            onUpdate={handleUpdateItem}
            onDelete={handleDeleteItem}
        />
        </CardContent>
      </Card>
    </div>
  )
}