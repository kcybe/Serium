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
import { Button } from "../ui/button"

type SearchParameter = "all" | "itemId" | "action" | "changes"

interface HistorySearchFilterProps {
  onSearchChange: (value: string, parameter: SearchParameter) => void
  onActionChange: (action: string) => void
  selectedAction: string
  onClearFilters: () => void
}

export function HistorySearchFilter({ 
  onSearchChange,
  onActionChange,
  selectedAction,
  onClearFilters
}: HistorySearchFilterProps) {
  const [searchParam, setSearchParam] = useState<SearchParameter>("all")
  const [searchValue, setSearchValue] = useState<string>("")
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }
      
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
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      onSearchChange(value, searchParam)
    }, 200)
  }

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
    onActionChange("all")
    onClearFilters()
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            placeholder="Type / to search history..."
            className="pl-8 w-full"
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
            <SelectItem value="itemId">Item ID</SelectItem>
            <SelectItem value="action">Action</SelectItem>
            <SelectItem value="changes">Changes</SelectItem>
          </SelectContent>
        </Select>
        <Select 
          value={selectedAction} 
          onValueChange={onActionChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            <SelectItem value="create">Created</SelectItem>
            <SelectItem value="update">Updated</SelectItem>
            <SelectItem value="delete">Deleted</SelectItem>
          </SelectContent>
        </Select>
        <Button 
          variant="outline" 
          onClick={handleClearAll}
          className="flex items-center gap-2"
          disabled={!searchValue && selectedAction === "all"}
        >
          Clear Filters
        </Button>
      </div>
    </div>
  )
}