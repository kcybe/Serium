"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { DialogFooter } from "@/components/ui/dialog"
import { Building2, Palette, Tags, ListTodo, X } from "lucide-react"
import { useState } from "react"
import { db } from "@/lib/services/db"
import { SiteSettings } from "@/types/settings"
import { SettingsSection } from "./settings-layout"

export const settingsSchema = z.object({
  companyName: z.string(),
  theme: z.string(),
  categories: z.array(z.string()),
  statuses: z.array(z.string())
})

interface SettingsFormProps {
  settings: SiteSettings
  onSubmit: (values: SiteSettings) => void
}

export function SettingsForm({ settings, onSubmit }: SettingsFormProps) {
  const [newCategory, setNewCategory] = useState("")
  const [newStatus, setNewStatus] = useState("")

  const form = useForm<SiteSettings>({
    resolver: zodResolver(settingsSchema),
    defaultValues: settings,
  })

  const handleAddCategory = async () => {
    if (!newCategory) return
    const updatedSettings = {
      ...settings,
      id: 'site-settings',
      categories: [...settings.categories, newCategory]
    }
    form.setValue('categories', updatedSettings.categories)
    await db.settings.put(updatedSettings)
    onSubmit(updatedSettings)
    setNewCategory("")
  }

  const handleAddStatus = async () => {
    if (!newStatus) return
    const updatedSettings = {
      ...settings,
      id: 'site-settings',
      statuses: [...settings.statuses, newStatus]
    }
    form.setValue('statuses', updatedSettings.statuses)
    await db.settings.put(updatedSettings)
    onSubmit(updatedSettings)
    setNewStatus("")
  }

  const handleRemoveCategory = async (categoryToRemove: string) => {
    const updatedSettings = {
      ...settings,
      id: 'site-settings',
      categories: settings.categories.filter(c => c !== categoryToRemove)
    }
    form.setValue('categories', updatedSettings.categories)
    await db.settings.put(updatedSettings)
    onSubmit(updatedSettings)
  }

  const handleRemoveStatus = async (statusToRemove: string) => {
    const updatedSettings = {
      ...settings,
      id: 'site-settings',
      statuses: settings.statuses.filter(s => s !== statusToRemove)
    }
    form.setValue('statuses', updatedSettings.statuses)
    await db.settings.put(updatedSettings)
    onSubmit(updatedSettings)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-6">
          <SettingsSection
            icon={Building2}
            title="Company Settings"
            description="Manage your company information"
          >
            <FormField
              control={form.control}
              name="inventoryName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
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

          <SettingsSection
            icon={Tags}
            title="Categories"
            description="Manage inventory categories"
          >
            <div className="flex gap-2">
              <Input
                placeholder="Add new category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="flex-1"
              />
              <Button type="button" onClick={handleAddCategory}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {settings.categories.map((category) => (
                <Badge key={category} variant="secondary" className="flex items-center gap-1">
                  {category}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-destructive" 
                    onClick={() => handleRemoveCategory(category)}
                  />
                </Badge>
              ))}
            </div>
          </SettingsSection>

          <SettingsSection
            icon={ListTodo}
            title="Statuses"
            description="Manage inventory status options"
          >
            <div className="flex gap-2">
              <Input
                placeholder="Add new status"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="flex-1"
              />
              <Button type="button" onClick={handleAddStatus}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {settings.statuses.map((status) => (
                <Badge key={status} variant="secondary" className="flex items-center gap-1">
                  {status}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-destructive" 
                    onClick={() => handleRemoveStatus(status)}
                  />
                </Badge>
              ))}
            </div>
          </SettingsSection>
        </div>

        <DialogFooter>
          <Button type="submit">Save Changes</Button>
        </DialogFooter>
      </form>
    </Form>
  )
}