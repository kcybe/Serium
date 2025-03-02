import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { chartConfig } from "@/components/ui/chart-config";
import { useTheme } from "next-themes";
import { useChartColors } from "@/hooks/dashboard/use-chart-colors";
import { useTranslation } from "@/hooks/use-translation";
import { useSettings } from "@/hooks/use-settings";

interface DataChartProps {
  title: string;
  data: Array<{ id: string; value: number }>;
}

export function DataChart({ title, data }: DataChartProps) {
  const { theme } = useTheme();
  const settings = useSettings();
  const { t } = useTranslation(settings);
  const getChartColors = useChartColors();

  return (
    <Card className="h-[400px] flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer
          config={chartConfig}
          className="h-full w-full [&_.recharts-pie-label-text]:fill-foreground"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                content={<ChartTooltip />}
                cursor={{
                  fill:
                    theme === "dark"
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.1)",
                }}
              />
              <Pie
                data={data}
                dataKey="value"
                nameKey="id"
                cx="50%"
                cy="50%"
                innerRadius="35%"
                outerRadius="65%"
                paddingAngle={2}
                label
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getChartColors(data)[index]}
                  />
                ))}
              </Pie>
              <Legend
                verticalAlign="bottom"
                content={({ payload }) => (
                  <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                    {payload?.map((entry, index) => (
                      <div
                        key={`legend-${index}`}
                        className="flex items-center gap-2 text-xs"
                      >
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: entry.color }}
                        />
                        <span>{(entry.payload as any)?.id}</span>
                        <span className="text-muted-foreground">
                          ({(entry.payload as any)?.value ?? 0}{" "}
                          {t("common.items")})
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
