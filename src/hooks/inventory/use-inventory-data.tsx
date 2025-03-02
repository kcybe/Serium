// src/app/inventory/hooks/use-inventory-data.tsx
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { db } from "@/lib/services/db";
import { defaultSettings, type SiteSettings } from "@/types/settings";
import { type InventoryItem } from "@/types/inventory";
import { useTranslation } from "@/hooks/use-translation";
import { historyService } from "@/lib/services/history";

export function useInventoryData() {
  const [data, setData] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [historyEnabled, setHistoryEnabled] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isLoadingRef = useRef(false);
  const isInitialLoad = useRef(true);
  const isVerifying = useRef(false);
  const { t } = useTranslation(settings);

  const loadItems = async (isManualRefresh = false) => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    setIsRefreshing(true);
    setIsLoading(true);

    try {
      // Load both items and settings in parallel
      const [items, savedSettings] = await Promise.all([
        db.inventory.toArray(),
        db.settings.get("site-settings"),
      ]);

      const updatedItems = items.map((item) => ({
        ...item,
        isVerified: item.lastVerified
          ? new Date().getTime() - new Date(item.lastVerified).getTime() <
            24 * 60 * 60 * 1000
          : false,
      }));

      // Merge settings with defaultSettings to ensure customColumns is defined
      const mergedSettings: SiteSettings = savedSettings
        ? {
            ...defaultSettings,
            ...savedSettings,
            customColumns:
              savedSettings.customColumns || defaultSettings.customColumns,
          }
        : defaultSettings;

      // Check if there are actual changes in the data or settings
      const hasDataChanges =
        JSON.stringify(updatedItems) !== JSON.stringify(data);
      const hasSettingsChanges =
        JSON.stringify(mergedSettings) !== JSON.stringify(settings);

      setData(updatedItems);
      setSettings(mergedSettings);

      // Only show toasts for manual refreshes, not initial load
      if (isManualRefresh) {
        if (hasDataChanges || hasSettingsChanges) {
          toast.success(t("toast.refreshSuccess"));
        } else {
          toast.info(t("toast.noChanges"));
        }
      }
    } catch (e) {
      const error = e instanceof Error ? e : new Error("Unknown error");
      if (isManualRefresh) {
        toast.error(t("toast.refreshError", { error: error.message }));
      }
    } finally {
      isLoadingRef.current = false;
      setIsRefreshing(false);
      setIsLoading(false);
      setLoading(false);
      isInitialLoad.current = false;
    }
  };

  // Load settings separately
  const loadSettings = async () => {
    const savedSettings = await db.settings.get("site-settings");
    if (savedSettings) {
      setSettings({
        ...defaultSettings,
        ...savedSettings,
        customColumns:
          savedSettings.customColumns || defaultSettings.customColumns,
      });
    } else {
      setSettings(defaultSettings);
    }
  };

  // Initial data load
  useEffect(() => {
    let mounted = true;

    const initializePage = async () => {
      if (!mounted) return;
      await loadItems(false);
      await loadSettings();
    };

    initializePage();

    return () => {
      mounted = false;
    };
  }, []);

  // Check history tracking
  useEffect(() => {
    const checkHistoryTracking = async () => {
      const isEnabled = await historyService.isHistoryTrackingEnabled();
      setHistoryEnabled(isEnabled);
    };
    checkHistoryTracking();
  }, [settings]);

  return {
    data,
    setData,
    loading,
    isLoading,
    settings,
    historyEnabled,
    isRefreshing,
    isVerifying,
    loadItems,
    t,
  };
}
