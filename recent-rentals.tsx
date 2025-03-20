"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useApp } from "@/context/app-provider"
import Link from "next/link"

export function RecentRentals() {
  const { events, customers } = useApp()

  // Get the most recent rentals
  const recentRentals = events
    .filter((event) => event.type === "rental")
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 4)

  if (recentRentals.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 border rounded-md">
        <p className="text-muted-foreground">No rentals found. Create your first rental to see it here.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {recentRentals.map((rental) => {
        const customer = customers.find((c) => c.id === rental.customerId)

        return (
          <div key={rental.id} className="flex items-center justify-between space-x-4 rounded-md border p-4">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarFallback>
                  {customer
                    ? `${customer.firstName[0]}${customer.lastName[0]}`
                    : rental.customerName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium leading-none">
                  {customer ? `${customer.firstName} ${customer.lastName}` : rental.customerName}
                </p>
                <p className="text-sm text-muted-foreground">{customer?.email || "No email provided"}</p>
                <div className="flex items-center pt-2">
                  <Badge variant={rental.status === "active" ? "default" : "outline"} className="mr-2">
                    {rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {rental.carts.map((cart) => `${cart.type} × ${cart.quantity}`).join(", ")}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="text-sm text-right">
                <p className="font-medium">{rental.id}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(rental.startDate).toLocaleDateString()} - {new Date(rental.endDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/rentals/${rental.id}`}>View</Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/rentals/edit/${rental.id}`}>Edit</Link>
                </Button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

