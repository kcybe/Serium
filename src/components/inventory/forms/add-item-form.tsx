"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEffect, useState, useMemo, useCallback } from "react";
import { defaultSettings, SiteSettings, CustomColumn } from "@/types/settings";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { db } from "@/lib/services/db";
import { DialogFooter } from "@/components/ui/dialog";
import { Box, DollarSign, Package, ScrollText } from "lucide-react";
import { SettingsSection } from "@/components/settings/settings-layout";
import { useTranslation } from "@/hooks/use-translation";

// Create a dynamic schema generator function to handle required custom fields
function createFormSchema(customColumns: CustomColumn[] = [], t: any) {
  // Create the base schema with standard fields
  const baseSchemaObj: Record<string, any> = {
    sku: z.string(),
    name: z.string().min(2, t("general.form.nameTooShort")),
    description: z.string(),
    quantity: z.number().min(0, t("general.form.quantityPositive")),
    price: z.number().min(0, t("general.form.pricePositive")),
    category: z.string().min(2, t("general.form.categoryTooShort")),
    location: z.string(),
    status: z.string().min(2, t("general.form.statusTooShort")),
  };

  // Build customFields schema with proper validation for each field
  if (customColumns.length > 0) {
    const customFieldsSchema: Record<string, z.ZodType<any>> = {};

    for (const col of customColumns) {
      let fieldSchema;

      // Create appropriate schema based on field type
      switch (col.type) {
        case "number":
          fieldSchema = z.number().optional();
          break;
        case "boolean":
          fieldSchema = z.boolean().optional();
          break;
        default: // text
          fieldSchema = z.string().optional();
      }

      // Add required validation if needed
      if (col.required) {
        switch (col.type) {
          case "number":
            fieldSchema = z.number({
              required_error: t("general.form.fieldRequired", {
                field: col.label,
              }),
              invalid_type_error: t("general.form.mustBeNumber", {
                field: col.label,
              }),
            });
            break;
          case "boolean":
            // For boolean fields, we want to allow both true AND false as valid values
            // when required, just not undefined/null
            fieldSchema = z
              .boolean({
                required_error: t("general.form.fieldRequired", {
                  field: col.label,
                }),
              })
              .default(false); // Default to false instead of making it optional
            break;
          default: // text
            fieldSchema = z
              .string({
                required_error: t("general.form.fieldRequired", {
                  field: col.label,
                }),
              })
              .min(1, t("general.form.fieldRequired", { field: col.label }));
        }
      }

      customFieldsSchema[col.id] = fieldSchema;
    }

    baseSchemaObj.customFields = z.object(customFieldsSchema).optional();
  } else {
    baseSchemaObj.customFields = z
      .record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
      .optional();
  }

  return z.object(baseSchemaObj);
}

export type AddItemFormValues = z.infer<ReturnType<typeof createFormSchema>>;

interface AddItemFormProps {
  onSubmit: (values: AddItemFormValues) => void;
  onCancel: () => void;
  loading?: boolean;
  defaultValues?: AddItemFormValues;
  submitLabel?: string;
}

export function AddItemForm({
  onSubmit,
  onCancel,
  loading,
  defaultValues,
  submitLabel = "Add Item",
}: AddItemFormProps) {
  const [settings, setSettings] = useState<SiteSettings>({
    ...defaultSettings,
    categories: [],
    statuses: [],
  });
  const { t } = useTranslation(settings);

  // Generate schema using memo to avoid unnecessary recalculations
  const formSchema = useMemo(
    () => createFormSchema(settings.customColumns, t),
    [settings.customColumns, t]
  );

  // Initialize the form with the schema
  const form = useForm<AddItemFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      sku: "",
      description: "",
      quantity: 0,
      price: 0,
      category: settings.defaultCategory || "",
      location: settings.defaultLocation || "",
      status: settings.defaultStatus || "",
      customFields: defaultValues?.customFields || {},
    },
  });

  // Load settings once on component mount
  useEffect(() => {
    const loadSettings = async () => {
      const savedSettings = await db.settings.get("site-settings");
      if (savedSettings) {
        setSettings({
          ...defaultSettings,
          ...savedSettings,
          categories: savedSettings.categories || defaultSettings.categories,
          statuses: savedSettings.statuses || defaultSettings.statuses,
          customColumns:
            savedSettings.customColumns || defaultSettings.customColumns,
        });
      }
    };

    loadSettings();
  }, []);

  // Reset form when settings or defaultValues change
  useEffect(() => {
    if (settings) {
      form.reset({
        name: defaultValues?.name || "",
        sku: defaultValues?.sku || "",
        description: defaultValues?.description || "",
        quantity: defaultValues?.quantity ?? 0,
        price: defaultValues?.price ?? 0,
        category: defaultValues?.category || settings.defaultCategory || "",
        location: defaultValues?.location || settings.defaultLocation || "",
        status: defaultValues?.status || settings.defaultStatus || "",
        customFields: defaultValues?.customFields || {},
      });
    }
  }, [settings, defaultValues, form]);

  // Rest of your component stays the same
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mt-4 space-y-6 max-h-[70vh] overflow-y-auto px-1">
          <SettingsSection
            icon={Package}
            title={t("general.form.productInfo")}
            description={t("general.form.productInfoDesc")}
          >
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("general.form.name")}
                      <span className="text-destructive ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("general.form.namePlaceholder")}
                        {...field}
                      />
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
                    <FormLabel>{t("general.form.sku")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("general.form.skuPlaceholder")}
                        {...field}
                      />
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
                    <FormLabel>{t("general.form.description")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("general.form.descPlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </SettingsSection>

          <SettingsSection
            icon={DollarSign}
            title={t("general.form.pricingStock")}
            description={t("general.form.pricingStockDesc")}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("general.form.quantity")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={t("general.form.quantityPlaceholder")}
                        {...field}
                        value={field.value ?? 0}
                        onChange={(e) => field.onChange(Number(e.target.value))}
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
                    <FormLabel>{t("general.form.price")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder={t("general.form.pricePlaceholder")}
                        {...field}
                        value={field.value ?? 0}
                        onChange={(e) => field.onChange(Number(e.target.value))}
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
            title={t("general.form.classification")}
            description={t("general.form.classificationDesc")}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("general.form.category")}
                        <span className="text-destructive ml-1">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t(
                                "general.form.categoryPlaceholder"
                              )}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {settings.categories.map((category) => (
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
                      <FormLabel>{t("general.form.location")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("general.form.locationPlaceholder")}
                          {...field}
                        />
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
                    <FormLabel>
                      {t("general.form.status")}
                      <span className="text-destructive ml-1">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t("general.form.statusPlaceholder")}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {settings.statuses.map((status) => (
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
              title={t("general.form.customFields")}
              description={t("general.form.customFieldsDesc")}
            >
              <div className="space-y-4">
                {settings.customColumns.map((col: CustomColumn) => (
                  <FormField
                    key={col.id}
                    control={form.control}
                    // Use this path to properly handle nested errors
                    name={`customFields.${col.id}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {col.label}
                          {col.required && (
                            <span className="text-destructive ml-1">*</span>
                          )}
                        </FormLabel>
                        <FormControl>
                          {col.type === "boolean" ? (
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={field.value === true}
                                onChange={(e) =>
                                  field.onChange(e.target.checked)
                                }
                                className="h-4 w-4"
                                id={`checkbox-${col.id}`}
                              />
                              <Label htmlFor={`checkbox-${col.id}`}>
                                {col.required
                                  ? t("general.form.required")
                                  : t("general.form.enterField", {
                                      field: col.label,
                                    })}
                              </Label>
                            </div>
                          ) : (
                            <Input
                              placeholder={t("general.form.enterField", {
                                field: col.label,
                              })}
                              type={col.type === "number" ? "number" : "text"}
                              {...field}
                              value={
                                field.value === undefined ||
                                field.value === null
                                  ? col.type === "number"
                                    ? 0
                                    : ""
                                  : field.value
                              }
                              onChange={(e) => {
                                const newValue =
                                  col.type === "number"
                                    ? e.target.value === ""
                                      ? undefined
                                      : Number(e.target.value)
                                    : e.target.value;
                                field.onChange(newValue);
                              }}
                              aria-required={col.required}
                              className={
                                col.required
                                  ? "border-neutral-300 dark:border-neutral-700"
                                  : ""
                              }
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
            {t("general.cancel")}
          </Button>
          <Button type="submit" disabled={loading}>
            {submitLabel || t("general.addItemButton")}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
