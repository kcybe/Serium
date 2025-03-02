/**
 * Table utility functions and constants for consistent behavior across the application
 */

/**
 * Get column width from either column meta or default mapping
 */
export function getColumnWidth(
  columnId: string,
  columnMeta?: { width?: string }
): string {
  // First try to get width from column meta
  if (columnMeta?.width) {
    return columnMeta.width;
  }

  // Fallback to default column widths
  const defaultColumnWidths: Record<string, string> = {
    name: "200px",
    sku: "120px",
    description: "300px",
    quantity: "100px",
    price: "120px",
    category: "150px",
    location: "150px",
    status: "120px",
    verification: "150px",
    actions: "100px",
    separator: "40px",
  };

  return defaultColumnWidths[columnId] || "150px";
}

/**
 * Table style classes for consistent styling
 */
export const tableStyles = {
  container: "space-y-4",
  tableWrapper: "rounded-md border shadow-sm overflow-x-auto",
  table: "w-full",
  headerRow: "bg-muted/50",
  headerCell: "font-semibold text-center whitespace-nowrap p-2",
  row: "hover:bg-muted/50 transition-colors",
  cell: "py-3 text-center",
  cellContent: "overflow-hidden text-ellipsis",
};
