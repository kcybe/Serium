import Dexie, { Table } from 'dexie'
import { InventoryItem } from '@/types/inventory'
import { SiteSettings } from '@/types/settings'

export class InventoryDB extends Dexie {
  inventory!: Table<InventoryItem>
  settings!: Table<SiteSettings>
  
  constructor() {
    super('inventoryDB')
    this.version(4).stores({ // Increment version to force schema update
      inventory: '++id, name, sku, description, quantity, price, category, location, status',
      settings: 'id, companyName, currency, dateFormat, theme, categories, statuses, lowStockThreshold, defaultCategory, defaultLocation, defaultStatus'
    })
  }
}

export const db = new InventoryDB()