import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar/navbar";
import { Toaster } from "sonner";
import { Footer } from "@/components/footer";
import { pixelifySans, inter } from "@/lib/fonts";
import { LanguageProvider } from "@/providers/language-provider";

export const metadata: Metadata = {
  title: "Serium",
  description: "Manage your inventory with ease",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${pixelifySans.variable}`}
      suppressHydrationWarning
    >
      <body className={inter.className}>
        <LanguageProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
