"use client"

import { useState, useEffect } from 'react'
import { HistoryEntry, HistoryFilter } from '@/types/history'
import { historyService } from '@/lib/history-service'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from '@/components/ui/input'

const actionColors = {
  create: 'bg-green-500',
  update: 'bg-blue-500',
  delete: 'bg-red-500'
}

export function HistoryView() {
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [filter, setFilter] = useState<HistoryFilter>({})
  const [itemIdSearch, setItemIdSearch] = useState("")

  useEffect(() => {
    loadHistory()
  }, [filter])

  const loadHistory = async () => {
    const entries = await historyService.getHistory(filter)
    setHistory(entries)
  }

  const handleSearch = (value: string) => {
    setItemIdSearch(value)
    setFilter({ ...filter, itemId: value || undefined })
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="mb-4">History</CardTitle>
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by Item ID"
              value={itemIdSearch}
              onChange={(e) => handleSearch(e.target.value)}
              className="max-w-[300px]"
            />
          </div>
          <Select
            value={filter.action || 'all'}
            onValueChange={(value: string) => 
              setFilter({ 
                ...filter, 
                action: value === 'all' ? undefined : value as 'create' | 'update' | 'delete'
              })
            }
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
        </div>
      </CardHeader>
      <CardContent>
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
            {history.map((entry) => (
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
      </CardContent>
    </Card>
  )
}