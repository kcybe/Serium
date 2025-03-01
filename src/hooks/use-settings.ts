"use client";

import { useEffect, useState } from "react";
import { SiteSettings } from "@/types/settings";
import { db } from "@/lib/services/db";

export function useSettings() {
  const [settings, setSettings] = useState<SiteSettings>({
    language: "en",
  } as SiteSettings);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = await db.settings.get("site-settings");
        if (savedSettings) setSettings(savedSettings);
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    };
    loadSettings();
  }, []);

  return settings;
}
