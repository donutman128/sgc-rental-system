"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { CalendarDays, ShoppingCart, Users, Settings, TrendingUp, Truck, Menu } from "lucide-react"

export function MobileNav() {
  const [open, setOpen] = useState(false)
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
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <div className="px-7">
          <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
            <span className="font-bold text-xl">SGC Rentals</span>
          </Link>
        </div>
        <div className="flex flex-col gap-4 mt-8 px-2">
          {routes.map((route) => (
            <Button
              key={route.href}
              variant={route.active ? "default" : "ghost"}
              className="justify-start w-full"
              asChild
              onClick={() => setOpen(false)}
            >
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
        </div>
      </SheetContent>
    </Sheet>
  )
}

