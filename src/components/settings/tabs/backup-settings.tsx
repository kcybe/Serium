"use client"

import { Button } from "@/components/ui/button"
import { SettingsSection } from "../settings-layout"
import { Download, Upload, Save, RotateCcw } from "lucide-react"
import { db } from "@/lib/services/db"
import { exportToJson } from "@/lib/services/utils/export-to-json"
import { importFromJson } from "@/lib/services/utils/import-from-json"
import { toast } from "sonner"
import { useRef, useState } from "react"
import { SiteSettings, defaultSettings } from "@/types/settings"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"

interface BackupSettingsProps {
  settings: SiteSettings
  onSettingsImported: (settings: SiteSettings) => void
}

export function BackupSettings({ settings, onSettingsImported }: BackupSettingsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showResetDialog, setShowResetDialog] = useState(false)

  const handleExportAll = async () => {
    try {
      const [inventory, historyLogs] = await Promise.all([
        db.inventory.toArray(),
        db.history.toArray()
      ])
      const backup = {
        settings,
        inventory,
        history: historyLogs
      }
      exportToJson(
        { settings, inventory, history: historyLogs },
        `inventory-backup-${new Date().toISOString().split('T')[0]}.json`
      )
      toast.success("Backup exported successfully")
    } catch (error) {
      toast.error("Failed to export backup")
      console.error(error)
    }
  }

  const handleImportAll = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    try {
      const backup = await importFromJson(file)
      
      // Clear existing data first
      await Promise.all([
        db.inventory.clear(),
        db.history.clear()
      ])

      // Import inventory
      if (backup.inventory) {
        await db.inventory.bulkAdd(backup.inventory)
      }

      // Import history
      if (backup.history) {
        await db.history.bulkAdd(backup.history)
      }

      // Update settings
      if (backup.settings) {
        await db.settings.update('site-settings', {
          ...backup.settings,
          customColumns: backup.settings.customColumns || [],
          categories: backup.settings.categories || [],
          statuses: backup.settings.statuses || []
        })
      }
      
      toast.success('Full backup restored. Please refresh the page to make changes!)')
    } catch (error) {
      toast.error('Invalid backup file')
    }
  }

  const handleFactoryReset = async () => {
    try {
      await Promise.all([
        db.inventory.clear(),
        db.history.clear(),
        db.settings.put({ ...defaultSettings, id: 'site-settings' })
      ])
      onSettingsImported(defaultSettings)
      toast.success("Factory reset completed successfully")
    } catch (error) {
      toast.error("Failed to perform factory reset")
      console.error(error)
    }
    setShowResetDialog(false)
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

      <SettingsSection
        icon={RotateCcw}
        title="Factory Reset"
        description="Reset all settings and data to default state"
      >
        <Button 
          variant="destructive" 
          onClick={() => setShowResetDialog(true)}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset to Factory Defaults
        </Button>
      </SettingsSection>

      <ConfirmationDialog
        open={showResetDialog}
        onOpenChange={setShowResetDialog}
        onConfirm={handleFactoryReset}
        title="Factory Reset"
        description="This will permanently delete all your data and reset all settings to their default values. This action cannot be undone."
        confirmLabel="Reset Everything"
        cancelLabel="Cancel"
      />
    </div>
  )
}