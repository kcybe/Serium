import { Button } from "@/components/ui/button"
import { pixelifySans } from "@/lib/fonts"

export function Hero() {
  return (
    <div className="container flex flex-col items-center justify-center space-y-4 text-center py-24 md:py-32 relative overflow-hidden">
      <div className="matrix-bg absolute inset-0 pointer-events-none" aria-hidden="true" />
      <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter relative z-10">
        Manage Your Inventory
        <br className="hidden sm:inline" />
        With <span className={`
          ${pixelifySans.className} 
          text-8xl 
          font-bold 
          matrix-text
          relative
          [animation:matrix-reveal_1s_cubic-bezier(0.25,0.46,0.45,0.94)_both]
        `}>ease</span>
      </h1>
      <p className="max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400 relative z-10">
        Streamline your inventory management process with our powerful and intuitive platform.
        Track, manage, and optimize your stock in real-time.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 mt-8 relative z-10">
        <Button size="lg">Get Started</Button>
        <Button size="lg" variant="outline">Learn More</Button>
      </div>
    </div>
  )
}