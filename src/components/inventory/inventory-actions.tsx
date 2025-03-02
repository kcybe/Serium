// src/app/inventory/components/inventory-actions.tsx
import { InventoryItem } from "@/types/inventory";
import { AddItemDialog } from "@/components/inventory/dialogs/add-item-dialog";
import { DataActions } from "@/components/inventory/actions/data-actions";

interface InventoryActionsProps {
  data: InventoryItem[];
  onAddItem: (newItem: InventoryItem) => Promise<void>;
  onDataImported: (items: InventoryItem[]) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function InventoryActions({
  data,
  onAddItem,
  onDataImported,
  onRefresh,
  isRefreshing,
}: InventoryActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <AddItemDialog onAddItem={onAddItem} />
      <DataActions
        data={data}
        onDataImported={onDataImported}
        onRefresh={onRefresh}
        isRefreshing={isRefreshing}
      />
    </div>
  );
}
