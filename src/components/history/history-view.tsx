"use client"

import { useState, useEffect, useMemo } from 'react'
import { HistoryEntry, HistoryFilter } from '@/types/history'
import { historyService } from '@/lib/services/history'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Download, MoreHorizontal, RotateCw } from 'lucide-react'
import { exportToJson } from "@/lib/services/utils/export-to-json"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from '@/lib/services/utils/utils'
import { HistorySearchFilter } from '@/components/history/history-search-filter'

const actionColors = {
  create: 'bg-green-500',
  update: 'bg-blue-500',
  delete: 'bg-red-500'
}

type SearchParameter = "all" | "itemId" | "action" | "changes"

export function HistoryView() {
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [filter, setFilter] = useState<HistoryFilter>({})
  const [itemIdSearch, setItemIdSearch] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pageSize, setPageSize] = useState(8)
  const [pageIndex, setPageIndex] = useState(0)

  useEffect(() => {
    loadHistory()
  }, [filter])

  const loadHistory = async () => {
    const entries = await historyService.getHistory(filter)
    setHistory(entries)
  }

  const handleSearch = (value: string, parameter: SearchParameter) => {
    if (!value) {
      setFilter({ ...filter, itemId: undefined, searchParameter: undefined })
      return
    }
    
    setFilter(prev => ({
      ...prev,
      itemId: value,
      searchParameter: parameter
    }))
    setPageIndex(0)
  }

  const handleExport = () => {
    exportToJson(
      history,
      `inventory-history-${new Date().toISOString().split('T')[0]}.json`
    )
  }

  const handleRefresh = async () => {
    if (isRefreshing) return
    setIsRefreshing(true)
    try {
      await loadHistory()
    } finally {
      setIsRefreshing(false)
    }
  }

  const renderChanges = (changes: HistoryEntry['changes']) => {
    return changes.map((change, index) => (
      <div key={index} className="text-sm">
        <span className="font-medium">{change.field}: </span>
        <span className="text-muted-foreground">
          {change.oldValue?.toString() || 'null'} → {change.newValue?.toString() || 'null'}
        </span>
      </div>
    ))
  }

  const filteredHistory = useMemo(() => {
    let filtered = history

    if (filter.searchAll && filter.itemId) {
      const searchLower = filter.itemId.toLowerCase()
      filtered = filtered.filter(entry => 
        entry.itemId.toLowerCase().includes(searchLower) ||
        entry.action.toLowerCase().includes(searchLower) ||
        entry.changes.some(change => 
          change.field.toLowerCase().includes(searchLower) ||
          String(change.oldValue).toLowerCase().includes(searchLower) ||
          String(change.newValue).toLowerCase().includes(searchLower)
        )
      )
    } else if (filter.itemId && filter.searchParameter) {
      const searchLower = filter.itemId.toLowerCase()
      switch (filter.searchParameter) {
        case "itemId":
          filtered = filtered.filter(entry => 
            entry.itemId.toLowerCase().includes(searchLower)
          )
          break
        case "action":
          filtered = filtered.filter(entry => 
            entry.action.toLowerCase().includes(searchLower)
          )
          break
        case "changes":
          filtered = filtered.filter(entry => 
            entry.changes.some(change => 
              change.field.toLowerCase().includes(searchLower) ||
              String(change.oldValue).toLowerCase().includes(searchLower) ||
              String(change.newValue).toLowerCase().includes(searchLower)
            )
          )
          break
      }
    }

    return filtered
  }, [history, filter])

  const paginatedHistory = filteredHistory.slice(
    pageIndex * pageSize,
    (pageIndex + 1) * pageSize
  )

  const pageCount = Math.ceil(filteredHistory.length / pageSize)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <CardTitle>History</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleRefresh} disabled={isRefreshing}>
                <RotateCw 
                  className={cn(
                    "h-4 w-4 mr-2",
                    isRefreshing && "animate-spin"
                  )} 
                />
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export History
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex gap-4">
          <HistorySearchFilter
            onSearchChange={handleSearch}
            onActionChange={(value: string) => 
              setFilter({ 
                ...filter, 
                action: value === 'all' ? undefined : value as 'create' | 'update' | 'delete'
              })
            }
            selectedAction={filter.action || 'all'}
            onClearFilters={() => {
              setFilter({})
              setItemIdSearch("")
            }}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Item ID</TableHead>
                <TableHead>Changes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedHistory.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>
                    {format(new Date(entry.timestamp), 'PPpp')}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={actionColors[entry.action]}>
                      {entry.action}
                    </Badge>
                  </TableCell>
                  <TableCell>{entry.itemId}</TableCell>
                  <TableCell>{renderChanges(entry.changes)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="flex items-center space-x-2">
              <p className="text-sm text-muted-foreground">Rows per page</p>
              <Select
                value={`${pageSize}`}
                onValueChange={(value) => {
                  setPageSize(Number(value))
                  setPageIndex(0)
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={pageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[8, 16, 32, 48, 64].map((size) => (
                    <SelectItem key={size} value={`${size}`}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex w-[100px] items-center justify-center text-sm text-muted-foreground">
                Page {pageIndex + 1} of {pageCount}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPageIndex(0)}
                  disabled={pageIndex === 0}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPageIndex(page => page - 1)}
                  disabled={pageIndex === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPageIndex(page => page + 1)}
                  disabled={pageIndex === pageCount - 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPageIndex(pageCount - 1)}
                  disabled={pageIndex === pageCount - 1}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}