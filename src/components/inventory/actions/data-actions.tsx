"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, RotateCw } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"
import { useSettings } from "@/hooks/use-settings"
import { InventoryItem } from "@/types/inventory"

interface DataActionsProps {
  data: InventoryItem[]
  onDataImported: (items: InventoryItem[]) => void
  onRefresh: () => Promise<void>
  isRefreshing: boolean
}

export function DataActions({ onRefresh, isRefreshing }: DataActionsProps) {
  const settings = useSettings()
  const { t } = useTranslation(settings)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onRefresh} disabled={isRefreshing}>
          <RotateCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? t("buttons.refreshing") : t("buttons.refresh")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}