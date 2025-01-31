import { Column } from "@tanstack/react-table";

import { ColumnDef, Row, Table } from "@tanstack/react-table"
import { InventoryItem } from "@/types/inventory"
import { SiteSettings, CustomColumn } from "@/types/settings"
import { SortableHeader } from "@/components/inventory/table/sortable-header"
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
  
    // Ensure customColumns is an array
    const customColumns: ColumnDef<InventoryItem>[] = (settings.customColumns || []).map((col: CustomColumn) => ({
      accessorFn: (row: InventoryItem) => row.customFields?.[col.id] || '',
      id: col.id,
      header: ({ column }: { column: Column<InventoryItem> }) => <SortableHeader column={column} title={col.label} />,
      cell: ({ row }) => {
        const value = row.original.customFields?.[col.id]
        switch(col.type) {
          case 'number':
            return <span>{value}</span>
          case 'boolean':
            return <input type="checkbox" checked={!!value} disabled />
          default:
            return <span>{value}</span>
        }
      },
      meta: {
        type: col.type
      }
    }))

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
  
    return [...baseColumns, ...customColumns, ...(featureColumns.length > 0 ? [{
      id: "separator",
      header: () => <div className="w-px h-6 bg-border mx-2" />,
      cell: () => <div className="w-px h-full bg-border mx-2" />,
    }, ...featureColumns] : []), actionColumn]
  }