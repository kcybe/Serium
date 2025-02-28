import { Column } from "@tanstack/react-table";
import { InventoryItem } from "@/types/inventory";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { SiteSettings } from "@/types/settings";
import { useTranslation } from "@/hooks/use-translation";

interface SortableHeaderProps {
  column: Column<InventoryItem>;
  title: string;
  settings: SiteSettings;
}

export function SortableHeader({
  column,
  title,
  settings,
}: SortableHeaderProps) {
  const { t } = useTranslation(settings);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-1 h-8 px-2 whitespace-nowrap"
        >
          <span className="font-medium">{title}</span>
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="h-3.5 w-3.5" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="h-3.5 w-3.5" />
          ) : (
            <ArrowUpDown className="h-3.5 w-3.5" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
          <ArrowUp className="mr-2 h-4 w-4" />
          {t("sort.asc")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
          <ArrowDown className="mr-2 h-4 w-4" />
          {t("sort.desc")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
