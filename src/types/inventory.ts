export interface InventoryItem {
  id: string
  name: string
  sku: string | number
  quantity: number
  price: number
  category: string
  status: string
  description: string
  location: string
}

export interface AddItemFormValues {
  name: string
  sku: string
  quantity: number
  price: number
  category: string
  status: string
  description: string
  location: string
}