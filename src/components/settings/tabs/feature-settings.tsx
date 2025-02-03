"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { SettingsSection } from "../settings-layout"
import { SiteSettings } from "@/types/settings"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import { Sparkles, History, Bell, CheckCircle } from "lucide-react"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTranslation } from "@/hooks/use-translation"

interface FeatureSettingsProps {
  settings: SiteSettings
  onSubmit: (values: SiteSettings) => void
}

export function FeatureSettings({ settings, onSubmit }: FeatureSettingsProps) {
  const { t } = useTranslation(settings)
  const [localFeatures, setLocalFeatures] = useState(settings.features)
  const [verificationTimeout, setVerificationTimeout] = useState(
    settings.features.verificationTimeout || 7
  )
  const [verificationTimeoutUnit, setVerificationTimeoutUnit] = useState(
    settings.features.verificationTimeoutUnit || 'days'
  )

  const features = [
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
        title={t(`features.featuresTitle`)}
        description={t(`features.featuresDescription`)}
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
                        {t(feature.id === 'historyTracking' 
                          ? 'features.historyTracking' 
                          : `features.${feature.id}`)}
                      </label>
                      <Checkbox
                        id={feature.id}
                        checked={!!localFeatures?.[feature.id]}
                        onCheckedChange={(checked) => handleFeatureToggle(feature.id, checked)}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {t(feature.id === 'historyTracking' 
                        ? 'features.historyTrackingDescription' 
                        : `features.${feature.id}Description`)}
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
                            {t(`features.${subFeature.id}`)}
                          </label>
                          <p className="text-sm text-muted-foreground">
                            {t(`features.${subFeature.id}Description`)}
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
                                <SelectItem value="minutes">{t('units.minutes')}</SelectItem>
                                <SelectItem value="hours">{t('units.hours')}</SelectItem>
                                <SelectItem value="days">{t('units.days')}</SelectItem>
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