export function useChartColors() {
  return (data: Array<{ id: string }>) => {
    return data.map((_, index) => `hsl(var(--chart-${(index % 5) + 1}))`);
  };
}
