"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Download, Upload, RotateCw } from "lucide-react"
import { useRef } from "react"
import { toast } from "sonner"
import { db } from "@/lib/db"
import { exportToJson, importFromJson } from "@/lib/utils"
import { InventoryItem } from "@/types/inventory"

interface DataActionsProps {
  data: InventoryItem[]
  onDataImported: (items: InventoryItem[]) => void
  onRefresh: () => void
}

export function DataActions({ data, onDataImported, onRefresh }: DataActionsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExport = () => {
    exportToJson(data, `inventory-${new Date().toISOString().split('T')[0]}.json`)
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0]
      if (!file) return
  
      const importedData = await importFromJson(file)
      if (!Array.isArray(importedData)) throw new Error('Invalid data format')
  
      // Generate new IDs for imported items
      const itemsWithNewIds = importedData.map(item => ({
        ...item,
        id: crypto.randomUUID()
      }))
  
      await db.inventory.bulkAdd(itemsWithNewIds)
      onDataImported(itemsWithNewIds)
      toast.success("Data imported successfully")
    } catch (error) {
      toast.error("Failed to import data")
      console.error(error)
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        accept=".json"
        className="hidden"
        onChange={handleImport}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onRefresh}>
            <RotateCw className="mr-2 h-4 w-4" />
            Refresh
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
            <Upload className="mr-2 h-4 w-4" />
            Import Data
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}