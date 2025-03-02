// src/app/inventory/components/inventory-filters.tsx
import { SearchFilter } from "@/components/inventory/filters/search-filter";
import { InventoryItem } from "@/types/inventory";
import { SiteSettings } from "@/types/settings";

interface InventoryFiltersProps {
  data: InventoryItem[];
  settings: SiteSettings;
  searchValue: string;
  searchParam: "all" | "name" | "sku" | "location" | "description";
  selectedCategories: string[];
  selectedStatuses: string[];
  onSearchChange: (
    value: string,
    param: "all" | "name" | "sku" | "location" | "description"
  ) => void;
  onCategoriesChange: (categories: string[]) => void;
  onStatusesChange: (statuses: string[]) => void;
  onClearFilters: () => void;
  onVerify: (id: string, source: "scan" | "button" | undefined) => void;
}

export function InventoryFilters({
  data,
  settings,
  searchValue,
  searchParam,
  selectedCategories,
  selectedStatuses,
  onSearchChange,
  onCategoriesChange,
  onStatusesChange,
  onClearFilters,
  onVerify,
}: InventoryFiltersProps) {
  return (
    <SearchFilter
      onSearchChange={onSearchChange}
      categories={settings.categories}
      statuses={settings.statuses}
      selectedCategories={selectedCategories}
      selectedStatuses={selectedStatuses}
      onCategoriesChange={onCategoriesChange}
      onStatusesChange={onStatusesChange}
      onClearFilters={onClearFilters}
      data={data}
      onVerify={onVerify}
      settings={settings}
    />
  );
}
