import { db } from './db'
import { HistoryEntry, HistoryFilter } from '@/types/history'
import { InventoryItem } from '@/types/inventory'
import { toast } from 'sonner'

export const historyService = {
  async isHistoryTrackingEnabled() {
    const settings = await db.settings.get('site-settings')
    return settings?.features?.historyTracking ?? false
  },

  async trackChange(
    itemId: string,
    action: 'create' | 'update' | 'delete',
    oldData?: Partial<InventoryItem>,
    newData?: Partial<InventoryItem>
  ) {
    const isEnabled = await this.isHistoryTrackingEnabled()
    if (!isEnabled) {
      return { success: false, reason: 'disabled' }
    }
    
    const changes = []
    
    if (action === 'create' && newData) {
      const entries = Object.entries(newData)
      if (entries.length > 0) {
        changes.push(...entries.map(([field, value]) => ({
          field,
          oldValue: null,
          newValue: value ?? null
        })))
      }
    } else if (action === 'delete' && oldData) {
      const entries = Object.entries(oldData)
      if (entries.length > 0) {
        changes.push(...entries.map(([field, value]) => ({
          field,
          oldValue: value ?? null,
          newValue: null
        })))
      }
    } else if (oldData && newData) {
      const allKeys = Object.keys(oldData)
      if (allKeys.length > 0) {
        allKeys.forEach(key => {
          const typedKey = key as keyof InventoryItem
          const oldValue = String(oldData[typedKey])
          const newValue = String(newData[typedKey])
          if (oldValue !== newValue) {
            changes.push({
              field: key,
              oldValue: oldData[typedKey] ?? null,
              newValue: newData[typedKey] ?? null
            })
          }
        })
      }
    }

    const historyEntry: Omit<HistoryEntry, 'id'> = {
      itemId,
      action,
      changes,
      timestamp: new Date(),
    }

    await db.history.add(historyEntry)
    return { success: true }
  },
  async getHistory(filter?: HistoryFilter) {
    let query = db.history
      .orderBy('timestamp')
      .reverse();

    if (filter) {
      if (filter.startDate) {
        query = query.filter(entry => entry.timestamp >= filter.startDate!)
      }
      if (filter.endDate) {
        query = query.filter(entry => entry.timestamp <= filter.endDate!)
      }
      if (filter.action && filter.action !== 'all' as string) {
        query = query.filter(entry => entry.action === filter.action)
      }
      if (filter.itemId && filter.searchParameter) {
        const searchLower = filter.itemId.toLowerCase()
        switch (filter.searchParameter) {
          case "itemId":
            query = query.filter(entry => 
              entry.itemId.toLowerCase().includes(searchLower)
            )
            break
          case "action":
            query = query.filter(entry => 
              entry.action.toLowerCase().includes(searchLower)
            )
            break
          case "changes":
            query = query.filter(entry => 
              entry.changes.some(change => 
                change.field.toLowerCase().includes(searchLower) ||
                String(change.oldValue).toLowerCase().includes(searchLower) ||
                String(change.newValue).toLowerCase().includes(searchLower)
              )
            )
            break
          case "all":
            query = query.filter(entry => 
              entry.itemId.toLowerCase().includes(searchLower) ||
              entry.action.toLowerCase().includes(searchLower) ||
              entry.changes.some(change => 
                change.field.toLowerCase().includes(searchLower) ||
                String(change.oldValue).toLowerCase().includes(searchLower) ||
                String(change.newValue).toLowerCase().includes(searchLower)
              )
            )
            break
        }
      }
    }

    return query.sortBy('timestamp');
  },
  getSettings: () => db.settings.get('site-settings'),
  getInventory: () => db.inventory.toArray(),
}