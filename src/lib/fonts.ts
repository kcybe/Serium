import localFont from 'next/font/local'

export const pixelifySans = localFont({
  src: '../../public/fonts/PixelifySans-Regular.ttf',
  weight: '400',
  display: 'swap',
  fallback: ['system-ui', 'arial'],
  variable: '--font-pixelify',
})

export const inter = localFont({
  src: '../../public/fonts/Inter-Variable.woff2.ttf',
  weight: '100 900',
  display: 'swap',
  fallback: ['system-ui', 'arial'],
  variable: '--font-inter',
})