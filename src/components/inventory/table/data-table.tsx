"use client";

import { ColumnDef, flexRender } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InventoryItem } from "@/types/inventory";
import { SiteSettings } from "@/types/settings";
import { useInventoryTable } from "./hooks/use-inventory-table";
import { useTranslation } from "@/hooks/use-translation";
import { TablePagination } from "@/components/ui/table-pagination";

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
  const { pageIndex, pageSize } = table.getState().pagination;

  return (
    <div className="space-y-2">
      {/* Table container with defined height and overflow */}
      <div className="rounded-md border overflow-hidden">
        <div className="max-h-[600px] overflow-auto">
          <Table className="w-full">
            <TableHeader className="bg-muted/50 sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      style={{
                        width: getMinWidthForColumn(header.id),
                        maxWidth: getMaxWidthForColumn(header.id),
                      }}
                      className="h-9 py-1 px-2"
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
                    className="h-9"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="py-1 px-2"
                        style={{
                          maxWidth: getMaxWidthForColumn(cell.column.id),
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-16 text-center"
                  >
                    {t("table.noResults")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Use our common pagination component */}
      <div className="px-2 pt-2">
        <TablePagination
          pageIndex={pageIndex}
          pageSize={pageSize}
          pageCount={table.getPageCount()}
          totalItems={table.getFilteredRowModel().rows.length}
          selectedItems={table.getFilteredSelectedRowModel().rows.length}
          onPageChange={(page) => table.setPageIndex(page)}
          onPageSizeChange={(size) => table.setPageSize(size)}
          settings={settings}
          pageSizeOptions={[8, 15, 25, 50]}
          showSelectedCount={true}
        />
      </div>
    </div>
  );
}

// Helper function to determine minimum width for columns
function getMinWidthForColumn(columnId: string): string {
  const columnWidths: Record<string, string> = {
    select: "30px",
    status: "100px",
    verify: "80px",
    actions: "70px",
    sku: "100px",
    price: "90px",
    quantity: "80px",
    category: "130px",
    name: "180px",
    description: "220px",
    location: "130px",
    separator: "30px",
  };

  return columnWidths[columnId] || "120px";
}

// Helper function to determine maximum width for columns
function getMaxWidthForColumn(columnId: string): string {
  const columnMaxWidths: Record<string, string> = {
    select: "30px",
    verify: "80px",
    actions: "70px",
    price: "90px",
    quantity: "80px",
    sku: "100px",
    status: "100px",
    separator: "30px",
  };

  return columnMaxWidths[columnId] || "auto";
}
