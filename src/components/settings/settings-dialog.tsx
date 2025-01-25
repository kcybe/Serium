"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Settings2, Table2, Save } from "lucide-react"
import { useState, useEffect } from "react"
import { SiteSettings, defaultSettings } from "@/types/settings"
import { db } from "@/lib/db"
import { toast } from "sonner"
import { useTheme } from "next-themes"
import { SettingsTabs } from "./settings-tabs"
import { TableSettings } from "./tabs/table-settings"
import { Tabs, TabsContent } from "@/components/ui/tabs"  // Updated import

const tabs = [
  { value: "general", label: "General", icon: Settings2 },
  { value: "table", label: "Table", icon: Table2 },
  { value: "backup", label: "Backup", icon: Save }
]

export function SettingsDialog() {
  const [open, setOpen] = useState(false)
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const { setTheme } = useTheme()

  useEffect(() => {
    const loadSettings = async () => {
      const savedSettings = await db.settings.get('site-settings')
      if (savedSettings) {
        setSettings(savedSettings)
        setTheme(savedSettings.theme)
      }
    }
    loadSettings()
  }, [])

  const handleSubmit = async (values: SiteSettings) => {
    try {
      await db.settings.put({ ...values, id: 'site-settings' })
      setSettings(values)
      setTheme(values.theme)
      toast.success("Settings saved successfully")
      setOpen(false)
    } catch (error) {
      toast.error("Failed to save settings")
      console.error(error)
    }
  }

  const loadSettings = async () => {
    const savedSettings = await db.settings.get('site-settings')
    if (savedSettings) {
      setSettings(savedSettings)
      setTheme(savedSettings.theme)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <SettingsTabs 
          settings={settings} 
          onSubmit={handleSubmit} 
          onSettingsImported={(newSettings) => {
            setSettings(newSettings)
            window.location.reload()
          }}
        >
          <TabsContent value="table">
            <TableSettings 
              settings={settings} 
              onSubmit={handleSubmit} 
              onSettingsUpdated={loadSettings}
            />
          </TabsContent>
        </SettingsTabs>
      </DialogContent>
    </Dialog>
  )
}