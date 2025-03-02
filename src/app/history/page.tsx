import { HistoryContainer } from "@/components/history/history-container";
import { PageTransition } from "@/components/ui/page-transition";

export default function HistoryPage() {
  return (
    <PageTransition>
      <div className="flex justify-center p-8">
        <div className="w-full max-w-7xl">
          <HistoryContainer />
        </div>
      </div>
    </PageTransition>
  );
}
