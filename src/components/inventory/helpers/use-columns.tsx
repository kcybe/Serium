import { ColumnDef, Column } from "@tanstack/react-table";
import { SortableHeader } from "@/components/inventory/table/components/sortable-header";
import ActionCell from "@/components/inventory/table/components/action-cell";
import VerificationCell from "@/components/inventory/table/components/verification-cell";
import { TruncatedCell } from "../table/components/truncated-cell";
import { useTranslation } from "@/hooks/use-translation";
import { InventoryItem } from "@/types/inventory";
import { SiteSettings, CustomColumn } from "@/types/settings";

// Column width constants for consistent sizing
const COLUMN_WIDTHS = {
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
  custom: "150px",
} as const;

export function useColumns(settings: SiteSettings): ColumnDef<InventoryItem>[] {
  const { t } = useTranslation(settings);

  const baseColumns: ColumnDef<InventoryItem>[] = [
    {
      accessorKey: "name",
      header: ({ column }: { column: Column<InventoryItem> }) => (
        <SortableHeader
          column={column}
          title={t("table.columns.name")}
          settings={settings}
        />
      ),
      meta: {
        width: COLUMN_WIDTHS.name,
      },
    },
    {
      accessorKey: "sku",
      header: ({ column }: { column: Column<InventoryItem> }) => (
        <SortableHeader
          column={column}
          title={t("table.columns.sku")}
          settings={settings}
        />
      ),
      show: settings.visibleColumns?.sku,
      meta: {
        width: COLUMN_WIDTHS.sku,
      },
    },
    {
      accessorKey: "description",
      header: ({ column }: { column: Column<InventoryItem> }) => (
        <SortableHeader
          column={column}
          title={t("table.columns.description")}
          settings={settings}
        />
      ),
      cell: ({ row }: { row: { getValue: (key: string) => unknown } }) => {
        const description = row.getValue("description") as string;
        return <TruncatedCell content={description} />;
      },
      show: settings.visibleColumns?.description,
      meta: {
        width: COLUMN_WIDTHS.description,
      },
    },
    {
      accessorKey: "quantity",
      header: ({ column }: { column: Column<InventoryItem> }) => (
        <SortableHeader
          column={column}
          title={t("table.columns.quantity")}
          settings={settings}
        />
      ),
      show: settings.visibleColumns?.quantity,
      meta: {
        width: COLUMN_WIDTHS.quantity,
      },
    },
    {
      accessorKey: "price",
      header: ({ column }: { column: Column<InventoryItem> }) => (
        <SortableHeader
          column={column}
          title={t("table.columns.price")}
          settings={settings}
        />
      ),
      show: settings.visibleColumns?.price,
      meta: {
        width: COLUMN_WIDTHS.price,
      },
    },
    {
      accessorKey: "category",
      header: ({ column }: { column: Column<InventoryItem> }) => (
        <SortableHeader
          column={column}
          title={t("table.columns.category")}
          settings={settings}
        />
      ),
      show: settings.visibleColumns?.category,
      meta: {
        width: COLUMN_WIDTHS.category,
      },
    },
    {
      accessorKey: "location",
      header: ({ column }: { column: Column<InventoryItem> }) => (
        <SortableHeader
          column={column}
          title={t("table.columns.location")}
          settings={settings}
        />
      ),
      show: settings.visibleColumns?.location,
      meta: {
        width: COLUMN_WIDTHS.location,
      },
    },
    {
      accessorKey: "status",
      header: ({ column }: { column: Column<InventoryItem> }) => (
        <SortableHeader
          column={column}
          title={t("table.columns.status")}
          settings={settings}
        />
      ),
      show: settings.visibleColumns?.status,
      meta: {
        width: COLUMN_WIDTHS.status,
      },
    },
  ].filter((column) => {
    // Always show name column
    if (column.accessorKey === "name") return true;

    // Filter other columns based on visibility settings
    const key = column.accessorKey as keyof typeof settings.visibleColumns;
    return settings.visibleColumns?.[key] ?? true;
  });

  // Map custom columns with proper typing
  const customColumns: ColumnDef<InventoryItem>[] = (
    settings.customColumns ?? []
  ).map((col: CustomColumn) => ({
    accessorFn: (row: InventoryItem) => row.customFields?.[col.id] ?? "",
    id: col.id,
    header: ({ column }: { column: Column<InventoryItem> }) => (
      <SortableHeader column={column} title={col.label} settings={settings} />
    ),
    cell: ({ row }: { row: { original: InventoryItem } }) => {
      const value = row.original.customFields?.[col.id];

      switch (col.type) {
        case "number":
          return <span>{value}</span>;
        case "boolean":
          return <input type="checkbox" checked={Boolean(value)} disabled />;
        default:
          return <span>{value}</span>;
      }
    },
    meta: {
      type: col.type,
      width: COLUMN_WIDTHS.custom,
    },
  }));

  // Feature-specific columns
  const featureColumns: ColumnDef<InventoryItem>[] = [];

  if (settings.features?.itemVerification) {
    featureColumns.push({
      id: "verification",
      header: ({ column }: { column: Column<InventoryItem> }) => (
        <SortableHeader
          column={column}
          title={t("table.columns.lastVerified")}
          settings={settings}
        />
      ),
      accessorFn: (row: InventoryItem) =>
        row.lastVerified instanceof Date ? row.lastVerified.getTime() : 0,
      cell: VerificationCell,
      meta: {
        width: COLUMN_WIDTHS.verification,
      },
    });
  }

  // Actions column
  const actionColumn: ColumnDef<InventoryItem> = {
    id: "actions",
    cell: ActionCell,
    meta: {
      width: COLUMN_WIDTHS.actions,
    },
  };

  // Combine all columns
  return [
    ...baseColumns,
    ...customColumns,
    ...(featureColumns.length > 0
      ? [
          {
            id: "separator",
            header: () => <div className="w-px h-6 bg-border mx-2" />,
            cell: () => <div className="w-px h-full bg-border mx-2" />,
            meta: {
              width: COLUMN_WIDTHS.separator,
            },
          },
          ...featureColumns,
        ]
      : []),
    actionColumn,
  ];
}
