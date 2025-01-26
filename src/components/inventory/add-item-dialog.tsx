"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { AddItemForm, type AddItemFormValues } from "./add-item-form"
import { InventoryItem } from "./columns"
import { db } from "@/lib/db"
import { toast } from "sonner"
import { historyService } from "@/lib/history-service"

interface AddItemDialogProps {
  onAddItem: (item: InventoryItem) => void
}

export function AddItemDialog({ onAddItem }: AddItemDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (values: AddItemFormValues) => {
    try {
      setLoading(true)
      const newItem: InventoryItem = {
        ...values,
        id: crypto.randomUUID(),
        sku: values.sku,
        quantity: Number(values.quantity),
        price: Number(values.price)
      }
      
      await db.inventory.add(newItem)
      onAddItem(newItem)
      await historyService.trackChange(newItem.id, 'create', undefined, newItem)
      setOpen(false)
    } catch (error) {
      toast.error("Failed to add item")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Item</DialogTitle>
        </DialogHeader>
        <AddItemForm 
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
          loading={loading}
        />
      </DialogContent>
    </Dialog>
  )
}