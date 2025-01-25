"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Save, Table2 } from "lucide-react"
import { GeneralSettings } from "./tabs/general-settings"
import { TableSettings } from "./tabs/table-settings"
import { SiteSettings } from "@/types/settings"
import { BackupSettings } from "./tabs/backup-settings"

interface SettingsTabsProps {
  settings: SiteSettings
  onSubmit: (values: SiteSettings) => void
  onSettingsImported: (newSettings: SiteSettings) => void
  children?: React.ReactNode  // Add this line
}

export function SettingsTabs({ settings, onSubmit, onSettingsImported }: SettingsTabsProps) {
  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-4">
        <TabsTrigger value="general" className="flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          General
        </TabsTrigger>
        <TabsTrigger value="table" className="flex items-center gap-2">
          <Table2 className="h-4 w-4" />
          Table
        </TabsTrigger>
        <TabsTrigger value="backup" className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Backup
        </TabsTrigger>
      </TabsList>
      <TabsContent value="general">
        <GeneralSettings settings={settings} onSubmit={onSubmit} />
      </TabsContent>
      <TabsContent value="table">
        <TableSettings settings={settings} onSubmit={onSubmit} />
      </TabsContent>
      <TabsContent value="backup" className="space-y-6">
        <BackupSettings 
          settings={settings} 
          onSettingsImported={onSettingsImported}
        />
      </TabsContent>
    </Tabs>
  )
}