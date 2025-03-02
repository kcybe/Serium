// src/app/inventory/hooks/use-filtered-data.tsx
import { useMemo, useState } from "react";
import { type InventoryItem } from "@/types/inventory";

export function useFilteredData(data: InventoryItem[]) {
  const [searchValue, setSearchValue] = useState("");
  const [searchParam, setSearchParam] = useState<
    "all" | "name" | "sku" | "location" | "description"
  >("all");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const filteredData = useMemo(() => {
    let filtered = data;

    // Filter by search
    if (searchValue) {
      filtered = filtered.filter((item) => {
        const searchLower = searchValue.toLowerCase();
        if (searchParam === "all") {
          return (
            String(item.name || "")
              .toLowerCase()
              .includes(searchLower) ||
            String(item.sku || "")
              .toLowerCase()
              .includes(searchLower) ||
            String(item.location || "")
              .toLowerCase()
              .includes(searchLower) ||
            String(item.description || "")
              .toLowerCase()
              .includes(searchLower)
          );
        }
        return String(item[searchParam] || "")
          .toLowerCase()
          .includes(searchLower);
      });
    }

    // Filter by categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((item) =>
        selectedCategories.includes(item.category)
      );
    }

    // Filter by statuses
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((item) =>
        selectedStatuses.includes(item.status)
      );
    }

    return filtered;
  }, [data, searchValue, searchParam, selectedCategories, selectedStatuses]);

  const handleClearFilters = () => {
    setSearchValue("");
    setSearchParam("all");
    setSelectedCategories([]);
    setSelectedStatuses([]);
  };

  return {
    filteredData,
    searchValue,
    setSearchValue,
    searchParam,
    setSearchParam,
    selectedCategories,
    setSelectedCategories,
    selectedStatuses,
    setSelectedStatuses,
    handleClearFilters,
  };
}
