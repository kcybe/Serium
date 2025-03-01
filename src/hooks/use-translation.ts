"use client";

import { SiteSettings } from "@/types/settings";
import { getTranslations, t } from "@/lib/services/i18n";
import { useLanguage } from "@/providers/language-provider";
import { useMemo } from "react";

interface TranslationResult {
  t: (key: string, params?: Record<string, string>) => string;
  translations: Record<string, any>;
  currentLanguage: string;
}

export function useTranslation(
  settingsOverride?: SiteSettings
): TranslationResult {
  const { language: contextLanguage } = useLanguage();

  // Priority: 1) explicit settings passed in 2) context language 3) fallback to "en"
  const language = settingsOverride?.language || contextLanguage || "en";

  // Memoize translations to avoid unnecessary re-renders
  const translations = useMemo(() => getTranslations(language), [language]);

  // Create a translation function that always uses the current language
  const translate = (key: string, params?: Record<string, string>) => {
    return t(key, language, params);
  };

  return {
    t: translate,
    translations,
    currentLanguage: language,
  };
}
