"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { FilterDropdown } from "./filter-dropdown"
import { Button } from "../../ui/button"
import { toast } from "sonner"
import { InventoryItem } from "@/types/inventory"
import { SiteSettings } from "@/types/settings"
import { useTranslation } from "@/hooks/use-translation"

type SearchParameter = "all" | "name" | "sku" | "location" | "description"

interface SearchFilterProps {
    onSearchChange: (value: string, parameter: SearchParameter) => void
    categories: string[]
    statuses: string[]
    selectedCategories: string[]
    selectedStatuses: string[]
    onCategoriesChange: (categories: string[]) => void
    onStatusesChange: (statuses: string[]) => void
    onClearFilters: () => void  // Add this prop
    data: InventoryItem[]
    onVerify: (id: string, source?: 'scan' | 'button') => void
    settings: SiteSettings  // Add this prop
}
  
export function SearchFilter({ 
    onSearchChange, 
    categories,
    statuses,
    selectedCategories,
    selectedStatuses,
    onCategoriesChange,
    onStatusesChange,
    onClearFilters,
    data,
    onVerify,
    settings
}: SearchFilterProps) {
  const { t } = useTranslation(settings || { language: 'en' } as SiteSettings)
  const [searchParam, setSearchParam] = useState<SearchParameter>("all")
  const [searchValue, setSearchValue] = useState<string>("")
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [barcodeBuffer, setBarcodeBuffer] = useState<{ buffer: string; lastKeyTime: number }>({
    buffer: '',
    lastKeyTime: 0
  })

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Add keyboard shortcut handler
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignore if typing in an input or textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }
      
      // Press '/' to focus search
      if (e.key === '/') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  const handleSearchChange = (value: string) => {
    setSearchValue(value)
    
    // Clear any existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Set a new timeout
    typingTimeoutRef.current = setTimeout(() => {
      onSearchChange(value, searchParam)
    }, 200) // 200ms delay
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [])

  const handleParameterChange = (param: SearchParameter) => {
    setSearchParam(param)
    onSearchChange(searchValue, param)
  }

  const handleClearAll = () => {
    setSearchValue("")
    setSearchParam("all")
    onClearFilters()
  }

  useEffect(() => {
    if (!settings.features?.itemVerification || !settings.features?.scanToVerify) {
      return;
    }

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const currentTime = new Date().getTime()
      const bufferTimeout = 100

      setBarcodeBuffer(prev => {
        if (currentTime - prev.lastKeyTime > bufferTimeout) {
          return {
            buffer: e.key,
            lastKeyTime: currentTime
          }
        }

        if (e.key === 'Enter') {
          const scannedSku = prev.buffer
          const matchingItem = data.find(item => String(item.sku) === scannedSku)
          if (matchingItem) {
            onVerify(matchingItem.id, 'scan');
          } else {
            toast.error(`No item found with SKU: ${scannedSku}`);
          }

          return {
            buffer: '',
            lastKeyTime: currentTime
          }
        }

        return {
          buffer: prev.buffer + e.key,
          lastKeyTime: currentTime
        }
      })
    }

    window.addEventListener('keypress', handleKeyPress)
    return () => window.removeEventListener('keypress', handleKeyPress)
  }, [data, onVerify, settings.features])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            placeholder={t('general.searchPlaceholder')}
            className="pl-8"
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
        <Select value={searchParam} onValueChange={handleParameterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Search by..." />
          </SelectTrigger>
          <SelectContent>
              <SelectItem value="all">{t('filters.all')}</SelectItem>
              <SelectItem value="name">{t('filters.name')}</SelectItem>
              <SelectItem value="sku">{t('filters.sku')}</SelectItem>
              <SelectItem value="location">{t('filters.location')}</SelectItem>
              <SelectItem value="description">{t('filters.description')}</SelectItem>
              </SelectContent>
        </Select>
        <Button 
          variant="outline" 
          onClick={handleClearAll}
          className="flex items-center gap-2"
          disabled={!searchValue && selectedCategories.length === 0 && selectedStatuses.length === 0}
        >
          {t('general.clearFiltersButton')}
        </Button>
      </div>
      <div className="flex gap-2">
        <FilterDropdown
          title={t('table.categoriesTitle')}
          options={categories}
          selectedOptions={selectedCategories}
          onSelectionChange={onCategoriesChange}
        />
        <FilterDropdown
          title={t('table.statusesTitle')}
          options={statuses}
          selectedOptions={selectedStatuses}
          onSelectionChange={onStatusesChange}
        />
      </div>
    </div>
  )
}