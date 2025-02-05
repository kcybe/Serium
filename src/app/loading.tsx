"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useTranslation } from "@/hooks/use-translation"
import { useSettings } from "@/hooks/use-settings"

export default function Loading() {
  const settings = useSettings()
  const { t } = useTranslation(settings)

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="text-center space-y-4">
        <LoadingSpinner size={48} className="mx-auto" />
        <h2 className="text-2xl font-semibold">{t('general.loading')}</h2>
        <p className="text-muted-foreground">{t('general.loadingDescription')}</p>
      </div>
    </div>
  )
}