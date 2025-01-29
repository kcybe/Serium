import { Hero } from "@/components/hero"
import { PageTransition } from '@/components/ui/page-transition'
import MatrixRain from '@/components/matrix-rain'

export default function Home() {
  return (
    <PageTransition>
      <MatrixRain />
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-7xl mx-auto">
          <Hero />
          {/* Add more sections here */}
        </div>
      </main>
    </PageTransition>
  )
}