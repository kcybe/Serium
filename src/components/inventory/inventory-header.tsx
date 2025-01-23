"use client"

import { CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { db } from "@/lib/db"
import { defaultSettings, SiteSettings } from "@/types/settings"

export function InventoryHeader() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)

  useEffect(() => {
    const loadSettings = async () => {
      const savedSettings = await db.settings.get('site-settings')
      if (savedSettings) {
        setSettings(savedSettings)
      }
    }
    loadSettings()
  }, [])

  return (
    <CardTitle>{settings.inventoryName || 'Inventory'}</CardTitle>
  )
}