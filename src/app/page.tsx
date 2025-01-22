import { Hero } from "@/components/hero"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <>
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-7xl mx-auto">
          <Hero />
          {/* Add more sections here */}
        </div>
      </main>
      <Footer />
    </>
  )
}