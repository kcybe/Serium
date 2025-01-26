"use client"

import { CardTitle } from "@/components/ui/card"
import { SiteSettings } from "@/types/settings"

interface InventoryHeaderProps {
  settings: SiteSettings
}

export function InventoryHeader({ settings }: InventoryHeaderProps) {
  return (
    <CardTitle>{settings.inventoryName || 'Inventory'}</CardTitle>
  )
}