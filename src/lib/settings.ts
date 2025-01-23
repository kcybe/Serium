export interface SiteSettings {
    inventoryName: string
    currency: string
    dateFormat: string
    theme: 'light' | 'dark' | 'system'
    lowStockThreshold: number
    defaultCategory: string
    defaultLocation: string
    defaultStatus: string
  }
  
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
  }