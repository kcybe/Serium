import { db } from "./db"
import { InventoryItem } from "@/types/inventory"
import { historyService } from "./history"

export const inventoryService = {
  addItem: async (item: InventoryItem) => {
    await db.inventory.add(item)
    await historyService.trackChange(item.id, 'create', undefined, item)
  },
  
  updateItem: async (id: string, updatedItem: InventoryItem, oldItem: InventoryItem) => {
    await db.inventory.update(id, updatedItem)
    await historyService.trackChange(id, 'update', oldItem, updatedItem)
  },
  
  deleteItem: async (id: string, oldItem: InventoryItem) => {
    await db.inventory.delete(id)
    await historyService.trackChange(id, 'delete', oldItem)
  },

  verifyItem: async (id: string) => {
    const item = await db.inventory.get(id)
    if (!item) throw new Error('Item not found')

    const updatedItem: InventoryItem = {
      ...item,
      lastVerified: new Date(),
      isVerified: true
    }

    await db.inventory.update(id, updatedItem)
    await historyService.trackChange(id, 'update', item, updatedItem)

    return updatedItem
  }
}