"use client"

import { ColumnDef, Column, Row, Table } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown, ArrowDown, ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EditItemDialog } from "./edit-item-dialog"
import { useState } from "react"
import { toast } from "sonner"
import { db } from "@/lib/db"
import { TableMeta } from "./data-table"
import { ConfirmationDialog } from "../ui/confirmation-dialog"
import { format, formatDistanceToNow } from "date-fns"
import { CheckCircle, XCircle } from "lucide-react"
import { SiteSettings } from "@/types/settings"
import { cn } from "@/lib/utils"

export interface InventoryItem {
  id: string
  name: string
  sku: string | number
  quantity: number
  price: number
  category: string
  status: string
  description: string
  location: string
  lastVerified?: Date | null
  isVerified?: boolean
}

function SortableHeader({ column, title }: { column: Column<InventoryItem>, title: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          {title}
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="h-4 w-4" />
          ) : (
            <ArrowUpDown className="h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
          <ArrowUp className="mr-2 h-4 w-4" />
          Asc
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
          <ArrowDown className="mr-2 h-4 w-4" />
          Desc
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function getColumns(settings: SiteSettings): ColumnDef<InventoryItem>[] {
  const baseColumns = [
    {
      accessorKey: "name",
      header: ({ column }: { column: Column<InventoryItem> }) => <SortableHeader column={column} title="Name" />,
    },
    {
      accessorKey: "sku",
      header: ({ column }: { column: Column<InventoryItem> }) => <SortableHeader column={column} title="SKU" />,
    },
    {
      accessorKey: "description",
      header: ({ column }: { column: Column<InventoryItem> }) => <SortableHeader column={column} title="Description" />,
    },
    {
      accessorKey: "quantity",
      header: ({ column }: { column: Column<InventoryItem> }) => <SortableHeader column={column} title="Quantity" />,
    },
    {
      accessorKey: "price",
      header: ({ column }: { column: Column<InventoryItem> }) => <SortableHeader column={column} title="Price" />,
    },
    {
      accessorKey: "category",
      header: ({ column }: { column: Column<InventoryItem> }) => <SortableHeader column={column} title="Category" />,
    },
    {
      accessorKey: "location",
      header: ({ column }: { column: Column<InventoryItem> }) => <SortableHeader column={column} title="Location" />,
    },
    {
      accessorKey: "status",
      header: ({ column }: { column: Column<InventoryItem> }) => <SortableHeader column={column} title="Status" />,
    }
  ]

  const featureColumns = []
  
  if (settings.features?.itemVerification) {
    featureColumns.push({
      id: "verification",
      header: "Last Verified",
      cell: ({ row, table }: { row: Row<InventoryItem>, table: Table<InventoryItem> }) => {
        const item = row.original
        const lastVerified = item.lastVerified ? new Date(item.lastVerified) : null
        
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => (table.options.meta as TableMeta).onVerify(item.id)}
              className="h-8 w-8 p-0"
            >
              {item.isVerified ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
            </Button>
            <span className={cn(
              "text-sm",
              !lastVerified && "text-muted-foreground",
              lastVerified && !item.isVerified && "text-red-500"
            )}>
              {lastVerified 
                ? `${formatDistanceToNow(lastVerified)} ago`
                : 'Never verified'}
            </span>
          </div>
        )
      }
    })
  }

  const actionColumn = {
    id: "actions",
    cell: ({ table, row }: { table: Table<InventoryItem>, row: Row<InventoryItem> }) => {
      const item = row.original
      const [editOpen, setEditOpen] = useState(false)
      const [deleteOpen, setDeleteOpen] = useState(false)
    
      const handleUpdate = (updatedItem: InventoryItem) => {
        (table.options.meta as TableMeta).updateData(item.id, updatedItem)
      }
    
      const handleDelete = async () => {
        try {
          const itemToDelete = row.original
          if (!itemToDelete.id) {
            throw new Error('Item ID is missing')
          }
          await db.inventory.delete(itemToDelete.id)
          ;(table.options.meta as TableMeta).deleteData(itemToDelete)
          setDeleteOpen(false)
        } catch (error) {
          toast.error("Failed to delete item")
          console.error(error)
        }
      }
    
      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(item.id)}>
                Copy ID
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setEditOpen(true)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDeleteOpen(true)} className="text-destructive">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <EditItemDialog
            item={item}
            open={editOpen}
            onOpenChange={setEditOpen}
            onItemUpdated={handleUpdate}
          />
          <ConfirmationDialog
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
            onConfirm={handleDelete}
            title="Delete Item"
            description="Are you sure you want to delete this item? This action cannot be undone."
            confirmLabel="Delete"
          />
        </>
      )
    }
  }

  return [...baseColumns, ...(featureColumns.length > 0 ? [{
    id: "separator",
    header: () => <div className="w-px h-6 bg-border mx-2" />,
    cell: () => <div className="w-px h-full bg-border mx-2" />,
  }, ...featureColumns] : []), actionColumn]
}