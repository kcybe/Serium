"use client"

import { Button } from "@/components/ui/button"
import { pixelifySans } from "@/lib/fonts"
import { Particles } from "@/components/particles"
import Link from "next/link"

export function Hero() {
  return (
    <>
      <div className="relative overflow-hidden">
        <div className="container flex flex-col items-center justify-center space-y-4 text-center py-24 md:py-32 relative">
          <h1 className={`${pixelifySans.className} text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter relative z-10`}>
            Manage Your Inventory
            <br className="hidden sm:inline" />
            With Ease
          </h1>
          <p className="max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400 relative z-10">
            Streamline your inventory management process with our powerful and intuitive platform.
            Track, manage, and optimize your stock in real-time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8 relative z-10">
            <Button asChild size="lg" variant={"outline"} className={`${pixelifySans.className} text-xl`}>
              <Link href={"/inventory"}>Enter Serium</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}