"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AddItemForm } from "./add-item-form"
import { InventoryItem } from "./columns"
import { db } from "@/lib/db"
import { toast } from "sonner"

interface EditItemDialogProps {
  item: InventoryItem
  open: boolean
  onOpenChange: (open: boolean) => void
  onItemUpdated: (item: InventoryItem) => void
}

export function EditItemDialog({ item, open, onOpenChange, onItemUpdated }: EditItemDialogProps) {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (values: Omit<InventoryItem, 'id'>) => {
    try {
      setLoading(true)
      await db.inventory.update(item.id, values)
      const updatedItem = { ...values, id: item.id }
      onItemUpdated(updatedItem)
      toast.success("Item updated successfully")
      onOpenChange(false)
    } catch (error) {
      toast.error("Failed to update item")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Item</DialogTitle>
        </DialogHeader>
        <AddItemForm 
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          loading={loading}
          defaultValues={item}
          submitLabel="Save Changes"
        />
      </DialogContent>
    </Dialog>
  )
}