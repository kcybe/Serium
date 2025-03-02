import { SiteSettings } from "@/types/settings";
import { TablePagination } from "@/components/ui/table-pagination";

interface HistoryPaginationProps {
  pageIndex: number;
  pageSize: number;
  pageCount: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  settings: SiteSettings;
  pageSizeOptions: number[];
}

export function HistoryPagination({
  pageIndex,
  pageSize,
  pageCount,
  totalItems,
  onPageChange,
  onPageSizeChange,
  settings,
  pageSizeOptions,
}: HistoryPaginationProps) {
  return (
    <div className="px-2 pt-2">
      <TablePagination
        pageIndex={pageIndex}
        pageSize={pageSize}
        pageCount={pageCount}
        totalItems={totalItems}
        selectedItems={0}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        settings={settings}
        pageSizeOptions={pageSizeOptions}
        showSelectedCount={false}
      />
    </div>
  );
}
