"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { CalendarDays, ShoppingCart, Users, Settings, TrendingUp, Truck } from "lucide-react"

export function MainNav() {
  const pathname = usePathname()

  const routes = [
    {
      href: "/",
      label: "Dashboard",
      icon: TrendingUp,
      active: pathname === "/",
    },
    {
      href: "/calendar",
      label: "Calendar",
      icon: CalendarDays,
      active: pathname === "/calendar",
    },
    {
      href: "/rentals",
      label: "Rentals",
      icon: ShoppingCart,
      active: pathname.startsWith("/rentals"),
    },
    {
      href: "/fleet",
      label: "Fleet",
      icon: Truck,
      active: pathname.startsWith("/fleet"),
    },
    {
      href: "/customers",
      label: "Customers",
      icon: Users,
      active: pathname.startsWith("/customers"),
    },
    {
      href: "/settings",
      label: "Settings",
      icon: Settings,
      active: pathname.startsWith("/settings"),
    },
  ]

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {routes.map((route) => (
        <Button key={route.href} variant={route.active ? "default" : "ghost"} asChild className="justify-start">
          <Link
            href={route.href}
            className={cn(
              "flex items-center text-sm font-medium transition-colors",
              route.active ? "text-primary-foreground" : "text-muted-foreground hover:text-primary",
            )}
          >
            <route.icon className="mr-2 h-4 w-4" />
            {route.label}
          </Link>
        </Button>
      ))}
    </nav>
  )
}

