import Link from "next/link";
import { AnimatedLogo } from "../ui/animated-logo";
import { ClientNavItems } from "./components/client-nav-items";
import { ClientMobileNav } from "./components/client-mobile-nav";

export function Navbar() {
  return (
    <div className="sticky top-0 z-50 flex justify-center">
      <nav className="border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 w-full p-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex space-x-2">
            <AnimatedLogo />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-1">
            <ClientNavItems />
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <ClientMobileNav />
          </div>
        </div>
      </nav>
    </div>
  );
}
