"use client"

import { ColumnDef } from "@tanstack/react-table"
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

// Update the status type to match your data
export type InventoryItem = {
  id: string
  sku: number
  name: string
  description: string
  quantity: number
  price: number
  category: string
  location: string
  status: string
}

function SortableHeader({ column, title }: { column: any, title: string }) {
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

export const columns: ColumnDef<InventoryItem>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <SortableHeader column={column} title="Name" />,
  },
  {
    accessorKey: "sku",
    header: ({ column }) => <SortableHeader column={column} title="SKU" />,
  },
  {
    accessorKey: "description",
    header: ({ column }) => <SortableHeader column={column} title="Description" />,
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => <SortableHeader column={column} title="Quantity" />,
  },
  {
    accessorKey: "price",
    header: ({ column }) => <SortableHeader column={column} title="Price" />,
  },
  {
    accessorKey: "category",
    header: ({ column }) => <SortableHeader column={column} title="Category" />,
  },
  {
    accessorKey: "location",
    header: ({ column }) => <SortableHeader column={column} title="Location" />,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <SortableHeader column={column} title="Status" />,
  },
  {
    id: "actions",
    cell: ({ table, row }) => {
      const item = row.original
      const [editOpen, setEditOpen] = useState(false)
      const [deleteOpen, setDeleteOpen] = useState(false)
    
      const handleUpdate = (updatedItem: InventoryItem) => {
        (table.options.meta as TableMeta).updateData(updatedItem)
      }
    
      const handleDelete = async () => {
        try {
          await db.inventory.delete(item.id)
          ;(table.options.meta as TableMeta).deleteData(item)
          toast.success("Item deleted successfully")
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
]