"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useApp } from "@/context/app-provider"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { format, eachMonthOfInterval, startOfYear, endOfYear, startOfMonth, endOfMonth } from "date-fns"

export function YearViewCalendar() {
  const { events } = useApp()
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  // Navigate to previous year
  const prevYear = () => {
    setCurrentYear(currentYear - 1)
  }

  // Navigate to next year
  const nextYear = () => {
    setCurrentYear(currentYear + 1)
  }

  // Get months for the current year
  const months = eachMonthOfInterval({
    start: startOfYear(new Date(currentYear, 0, 1)),
    end: endOfYear(new Date(currentYear, 0, 1)),
  })

  // Get events for a specific month
  const getEventsForMonth = (month: Date) => {
    const monthStart = startOfMonth(month)
    const monthEnd = endOfMonth(month)

    return events.filter((event) => {
      const eventStart = new Date(event.startDate)
      const eventEnd = new Date(event.endDate)

      // Event starts during the month
      const startsInMonth = eventStart >= monthStart && eventStart <= monthEnd

      // Event ends during the month
      const endsInMonth = eventEnd >= monthStart && eventEnd <= monthEnd

      // Event spans the entire month
      const spansMonth = eventStart <= monthStart && eventEnd >= monthEnd

      return startsInMonth || endsInMonth || spansMonth
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Year View</CardTitle>
            <CardDescription>Calendar overview for {currentYear}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={prevYear}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Select value={currentYear.toString()} onValueChange={(value) => setCurrentYear(Number.parseInt(value))}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 11 }, (_, i) => new Date().getFullYear() + i - 5).map((y) => (
                  <SelectItem key={y} value={y.toString()}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={nextYear}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
          {months.map((month) => {
            const monthEvents = getEventsForMonth(month)
            const rentalEvents = monthEvents.filter((e) => e.type === "rental").length
            const serviceEvents = monthEvents.filter((e) => e.type === "service").length
            const saleEvents = monthEvents.filter((e) => e.type === "sale").length

            return (
              <Card key={month.toString()} className="overflow-hidden">
                <CardHeader className="p-3 bg-muted/50">
                  <CardTitle className="text-sm font-medium">{format(month, "MMMM")}</CardTitle>
                </CardHeader>
                <CardContent className="p-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rentals:</span>
                      <span className="font-medium">{rentalEvents}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Services:</span>
                      <span className="font-medium">{serviceEvents}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sales:</span>
                      <span className="font-medium">{saleEvents}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t mt-1">
                      <span className="text-muted-foreground">Total:</span>
                      <span className="font-medium">{monthEvents.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

