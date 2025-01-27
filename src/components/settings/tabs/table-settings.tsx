"use client"

import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tags, ListTodo, Settings2, ListFilter } from "lucide-react"
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
  })
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
      }
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <SettingsSection
          icon={Settings2}
          title="Default Values"
          description="Set default values for new items"
        >
          <div className="grid gap-4">
            <FormField
              control={form.control}
              name="defaultCategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Category</FormLabel>
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
                  <FormLabel>Default Location</FormLabel>
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
                  <FormLabel>Default Status</FormLabel>
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
          title="Categories"
          description="Manage inventory categories"
        >
          <div className="flex gap-2">
            <Input
              placeholder="Add new category"
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
            <Button type="button" onClick={handleAddCategory}>Add</Button>
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
          title="Statuses"
          description="Manage inventory status options"
        >
          <div className="flex gap-2">
            <Input
              placeholder="Add new status"
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
            <Button type="button" onClick={handleAddStatus}>Add</Button>
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
          title="Visible Columns"
          description="Choose which columns to display in the inventory table"
        >
          <div className="grid gap-4">
            {Object.entries(form.getValues().visibleColumns).map(([column, isVisible]) => (
              <div key={column} className="flex items-center justify-between">
                <Label htmlFor={`column-${column}`} className="capitalize">
                  {column}
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

        <DialogFooter>
          <Button type="submit">Save Changes</Button>
        </DialogFooter>
      </form>
    </Form>
  )
}