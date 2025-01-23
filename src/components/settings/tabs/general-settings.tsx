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

const generalSettingsSchema = z.object({
  inventoryName: z.string(),  // Changed from companyName
  theme: z.enum(["light", "dark", "system"] as const),
  currency: z.string(),
  dateFormat: z.string(),
  lowStockThreshold: z.number(),
  defaultCategory: z.string(),
  defaultLocation: z.string(),
  defaultStatus: z.string(),
})

type GeneralSettingsValues = z.infer<typeof generalSettingsSchema>

export function GeneralSettings({ settings, onSubmit }: { settings: SiteSettings; onSubmit: (values: SiteSettings) => void }) {
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
        title="Inventory Settings"
        description="Manage your inventory information"
      >
          <FormField
            control={form.control}
            name="inventoryName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Inventory Name</FormLabel>
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
          title="Appearance"
          description="Customize the look and feel"
        >
          <FormField
            control={form.control}
            name="theme"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Theme</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a theme" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </SettingsSection>

        <DialogFooter>
          <Button type="submit">Save Changes</Button>
        </DialogFooter>
      </form>
    </Form>
  )
}