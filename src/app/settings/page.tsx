"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageTransition } from "@/components/ui/page-transition";
import { SettingsTabs } from "@/components/settings/settings-tabs";
import { SiteSettings, defaultSettings } from "@/types/settings";
import { db } from "@/lib/services/db";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { useTranslation } from "@/hooks/use-translation";

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const { setTheme } = useTheme();
  const { t } = useTranslation(settings);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = await db.settings.get("site-settings");
        if (savedSettings) {
          setSettings({
            ...defaultSettings,
            ...savedSettings,
            categories: savedSettings.categories || defaultSettings.categories,
            statuses: savedSettings.statuses || defaultSettings.statuses,
            customColumns:
              savedSettings.customColumns || defaultSettings.customColumns,
          });
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
        toast.error(t("toast.settingsLoadError"));
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSubmit = async (values: SiteSettings) => {
    try {
      await db.settings.put({ ...values, id: "site-settings" });
      setSettings(values);
      setTheme(values.theme);
      toast.success(t("toast.settingsSaved"));

      // No need to reload the page - just update the state
    } catch (error) {
      toast.error(t("toast.settingsSaveError"));
      console.error(error);
    }
  };

  const handleSettingsImported = (newSettings: SiteSettings) => {
    setSettings(newSettings);
    setTheme(newSettings.theme);
  };

  return (
    <PageTransition>
      <div className="flex justify-center p-8">
        <div className="w-full max-w-4xl">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>{t("settings.pageTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-6">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <Skeleton className="h-32 w-full" />
                </div>
              ) : (
                <SettingsTabs
                  settings={settings}
                  onSubmit={handleSubmit}
                  onSettingsImported={handleSettingsImported}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
