import { HistoryFilter } from "@/types/history";
import { HistorySearchFilter } from "./history-search-filter";

interface HistoryFiltersProps {
  filter: HistoryFilter;
  onSearchChange: (
    value: string,
    parameter: "all" | "itemId" | "action" | "changes"
  ) => void;
  onActionChange: (action: string) => void;
  selectedAction: string;
  onClearFilters: () => void;
}

export function HistoryFilters({
  filter,
  onSearchChange,
  onActionChange,
  selectedAction,
  onClearFilters,
}: HistoryFiltersProps) {
  return (
    <div className="flex gap-4">
      <HistorySearchFilter
        onSearchChange={onSearchChange}
        onActionChange={onActionChange}
        selectedAction={selectedAction}
        onClearFilters={onClearFilters}
      />
    </div>
  );
}
