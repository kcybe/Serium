import { InventoryItem } from "@/types/inventory";
import { SiteSettings } from "@/types/settings";
import { HistoryEntry } from "@/types/history";

export async function exportToJson(backupData: {
  settings: SiteSettings
  inventory: InventoryItem[]
  history: HistoryEntry[]
}, fileName: string) {
  const blob = new Blob([JSON.stringify({
    meta: {
      version: 1.2,
      createdAt: new Date().toISOString(),
    },
    ...backupData
  }, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}