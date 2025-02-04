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
import { AddItemForm, type AddItemFormValues } from "../forms/add-item-form"
import { InventoryItem } from "@/types/inventory"
import { db } from "@/lib/services/db"
import { toast } from "sonner"
import { historyService } from "@/lib/services/history"
import { useSettings } from "@/hooks/use-settings"
import { useTranslation } from "@/hooks/use-translation"

interface AddItemDialogProps {
  onAddItem: (item: InventoryItem) => void
}

export function AddItemDialog({ onAddItem }: AddItemDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const settings = useSettings()
  const { t } = useTranslation(settings)

  const generateUUID = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID()
    }
    // Fallback for environments without crypto support
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0
      const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }

  const handleSubmit = async (values: AddItemFormValues) => {
    try {
      setLoading(true)
      let attempts = 0
      let newItem: InventoryItem

      do {
        newItem = {
          ...values,
          id: generateUUID(),
          sku: values.sku,
          quantity: Number(values.quantity),
          price: Number(values.price)
        }
        attempts++
      } while (
        attempts < 3 && 
        await db.inventory.get(newItem.id).catch(() => null)
      )

      if (attempts >= 3) {
        throw new Error('Failed to generate unique ID after 3 attempts')
      }

      await db.inventory.add(newItem)
      onAddItem(newItem)
      await historyService.trackChange(newItem.id, 'create', undefined, newItem)
      setOpen(false)
    } catch (error) {
      toast.error("Failed to add item")
      console.error(error)
      setOpen(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          {t('general.addItemButton')}
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