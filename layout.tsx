import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { MobileNav } from "@/components/mobile-nav"
import { AppProvider } from "@/context/app-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Stoltzfoos Golf Carts - Rental Management",
  description: "Advanced rental and scheduling software for golf cart fleet management",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AppProvider>
            <div className="flex min-h-screen flex-col">
              <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center">
                  <div className="mr-4 hidden md:flex">
                    <div className="font-bold text-xl">SGC Rentals</div>
                  </div>
                  <div className="hidden md:flex md:flex-1">
                    <MainNav />
                  </div>
                  <div className="flex md:hidden">
                    <MobileNav />
                  </div>
                  <div className="ml-auto flex items-center space-x-4">
                    <UserNav />
                  </div>
                </div>
              </header>
              {children}
            </div>
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'