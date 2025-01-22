"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SiteSettings, currencyOptions, dateFormatOptions, themeOptions } from "@/types/settings"
import { useState } from "react"
import { db } from "@/lib/db"

const formSchema = z.object({
    id: z.string().optional(),
    companyName: z.string().min(2),
    currency: z.string(),
    dateFormat: z.string(),
    theme: z.enum(['light', 'dark', 'system']),
    lowStockThreshold: z.number().min(0),
    defaultCategory: z.string(),
    defaultLocation: z.string(),
    defaultStatus: z.string(),
    categories: z.array(z.string()),
    statuses: z.array(z.string())
  })

interface SettingsFormProps {
  settings: SiteSettings
  onSubmit: (values: SiteSettings) => void
}

export function SettingsForm({ settings, onSubmit }: SettingsFormProps) {
  const [newCategory, setNewCategory] = useState('')
  const [newStatus, setNewStatus] = useState('')
  
  const form = useForm<SiteSettings>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: 'site-settings',
      ...settings
    },
    values: settings // Add this line to keep form in sync with settings
  })

  const handleAddCategory = async () => {
    if (newCategory && !settings.categories.includes(newCategory)) {
      const updatedSettings = {
        ...settings,
        id: 'site-settings',
        categories: [...settings.categories, newCategory]
      }
      await db.settings.put(updatedSettings)
      onSubmit(updatedSettings) // Call onSubmit to update parent state
      setNewCategory('')
    }
  }
  
  const handleAddStatus = async () => {
    if (newStatus && !settings.statuses.includes(newStatus)) {
      const updatedSettings = {
        ...settings,
        id: 'site-settings',
        statuses: [...settings.statuses, newStatus]
      }
      await db.settings.put(updatedSettings)
      onSubmit(updatedSettings) // Call onSubmit to update parent state
      setNewStatus('')
    }
  }
  
  const handleRemoveCategory = async (categoryToRemove: string) => {
    const updatedSettings = {
      ...settings,
      id: 'site-settings', // Ensure id is included
      categories: settings.categories.filter(c => c !== categoryToRemove)
    }
    form.setValue('categories', updatedSettings.categories)
    await db.settings.put(updatedSettings)
    onSubmit(updatedSettings)
  }
  
  const handleRemoveStatus = async (statusToRemove: string) => {
    const updatedSettings = {
      ...settings,
      id: 'site-settings', // Ensure id is included
      statuses: settings.statuses.filter(s => s !== statusToRemove)
    }
    form.setValue('statuses', updatedSettings.statuses)
    await db.settings.put(updatedSettings)
    onSubmit(updatedSettings)
  }
  
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Company & Theme Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">General Settings</h3>
              <FormField
                control={form.control}
                name="companyName"
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

              <FormField
                control={form.control}
                name="theme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Theme</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {themeOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lowStockThreshold"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Low Stock Threshold</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={e => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Defaults Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Default Values</h3>
              <FormField
                control={form.control}
                name="defaultCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {settings.categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="defaultLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Location</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="defaultStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {settings.statuses.map(status => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Categories and Statuses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Categories</h3>
              <div className="flex gap-2">
                <Input 
                  value={newCategory} 
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="New category"
                />
                <Button type="button" onClick={handleAddCategory}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.watch('categories').map((category) => (
                  <div key={category} className="flex items-center bg-secondary p-1 rounded">
                    {category}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveCategory(category)}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Statuses</h3>
              <div className="flex gap-2">
                <Input 
                  value={newStatus} 
                  onChange={(e) => setNewStatus(e.target.value)}
                  placeholder="New status"
                />
                <Button type="button" onClick={handleAddStatus}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.watch('statuses').map((status) => (
                  <div key={status} className="flex items-center bg-secondary p-1 rounded">
                    {status}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveStatus(status)}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Button type="submit">Save Settings</Button>
        </form>
      </Form>
    )
  }