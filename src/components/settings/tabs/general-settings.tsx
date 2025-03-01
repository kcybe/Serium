"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2, Palette, Globe } from "lucide-react";
import { SettingsSection } from "../settings-layout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { SiteSettings } from "@/types/settings";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { useTranslation } from "@/hooks/use-translation";
import { useLanguage } from "@/providers/language-provider";
import { useEffect } from "react";

const generalSettingsSchema = z.object({
  inventoryName: z.string(),
  theme: z.enum(["light", "dark", "system"] as const),
  currency: z.string(),
  dateFormat: z.string(),
  lowStockThreshold: z.number(),
  defaultCategory: z.string(),
  defaultLocation: z.string(),
  defaultStatus: z.string(),
  language: z.string(),
});

type GeneralSettingsValues = z.infer<typeof generalSettingsSchema>;

interface GeneralSettingsProps {
  settings: SiteSettings;
  onSubmit: (values: SiteSettings) => void;
}

export function GeneralSettings({ settings, onSubmit }: GeneralSettingsProps) {
  const { updateLanguage } = useLanguage();
  const { t } = useTranslation(settings);

  const form = useForm<GeneralSettingsValues>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      inventoryName: settings.inventoryName || "",
      theme: settings.theme || "system",
      currency: settings.currency || "",
      dateFormat: settings.dateFormat || "",
      lowStockThreshold: settings.lowStockThreshold || 0,
      defaultCategory: settings.defaultCategory || "",
      defaultLocation: settings.defaultLocation || "",
      defaultStatus: settings.defaultStatus || "",
      language: settings.language || "en",
    },
  });

  // Update form when settings change externally
  useEffect(() => {
    form.reset({
      ...form.getValues(),
      language: settings.language || "en",
    });
  }, [settings.language, form]);

  const handleSubmit = async (values: GeneralSettingsValues) => {
    const hasLanguageChanged = values.language !== settings.language;

    // First update settings to ensure persistence
    onSubmit({
      ...settings,
      ...values,
    });

    // Then update language context if needed
    // This ensures the language context is updated after the settings are saved
    if (hasLanguageChanged) {
      await updateLanguage(values.language);
    }
  };

  const availableLanguages = [
    { value: "en", label: t("languages.en") },
    { value: "he", label: t("languages.he") },
    // Add more languages as needed
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <SettingsSection
          icon={Building2}
          title={t("settingsSections.inventoryTitle")}
          description={t("settingsSections.inventoryDescription")}
        >
          <FormField
            control={form.control}
            name="inventoryName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("general.inventoryName")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </SettingsSection>

        <SettingsSection
          icon={Palette}
          title={t("settingsSections.appearanceTitle")}
          description={t("settingsSections.appearanceDescription")}
        >
          <FormField
            control={form.control}
            name="theme"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("settings.theme")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("settings.themePlaceholder")}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="light">{t("theme.light")}</SelectItem>
                    <SelectItem value="dark">{t("theme.dark")}</SelectItem>
                    <SelectItem value="system">{t("theme.system")}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </SettingsSection>

        <SettingsSection
          icon={Globe}
          title={t("settingsSections.languageTitle")}
          description={t("settingsSections.languageDescription")}
        >
          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("settingsSections.languageTitle")}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableLanguages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </SettingsSection>

        <DialogFooter>
          <Button type="submit">{t("general.save")}</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
