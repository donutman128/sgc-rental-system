"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, ShoppingCart, Truck, AlertTriangle } from "lucide-react"
import { useApp } from "@/context/app-provider"

export function DashboardStats() {
  const { events, fleet } = useApp()

  // Calculate active rentals
  const activeRentals = events.filter((event) => event.type === "rental" && event.status === "active").length

  // Calculate available carts
  const availableCarts = fleet.filter((cart) => cart.status === "available").length

  // Calculate gas and electric carts
  const gasCarts = fleet.filter(
    (cart) => cart.status === "available" && (cart.type.includes("Gas") || !cart.type.includes("Electric")),
  ).length

  const electricCarts = fleet.filter((cart) => cart.status === "available" && cart.type.includes("Electric")).length

  // Calculate pending deliveries
  const pendingDeliveries = events.filter(
    (event) => (event.type === "delivery" || event.type === "rental") && event.status === "pending",
  ).length

  // Calculate rental vs sales deliveries
  const rentalDeliveries = events.filter((event) => event.type === "rental" && event.status === "pending").length

  const saleDeliveries = events.filter((event) => event.type === "sale" && event.status === "pending").length

  // Calculate maintenance alerts
  const maintenanceAlerts = fleet.filter((cart) => cart.status === "maintenance").length

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Rentals</CardTitle>
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeRentals}</div>
          <p className="text-xs text-muted-foreground">Currently active rentals</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Available Carts</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{availableCarts}</div>
          <p className="text-xs text-muted-foreground">
            {gasCarts} gas, {electricCarts} electric
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Deliveries</CardTitle>
          <Truck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingDeliveries}</div>
          <p className="text-xs text-muted-foreground">
            {rentalDeliveries} rentals, {saleDeliveries} sales
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Maintenance Alerts</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{maintenanceAlerts}</div>
          <p className="text-xs text-muted-foreground">Requires attention</p>
        </CardContent>
      </Card>
    </div>
  )
}

