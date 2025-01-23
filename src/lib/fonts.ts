import { Pixelify_Sans } from "next/font/google"

export const pixelifySans = Pixelify_Sans({ 
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
  adjustFontFallback: true,
})