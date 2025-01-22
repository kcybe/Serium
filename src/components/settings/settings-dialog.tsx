"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Settings2 } from "lucide-react"
import { SettingsForm } from "./settings-form"
import { useState, useEffect } from "react"
import { SiteSettings, defaultSettings } from "@/types/settings"
import { db } from "@/lib/db"
import { toast } from "sonner"
import { useTheme } from "next-themes"

export function SettingsDialog() {
  const [open, setOpen] = useState(false)
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const { setTheme } = useTheme()

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = await db.settings.get('site-settings')
        if (savedSettings) {
          setSettings({
            ...defaultSettings,
            ...savedSettings,
            categories: savedSettings.categories || defaultSettings.categories,
            statuses: savedSettings.statuses || defaultSettings.statuses
          })
          setTheme(savedSettings.theme)
        } else {
          const defaultWithId = { ...defaultSettings, id: 'site-settings' }
          await db.settings.put(defaultWithId)
          setSettings(defaultWithId)
        }
      } catch (error) {
        console.error("Failed to load settings:", error)
      }
    }

    if (open) {
      loadSettings()
    }
  }, [open, setTheme])

  const handleSubmit = async (values: SiteSettings) => {
    try {
      const settingsWithId = { ...values, id: 'site-settings' }
      await db.settings.put(settingsWithId)
      setSettings(settingsWithId)
      setTheme(values.theme)
      setOpen(false)
      toast.success("Settings saved successfully")
    } catch (error) {
      toast.error("Failed to save settings")
      console.error(error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <SettingsForm settings={settings} onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  )
}