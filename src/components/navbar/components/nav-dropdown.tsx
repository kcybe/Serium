"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  PackageSearch,
  LayoutDashboard,
  History,
  Settings,
  Home,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    label: "Inventory",
    href: "/inventory",
    icon: <PackageSearch className="h-4 w-4 mr-2" />,
  },
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-4 w-4 mr-2" />,
  },
  {
    label: "History",
    href: "/history",
    icon: <History className="h-4 w-4 mr-2" />,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: <Settings className="h-4 w-4 mr-2" />,
  },
];

// Home item defined separately since it's used as the default
const homeItem: NavItem = {
  label: "Home",
  href: "/",
  icon: <Home className="h-4 w-4 mr-2" />,
};

export function NavDropdown() {
  const pathname = usePathname();

  // Find current page from pathname
  const currentPage =
    navItems.find(
      (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
    ) || homeItem;

  // Include the icon in the button if we have one
  const currentIcon = currentPage.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-1">
          <span className="flex items-center">
            {currentIcon}
            {currentPage.label}
          </span>
          <ChevronDown className="h-4 w-4 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem key={homeItem.href} asChild>
          <Link
            href={homeItem.href}
            className={`flex items-center w-full ${
              pathname === homeItem.href ? "font-medium bg-accent/50" : ""
            }`}
          >
            {homeItem.icon}
            {homeItem.label}
          </Link>
        </DropdownMenuItem>

        {navItems.map((item) => (
          <DropdownMenuItem key={item.href} asChild>
            <Link
              href={item.href}
              className={`flex items-center w-full ${
                pathname === item.href ? "font-medium bg-accent/50" : ""
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
