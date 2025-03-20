"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { useApp } from "@/context/app-provider"
import Link from "next/link"
import { YearViewCalendar } from "@/components/year-view-calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DayViewCalendar } from "@/components/day-view-calendar"
import { WeekViewCalendar } from "@/components/week-view-calendar"
import { format, isWithinInterval } from "date-fns"

export default function CalendarPage() {
  const { events, customers } = useApp()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState("month")

  // Generate days for the month view
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()

  const prevPeriod = () => {
    if (view === "day") {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 1))
    } else if (view === "week") {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7))
    } else if (view === "month") {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
    } else if (view === "year") {
      setCurrentDate(new Date(currentDate.getFullYear() - 1, 0, 1))
    }
  }

  const nextPeriod = () => {
    if (view === "day") {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1))
    } else if (view === "week") {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 7))
    } else if (view === "month") {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
    } else if (view === "year") {
      setCurrentDate(new Date(currentDate.getFullYear() + 1, 0, 1))
    }
  }

  const monthName = currentDate.toLocaleString("default", { month: "long" })
  const year = currentDate.getFullYear()

  // Days of the week
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  // Create calendar days array
  const calendarDays = []

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null)
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day)
  }

  // Get events for the current month
  const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

  // Function to get events for a specific day
  const getEventsForDay = (day: number) => {
    if (!day) return []

    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    const dayStart = new Date(date)
    dayStart.setHours(0, 0, 0, 0)

    const dayEnd = new Date(date)
    dayEnd.setHours(23, 59, 59, 999)

    return events.filter((event) => {
      const eventStart = new Date(event.startDate)
      const eventEnd = new Date(event.endDate)

      // Event starts on this day
      const startsOnDay = eventStart >= dayStart && eventStart <= dayEnd

      // Event ends on this day
      const endsOnDay = eventEnd >= dayStart && eventEnd <= dayEnd

      // Event spans this day (started before, ends after)
      const spansDay =
        isWithinInterval(date, { start: eventStart, end: eventEnd }) ||
        isWithinInterval(dayStart, { start: eventStart, end: eventEnd }) ||
        isWithinInterval(dayEnd, { start: eventStart, end: eventEnd })

      return startsOnDay || endsOnDay || spansDay
    })
  }

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Rental Calendar</h1>
        <div className="flex items-center gap-2">
          <Select value={view} onValueChange={setView}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Day View</SelectItem>
              <SelectItem value="week">Week View</SelectItem>
              <SelectItem value="month">Month View</SelectItem>
              <SelectItem value="year">Year View</SelectItem>
            </SelectContent>
          </Select>
          <Button asChild>
            <Link href="/rentals/new">
              <Plus className="mr-2 h-4 w-4" />
              New Booking
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="icon" onClick={prevPeriod}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2">
                <CardTitle>
                  {view === "day"
                    ? format(currentDate, "MMMM d, yyyy")
                    : view === "week"
                      ? `Week of ${format(currentDate, "MMMM d")}`
                      : view === "month"
                        ? `${monthName} ${year}`
                        : `${year}`}
                </CardTitle>
                <Select
                  value={year.toString()}
                  onValueChange={(value) => {
                    const newDate = new Date(currentDate)
                    newDate.setFullYear(Number.parseInt(value))
                    setCurrentDate(newDate)
                  }}
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 11 }, (_, i) => new Date().getFullYear() + i).map((y) => (
                      <SelectItem key={y} value={y.toString()}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" size="icon" onClick={nextPeriod}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex space-x-2">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
                <span className="text-xs">Rental</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                <span className="text-xs">Sale</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                <span className="text-xs">Service</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={view} value={view} onValueChange={setView} className="space-y-4">
            <TabsList>
              <TabsTrigger value="day">Day View</TabsTrigger>
              <TabsTrigger value="week">Week View</TabsTrigger>
              <TabsTrigger value="month">Month View</TabsTrigger>
              <TabsTrigger value="year">Year View</TabsTrigger>
            </TabsList>

            <TabsContent value="day">
              <DayViewCalendar selectedDate={currentDate} />
            </TabsContent>

            <TabsContent value="week">
              <WeekViewCalendar selectedDate={currentDate} />
            </TabsContent>

            <TabsContent value="month">
              <div className="grid grid-cols-7 gap-1">
                {weekDays.map((day) => (
                  <div key={day} className="text-center font-medium py-2 text-sm">
                    {day}
                  </div>
                ))}

                {calendarDays.map((day, index) => {
                  // Find events for this day
                  const dayEvents = day ? getEventsForDay(day) : []

                  return (
                    <div
                      key={index}
                      className={cn(
                        "min-h-[100px] p-2 border text-sm",
                        day ? "bg-background hover:bg-muted/50 cursor-pointer" : "bg-muted/20",
                        day === new Date().getDate() &&
                          currentDate.getMonth() === new Date().getMonth() &&
                          currentDate.getFullYear() === new Date().getFullYear()
                          ? "border-primary"
                          : "border-border",
                      )}
                      onClick={() => {
                        if (day) {
                          const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
                          setCurrentDate(newDate)
                          setView("day")
                        }
                      }}
                    >
                      {day && (
                        <>
                          <div className="font-medium">{day}</div>
                          <div className="space-y-1 mt-1">
                            {dayEvents.map((event) => {
                              const customer = customers.find((c) => c.id === event.customerId)
                              const customerName = customer
                                ? `${customer.firstName} ${customer.lastName}`
                                : event.customerName

                              return (
                                <div
                                  key={event.id}
                                  className={cn(
                                    "text-xs p-1 rounded truncate",
                                    event.type === "rental"
                                      ? "bg-blue-100 text-blue-800"
                                      : event.type === "sale"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800",
                                  )}
                                >
                                  {customerName} ({event.carts.reduce((sum, cart) => sum + cart.quantity, 0)})
                                </div>
                              )
                            })}
                          </div>
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            </TabsContent>

            <TabsContent value="year">
              <YearViewCalendar />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

