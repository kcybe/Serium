"use client"

import { useState, useEffect, useMemo } from "react"
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
import { InventoryHeader } from "@/components/inventory/inventory-header"
import { toast } from "sonner"
import { SearchFilter } from "@/components/inventory/search-filter"
import { defaultSettings, SiteSettings } from "@/types/settings"


export default function InventoryPage() {
    const [data, setData] = useState<InventoryItem[]>([])
    const [loading, setLoading] = useState(true)

    const [searchValue, setSearchValue] = useState("")
    const [searchParam, setSearchParam] = useState<"all" | "name" | "sku" | "location" | "description">("all")

    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
    const [settings, setSettings] = useState<SiteSettings>(defaultSettings)

    const filteredData = useMemo(() => {
        let filtered = data

        // Filter by search
        if (searchValue) {
          filtered = filtered.filter(item => {
            const searchLower = searchValue.toLowerCase()
            if (searchParam === "all") {
              return (
                String(item.name || '').toLowerCase().includes(searchLower) ||
                String(item.sku || '').toLowerCase().includes(searchLower) ||
                String(item.location || '').toLowerCase().includes(searchLower) ||
                String(item.description || '').toLowerCase().includes(searchLower)
              )
            }
            return String(item[searchParam] || '').toLowerCase().includes(searchLower)
          })
        }

        // Filter by categories
        if (selectedCategories.length > 0) {
          filtered = filtered.filter(item => selectedCategories.includes(item.category))
        }

        // Filter by statuses
        if (selectedStatuses.length > 0) {
          filtered = filtered.filter(item => selectedStatuses.includes(item.status))
        }

        return filtered
    }, [data, searchValue, searchParam, selectedCategories, selectedStatuses])
  
    const loadItems = async () => {
        setLoading(true)  // Add this line
        try {
          const items = await db.inventory.toArray()
          setData(items)
          toast.success("Data refreshed successfully")  // Add this line
        } catch (error) {
          console.error("Failed to load items:", error)
          toast.error("Failed to refresh data")  // Add this line
        } finally {
          setLoading(false)
        }
      }
  
    useEffect(() => {
      loadItems()
    }, [])

    const loadSettings = async () => {
        const savedSettings = await db.settings.get('site-settings')  // Changed from 'site' to 'site-settings'
        if (savedSettings) {
          setSettings(savedSettings)
        }
      }

      useEffect(() => {
        loadItems()
        loadSettings()
      }, [])
      
      // Add a new effect to watch settings changes
      useEffect(() => {
        loadSettings()
      }, [settings])

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

  const handleClearFilters = () => {
    setSearchValue("")
    setSearchParam("all")
    setSelectedCategories([])
    setSelectedStatuses([])
  }

  return (
    <div className="flex justify-center space-y-4 p-8 pt-8">
      <Card className="w-full max-w-7xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>
            <InventoryHeader />
          </CardTitle>
          <div className="flex items-center gap-2">
            <AddItemDialog onAddItem={handleAddItem} />
            <DataActions 
              data={data} 
              onDataImported={(items) => setData(prev => [...prev, ...items])} 
              onRefresh={loadItems}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <SearchFilter 
              onSearchChange={(value, param) => {
                setSearchValue(value)
                setSearchParam(param)
              }}
              categories={settings.categories}
              statuses={settings.statuses}
              selectedCategories={selectedCategories}
              selectedStatuses={selectedStatuses}
              onCategoriesChange={setSelectedCategories}
              onStatusesChange={setSelectedStatuses}
              onClearFilters={handleClearFilters}
            />
            <DataTable 
              columns={columns} 
              data={filteredData}  // Changed from data to filteredData
              onUpdate={handleUpdateItem}
              onDelete={handleDeleteItem}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}