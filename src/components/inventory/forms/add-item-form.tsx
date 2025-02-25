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
import { useEffect, useState } from "react"
import { defaultSettings, SiteSettings, CustomColumn } from "@/types/settings"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { db } from "@/lib/services/db"
import { DialogFooter } from "@/components/ui/dialog"
import { Box, DollarSign, Package, ScrollText } from "lucide-react"
import { SettingsSection } from "@/components/settings/settings-layout"
import { useTranslation } from "@/hooks/use-translation"

const formSchema = z.object({
  sku: z.string(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string(),
  quantity: z.number().min(0, "Quantity must be positive"),
  price: z.number().min(0, "Price must be positive"),
  category: z.string().min(2, "Category must be at least 2 characters"),
  location: z.string(),
  status: z.string().min(2, "Status must be at least 2 characters"),
  customFields: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional()
})

export type AddItemFormValues = z.infer<typeof formSchema>

interface AddItemFormProps {
  onSubmit: (values: AddItemFormValues) => void
  onCancel: () => void
  loading?: boolean
  defaultValues?: AddItemFormValues
  submitLabel?: string
}

export function AddItemForm({ onSubmit, onCancel, loading, defaultValues}: AddItemFormProps) {
  const [settings, setSettings] = useState<SiteSettings>({
    ...defaultSettings,
    categories: [],
    statuses: []
  })
  const { t } = useTranslation(settings)
  
  const form = useForm<AddItemFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      sku: '',
      description: '',
      quantity: 0,
      price: 0,
      category: settings.defaultCategory,
      location: settings.defaultLocation,
      status: settings.defaultStatus,
      customFields: defaultValues?.customFields || {}
    }
  })

  useEffect(() => {
    const loadSettings = async () => {
      const savedSettings = await db.settings.get('site-settings')
      if (savedSettings) {
        setSettings({
          ...defaultSettings,
          ...savedSettings,
          categories: savedSettings.categories || defaultSettings.categories,
          statuses: savedSettings.statuses || defaultSettings.statuses,
          customColumns: savedSettings.customColumns || defaultSettings.customColumns
        })
      }
    }
    loadSettings()
  }, [])
  
  useEffect(() => {
    if (settings) {
      form.reset({
        name: defaultValues?.name || '',
        sku: defaultValues?.sku || '',
        description: defaultValues?.description || '',
        quantity: defaultValues?.quantity ?? 0,
        price: defaultValues?.price ?? 0,
        category: defaultValues?.category || settings.defaultCategory,
        location: defaultValues?.location || settings.defaultLocation,
        status: defaultValues?.status || settings.defaultStatus,
        customFields: defaultValues?.customFields || {}
      })
    }
  }, [settings, defaultValues])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mt-4 space-y-6 max-h-[70vh] overflow-y-auto px-1">
          <SettingsSection
            icon={Package}
            title={t('general.form.productInfo')}
            description={t('general.form.productInfoDesc')}
          >
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('general.form.name')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('general.form.namePlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('general.form.sku')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('general.form.skuPlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('general.form.description')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('general.form.descPlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </SettingsSection>

          <SettingsSection
            icon={DollarSign}
            title={t('general.form.pricingStock')}
            description={t('general.form.pricingStockDesc')}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('general.form.quantity')}</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder={t('general.form.quantityPlaceholder')}
                        {...field}
                        value={field.value ?? 0}
                        onChange={e => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('general.form.price')}</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        placeholder={t('general.form.pricePlaceholder')}
                        {...field}
                        value={field.value ?? 0}
                        onChange={e => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </SettingsSection>

          <SettingsSection
            icon={Box}
            title={t('general.form.classification')}
            description={t('general.form.classificationDesc')}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('general.form.category')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('general.form.categoryPlaceholder')} />
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
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('general.form.location')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('general.form.locationPlaceholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('general.form.status')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('general.form.statusPlaceholder')} />
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
          </SettingsSection>

          {settings.customColumns.length > 0 && (
            <SettingsSection
              icon={ScrollText}
              title={t('general.form.customFields')}
              description={t('general.form.customFieldsDesc')}
            >
              <div className="space-y-4">
                {settings.customColumns.map((col: CustomColumn) => (
                  <FormField
                    key={col.id}
                    control={form.control}
                    name={`customFields.${col.id}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{col.label}</FormLabel>
                        <FormControl>
                          {col.type === 'boolean' ? (
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={!!field.value}
                                onChange={(e) => field.onChange(e.target.checked)}
                                className="h-4 w-4"
                              />
                            </div>
                          ) : (
                            <Input 
                              placeholder={`Enter ${col.label}`}
                              type={col.type === 'number' ? 'number' : 'text'}
                              {...field}
                              value={
                                col.type === 'number' 
                                  ? (field.value as number | undefined ?? 0)
                                  : (field.value as string | undefined ?? '')
                              }
                              onChange={(e) => {
                                const newValue = col.type === 'number' 
                                  ? Number(e.target.value) 
                                  : e.target.value;
                                field.onChange(newValue);
                              }}
                            />
                          )}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </SettingsSection>
          )}
        </div>

        <DialogFooter className="mt-6">
          <Button type="button" variant="outline" onClick={onCancel}>
            {t('general.cancel')}
          </Button>
          <Button type="submit" disabled={loading}>
            {t('general.addItemButton')}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}