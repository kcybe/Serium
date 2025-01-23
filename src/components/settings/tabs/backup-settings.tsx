"use client"

import { Button } from "@/components/ui/button"
import { SettingsSection } from "../settings-layout"
import { Download, Upload, Save } from "lucide-react"
import { db } from "@/lib/db"
import { exportToJson, importFromJson } from "@/lib/utils"
import { toast } from "sonner"
import { useRef } from "react"
import { SiteSettings } from "@/types/settings"

interface BackupSettingsProps {
  settings: SiteSettings
  onSettingsImported: (settings: SiteSettings) => void
}

export function BackupSettings({ settings, onSettingsImported }: BackupSettingsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExportAll = async () => {
    try {
      const inventory = await db.inventory.toArray()
      const backup = {
        settings,
        inventory
      }
      exportToJson(backup, `inventory-backup-${new Date().toISOString().split('T')[0]}.json`)
      toast.success("Backup exported successfully")
    } catch (error) {
      toast.error("Failed to export backup")
      console.error(error)
    }
  }

  const handleImportAll = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0]
      if (!file) return

      const importedData = await importFromJson(file)
      if (!importedData?.settings || !importedData?.inventory) {
        throw new Error('Invalid backup format')
      }

      // Clear existing data
      await db.inventory.clear()
      
      // Import inventory items with new IDs
      const itemsWithNewIds = importedData.inventory.map((item: any) => ({
        ...item,
        id: crypto.randomUUID()
      }))
      
      await db.inventory.bulkAdd(itemsWithNewIds)
      await db.settings.put({ ...importedData.settings, id: 'site-settings' })
      
      onSettingsImported(importedData.settings)
      toast.success("Backup imported successfully")
    } catch (error) {
      toast.error("Failed to import backup")
      console.error(error)
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-6">
      <SettingsSection
        icon={Save}
        title="Backup & Restore"
        description="Export or import all data including settings and inventory"
      >
        <input
          type="file"
          ref={fileInputRef}
          accept=".json"
          className="hidden"
          onChange={handleImportAll}
        />
        <div className="flex gap-4">
          <Button onClick={handleExportAll}>
            <Download className="mr-2 h-4 w-4" />
            Export All Data
          </Button>
          <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
            <Upload className="mr-2 h-4 w-4" />
            Import Backup
          </Button>
        </div>
      </SettingsSection>
    </div>
  )
}