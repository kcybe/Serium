export interface HistoryEntry {
    id?: string  // Make id optional
    itemId: string
    action: 'create' | 'update' | 'delete'
    changes: {
      field: string
      oldValue: any
      newValue: any
    }[]
    timestamp: Date
    userId?: string
  }
  
  export interface HistoryFilter {
    startDate?: Date
    endDate?: Date
    action?: 'create' | 'update' | 'delete'
    itemId?: string
  }