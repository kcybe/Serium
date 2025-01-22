import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t">
      <div className="flex h-16 items-center justify-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <p className="text-sm text-muted-foreground">
          © 2024 Inventory Manager. All rights reserved.
        </p>
      </div>
    </footer>
  )
}