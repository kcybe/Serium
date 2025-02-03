import { Column } from "@tanstack/react-table"
import { InventoryItem } from "@/types/inventory"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react"
import { SiteSettings } from "@/types/settings"
import { useTranslation } from "@/hooks/use-translation";

export function SortableHeader({
  column,
  title,
  settings
}: {
  column: Column<InventoryItem>,
  title: string,
  settings: SiteSettings
}) {
  const { t } = useTranslation(settings);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          {title}
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="h-4 w-4" />
          ) : (
            <ArrowUpDown className="h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
          <ArrowUp className="mr-2 h-4 w-4" />
          {t('sort.asc')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
          <ArrowDown className="mr-2 h-4 w-4" />
          {t('sort.desc')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}