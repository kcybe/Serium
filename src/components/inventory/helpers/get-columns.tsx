import { Column } from "@tanstack/react-table";

import { ColumnDef, Row, Table } from "@tanstack/react-table"
import { TableMeta } from "@/components/inventory/table/data-table"
import { InventoryItem } from "@/types/inventory"
import { SiteSettings } from "@/types/settings"
import { SortableHeader } from "@/components/inventory/table/sortable-header"
import { db } from "@/lib/services/db"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { CheckCircle, MoreHorizontal, XCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { EditItemDialog } from "../dialogs/edit-item-dialog"
import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/services/utils/utils"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import VerificationCell from "@/components/inventory/table/components/verification-cell"
import ActionCell from "../table/components/action-cell";

export function getColumns(settings: SiteSettings): ColumnDef<InventoryItem>[] {
    const baseColumns = [
      {
        accessorKey: "name",
        header: ({ column }: { column: Column<InventoryItem> }) => 
          <SortableHeader column={column} title="Name" />,
      },
      {
        accessorKey: "sku",
        header: ({ column }: { column: Column<InventoryItem> }) => 
          <SortableHeader column={column} title="SKU" />,
        show: settings.visibleColumns?.sku
      },
      {
        accessorKey: "description",
        header: ({ column }: { column: Column<InventoryItem> }) => 
          <SortableHeader column={column} title="Description" />,
        show: settings.visibleColumns?.description
      },
      {
        accessorKey: "quantity",
        header: ({ column }: { column: Column<InventoryItem> }) => 
          <SortableHeader column={column} title="Quantity" />,
        show: settings.visibleColumns?.quantity
      },
      {
        accessorKey: "price",
        header: ({ column }: { column: Column<InventoryItem> }) => 
          <SortableHeader column={column} title="Price" />,
        show: settings.visibleColumns?.price
      },
      {
        accessorKey: "category",
        header: ({ column }: { column: Column<InventoryItem> }) => 
          <SortableHeader column={column} title="Category" />,
        show: settings.visibleColumns?.category
      },
      {
        accessorKey: "location",
        header: ({ column }: { column: Column<InventoryItem> }) => 
          <SortableHeader column={column} title="Location" />,
        show: settings.visibleColumns?.location
      },
      {
        accessorKey: "status",
        header: ({ column }: { column: Column<InventoryItem> }) => 
          <SortableHeader column={column} title="Status" />,
        show: settings.visibleColumns?.status
      }
    ].filter(column => {
      if (column.accessorKey === 'name') return true;
      return settings.visibleColumns?.[column.accessorKey as keyof typeof settings.visibleColumns] ?? true;
    });
  
    const featureColumns = []
    
    if (settings.features?.itemVerification) {
        featureColumns.push({
          id: "verification",
          header: ({ column }: { column: Column<InventoryItem> }) => <SortableHeader column={column} title="Last Verified" />,
          accessorFn: (row: InventoryItem) => row.lastVerified ? row.lastVerified.getTime() : 0,
          cell: VerificationCell,
        });
      }
  
      const actionColumn: ColumnDef<InventoryItem> = {
        id: "actions",
        cell: ActionCell,
      };
  
    return [...baseColumns, ...(featureColumns.length > 0 ? [{
      id: "separator",
      header: () => <div className="w-px h-6 bg-border mx-2" />,
      cell: () => <div className="w-px h-full bg-border mx-2" />,
    }, ...featureColumns] : []), actionColumn]
  }