"use client"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, Palette } from "lucide-react"
import { SettingsSection } from "../settings-layout"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { SiteSettings } from "@/types/settings"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import { useTranslation } from "@/hooks/use-translation"

const generalSettingsSchema = z.object({
  inventoryName: z.string(),  // Changed from companyName
  theme: z.enum(["light", "dark", "system"] as const),
  currency: z.string(),
  dateFormat: z.string(),
  lowStockThreshold: z.number(),
  defaultCategory: z.string(),
  defaultLocation: z.string(),
  defaultStatus: z.string(),
  language: z.string(),
})

type GeneralSettingsValues = z.infer<typeof generalSettingsSchema>

export function GeneralSettings({ settings, onSubmit }: { settings: SiteSettings; onSubmit: (values: SiteSettings) => void }) {
  const { t } = useTranslation(settings)
  const form = useForm<GeneralSettingsValues>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      inventoryName: settings.inventoryName || '',  // Add default empty string
      theme: settings.theme || 'system',
      currency: settings.currency || '',
      dateFormat: settings.dateFormat || '',
      lowStockThreshold: settings.lowStockThreshold || 0,
      defaultCategory: settings.defaultCategory || '',
      defaultLocation: settings.defaultLocation || '',
      defaultStatus: settings.defaultStatus || '',
      language: settings.language || 'en',
    },
  })

  const handleSubmit = (values: GeneralSettingsValues) => {
    onSubmit({
      ...settings,
      ...values,
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <SettingsSection
        icon={Building2}
        title={t('settingsSections.inventoryTitle')}
        description={t('settingsSections.inventoryDescription')}
      >
          <FormField
            control={form.control}
            name="inventoryName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('general.inventoryName')}</FormLabel>
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
          title={t('settingsSections.appearanceTitle')}
          description={t('settingsSections.appearanceDescription')}
        >
          <FormField
            control={form.control}
            name="theme"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('settings.theme')}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('settings.themePlaceholder')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="light">{t('theme.light')}</SelectItem>
                    <SelectItem value="dark">{t('theme.dark')}</SelectItem>
                    <SelectItem value="system">{t('theme.system')}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </SettingsSection>

        <SettingsSection
          icon={Palette}
          title={t('settingsSections.languageTitle')}
          description={t('settingsSections.languageDescription')}
        >
          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('settingsSections.languageTitle')}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('languages.en')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="en">{t('languages.en')}</SelectItem>
                    <SelectItem value="he">{t('languages.he')}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </SettingsSection>

        <DialogFooter>
          <Button type="submit">{t('general.save')}</Button>
        </DialogFooter>
      </form>
    </Form>
  )
}