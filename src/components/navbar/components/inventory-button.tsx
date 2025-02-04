"use client"

import React from 'react'
import { Table } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { useTranslation } from "@/hooks/use-translation"
import { SiteSettings } from "@/types/settings"

export default function InventoryButton({ settings }: { settings?: SiteSettings }) {
  const { t } = useTranslation(settings || { language: 'en' } as SiteSettings)
  
  return (
    <Button variant="outline">
      <Link href='/inventory' className='flex items-center'>
        <Table className="h-[1.2rem] w-[1.2rem]" />
        <span className="ml-2">{t('buttons.inventory')}</span>
      </Link>
    </Button>
  )
}
