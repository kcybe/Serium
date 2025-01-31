import { cn } from "@/lib/services/utils/utils"
import { LucideIcon } from "lucide-react"

interface SettingsSectionProps {
  icon: LucideIcon
  title: string
  description: string
  children: React.ReactNode
  className?: string
}

export function SettingsSection({ 
  icon: Icon,
  title, 
  description, 
  children,
  className 
}: SettingsSectionProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-muted-foreground" />
        <div>
          <h3 className="text-lg font-medium leading-none tracking-tight">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="p-4 border rounded-lg space-y-4">
        {children}
      </div>
    </div>
  )
}