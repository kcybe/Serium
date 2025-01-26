import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t mt-auto py-2">
      <div className="flex h-10 items-center justify-center px-4">
        <p className="text-xs text-muted-foreground">
          © 2024 Inventory Manager. All rights reserved.
        </p>
      </div>
    </footer>
  )
}