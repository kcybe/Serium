"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { DataTable } from "@/components/inventory/table/data-table"
import { type InventoryItem, getColumns } from "@/components/inventory/table/columns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AddItemDialog } from "@/components/inventory/dialogs/add-item-dialog"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { db } from "@/lib/services/db"
import { Skeleton } from "@/components/ui/skeleton"
import { exportToJson } from "@/lib/utils"
import { DataActions } from "@/components/inventory/actions/data-actions"
import { InventoryHeader } from "@/components/inventory/inventory-header"
import { toast } from "sonner"
import { SearchFilter } from "@/components/inventory/filters/search-filter"
import { defaultSettings, SiteSettings } from "@/types/settings"
import { historyService } from '@/lib/services/history'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { PageTransition } from '@/components/ui/page-transition'


export default function InventoryPage() {
    const [data, setData] = useState<InventoryItem[]>([])
    const [loading, setLoading] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [searchValue, setSearchValue] = useState("")
    const [searchParam, setSearchParam] = useState<"all" | "name" | "sku" | "location" | "description">("all")
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
    const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
    const [historyEnabled, setHistoryEnabled] = useState<boolean>(true)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const isVerifying = useRef(false)

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

    const memoizedColumns = useMemo(() => getColumns(settings), [settings])
  
    const loadItems = async () => {
        if (isRefreshing || isLoading) return
        setIsRefreshing(true)
        setIsLoading(true)
        
        try {
          // Load both items and settings in parallel
          const [items, savedSettings] = await Promise.all([
            db.inventory.toArray(),
            db.settings.get('site-settings')
          ])

          const updatedItems = items.map(item => ({
            ...item,
            isVerified: item.lastVerified ? 
              (new Date().getTime() - new Date(item.lastVerified).getTime()) < (24 * 60 * 60 * 1000)
              : false
          }))

          // Check if there are actual changes in the data or settings
          const hasDataChanges = JSON.stringify(updatedItems) !== JSON.stringify(data)
          const hasSettingsChanges = JSON.stringify(savedSettings) !== JSON.stringify(settings)
          
          setData(updatedItems)
          if (savedSettings) {
            setSettings(savedSettings)
          }
          
          if (hasDataChanges || hasSettingsChanges) {
            toast.success("Data refreshed successfully", {
              id: "refresh-data"
            })
          } else {
            toast.info("No changes found", {
              id: "refresh-data"
            })
          }
        } catch (error) {
          console.error("Failed to load items:", error)
          toast.error("Failed to refresh data", {
            id: "refresh-error"
          })
        } finally {
          setIsRefreshing(false)
          setIsLoading(false)
          setLoading(false)
        }
      }
  
    useEffect(() => {
      let mounted = true

      const initializePage = async () => {
        if (!mounted) return
        await loadItems()
        await loadSettings()
      }

      initializePage()

      return () => {
        mounted = false
      }
    }, []) // Only runs once on mount

    const loadSettings = async () => {
        const savedSettings = await db.settings.get('site-settings')  // Changed from 'site' to 'site-settings'
        if (savedSettings) {
          setSettings(savedSettings)
        }
      }

    // Add this effect after your other effects
    useEffect(() => {
      const checkHistoryTracking = async () => {
        const isEnabled = await historyService.isHistoryTrackingEnabled()
        setHistoryEnabled(isEnabled)
      }
      checkHistoryTracking()
    }, [settings])

  const handleAddItem = async (newItem: InventoryItem) => {
    try {
      await historyService.trackChange(newItem.id, 'create', undefined, newItem)
      setData(prev => [...prev, newItem])
      toast.success("Item added successfully")
    } catch (error) {
      console.error(error)
      toast.error("Failed to add item")
    }
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

  const handleUpdateItem = async (id: string, updatedItem: InventoryItem) => {
    try {
      const oldItem = await db.inventory.get(id)
      if (!oldItem) {
        throw new Error('Item not found')
      }
      
      const processedItem: InventoryItem = {
        ...oldItem,
        ...updatedItem,
        sku: updatedItem.sku,
        quantity: Number(updatedItem.quantity),
        price: Number(updatedItem.price)
      }
      
      await db.inventory.update(id, processedItem)
      setData(prev => prev.map(item => item.id === id ? processedItem : item))
      toast.success("Item updated successfully")
    } catch (error) {
      console.error(error)
      toast.error("Failed to update item")
    }
  }

  const handleDeleteItem = async (id: string) => {
    const oldItem = await db.inventory.get(id)
    await db.inventory.delete(id)
    await historyService.trackChange(id, 'delete', oldItem)
    setData(prev => prev.filter(item => item.id !== id))
    toast.success("Item deleted successfully")
  }

  const handleClearFilters = () => {
    setSearchValue("")
    setSearchParam("all")
    setSelectedCategories([])
    setSelectedStatuses([])
  }

  const handleVerify = async (id: string, source: 'scan' | 'button' = 'button') => {
    if (isVerifying.current) return;
    isVerifying.current = true;

    try {
      const item = await db.inventory.get(id);
      if (!item) {
        throw new Error('Item not found');
      }
  
      const updatedItem = {
        ...item,
        lastVerified: new Date(),
        isVerified: true
      };
  
      await db.inventory.update(id, updatedItem);
      await historyService.trackChange(id, 'update', item, updatedItem);
      
      setData(prev => prev.map(i => {
        if (i.id === id) {
          return {
            ...i,
            lastVerified: new Date(),
            isVerified: true
          };
        }
        return i;
      }));
      
      if (source === 'scan') {
        toast.success(`Verified item: ${item.name} (SKU: ${item.sku})`);
      } else {
        toast.success("Item verified successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to verify item");
    } finally {
      setTimeout(() => {
        isVerifying.current = false;
      }, 100);
    }
  };

  return (
    <PageTransition>
      <div className="flex flex-col gap-4 p-8 pt-8">
        {!historyEnabled && (
          <div className="w-full max-w-7xl mx-auto">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>History Tracking Disabled</AlertTitle>
              <AlertDescription>
                History tracking is currently disabled. Enable it in settings to track inventory changes.
              </AlertDescription>
            </Alert>
          </div>
        )}
        <div className="flex justify-center">
          <Card className="w-full max-w-7xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle>
                <InventoryHeader settings={settings} />
              </CardTitle>
              <div className="flex items-center gap-2">
                <AddItemDialog onAddItem={handleAddItem} />
                <DataActions 
                  data={data}
                  onDataImported={(items) => setData(prev => [...prev, ...items])}
                  onRefresh={loadItems} 
                  isRefreshing={isRefreshing} 
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
                  data={data}
                  onVerify={handleVerify}
                  settings={settings}
                />
                <DataTable 
                  columns={memoizedColumns}
                  data={filteredData}
                  onUpdate={(id, updatedItem) => handleUpdateItem(id, updatedItem)}
                  onDelete={handleDeleteItem}
                  handleVerify={handleVerify}
                  settings={settings}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  )
}