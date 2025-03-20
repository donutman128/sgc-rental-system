"use client"
import { Card, CardContent } from "@/components/ui/card"
import { useApp } from "@/context/app-provider"
import { format, addHours, startOfDay, endOfDay, isWithinInterval } from "date-fns"
import { cn } from "@/lib/utils"

export function DayViewCalendar({ selectedDate }: { selectedDate: Date }) {
  const { events, customers } = useApp()

  // Generate hours for the day view (7am to 10pm)
  const hours = Array.from({ length: 16 }, (_, i) => i + 7)

  // Get events for the selected day
  const getEventsForHour = (hour: number) => {
    const hourStart = addHours(startOfDay(selectedDate), hour)
    const hourEnd = addHours(startOfDay(selectedDate), hour + 1)
    const dayStart = startOfDay(selectedDate)
    const dayEnd = endOfDay(selectedDate)

    return events.filter((event) => {
      const eventStart = new Date(event.startDate)
      const eventEnd = new Date(event.endDate)

      // Check if event starts during this hour
      const startsInHour = eventStart >= hourStart && eventStart < hourEnd

      // Check if event is ongoing during this hour (started before, ends after)
      const isOngoing =
        isWithinInterval(hourStart, { start: eventStart, end: eventEnd }) ||
        isWithinInterval(hourEnd, { start: eventStart, end: eventEnd })

      // Check if event spans this entire day
      const spansDay = eventStart <= dayStart && eventEnd >= dayEnd

      return startsInHour || isOngoing || spansDay
    })
  }

  return (
    <div className="space-y-1">
      <div className="text-center font-medium py-2">{format(selectedDate, "EEEE, MMMM d, yyyy")}</div>

      <div className="grid grid-cols-[80px_1fr] gap-2">
        {hours.map((hour) => {
          const hourEvents = getEventsForHour(hour)
          const formattedHour = format(addHours(startOfDay(selectedDate), hour), "h:mm a")

          return (
            <div key={hour} className="contents">
              <div className="text-sm text-muted-foreground py-2 text-right pr-2">{formattedHour}</div>
              <Card className="min-h-[60px] relative">
                <CardContent className="p-2">
                  {hourEvents.length === 0 ? (
                    <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">
                      {hour >= 8 && hour <= 17 ? "Available" : "After Hours"}
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {hourEvents.map((event) => {
                        const customer = customers.find((c) => c.id === event.customerId)
                        const customerName = customer
                          ? `${customer.firstName} ${customer.lastName}`
                          : event.customerName

                        const eventStart = new Date(event.startDate)
                        const eventEnd = new Date(event.endDate)
                        const isStartingNow =
                          eventStart.getHours() === hour &&
                          eventStart.getDate() === selectedDate.getDate() &&
                          eventStart.getMonth() === selectedDate.getMonth() &&
                          eventStart.getFullYear() === selectedDate.getFullYear()

                        const isEndingToday =
                          eventEnd.getDate() === selectedDate.getDate() &&
                          eventEnd.getMonth() === selectedDate.getMonth() &&
                          eventEnd.getFullYear() === selectedDate.getFullYear()

                        return (
                          <div
                            key={event.id}
                            className={cn(
                              "text-xs p-1 rounded",
                              event.type === "rental"
                                ? "bg-blue-100 text-blue-800"
                                : event.type === "sale"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800",
                            )}
                          >
                            <div className="font-medium">{customerName}</div>
                            <div className="flex justify-between">
                              <span>{event.carts.reduce((sum, cart) => sum + cart.quantity, 0)} carts</span>
                              <span>
                                {isStartingNow
                                  ? `Pickup: ${format(eventStart, "h:mm a")}`
                                  : isEndingToday && eventEnd.getHours() === hour
                                    ? `Dropoff: ${format(eventEnd, "h:mm a")}`
                                    : "Ongoing"}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )
        })}
      </div>
    </div>
  )
}

