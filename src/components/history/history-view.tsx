"use client";

import { useState, useEffect, useMemo } from "react";
import { HistoryEntry, HistoryFilter } from "@/types/history";
import { historyService } from "@/lib/services/history";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, RotateCw } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { HistorySearchFilter } from "@/components/history/history-search-filter";
import { useTranslation } from "@/hooks/use-translation";
import { useSettings } from "@/hooks/use-settings";
import { TablePagination } from "@/components/ui/table-pagination";
import { toast } from "sonner"; // Import toast for notifications

const actionColors = {
  create: "bg-green-500",
  update: "bg-blue-500",
  delete: "bg-red-500",
};

type SearchParameter = "all" | "itemId" | "action" | "changes";

export function HistoryView() {
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
      // Show toast only when explicitly requested
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

    // Removed toast notification
  };

  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      // Pass true to indicate this is a manual refresh
      await loadHistory(true);
    } catch (error) {
      console.error("Failed to refresh history:", error);
      toast.error(t("toast.refreshError"));
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleClearFilters = () => {
    // Removed toast notification
    setFilter({});
    setItemIdSearch("");
  };

  const renderChanges = (changes: HistoryEntry["changes"]) => {
    return changes.map((change, index) => (
      <div key={index} className="text-sm">
        <span className="font-medium">{change.field}: </span>
        <span className="text-muted-foreground">
          {change.oldValue?.toString() || "null"} →{" "}
          {change.newValue?.toString() || "null"}
        </span>
      </div>
    ));
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

  const paginatedHistory = filteredHistory.slice(
    pageIndex * pageSize,
    (pageIndex + 1) * pageSize
  );

  const pageCount = Math.ceil(filteredHistory.length / pageSize);

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPageIndex(0);
    // Removed toast notification
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <CardTitle>History</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleRefresh} disabled={isRefreshing}>
                <RotateCw
                  className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")}
                />
                {isRefreshing ? t("buttons.refreshing") : t("buttons.refresh")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex gap-4">
          <HistorySearchFilter
            onSearchChange={handleSearch}
            onActionChange={(value: string) => {
              const newActionValue =
                value === "all"
                  ? undefined
                  : (value as "create" | "update" | "delete");

              setFilter({
                ...filter,
                action: newActionValue,
              });

              // Removed toast notification
            }}
            selectedAction={filter.action || "all"}
            onClearFilters={handleClearFilters}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-2">
          {/* Table container with defined height and overflow */}
          <div className="rounded-md border overflow-hidden">
            <div className="max-h-[600px] overflow-auto">
              <Table className="w-full">
                <TableHeader className="bg-muted/50 sticky top-0 z-10">
                  <TableRow className="hover:bg-transparent">
                    <TableHead
                      style={{
                        width: "180px",
                        maxWidth: "auto",
                      }}
                      className="h-9 py-1 px-2"
                    >
                      {t("table.headers.date")}
                    </TableHead>
                    <TableHead
                      style={{
                        width: "100px",
                        maxWidth: "100px",
                      }}
                      className="h-9 py-1 px-2"
                    >
                      {t("table.headers.action")}
                    </TableHead>
                    <TableHead
                      style={{
                        width: "120px",
                        maxWidth: "auto",
                      }}
                      className="h-9 py-1 px-2"
                    >
                      {t("table.headers.itemId")}
                    </TableHead>
                    <TableHead
                      style={{
                        width: "auto",
                        maxWidth: "auto",
                      }}
                      className="h-9 py-1 px-2"
                    >
                      {t("table.headers.changes")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedHistory.length ? (
                    paginatedHistory.map((entry) => (
                      <TableRow key={entry.id} className="h-9">
                        <TableCell
                          className="py-1 px-2"
                          style={{
                            maxWidth: "auto",
                          }}
                        >
                          {format(new Date(entry.timestamp), "PPpp")}
                        </TableCell>
                        <TableCell
                          className="py-1 px-2"
                          style={{
                            maxWidth: "100px",
                          }}
                        >
                          <Badge
                            variant="secondary"
                            className={actionColors[entry.action]}
                          >
                            {t(`history.actions.${entry.action}`)}
                          </Badge>
                        </TableCell>
                        <TableCell
                          className="py-1 px-2"
                          style={{
                            maxWidth: "auto",
                          }}
                        >
                          {entry.itemId}
                        </TableCell>
                        <TableCell
                          className="py-1 px-2"
                          style={{
                            maxWidth: "auto",
                          }}
                        >
                          {renderChanges(entry.changes)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-16 text-center">
                        {t("table.noResults")}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Use our common pagination component */}
          <div className="px-2 pt-2">
            <TablePagination
              pageIndex={pageIndex}
              pageSize={pageSize}
              pageCount={pageCount}
              totalItems={filteredHistory.length}
              selectedItems={0} // History doesn't have selectable rows
              onPageChange={(page) => {
                setPageIndex(page);
                // Removed toast notification
              }}
              onPageSizeChange={handlePageSizeChange}
              settings={settings}
              pageSizeOptions={[8, 15, 25, 50]}
              showSelectedCount={false} // No selection in history view
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
