import { SiteSettings } from '@/types/settings'
import en from '@/locales/en.json'
import he from '@/locales/he.json'

type Translations = typeof en
type LocaleKeys = keyof typeof en

const translations = { en, he } as const

export function getTranslations(language: string): Translations {
  return translations[language as keyof typeof translations] || en
}

export function t(key: string, language: string, params?: Record<string, string>): string {
  const keys = key.split('.') as Array<keyof Translations | LocaleKeys>
  let value: any = translations[language as keyof typeof translations] || en
  
  for (const k of keys) {
    value = value[k]
    if (!value) return key // Fallback to key if not found
  }
  
  return typeof value === 'string' 
    ? value.replace(/\${(\w+)}/g, (_, p) => params?.[p] || '')
    : key
} 