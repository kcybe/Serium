import { InventoryItem } from "@/types/inventory"
import { SiteSettings } from "@/types/settings"
import { HistoryEntry } from "@/types/history"

export async function importFromJson(file: File): Promise<{
  inventory: InventoryItem[]
  settings?: SiteSettings
  history?: HistoryEntry[]
}> {
  const text = await file.text()
  const data = JSON.parse(text)
  
  return {
    inventory: data.inventory || data,
    settings: data.settings,
    history: (data.history || []).map((entry: any) => ({
      ...entry,
      timestamp: new Date(entry.timestamp)
    }))
  }
}