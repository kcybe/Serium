"use client"

import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tags, ListTodo, Settings2, ListFilter, Save, Trash2 } from "lucide-react"
import { SettingsSection } from "../settings-layout"
import { useState } from "react"
import { SiteSettings } from "@/types/settings"
import { X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { DialogFooter } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { v4 as uuidv4 } from 'uuid'
import { useTranslation } from "@/hooks/use-translation"

const tableSettingsSchema = z.object({
  defaultCategory: z.string(),
  defaultLocation: z.string(),
  defaultStatus: z.string(),
  categories: z.array(z.string()),
  statuses: z.array(z.string()),
  visibleColumns: z.object({
    name: z.boolean(),
    sku: z.boolean(),
    description: z.boolean(),
    quantity: z.boolean(),
    price: z.boolean(),
    category: z.boolean(),
    location: z.boolean(),
    status: z.boolean()
  }),
  customColumns: z.array(
    z.object({
      id: z.string(),
      label: z.string().min(1, "Label is required"),
      type: z.enum(['text', 'number', 'boolean'])
    })
  )
})

type TableSettingsValues = z.infer<typeof tableSettingsSchema>

interface TableSettingsProps {
  settings: SiteSettings
  onSubmit: (values: SiteSettings) => void
  onSettingsUpdated?: () => void
}

export function TableSettings({ settings, onSubmit, onSettingsUpdated }: TableSettingsProps) {
  const [newCategory, setNewCategory] = useState("")
  const [newStatus, setNewStatus] = useState("")
  const [localCategories, setLocalCategories] = useState(settings.categories)
  const [localStatuses, setLocalStatuses] = useState(settings.statuses)
  const [localVisibleColumns, setLocalVisibleColumns] = useState(settings.visibleColumns)
  const { t } = useTranslation(settings)

  const form = useForm<TableSettingsValues>({
    resolver: zodResolver(tableSettingsSchema),
    defaultValues: {
      defaultCategory: settings.defaultCategory,
      defaultLocation: settings.defaultLocation,
      defaultStatus: settings.defaultStatus,
      categories: settings.categories,
      statuses: settings.statuses,
      visibleColumns: settings.visibleColumns || {
        name: true,
        sku: true,
        description: true,
        quantity: true,
        price: true,
        category: true,
        location: true,
        status: true
      },
      customColumns: settings.customColumns || []
    },
  })

  const handleSubmit = async (values: TableSettingsValues) => {
    await onSubmit({ 
      ...settings,
      ...values,
      categories: localCategories,
      statuses: localStatuses,
      visibleColumns: localVisibleColumns
    })
    if (onSettingsUpdated) {
      onSettingsUpdated()
    }
  }

  const handleAddCategory = () => {
    if (!newCategory) return
    setLocalCategories(prev => [...prev, newCategory])
    setNewCategory("")
  }

  const handleAddStatus = () => {
    if (!newStatus) return
    setLocalStatuses(prev => [...prev, newStatus])
    setNewStatus("")
  }

  const handleRemoveCategory = (categoryToRemove: string) => {
    setLocalCategories(prev => prev.filter(c => c !== categoryToRemove))
  }

  const handleRemoveStatus = (statusToRemove: string) => {
    setLocalStatuses(prev => prev.filter(s => s !== statusToRemove))
  }

  // Handlers for custom columns
  const handleAddCustomColumn = () => {
    form.setValue('customColumns', [...form.getValues('customColumns'), { id: uuidv4(), label: '', type: 'text' }])
  }

  const handleRemoveCustomColumn = (index: number) => {
    const currentCustomColumns = form.getValues('customColumns');
    form.setValue('customColumns', currentCustomColumns.filter((_, i) => i !== index));
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <SettingsSection
          icon={Settings2}
          title={t('table.defaultValuesTitle')}
          description={t('table.defaultValuesDescription')}
        >
          <div className="grid gap-4">
            <FormField
              control={form.control}
              name="defaultCategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('table.defaultCategory')}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select default category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {localCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="defaultLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('table.defaultLocation')}</FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      value={field.value || ''} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="defaultStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('table.defaultStatus')}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select default status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {localStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
        </SettingsSection>

        <SettingsSection
          icon={Tags}
          title={t('table.categoriesTitle')}
          description={t('table.categoriesDescription')}
        >
          <div className="flex gap-2">
            <Input
              placeholder={t('table.addCategoryPlaceholder')}
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddCategory()
                }
              }}
            />
            <Button type="button" onClick={handleAddCategory}>{t('buttons.add')}</Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {localCategories.map((category) => (
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
          title={t('table.statusesTitle')}
          description={t('table.statusesDescription')}
        >
          <div className="flex gap-2">
            <Input
              placeholder={t('table.addStatusPlaceholder')}
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddStatus()
                }
              }}
            />
            <Button type="button" onClick={handleAddStatus}>{t('buttons.add')}</Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {localStatuses.map((status) => (
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

        <SettingsSection
          icon={ListFilter}
          title={t('table.visibleColumnsTitle')}
          description={t('table.visibleColumnsDescription')}
        >
          <div className="grid gap-4">
            {Object.entries(form.getValues().visibleColumns).map(([column, isVisible]) => (
              <div key={column} className="flex items-center justify-between">
                <Label htmlFor={`column-${column}`} className="capitalize">
                  {t(`table.columns.${column}`)}
                </Label>
                <Switch
                  id={`column-${column}`}
                  checked={isVisible}
                  onCheckedChange={(checked) => {
                    if (column === 'name') return;
                    const updatedColumns = {
                      ...localVisibleColumns,
                      [column]: checked
                    };
                    setLocalVisibleColumns(updatedColumns);
                    form.setValue(`visibleColumns.${column as keyof typeof settings.visibleColumns}`, checked);
                  }}
                  disabled={column === 'name'}
                />
              </div>
            ))}
          </div>
        </SettingsSection>

        <SettingsSection
          icon={Tags}
          title={t('table.customColumnsTitle')}
          description={t('table.customColumnsDescription')}
        >
          <div className="flex flex-col gap-4">
            {form.watch('customColumns').map((column, index) => (
              <div key={column.id} className="grid grid-cols-[1fr_1fr_auto] items-start gap-4">
                <FormField
                  control={form.control}
                  name={`customColumns.${index}.label`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Label</FormLabel>
                      <FormControl>
                        <Input placeholder="Column Label" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`customColumns.${index}.type`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="text">{t('table.columnTypes.text')}</SelectItem>
                          <SelectItem value="number">{t('table.columnTypes.number')}</SelectItem>
                          <SelectItem value="boolean">{t('table.columnTypes.boolean')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  className="mt-8" 
                  type="button" 
                  variant="destructive" 
                  size="icon"
                  onClick={() => handleRemoveCustomColumn(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" onClick={handleAddCustomColumn}>
              {t('buttons.addCustomColumn')}
            </Button>
          </div>
        </SettingsSection>

        <DialogFooter>
          <Button type="submit">{t('general.save')}</Button>
        </DialogFooter>
      </form>
    </Form>
  )
}