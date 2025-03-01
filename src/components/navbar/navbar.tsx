import Link from "next/link";
import { AnimatedLogo } from "../ui/animated-logo";
import { NavItems } from "./components/nav-items";
import { MobileNav } from "./components/mobile-nav";

export function Navbar() {
  return (
    <div className="sticky top-0 z-50 flex justify-center">
      <nav className="border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 w-full p-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex space-x-2">
            <AnimatedLogo />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex">
            <NavItems />
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <MobileNav />
          </div>
        </div>
      </nav>
    </div>
  );
}
