import { useState, useEffect, useMemo } from "react";
import { HistoryEntry, HistoryFilter } from "@/types/history";
import { historyService } from "@/lib/services/history";
import { useSettings } from "@/hooks/use-settings";
import { useTranslation } from "@/hooks/use-translation";
import { toast } from "sonner";

type SearchParameter = "all" | "itemId" | "action" | "changes";

export function useHistoryData() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [filter, setFilter] = useState<HistoryFilter>({});
  const [itemIdSearch, setItemIdSearch] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pageSize, setPageSize] = useState(8);
  const [pageIndex, setPageIndex] = useState(0);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  const settings = useSettings();
  const { t } = useTranslation(settings);

  useEffect(() => {
    loadHistory();
  }, [filter, reloadTrigger]);

  const loadHistory = async (showRefreshToast = false) => {
    try {
      const entries = await historyService.getHistory(filter);
      setHistory(entries);
      if (showRefreshToast) {
        toast.success(t("toast.historyRefreshed"));
      }
    } catch (error) {
      console.error("Failed to load history:", error);
      toast.error(t("toast.historyLoadError"));
    }
  };

  const handleSearch = (value: string, parameter: SearchParameter) => {
    if (!value) {
      setFilter({ ...filter, itemId: undefined, searchParameter: undefined });
      return;
    }

    setFilter((prev) => ({
      ...prev,
      itemId: value,
      searchParameter: parameter,
    }));
    setPageIndex(0);
  };

  const handleActionChange = (value: string) => {
    const newActionValue =
      value === "all" ? undefined : (value as "create" | "update" | "delete");

    setFilter({
      ...filter,
      action: newActionValue,
    });
  };

  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      await loadHistory(true);
    } catch (error) {
      console.error("Failed to refresh history:", error);
      toast.error(t("toast.refreshError"));
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleClearFilters = () => {
    setFilter({});
    setItemIdSearch("");
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPageIndex(0);
  };

  const filteredHistory = useMemo(() => {
    let filtered = history;

    if (filter.searchAll && filter.itemId) {
      const searchLower = filter.itemId.toLowerCase();
      filtered = filtered.filter(
        (entry) =>
          entry.itemId.toLowerCase().includes(searchLower) ||
          entry.action.toLowerCase().includes(searchLower) ||
          entry.changes.some(
            (change) =>
              change.field.toLowerCase().includes(searchLower) ||
              String(change.oldValue).toLowerCase().includes(searchLower) ||
              String(change.newValue).toLowerCase().includes(searchLower)
          )
      );
    } else if (filter.itemId && filter.searchParameter) {
      const searchLower = filter.itemId.toLowerCase();
      switch (filter.searchParameter) {
        case "itemId":
          filtered = filtered.filter((entry) =>
            entry.itemId.toLowerCase().includes(searchLower)
          );
          break;
        case "action":
          filtered = filtered.filter((entry) =>
            entry.action.toLowerCase().includes(searchLower)
          );
          break;
        case "changes":
          filtered = filtered.filter((entry) =>
            entry.changes.some(
              (change) =>
                change.field.toLowerCase().includes(searchLower) ||
                String(change.oldValue).toLowerCase().includes(searchLower) ||
                String(change.newValue).toLowerCase().includes(searchLower)
            )
          );
          break;
      }
    }

    return filtered;
  }, [history, filter]);

  const paginatedHistory = useMemo(() => {
    return filteredHistory.slice(
      pageIndex * pageSize,
      (pageIndex + 1) * pageSize
    );
  }, [filteredHistory, pageIndex, pageSize]);

  const pageCount = Math.ceil(filteredHistory.length / pageSize);

  return {
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
  };
}
