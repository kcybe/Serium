import { SiteSettings } from '@/types/settings'
import { getTranslations, t } from '@/lib/services/i18n'

export function useTranslation(settings: SiteSettings) {
  return {
    t: (key: string, params?: Record<string, string>) => 
      t(key, settings?.language || 'en', params),
    translations: getTranslations(settings?.language || 'en')
  }
} 