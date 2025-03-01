// src/providers/language-provider.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { SiteSettings } from "@/types/settings";
import { db } from "@/lib/services/db";

interface LanguageContextValue {
  language: string;
  settings: SiteSettings | null;
  updateLanguage: (newLanguage: string) => Promise<void>;
  isLoading: boolean;
}

// Create a context with default values
const LanguageContext = createContext<LanguageContextValue>({
  language: "en",
  settings: null,
  updateLanguage: async () => {},
  isLoading: true,
});

// Custom hook to access the language context
export function useLanguage() {
  return useContext(LanguageContext);
}

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [language, setLanguage] = useState<string>("en");
  const [isLoading, setIsLoading] = useState(true);

  // Load settings on initial mount
  useEffect(() => {
    async function loadSettings() {
      try {
        const savedSettings = await db.settings.get("site-settings");
        if (savedSettings) {
          setSettings(savedSettings);
          setLanguage(savedSettings.language || "en");
        }
      } catch (error) {
        console.error("Failed to load language settings:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadSettings();
  }, []);

  // Force re-rendering of all components that consume the context when language changes
  async function updateLanguage(newLanguage: string) {
    if (!settings) return;

    try {
      const updatedSettings = {
        ...settings,
        language: newLanguage,
      };

      // Update the database first
      await db.settings.put(updatedSettings, "site-settings");

      // Then update state to trigger re-renders
      setSettings(updatedSettings);
      setLanguage(newLanguage);

      // Refresh translation cache by forcing a context update
      // This forces components to re-render with new translations
      setTimeout(() => {
        setLanguage((curr) =>
          curr === newLanguage ? `${newLanguage}_refresh` : newLanguage
        );
        setTimeout(() => {
          setLanguage(newLanguage);
        }, 0);
      }, 0);
    } catch (error) {
      console.error("Failed to update language:", error);
    }
  }

  const contextValue = {
    language,
    settings,
    updateLanguage,
    isLoading,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}
