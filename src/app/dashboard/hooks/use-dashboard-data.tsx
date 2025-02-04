"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/services/db"
import { SiteSettings } from "@/types/settings"
import { InventoryItem } from "@/types/inventory"

interface DashboardData {
  inventoryStats: {
    totalItems: number
    lowStockItems: number
    totalValue: number
    totalCategories: number
  }
  categoryDistribution: Array<{ 
    id: string
    name: string 
    value: number 
  }>
  stockLevels: Array<{ 
    name: string 
    quantity: number 
  }>
  locationDistribution: Array<{ 
    id: string
    name: string 
    value: number 
  }>
  statusDistribution: Array<{ 
    id: string
    name: string 
    value: number 
  }>
}

export function useInventoryData() {
  const [data, setData] = useState<DashboardData>({
    inventoryStats: { totalItems: 0, lowStockItems: 0, totalValue: 0, totalCategories: 0 },
    categoryDistribution: [],
    stockLevels: [],
    locationDistribution: [],
    statusDistribution: []
  })
  const [settings, setSettings] = useState<SiteSettings>()

  useEffect(() => {
    const loadData = async () => {
      const [inventory, settings] = await Promise.all([
        db.inventory.toArray(),
        db.settings.get('site-settings')
      ])
      
      setSettings(settings)
      processInventoryData(inventory)
    }
    
    loadData()
  }, [])

  const processInventoryData = (inventory: InventoryItem[]) => {
    const categories = new Map<string, number>()
    let totalValue = 0
    let lowStockItems = 0
    const locations = new Map<string, number>()
    const statuses = new Map<string, number>()

    inventory.forEach(item => {
      totalValue += item.price * item.quantity
      if(item.quantity < (settings?.lowStockThreshold || 10)) lowStockItems++
      
      categories.set(item.category, (categories.get(item.category) || 0) + 1)
      locations.set(item.location, (locations.get(item.location) || 0) + 1)
      statuses.set(item.status, (statuses.get(item.status) || 0) + 1)
    })

    setData({
      inventoryStats: {
        totalItems: inventory.length,
        lowStockItems,
        totalValue,
        totalCategories: categories.size
      },
      categoryDistribution: Array.from(categories)
        .map(([id, value]) => ({
          id,
          name: id,
          value
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 8),
      stockLevels: Array.from(
        inventory.reduce((acc, item) => {
          const status = item.status || 'Unknown';
          acc.set(status, (acc.get(status) || 0) + item.quantity);
          return acc;
        }, new Map<string, number>()),
        ([name, quantity]) => ({ 
          name, 
          quantity: Math.round(quantity * 100) / 100 
        })
      ).sort((a, b) => b.quantity - a.quantity),
      locationDistribution: Array.from(locations)
        .map(([id, value]) => ({
          id,
          name: id,
          value
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 8),
      statusDistribution: Array.from(statuses)
        .map(([id, value]) => ({
          id,
          name: id,
          value
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 8)
    })
  }

  return data
}