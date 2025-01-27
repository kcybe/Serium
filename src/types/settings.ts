export interface SiteSettings {
  id?: string
  inventoryName: string
  theme: "light" | "dark" | "system"
  currency: string
  dateFormat: string
  lowStockThreshold: number
  defaultCategory: string
  defaultLocation: string
  defaultStatus: string
  categories: string[]
  statuses: string[]
  features: {
    barcodeScanning?: boolean
    qrCodeSupport?: boolean
    historyTracking?: boolean
    notifications?: boolean
    itemVerification?: boolean
    verificationTimeout?: number
    verificationTimeoutUnit?: 'minutes' | 'hours' | 'days'
    [key: string]: boolean | number | string | undefined
  }
}

export const defaultSettings: SiteSettings = {
  inventoryName: "My Inventory",
  theme: "system",
  currency: "USD",
  dateFormat: "MM/DD/YYYY",
  lowStockThreshold: 10,
  defaultCategory: "General",
  defaultLocation: "Main Storage",
  defaultStatus: "In Stock",
  categories: ["General", "Electronics", "Office Supplies"],
  statuses: ["In Stock", "Low Stock", "Out of Stock"],
  features: {
    barcodeScanning: false,
    qrCodeSupport: false,
    historyTracking: false,
    notifications: false,
    itemVerification: false,
    verificationTimeout: 7,
    verificationTimeoutUnit: 'days'
  }
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