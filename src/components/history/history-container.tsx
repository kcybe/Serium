"use client";

import { useState, useEffect } from "react";
import { HistoryEntry, HistoryFilter } from "@/types/history";
import { historyService } from "@/lib/services/history";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSettings } from "@/hooks/use-settings";
import { useTranslation } from "@/hooks/use-translation";
import { toast } from "sonner";

// Extracted components
import { HistoryHeader } from "@/components/history/history-header";
import { HistoryFilters } from "@/components/history/history-filters";
import { HistoryTable } from "@/components/history/history-table";
import { HistoryPagination } from "@/components/history/history-pagination";
import { useHistoryData } from "@/hooks/history/use-history-data";

export function HistoryContainer() {
  const {
    history,
    filter,
    setFilter,
    isRefreshing,
    pageIndex,
    setPageIndex,
    pageSize,
    setPageSize,
    filteredHistory,
    paginatedHistory,
    pageCount,
    loadHistory,
    handleRefresh,
    handleSearch,
    handleClearFilters,
    handleActionChange,
    handlePageSizeChange,
  } = useHistoryData();

  const settings = useSettings();
  const { t } = useTranslation(settings);

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <HistoryHeader
          title={t("general.history")}
          isRefreshing={isRefreshing}
          onRefresh={handleRefresh}
          t={t}
        />
        <HistoryFilters
          filter={filter}
          onSearchChange={handleSearch}
          onActionChange={handleActionChange}
          selectedAction={filter.action || "all"}
          onClearFilters={handleClearFilters}
        />
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-2">
          <HistoryTable paginatedHistory={paginatedHistory} t={t} />

          <HistoryPagination
            pageIndex={pageIndex}
            pageSize={pageSize}
            pageCount={pageCount}
            totalItems={filteredHistory.length}
            onPageChange={setPageIndex}
            onPageSizeChange={handlePageSizeChange}
            settings={settings}
            pageSizeOptions={[8, 15, 25, 50]}
          />
        </div>
      </CardContent>
    </Card>
  );
}
