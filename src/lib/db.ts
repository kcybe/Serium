import Dexie, { Table } from 'dexie'
import { InventoryItem } from '@/types/inventory'
import { SiteSettings } from '@/types/settings'
import { HistoryEntry } from '@/types/history'

class InventoryDB extends Dexie {
  inventory!: Table<InventoryItem>
  settings!: Table<SiteSettings>
  history!: Table<HistoryEntry>
  
  constructor() {
    super('inventoryDB')
    this.version(2).stores({
      inventory: 'id, name, sku, description, quantity, price, category, location, status, lastVerified, isVerified',
      settings: 'id, companyName, currency, dateFormat, theme, categories, statuses, lowStockThreshold, defaultCategory, defaultLocation, defaultStatus',
      history: '++id, itemId, action, timestamp'
    })
  }
}

export const db = new InventoryDB()

// Delete existing database if needed
export const resetDatabase = async () => {
  await Dexie.delete('inventoryDB')
  window.location.reload()
}