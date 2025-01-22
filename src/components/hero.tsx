import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <div className="container flex flex-col items-center justify-center space-y-4 text-center py-24 md:py-32">
      <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter">
        Manage Your Inventory
        <br className="hidden sm:inline" />
        With Ease
      </h1>
      <p className="max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
        Streamline your inventory management process with our powerful and intuitive platform.
        Track, manage, and optimize your stock in real-time.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <Button size="lg">Get Started</Button>
        <Button size="lg" variant="outline">Learn More</Button>
      </div>
    </div>
  )
}