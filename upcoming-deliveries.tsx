"use client"

import { useApp } from "@/context/app-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Truck, ArrowDownToLine, Calendar, Clock } from "lucide-react"
import { useState } from "react"

export function UpcomingDeliveries() {
  const { events, updateEvent } = useApp()
  const [processingId, setProcessingId] = useState<string | null>(null)

  // Get today's date with time set to start of day
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Filter for today's deliveries and pickups
  const todaysDeliveries = events.filter((event) => {
    const eventDate = new Date(event.startDate)
    eventDate.setHours(0, 0, 0, 0)

    return (
      (event.type === "delivery" || event.type === "pickup") &&
      eventDate.getTime() === today.getTime() &&
      (event.status === "pending" || event.status === "active")
    )
  })

  // Sort by time
  todaysDeliveries.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())

  const handleMarkDelivered = async (id: string) => {
    setProcessingId(id)
    try {
      const event = events.find((e) => e.id === id)
      if (event) {
        const updatedNotes = `${event.notes || ""}\nDelivered on ${new Date().toLocaleString()}`
        await updateEvent(id, {
          status: "active",
          notes: updatedNotes,
        })
      }
    } finally {
      setProcessingId(null)
    }
  }

  const handleMarkPickedUp = async (id: string) => {
    setProcessingId(id)
    try {
      const event = events.find((e) => e.id === id)
      if (event) {
        const updatedNotes = `${event.notes || ""}\nPicked up on ${new Date().toLocaleString()}`
        await updateEvent(id, {
          status: "completed",
          notes: updatedNotes,
        })
      }
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Deliveries</CardTitle>
        <CardDescription>Scheduled deliveries and pickups for today</CardDescription>
      </CardHeader>
      <CardContent>
        {todaysDeliveries.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">No deliveries scheduled for today</div>
        ) : (
          <div className="space-y-4">
            {todaysDeliveries.map((delivery) => (
              <div
                key={delivery.id}
                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    {delivery.type === "delivery" ? (
                      <Truck className="h-5 w-5 text-primary" />
                    ) : (
                      <ArrowDownToLine className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{delivery.title}</div>
                    <div className="text-sm text-muted-foreground">{delivery.customerName}</div>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(delivery.startDate).toLocaleDateString()}
                      <Clock className="h-3 w-3 ml-2 mr-1" />
                      {new Date(delivery.startDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={delivery.status === "pending" ? "outline" : "default"}>
                    {delivery.status === "pending" ? "Pending" : "Active"}
                  </Badge>
                  {delivery.status === "pending" ? (
                    <Button
                      size="sm"
                      onClick={() => handleMarkDelivered(delivery.id)}
                      disabled={processingId === delivery.id}
                    >
                      {processingId === delivery.id ? "Processing..." : "Mark Delivered"}
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleMarkPickedUp(delivery.id)}
                      disabled={processingId === delivery.id}
                    >
                      {processingId === delivery.id ? "Processing..." : "Mark Picked Up"}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

