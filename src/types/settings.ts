export interface SiteSettings {
    id?: string
    inventoryName: string
    currency: string
    dateFormat: string
    theme: 'light' | 'dark' | 'system'
    lowStockThreshold: number
    defaultCategory: string
    defaultLocation: string
    defaultStatus: string
    categories: string[]
    statuses: string[]
  }
  
  export const defaultSettings: SiteSettings = {
    inventoryName: 'Inventory Manager',
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    theme: 'system',
    lowStockThreshold: 10,
    defaultCategory: 'General',
    defaultLocation: 'Main Warehouse',
    defaultStatus: 'In Stock',
    categories: ['General', 'Electronics', 'Office Supplies'],
    statuses: ['In Stock', 'Low Stock', 'Out of Stock']
  }

  export const currencyOptions = [
    { label: 'USD ($)', value: 'USD' },
    { label: 'EUR (€)', value: 'EUR' },
    { label: 'GBP (£)', value: 'GBP' }
  ]
  
  export const dateFormatOptions = [
    { label: 'MM/DD/YYYY', value: 'MM/DD/YYYY' },
    { label: 'DD/MM/YYYY', value: 'DD/MM/YYYY' },
    { label: 'YYYY-MM-DD', value: 'YYYY-MM-DD' }
  ]
  
  export const themeOptions = [
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' },
    { label: 'System', value: 'system' }
  ]