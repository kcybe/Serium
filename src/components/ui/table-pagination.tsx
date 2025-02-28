"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { SiteSettings } from "@/types/settings";
import { useTranslation } from "@/hooks/use-translation";

interface TablePaginationProps {
  pageIndex: number;
  pageSize: number;
  pageCount: number;
  totalItems: number;
  selectedItems?: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  settings: SiteSettings;
  pageSizeOptions?: number[];
  showSelectedCount?: boolean;
}

export function TablePagination({
  pageIndex,
  pageSize,
  pageCount,
  totalItems,
  selectedItems = 0,
  onPageChange,
  onPageSizeChange,
  settings,
  pageSizeOptions = [8, 15, 25, 50],
  showSelectedCount = false,
}: TablePaginationProps) {
  const { t } = useTranslation(settings);
  const [pageNumber, setPageNumber] = React.useState(pageIndex + 1);

  // Keep input in sync with pageIndex prop
  React.useEffect(() => {
    setPageNumber(pageIndex + 1);
  }, [pageIndex]);

  // Calculate from/to for current page
  const from = pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, totalItems);

  function handlePageInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    const page = value ? Number(value) : 1;
    setPageNumber(page);
  }

  function handlePageInputBlur() {
    const validPage = Math.min(Math.max(1, pageNumber), pageCount || 1);
    setPageNumber(validPage);
    onPageChange(validPage - 1);
  }

  function handlePageKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      const validPage = Math.min(Math.max(1, pageNumber), pageCount || 1);
      setPageNumber(validPage);
      onPageChange(validPage - 1);
    }
  }

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
        <Select
          value={`${pageSize}`}
          onValueChange={(value) => onPageSizeChange(Number(value))}
        >
          <SelectTrigger className="h-7 w-14 text-xs">
            <SelectValue placeholder={pageSize} />
          </SelectTrigger>
          <SelectContent>
            {pageSizeOptions.map((size) => (
              <SelectItem key={size} value={`${size}`} className="text-xs">
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span>
          {showSelectedCount && selectedItems > 0 && (
            <span className="mr-1">
              {t("table.selectedCount", {
                selected: selectedItems,
                total: totalItems,
              })}
              {" · "}
            </span>
          )}
          {t("table.pageInfo", {
            from,
            to,
            total: totalItems,
          })}
        </span>
      </div>

      <div className="flex items-center space-x-1">
        <Button
          variant="outline"
          size="icon"
          className="h-6 w-6"
          onClick={() => onPageChange(0)}
          disabled={pageIndex === 0}
        >
          <ChevronsLeft className="h-3 w-3" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-6 w-6"
          onClick={() => onPageChange(pageIndex - 1)}
          disabled={pageIndex === 0}
        >
          <ChevronLeft className="h-3 w-3" />
        </Button>
        <span className="flex items-center gap-1">
          <Input
            type="number"
            min={1}
            max={pageCount}
            value={pageNumber}
            onChange={handlePageInputChange}
            onBlur={handlePageInputBlur}
            onKeyDown={handlePageKeyDown}
            className="h-6 w-10 text-center text-xs"
            aria-label={t("table.pagination.pageOf", {
              current: pageNumber,
              total: pageCount,
            })}
          />
          <span className="text-xs text-muted-foreground">
            / {pageCount || 1}
          </span>
        </span>
        <Button
          variant="outline"
          size="icon"
          className="h-6 w-6"
          onClick={() => onPageChange(pageIndex + 1)}
          disabled={pageIndex >= pageCount - 1}
        >
          <ChevronRight className="h-3 w-3" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-6 w-6"
          onClick={() => onPageChange(pageCount - 1)}
          disabled={pageIndex >= pageCount - 1}
        >
          <ChevronsRight className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
