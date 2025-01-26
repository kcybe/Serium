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
import { Button } from "../ui/button"

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
  }
  
  export function SearchFilter({ 
    onSearchChange, 
    categories,
    statuses,
    selectedCategories,
    selectedStatuses,
    onCategoriesChange,
    onStatusesChange,
    onClearFilters
  }: SearchFilterProps) {
  const [searchParam, setSearchParam] = useState<SearchParameter>("all")
  const [searchValue, setSearchValue] = useState<string>("")
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

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

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            placeholder="Type / to search inventory..."
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
              <SelectItem value="all">All Parameters</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="sku">SKU</SelectItem>
              <SelectItem value="location">Location</SelectItem>
              <SelectItem value="description">Description</SelectItem>
              </SelectContent>
        </Select>
        <Button 
          variant="outline" 
          onClick={handleClearAll}
          className="flex items-center gap-2"
          disabled={!searchValue && selectedCategories.length === 0 && selectedStatuses.length === 0}
        >
          Clear Filters
        </Button>
      </div>
      <div className="flex gap-2">
        <FilterDropdown
          title="Categories"
          options={categories}
          selectedOptions={selectedCategories}
          onSelectionChange={onCategoriesChange}
        />
        <FilterDropdown
          title="Statuses"
          options={statuses}
          selectedOptions={selectedStatuses}
          onSelectionChange={onStatusesChange}
        />
      </div>
    </div>
  )
}