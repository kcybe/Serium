import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"
import { TableMeta } from "../data-table"

interface VerificationCellProps {
  row: any // Replace with actual Row type if possible
  table: any // Replace with actual Table type if possible
}

export default function VerificationCell({ row, table }: VerificationCellProps) {
  const item = row.original
  const lastVerified = item.lastVerified ? new Date(item.lastVerified) : null
  const verificationTimeout = table.options.meta.settings.features.verificationTimeout || 7
  const timeoutInMs = (() => {
    const timeout = verificationTimeout || 7
    switch (table.options.meta.settings.features.verificationTimeoutUnit) {
      case 'minutes': return timeout * 60 * 1000
      case 'hours': return timeout * 60 * 60 * 1000
      default: return timeout * 24 * 60 * 60 * 1000
    }
  })()
  const isExpired = lastVerified && 
    (new Date().getTime() - lastVerified.getTime()) > timeoutInMs

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => table.options.meta.onVerify(item.id)}
        className="h-8 w-8 p-0"
      >
        {item.isVerified ? (
          <CheckCircle className={cn(
            "h-4 w-4",
            isExpired ? "text-red-500" : "text-green-500"
          )} />
        ) : (
          <XCircle className="h-4 w-4 text-red-500" />
        )}
      </Button>
      <span className={cn(
        "text-sm",
        !lastVerified && "text-muted-foreground",
        item.isVerified && !isExpired && "text-green-500",
        (isExpired || !item.isVerified) && "text-red-500"
      )}>
        {lastVerified 
          ? `${formatDistanceToNow(lastVerified)} ago`
          : 'Never verified'}
      </span>
    </div>
  )
}