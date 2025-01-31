import { useReactTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel, SortingState } from "@tanstack/react-table"
import { useState } from "react"
import { InventoryItem } from "@/types/inventory"
import { TableMeta } from "../data-table"
import { SiteSettings } from "@/types/settings"

export function useInventoryTable(
  data: InventoryItem[],
  columns: any, // Replace with proper ColumnDef type if possible
  onUpdate: (id: string, item: InventoryItem) => void,
  onDelete: (id: string) => void,
  handleVerify: (id: string) => void,
  settings: SiteSettings
) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [pageSize, setPageSize] = useState(8)
  const [pageIndex, setPageIndex] = useState(0)
  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
      pagination: {
        pageSize,
        pageIndex,
      },
    },
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        const newState = updater({ pageIndex, pageSize })
        setPageIndex(newState.pageIndex)
        setPageSize(newState.pageSize)
      }
    },
    meta: {
      updateData: (id: string, updatedItem: InventoryItem) => onUpdate(id, updatedItem),
      deleteData: (item: InventoryItem) => onDelete(item.id),
      onVerify: (id: string) => handleVerify(id),
      settings: settings
    } as TableMeta,
  })

  return table
}