export interface SiteSettings {
    companyName: string
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
    companyName: string
    currency: string
    dateFormat: string
    theme: 'light' | 'dark' | 'system'
    lowStockThreshold: number
    defaultCategory: string
    defaultLocation: string
    defaultStatus: string
  }