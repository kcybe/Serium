import { Hero } from "@/components/hero"
import { PageTransition } from '@/components/ui/page-transition'
import { TopGlow } from '@/components/top-glow'
import { Particles } from "@/components/particles"

export default function Home() {
  return (
    <div>
      <TopGlow />
      <Particles persistent={true} duration={[2, 30]} count={75} speed={1} shape="circle" size={6} range={650} />
      <PageTransition>
        <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-7xl mx-auto">
            <Hero />
            {/* Add more sections here */}
          </div>
        </main>
      </PageTransition>
    </div>
  )
}