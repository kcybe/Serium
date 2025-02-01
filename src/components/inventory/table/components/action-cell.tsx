import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Edit, Trash } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { db } from "@/lib/services/db"
import { EditItemDialog } from "../../dialogs/edit-item-dialog"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { InventoryItem } from "@/types/inventory"

interface ActionCellProps {
  row: any // Replace with actual Row type if possible
  table: any // Replace with actual Table type if possible
}

export default function ActionCell({ row, table }: ActionCellProps) {
  const item = row.original
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const handleUpdate = (updatedItem: InventoryItem) => { // Replace 'any' with InventoryItem if possible
    table.options.meta.updateData(item.id, updatedItem)
  }

  const handleDelete = async () => {
    try {
      if (!item.id) {
        throw new Error('Item ID is missing')
      }
      await table.options.meta.deleteData(item)
    } catch (error) {
      toast.error("Failed to delete item")
      console.error(error)
    } finally {
      setDeleteOpen(false)
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