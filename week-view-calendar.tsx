"use client"

import { useApp } from "@/context/app-provider"
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isWithinInterval } from "date-fns"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

export function WeekViewCalendar({ selectedDate }: { selectedDate: Date }) {
  const { events, customers } = useApp()

  // Get start and end of the week
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 })
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 0 })

  // Create array of dates for the week
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })

  // Get events for a specific day
  const getEventsForDay = (date: Date) => {
    const dayStart = new Date(date)
    dayStart.setHours(0, 0, 0, 0)

    const dayEnd = new Date(date)
    dayEnd.setHours(23, 59, 59, 999)

    return events.filter((event) => {
      const eventStart = new Date(event.startDate)
      const eventEnd = new Date(event.endDate)

      // Event starts on this day
      const startsOnDay = isSameDay(eventStart, date)

      // Event ends on this day
      const endsOnDay = isSameDay(eventEnd, date)

      // Event spans this day (started before, ends after)
      const spansDay =
        isWithinInterval(date, { start: eventStart, end: eventEnd }) ||
        isWithinInterval(dayStart, { start: eventStart, end: eventEnd }) ||
        isWithinInterval(dayEnd, { start: eventStart, end: eventEnd })

      return startsOnDay || endsOnDay || spansDay
    })
  }

  return (
    <div className="space-y-4">
      <div className="text-center font-medium py-2">
        Week of {format(weekStart, "MMMM d")} - {format(weekEnd, "MMMM d, yyyy")}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day, index) => {
          const dayEvents = getEventsForDay(day)
          const isToday = isSameDay(day, new Date())

          return (
            <div key={index} className="flex flex-col">
              <div
                className={cn(
                  "text-center font-medium py-1 text-sm",
                  isToday && "bg-primary text-primary-foreground rounded-t-md",
                )}
              >
                {format(day, "EEE")}
                <div className="text-xs">{format(day, "MMM d")}</div>
              </div>

              <Card className={cn("flex-1 min-h-[300px]", isToday && "border-primary")}>
                <CardContent className="p-2 h-full overflow-y-auto">
                  {dayEvents.length === 0 ? (
                    <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">
                      No events
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {dayEvents.map((event) => {
                        const customer = customers.find((c) => c.id === event.customerId)
                        const customerName = customer
                          ? `${customer.firstName} ${customer.lastName}`
                          : event.customerName

                        const eventStart = new Date(event.startDate)
                        const eventEnd = new Date(event.endDate)
                        const isStartingToday = isSameDay(eventStart, day)
                        const isEndingToday = isSameDay(eventEnd, day)

                        return (
                          <div
                            key={event.id}
                            className={cn(
                              "text-xs p-2 rounded",
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
                                {isStartingToday
                                  ? `Pickup: ${format(eventStart, "h:mm a")}`
                                  : isEndingToday
                                    ? `Dropoff: ${format(eventEnd, "h:mm a")}`
                                    : "Ongoing"}
                              </span>
                            </div>
                            <div className="text-xs mt-1">
                              {event.carts.map((cart, i) => (
                                <div key={i}>
                                  {cart.type} × {cart.quantity}
                                </div>
                              ))}
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

