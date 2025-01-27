"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { SettingsSection } from "../settings-layout"
import { SiteSettings } from "@/types/settings"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import { Sparkles, Barcode, QrCode, History, Bell, CheckCircle, Clock } from "lucide-react"
import { useState } from "react"
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FeatureSettingsProps {
  settings: SiteSettings
  onSubmit: (values: SiteSettings) => void
}

export function FeatureSettings({ settings, onSubmit }: FeatureSettingsProps) {
  const [localFeatures, setLocalFeatures] = useState(settings.features)
  const [verificationTimeout, setVerificationTimeout] = useState(
    settings.features.verificationTimeout || 7
  )
  const [verificationTimeoutUnit, setVerificationTimeoutUnit] = useState(
    settings.features.verificationTimeoutUnit || 'days'
  )

  const features = [
    {
      id: "barcodeScanning",
      label: "Barcode Scanning",
      description: "Enable barcode scanning for quick item lookup",
      icon: Barcode,
    },
    {
      id: "qrCodeSupport",
      label: "QR Code Support",
      description: "Generate and scan QR codes for inventory items",
      icon: QrCode,
    },
    {
      id: "historyTracking",
      label: "History Tracking",
      description: "Track changes and maintain audit logs",
      icon: History,
    },
    {
      id: "notifications",
      label: "Notifications",
      description: "Get alerts for low stock and important updates",
      icon: Bell,
    },
    {
      id: "itemVerification",
      label: "Item Verification",
      description: "Track when items were last verified in inventory",
      icon: CheckCircle,
      subFeatures: [
        {
          id: "scanToVerify",
          label: "Scan to Verify",
          description: "Enable barcode scanning for quick item verification"
        },
        {
          id: "verificationTimeout",
          label: "Verification Timeout",
          description: "Time before verification status turns red",
          type: "number-with-unit"
        }
      ]
    },
  ]

  const handleFeatureToggle = (featureId: string, checked: boolean | "indeterminate", subFeatureId?: string) => {
    setLocalFeatures(prev => ({
      ...prev,
      [featureId]: subFeatureId ? prev?.[featureId] : (checked === true),
      ...(subFeatureId && {
        [subFeatureId]: checked === true
      })
    }))
  }

  const handleTimeoutChange = (value: string) => {
    const timeout = parseInt(value)
    if (!isNaN(timeout) && timeout > 0) {
      setVerificationTimeout(timeout)
    }
  }

  const handleSubmit = () => {
    onSubmit({
      ...settings,
      features: {
        ...localFeatures,
        verificationTimeout,
        verificationTimeoutUnit
      }
    })
  }

  return (
    <form className="space-y-6">
      <SettingsSection
        icon={Sparkles}
        title="Features"
        description="Enable or disable various features"
      >
        <div className="space-y-4">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div key={feature.id} className="flex flex-col space-y-4 rounded-lg border p-4">
                <div className="flex items-start space-x-4">
                  <Icon className="mt-1 h-5 w-5 text-muted-foreground" />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor={feature.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {feature.label}
                      </label>
                      <Checkbox
                        id={feature.id}
                        checked={!!localFeatures?.[feature.id]}
                        onCheckedChange={(checked) => handleFeatureToggle(feature.id, checked)}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
                {feature.subFeatures && localFeatures?.[feature.id] && (
                  <div className="ml-9 space-y-3 border-l pl-4">
                    {feature.subFeatures.map(subFeature => (
                      <div key={subFeature.id} className="flex items-center justify-between">
                        <div className="flex-1">
                          <label
                            htmlFor={subFeature.id}
                            className="text-sm font-medium leading-none"
                          >
                            {subFeature.label}
                          </label>
                          <p className="text-sm text-muted-foreground">
                            {subFeature.description}
                          </p>
                        </div>
                        {subFeature.type === "number-with-unit" ? (
                          <div className="flex items-center space-x-2">
                            <Input
                              id={subFeature.id}
                              type="number"
                              min="1"
                              value={verificationTimeout}
                              onChange={(e) => handleTimeoutChange(e.target.value)}
                              className="w-20"
                            />
                            <Select
                              value={verificationTimeoutUnit}
                              onValueChange={(value: "minutes" | "hours" | "days") => setVerificationTimeoutUnit(value)}
                            >
                              <SelectTrigger className="w-[110px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="minutes">Minutes</SelectItem>
                                <SelectItem value="hours">Hours</SelectItem>
                                <SelectItem value="days">Days</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        ) : (
                          <Checkbox
                            id={subFeature.id}
                            checked={!!localFeatures?.[subFeature.id]}
                            onCheckedChange={(checked) => 
                              handleFeatureToggle(feature.id, checked, subFeature.id)
                            }
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </SettingsSection>
      <DialogFooter>
        <Button type="button" onClick={handleSubmit}>Save Changes</Button>
      </DialogFooter>
    </form>
  )
}