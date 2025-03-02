// src/app/inventory/components/inventory-container.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InventoryHeader } from "@/components/inventory/inventory-header";
import { useInventoryData } from "@/hooks/inventory/use-inventory-data";
import { useFilteredData } from "@/hooks/inventory/use-filtered-data";
import { useItemActions } from "@/hooks/inventory/use-item-actions";
import { InventorySkeleton } from "./inventory-skeleton";
import { HistoryAlert } from "./history-alert";
import { InventoryFilters } from "./inventory-filters";
import { InventoryActions } from "./inventory-actions";
import { InventoryTable } from "./inventory-table";

export function InventoryContainer() {
  const {
    data,
    setData,
    loading,
    settings,
    historyEnabled,
    isRefreshing,
    isVerifying,
    loadItems,
    t,
  } = useInventoryData();

  const {
    filteredData,
    searchValue,
    searchParam,
    selectedCategories,
    selectedStatuses,
    setSearchValue,
    setSearchParam,
    setSelectedCategories,
    setSelectedStatuses,
    handleClearFilters,
  } = useFilteredData(data);

  const { handleAddItem, handleUpdateItem, handleDeleteItem, handleVerify } =
    useItemActions(data, setData, t);

  if (loading) {
    return <InventorySkeleton />;
  }

  const onVerify = (id: string, source: "scan" | "button" = "button") => {
    return handleVerify(id, source, isVerifying);
  };

  return (
    <div className="flex flex-col gap-4 p-8 pt-8">
      <HistoryAlert enabled={historyEnabled} t={t} />

      <div className="flex justify-center">
        <Card className="w-full max-w-7xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle>
              <InventoryHeader settings={settings} />
            </CardTitle>

            <InventoryActions
              data={data}
              onAddItem={handleAddItem}
              onDataImported={(items) => setData((prev) => [...prev, ...items])}
              onRefresh={() => loadItems(true)}
              isRefreshing={isRefreshing}
            />
          </CardHeader>

          <CardContent>
            <div className="flex flex-col gap-4">
              <InventoryFilters
                data={data}
                settings={settings}
                searchValue={searchValue}
                searchParam={searchParam}
                selectedCategories={selectedCategories}
                selectedStatuses={selectedStatuses}
                onSearchChange={(value, param) => {
                  setSearchValue(value);
                  setSearchParam(param);
                }}
                onCategoriesChange={setSelectedCategories}
                onStatusesChange={setSelectedStatuses}
                onClearFilters={handleClearFilters}
                onVerify={onVerify}
              />

              <InventoryTable
                filteredData={filteredData}
                settings={settings}
                onUpdate={handleUpdateItem}
                onDelete={handleDeleteItem}
                onVerify={onVerify}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
