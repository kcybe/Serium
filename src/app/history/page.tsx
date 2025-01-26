import { HistoryView } from '@/components/history/history-view'
import { PageTransition } from '@/components/ui/page-transition'

export default function HistoryPage() {
  return (
    <PageTransition>
      <div className="flex justify-center p-8">
        <div className="w-full max-w-7xl">
          <HistoryView />
        </div>
      </div>
    </PageTransition>
  )
}