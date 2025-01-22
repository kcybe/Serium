"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useEffect, useState } from "react"
import { defaultSettings, SiteSettings } from "@/types/settings"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { db } from "@/lib/db"

const formSchema = z.object({
  sku: z.string().min(2, "SKU must be at least 2 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string(),
  quantity: z.number().min(0, "Quantity must be positive"),
  price: z.number().min(0, "Price must be positive"),
  category: z.string().min(2, "Category must be at least 2 characters"),
  location: z.string(),
  status: z.string().min(2, "Status must be at least 2 characters"),
})

export type AddItemFormValues = z.infer<typeof formSchema>

interface AddItemFormProps {
  onSubmit: (values: AddItemFormValues) => void
  onCancel: () => void
  loading?: boolean
  defaultValues?: AddItemFormValues
  submitLabel?: string
}

export function AddItemForm({ onSubmit, onCancel, loading, defaultValues, submitLabel = "Add Item" }: AddItemFormProps) {
  const [settings, setSettings] = useState<SiteSettings>({
    ...defaultSettings,
    categories: [],
    statuses: []
  })
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
      ...defaultValues
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
          statuses: savedSettings.statuses || defaultSettings.statuses
        })
      }
    }
    loadSettings()
  }, [])
  
  useEffect(() => {
    if (settings) {
      form.reset({
        ...form.getValues(),
        category: settings.defaultCategory,
        location: settings.defaultLocation,
        status: settings.defaultStatus
      })
    }
  }, [settings])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter item name" {...field} />
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
              <FormLabel>SKU</FormLabel>
              <FormControl>
                <Input placeholder="Enter SKU" {...field} />
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Enter description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Enter quantity" 
                    {...field}
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
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01"
                    placeholder="Enter price" 
                    {...field}
                    onChange={e => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
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
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Enter location" {...field} />
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
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
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
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  )
}