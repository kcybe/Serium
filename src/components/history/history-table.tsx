import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { HistoryEntry } from "@/types/history";

interface HistoryTableProps {
  paginatedHistory: HistoryEntry[];
  t: (key: string) => string;
}

const actionColors = {
  create: "bg-green-500",
  update: "bg-blue-500",
  delete: "bg-red-500",
};

export function HistoryTable({ paginatedHistory, t }: HistoryTableProps) {
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

  return (
    <div className="rounded-md border overflow-hidden">
      <div className="max-h-[600px] overflow-auto">
        <Table className="w-full">
          <TableHeader className="bg-muted/50 sticky top-0 z-10">
            <TableRow className="hover:bg-transparent">
              <TableHead
                style={{ width: "180px", maxWidth: "auto" }}
                className="h-9 py-1 px-2"
              >
                {t("table.headers.date")}
              </TableHead>
              <TableHead
                style={{ width: "100px", maxWidth: "100px" }}
                className="h-9 py-1 px-2"
              >
                {t("table.headers.action")}
              </TableHead>
              <TableHead
                style={{ width: "120px", maxWidth: "auto" }}
                className="h-9 py-1 px-2"
              >
                {t("table.headers.itemId")}
              </TableHead>
              <TableHead
                style={{ width: "auto", maxWidth: "auto" }}
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
                  <TableCell className="py-1 px-2" style={{ maxWidth: "auto" }}>
                    {format(new Date(entry.timestamp), "PPpp")}
                  </TableCell>
                  <TableCell
                    className="py-1 px-2"
                    style={{ maxWidth: "100px" }}
                  >
                    <Badge
                      variant="secondary"
                      className={actionColors[entry.action]}
                    >
                      {t(`history.actions.${entry.action}`)}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-1 px-2" style={{ maxWidth: "auto" }}>
                    {entry.itemId}
                  </TableCell>
                  <TableCell className="py-1 px-2" style={{ maxWidth: "auto" }}>
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
  );
}
