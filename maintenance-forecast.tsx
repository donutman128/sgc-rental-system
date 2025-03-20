"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useApp } from "@/context/app-provider"
import { AlertTriangle, CheckCircle } from "lucide-react"
import { format, addMonths, addYears, isBefore } from "date-fns"

export function MaintenanceForecast() {
  const { fleet } = useApp()
  const [forecastYears, setForecastYears] = useState(2)

  // Calculate projected maintenance dates
  const calculateMaintenanceDates = () => {
    const today = new Date()
    const forecastEnd = addYears(today, forecastYears)

    return fleet
      .map((cart) => {
        // Calculate next maintenance date based on last service
        // Assume maintenance is needed every 6 months or after 50 rentals
        const lastService = cart.lastService || new Date(today.getFullYear() - 1, today.getMonth(), today.getDate())
        const nextServiceByDate = addMonths(lastService, 6)

        // Calculate maintenance by rental count
        // Assume maintenance after every 50 rentals, and each cart does about 10 rentals per month
        const rentalsTillMaintenance = 50 - (cart.rentalCount % 50)
        const monthsTillRentalMaintenance = Math.ceil(rentalsTillMaintenance / 10)
        const nextServiceByRentals = addMonths(today, monthsTillRentalMaintenance)

        // Use the earlier of the two dates
        const nextService = isBefore(nextServiceByDate, nextServiceByRentals) ? nextServiceByDate : nextServiceByRentals

        // Calculate if maintenance is due soon (within next 30 days)
        const isDueSoon = isBefore(nextService, addMonths(today, 1))

        // Calculate if maintenance is overdue
        const isOverdue = isBefore(nextService, today)

        // Only include carts with maintenance due within the forecast period
        const isWithinForecast = isBefore(nextService, forecastEnd)

        return {
          ...cart,
          nextService,
          isDueSoon,
          isOverdue,
          isWithinForecast,
        }
      })
      .filter((cart) => cart.isWithinForecast)
      .sort((a, b) => a.nextService.getTime() - b.nextService.getTime())
  }

  const maintenanceSchedule = calculateMaintenanceDates()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Maintenance Forecast</CardTitle>
            <CardDescription>
              Projected maintenance schedule for the next {forecastYears} {forecastYears === 1 ? "year" : "years"}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={forecastYears.toString()}
              onValueChange={(value) => setForecastYears(Number.parseInt(value))}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Forecast Years" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 5, 10].map((y) => (
                  <SelectItem key={y} value={y.toString()}>
                    {y} {y === 1 ? "year" : "years"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {maintenanceSchedule.length === 0 ? (
          <div className="flex items-center justify-center h-40 border rounded-md">
            <p className="text-muted-foreground">No maintenance scheduled within the selected time period.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cart ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Serial #</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {maintenanceSchedule.map((cart) => (
                <TableRow key={cart.id}>
                  <TableCell className="font-medium">{cart.id}</TableCell>
                  <TableCell>{cart.type}</TableCell>
                  <TableCell>
                    {cart.serialNumber ? (
                      <span title={cart.serialNumber}>...{cart.serialNumber.slice(-4)}</span>
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                  <TableCell>{format(cart.nextService, "MMM d, yyyy")}</TableCell>
                  <TableCell>
                    {cart.isOverdue ? (
                      <Badge variant="destructive" className="flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Overdue
                      </Badge>
                    ) : cart.isDueSoon ? (
                      <Badge
                        variant="warning"
                        className="flex items-center gap-1 bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                      >
                        <AlertTriangle className="h-3 w-3" />
                        Due Soon
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Scheduled
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <div className="mt-4 text-sm text-muted-foreground">
          <p>
            This forecast is based on last service date and rental usage patterns. Regular maintenance helps extend the
            life of your fleet and prevents unexpected breakdowns.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

