"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useApp, type CartType } from "@/context/app-provider"
import {
  startOfWeek,
  endOfWeek,
  format,
  addWeeks,
  startOfMonth,
  endOfMonth,
  addMonths,
  eachDayOfInterval,
  isWithinInterval,
} from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function AvailabilityGraph() {
  const { events, fleet } = useApp()
  const [view, setView] = useState<"weekly" | "monthly">("weekly")
  const [currentDate, setCurrentDate] = useState(new Date())

  // Cart types and their total counts
  const cartTypes: { type: CartType; total: number; color: string }[] = [
    { type: "2-Passenger Gas", total: 68, color: "#8884d8" },
    { type: "4-Passenger Gas", total: 40, color: "#82ca9d" },
    { type: "4-Passenger Electric", total: 12, color: "#ffc658" },
    { type: "6-Passenger Gas", total: 6, color: "#ff8042" },
    { type: "6-Passenger Electric", total: 2, color: "#0088fe" },
    { type: "Electric Ambulance", total: 1, color: "#00C49F" },
  ]

  // Navigate to previous period
  const goToPrevious = () => {
    if (view === "weekly") {
      setCurrentDate(addWeeks(currentDate, -1))
    } else {
      setCurrentDate(addMonths(currentDate, -1))
    }
  }

  // Navigate to next period
  const goToNext = () => {
    if (view === "weekly") {
      setCurrentDate(addWeeks(currentDate, 1))
    } else {
      setCurrentDate(addMonths(currentDate, 1))
    }
  }

  // Calculate availability for a specific date
  const getAvailabilityForDate = (date: Date, type: CartType, total: number) => {
    // Find rentals for this date that include this cart type
    const rentalsOnDate = events.filter((event) => {
      const eventStart = new Date(event.startDate)
      const eventEnd = new Date(event.endDate)

      // Check if the date falls within the rental period
      const dateInRange = isWithinInterval(date, { start: eventStart, end: eventEnd })

      // Check if the rental includes this cart type
      const includesCartType = event.carts.some((cart) => cart.type === type)

      return (
        dateInRange &&
        includesCartType &&
        event.type === "rental" &&
        (event.status === "active" || event.status === "pending")
      )
    })

    // Calculate total rented carts of this type on this date
    const rentedCarts = rentalsOnDate.reduce((sum, rental) => {
      const cartItem = rental.carts.find((cart) => cart.type === type)
      return sum + (cartItem ? cartItem.quantity : 0)
    }, 0)

    // Calculate available carts
    return Math.max(0, total - rentedCarts)
  }

  // Generate weekly view data
  const generateWeeklyData = () => {
    // Get start and end of current week
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 })
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 })

    // Create array of dates for the week
    const dateRange = eachDayOfInterval({ start: weekStart, end: weekEnd })

    return (
      <div className="grid grid-cols-7 gap-2 h-[300px]">
        {dateRange.map((date, index) => (
          <div key={index} className="flex flex-col h-full">
            <div className="text-center text-sm font-medium mb-2">
              {format(date, "EEE")}
              <div className="text-xs text-muted-foreground">{format(date, "MMM d")}</div>
            </div>
            <div className="flex-1 flex flex-col-reverse gap-1">
              {cartTypes.map(({ type, total, color }) => {
                const available = getAvailabilityForDate(date, type, total)
                const percentage = (available / total) * 100
                return (
                  <div
                    key={type}
                    className="relative rounded-t-sm"
                    style={{
                      height: `${percentage}%`,
                      backgroundColor: color,
                      minHeight: available > 0 ? "4px" : "0px",
                    }}
                    title={`${type}: ${available} available (${Math.round(percentage)}%)`}
                  >
                    {percentage > 15 && (
                      <div className="absolute inset-0 flex items-center justify-center text-xs text-white font-bold">
                        {available}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Generate monthly view data
  const generateMonthlyData = () => {
    // Get start and end of current month
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)

    // Create array of dates for the month
    const allDates = eachDayOfInterval({ start: monthStart, end: monthEnd })

    // Group by week
    const weeks: Date[][] = []
    let currentWeek: Date[] = []

    allDates.forEach((date, index) => {
      if (index === 0 || date.getDay() === 0) {
        if (currentWeek.length > 0) {
          weeks.push(currentWeek)
        }
        currentWeek = [date]
      } else {
        currentWeek.push(date)
      }

      if (index === allDates.length - 1) {
        weeks.push(currentWeek)
      }
    })

    return (
      <div className="grid grid-cols-1 gap-4 h-[400px]">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col">
            <div className="text-sm font-medium mb-1">
              Week {weekIndex + 1}: {format(week[0], "MMM d")} - {format(week[week.length - 1], "MMM d")}
            </div>
            <div className="flex-1 grid grid-cols-7 gap-1">
              {Array(7)
                .fill(0)
                .map((_, dayIndex) => {
                  const date = week[dayIndex]
                  const isEmpty = !date

                  return (
                    <div key={dayIndex} className={`flex flex-col ${isEmpty ? "opacity-0" : ""}`}>
                      {!isEmpty && (
                        <>
                          <div className="text-center text-xs text-muted-foreground">{format(date, "EEE d")}</div>
                          <div className="flex-1 flex items-end mt-1">
                            {cartTypes.map(({ type, total, color }) => {
                              const available = getAvailabilityForDate(date, type, total)
                              const percentage = (available / total) * 100
                              return (
                                <div
                                  key={type}
                                  className="flex-1 rounded-t-sm"
                                  style={{
                                    height: `${percentage}%`,
                                    backgroundColor: color,
                                    minHeight: available > 0 ? "4px" : "0px",
                                  }}
                                  title={`${type}: ${available} available (${Math.round(percentage)}%)`}
                                />
                              )
                            })}
                          </div>
                        </>
                      )}
                    </div>
                  )
                })}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Fleet Availability</CardTitle>
            <CardDescription>
              {view === "weekly"
                ? `Week of ${format(startOfWeek(currentDate, { weekStartsOn: 0 }), "MMM d")} - ${format(endOfWeek(currentDate, { weekStartsOn: 0 }), "MMM d, yyyy")}`
                : `${format(currentDate, "MMMM yyyy")}`}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={currentDate.getFullYear().toString()}
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
            <Tabs value={view} onValueChange={(v) => setView(v as "weekly" | "monthly")}>
              <TabsList>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center">
              <Button variant="outline" size="icon" onClick={goToPrevious}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={goToNext}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center justify-center gap-4">
          {cartTypes.map(({ type, color }) => (
            <div key={type} className="flex items-center">
              <div className="w-3 h-3 rounded-sm mr-1" style={{ backgroundColor: color }}></div>
              <span className="text-xs">{type}</span>
            </div>
          ))}
        </div>

        {view === "weekly" ? generateWeeklyData() : generateMonthlyData()}
      </CardContent>
    </Card>
  )
}

