"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AddItemForm } from "../forms/add-item-form"
import { InventoryItem } from "@/types/inventory"
import { db } from "@/lib/services/db"
import { toast } from "sonner"
import { LoadingSpinner } from "../../ui/loading-spinner"
import { AddItemFormValues } from "../forms/add-item-form"
import { historyService } from "@/lib/services/history"

interface EditItemDialogProps {
  item: InventoryItem
  open: boolean
  onOpenChange: (open: boolean) => void
  onItemUpdated: (item: InventoryItem) => void
}

export function EditItemDialog({ item, open, onOpenChange, onItemUpdated }: EditItemDialogProps) {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (values: AddItemFormValues) => {
    try {
      setLoading(true)
      const oldItem = await db.inventory.get(item.id)
      if (!oldItem) {
        throw new Error('Item not found')
      }

      const processedValues: InventoryItem = {
        ...item,
        ...values,
        id: item.id,
        sku: values.sku,
        quantity: Number(values.quantity),
        price: Number(values.price)
      }
      
      await db.inventory.update(item.id, processedValues)
      await historyService.trackChange(item.id, 'update', oldItem, processedValues)
      onItemUpdated(processedValues)
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
          <DialogTitle>
            {loading ? (
              <div className="flex items-center gap-2">
                <LoadingSpinner className="h-4 w-4" />
                Updating Item...
              </div>
            ) : (
              "Edit Item"
            )}
          </DialogTitle>
        </DialogHeader>
        <AddItemForm 
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          loading={loading}
          defaultValues={{ ...item, sku: String(item.sku) }}
          submitLabel={loading ? "Saving..." : "Save Changes"}
        />
      </DialogContent>
    </Dialog>
  )
}