import { useTranslation } from "@/hooks/use-translation";
import { useSettings } from "@/hooks/use-settings";
import { StatCard } from "./stat-card";

interface InventoryStats {
  totalItems: number;
  lowStockItems: number;
  totalValue: number;
  totalCategories: number;
}

interface OverviewStatsProps {
  stats: InventoryStats;
}

export function OverviewStats({ stats }: OverviewStatsProps) {
  const settings = useSettings();
  const { t } = useTranslation(settings);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title={t("dashboard.totalItems")} value={stats.totalItems} />

      <StatCard title={t("dashboard.lowStock")} value={stats.lowStockItems} />

      <StatCard
        title={t("dashboard.totalValue")}
        value={stats.totalValue}
        formatter={(value) =>
          value.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })
        }
      />

      <StatCard
        title={t("dashboard.categories")}
        value={stats.totalCategories}
      />
    </div>
  );
}
