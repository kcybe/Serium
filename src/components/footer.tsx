import { Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t mt-auto py-2 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-10 items-center justify-center px-4">
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          Made with 
          <Heart className="w-4 h-4 text-red-500 fill-red-500/20" /> 
          by
          <a 
            href="https://github.com/kcybe" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Noam
          </a>
        </p>
      </div>
    </footer>
  )
}