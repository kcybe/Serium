// src/app/inventory/components/inventory-table.tsx
import { useCallback, useMemo } from "react";
import { DataTable } from "@/components/inventory/table/data-table";
import { useColumns } from "@/components/inventory/helpers/use-columns";
import { InventoryItem } from "@/types/inventory";
import { SiteSettings } from "@/types/settings";

interface InventoryTableProps {
  filteredData: InventoryItem[];
  settings: SiteSettings;
  onUpdate: (id: string, updatedItem: InventoryItem) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onVerify: (id: string, source: "scan" | "button") => Promise<void>;
}

export function InventoryTable({
  filteredData,
  settings,
  onUpdate,
  onDelete,
  onVerify,
}: InventoryTableProps) {
  const memoizedColumns = useMemo(() => useColumns(settings), [settings]);

  const handleVerify = useCallback(
    (id: string) => onVerify(id, "button"),
    [onVerify]
  );

  return (
    <DataTable
      columns={memoizedColumns}
      data={filteredData}
      onUpdate={onUpdate}
      onDelete={onDelete}
      handleVerify={handleVerify}
      settings={settings}
    />
  );
}
