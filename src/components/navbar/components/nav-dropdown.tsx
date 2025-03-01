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
import { useTranslation } from "@/hooks/use-translation";
import { useLanguage } from "@/providers/language-provider";

interface NavItem {
  labelKey: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    labelKey: "general.inventory",
    href: "/inventory",
    icon: <PackageSearch className="h-4 w-4 mr-2" />,
  },
  {
    labelKey: "general.dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-4 w-4 mr-2" />,
  },
  {
    labelKey: "general.history",
    href: "/history",
    icon: <History className="h-4 w-4 mr-2" />,
  },
  {
    labelKey: "general.settings",
    href: "/settings",
    icon: <Settings className="h-4 w-4 mr-2" />,
  },
];

const homeItem: NavItem = {
  labelKey: "general.home",
  href: "/",
  icon: <Home className="h-4 w-4 mr-2" />,
};

export function NavDropdown() {
  const pathname = usePathname();
  const { language } = useLanguage();
  const { t } = useTranslation();

  const currentPage =
    navItems.find(
      (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
    ) || homeItem;

  const currentIcon = currentPage.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-1">
          <span className="flex items-center">
            {currentIcon}
            {t(currentPage.labelKey)}
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
            {t(homeItem.labelKey)}
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
              {t(item.labelKey)}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
