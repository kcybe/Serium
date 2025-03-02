"use client";

import { useInventoryData } from "@/hooks/dashboard/use-dashboard-data";
import { useSettings } from "@/hooks/use-settings";
import { PageTransition } from "@/components/ui/page-transition";
import { OverviewStats } from "@/components/dashboard/overview-stats";
import { ChartSection } from "@/components/dashboard/chart-section";

export default function DashboardPage() {
  const {
    inventoryStats,
    categoryDistribution,
    locationDistribution,
    statusDistribution,
  } = useInventoryData();
  const settings = useSettings();

  return (
    <PageTransition>
      <div className="flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            <OverviewStats stats={inventoryStats} />

            <ChartSection
              categoryDistribution={categoryDistribution}
              locationDistribution={locationDistribution}
              statusDistribution={statusDistribution}
              settings={settings}
            />
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
