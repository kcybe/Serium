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

interface AddItemDialogProps {
  onAddItem: (item: InventoryItem) => void
}

export function AddItemDialog({ onAddItem }: AddItemDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (values: AddItemFormValues) => {
    try {
      setLoading(true)
      const id = await db.inventory.add({
        ...values,
        sku: Number(values.sku),
        id: crypto.randomUUID(),
      })
      
      const newItem = await db.inventory.get(id)
      if (newItem) {
        onAddItem(newItem)
        toast.success("Item added successfully")
        setOpen(false)
      }
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