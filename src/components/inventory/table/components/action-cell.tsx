import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Edit, Trash, Barcode, Copy } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { db } from "@/lib/services/db"
import { EditItemDialog } from "../../dialogs/edit-item-dialog"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { InventoryItem } from "@/types/inventory"
import JsBarcode from 'jsbarcode'
import { useSettings } from "@/hooks/use-settings"
import { useTranslation } from "@/hooks/use-translation"

interface ActionCellProps {
  row: any // Replace with actual Row type if possible
  table: any // Replace with actual Table type if possible
}

export default function ActionCell({ row, table }: ActionCellProps) {
  const item = row.original
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const settings = useSettings()
  const { t } = useTranslation(settings)

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

  const handleGenerateBarcode = () => {
    if (!item.sku) {
      toast.error("Item SKU is required for barcode generation")
      return
    }

    const canvas = document.createElement('canvas')
    JsBarcode(canvas, String(item.sku), {
      format: 'CODE128',
      displayValue: true,
      fontSize: 16,
      margin: 10
    })

    const dataUrl = canvas.toDataURL()
    const printWindow = window.open('', '_blank')
    printWindow?.document.write(`
      <html>
        <body style="text-align: center; margin: 20px;">
          <img src="${dataUrl}" style="max-width: 100%; height: auto;">
        </body>
      </html>
    `)
  }

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{t('general.actions')}</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(item.id)}>
            <Copy className="mr-2 h-4 w-4" />
            {t('actions.copyId')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleGenerateBarcode}>
            <Barcode className="mr-2 h-4 w-4" />
            {t('actions.generateBarcode')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => {
            setEditOpen(true)
            setDropdownOpen(false)
          }}>
            <Edit className="mr-2 h-4 w-4" />
            {t('actions.edit')}
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => {
              setDeleteOpen(true)
              setDropdownOpen(false)
            }} 
            className="text-destructive"
          >
            <Trash className="mr-2 h-4 w-4" />
            {t('actions.delete')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {editOpen && (
        <EditItemDialog
          item={item}
          open={editOpen}
          onOpenChange={setEditOpen}
          onItemUpdated={handleUpdate}
        />
      )}
      {deleteOpen && (
        <ConfirmationDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          onConfirm={handleDelete}
          title={t('confirmation.deleteItemTitle')}
          description={t('confirmation.deleteItemDescription')}
          confirmLabel={t('buttons.delete')}
        />
      )}
    </>
  )
}