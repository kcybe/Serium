import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { MoreHorizontal, RotateCw } from "lucide-react";

interface HistoryHeaderProps {
  title: string;
  isRefreshing: boolean;
  onRefresh: () => Promise<void>;
  t: (key: string) => string;
}

export function HistoryHeader({
  title,
  isRefreshing,
  onRefresh,
  t,
}: HistoryHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <CardTitle>{title}</CardTitle>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onRefresh} disabled={isRefreshing}>
            <RotateCw
              className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")}
            />
            {isRefreshing ? t("buttons.refreshing") : t("buttons.refresh")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
