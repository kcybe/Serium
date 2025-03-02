import { DataChart } from "./data-chart";
import { SiteSettings } from "@/types/settings";
import { useTranslation } from "@/hooks/use-translation";

interface ChartSectionProps {
  categoryDistribution: Array<{ id: string; value: number }>;
  locationDistribution: Array<{ id: string; value: number }>;
  statusDistribution: Array<{ id: string; value: number }>;
  settings: SiteSettings;
}

export function ChartSection({
  categoryDistribution,
  locationDistribution,
  statusDistribution,
  settings,
}: ChartSectionProps) {
  const { t } = useTranslation(settings);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <DataChart
        title={t("dashboard.categoryDist")}
        data={categoryDistribution}
      />
      <DataChart
        title={t("dashboard.locationDist")}
        data={locationDistribution}
      />
      <DataChart title={t("dashboard.statusDist")} data={statusDistribution} />
    </div>
  );
}
