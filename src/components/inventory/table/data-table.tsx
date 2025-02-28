"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useState } from "react";
import { InventoryItem } from "@/types/inventory";
import { SiteSettings } from "@/types/settings";
import { useInventoryTable } from "./hooks/use-inventory-table";
import { useTranslation } from "@/hooks/use-translation";

export interface TableMeta {
  updateData: (id: string, updatedItem: InventoryItem) => void;
  deleteData: (item: InventoryItem) => void;
  onVerify: (id: string) => void;
  settings: SiteSettings;
}

interface DataTableProps<TData> {
  columns: ColumnDef<TData, any>[];
  data: TData[];
  onUpdate: (id: string, item: TData) => void;
  onDelete: (id: string) => void;
  handleVerify: (id: string) => void;
  settings: SiteSettings;
}

export function DataTable({
  columns,
  data,
  onUpdate,
  onDelete,
  handleVerify,
  settings,
}: DataTableProps<InventoryItem>) {
  const table = useInventoryTable(
    data,
    columns,
    onUpdate,
    onDelete,
    handleVerify,
    settings
  );
  const { t } = useTranslation(settings);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between py-4">
        <div className="w-[150px] items-center justify-center text-sm text-muted-foreground">
          {t("table.totalProducts")}: {data.length}
        </div>
      </div>

      {/* Horizontal scrolling container */}
      <div className="rounded-md border shadow-sm overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-muted/50">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="font-semibold text-center whitespace-nowrap"
                    style={{ minWidth: getMinWidthForColumn(header.id) }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-muted/50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="py-3 text-center"
                      style={{ minWidth: getMinWidthForColumn(cell.column.id) }}
                    >
                      <div className="overflow-hidden text-ellipsis">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  {t("table.emptyState")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination controls - fixed outside scrolling container */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex items-center space-x-2">
          <p className="text-sm text-muted-foreground">
            {t("table.rowsPerPage")}
          </p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[8, 16, 32, 48, 64].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex w-[100px] items-center justify-center text-sm text-muted-foreground">
            {t("table.pagination.pageOf", {
              current: String(table.getState().pagination.pageIndex + 1),
              total: String(table.getPageCount()),
            })}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to determine minimum width for columns
function getMinWidthForColumn(columnId: string): string {
  const columnWidths: Record<string, string> = {
    name: "180px",
    sku: "120px",
    description: "200px",
    quantity: "100px",
    price: "120px",
    category: "150px",
    location: "150px",
    status: "120px",
    verification: "150px",
    actions: "100px",
  };

  return columnWidths[columnId] || "120px";
}

// Column styling utility
function getColumnStyles(columnId: string): React.CSSProperties {
  const baseStyles: React.CSSProperties = {
    minWidth: getMinWidthForColumn(columnId),
  };

  // Add special handling for the description column
  if (columnId === "description") {
    return {
      ...baseStyles,
      maxWidth: "100px",
    };
  }

  return baseStyles;
}
