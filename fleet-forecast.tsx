"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useApp, type CartType } from "@/context/app-provider"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export function FleetForecast() {
  const { fleet, events } = useApp()
  const [startYear, setStartYear] = useState(new Date().getFullYear())
  const [forecastYears, setForecastYears] = useState(5)

  // Cart types and their total counts
  const cartTypes: { type: CartType; total: number; color: string }[] = [
    { type: "2-Passenger Gas", total: 68, color: "#8884d8" },
    { type: "4-Passenger Gas", total: 40, color: "#82ca9d" },
    { type: "4-Passenger Electric", total: 12, color: "#ffc658" },
    { type: "6-Passenger Gas", total: 6, color: "#ff8042" },
    { type: "6-Passenger Electric", total: 2, color: "#0088fe" },
    { type: "Electric Ambulance", total: 1, color: "#00C49F" },
  ]

  // Generate forecast data
  const generateForecastData = () => {
    const data = []

    // Get current fleet counts
    const currentCounts = {}
    cartTypes.forEach(({ type }) => {
      currentCounts[type] = fleet.filter((cart) => cart.type === type).length
    })

    // Get future bookings
    const futureBookings = {}
    cartTypes.forEach(({ type }) => {
      futureBookings[type] = []

      // For each year in the forecast
      for (let year = startYear; year < startYear + forecastYears; year++) {
        const yearStart = new Date(year, 0, 1)
        const yearEnd = new Date(year, 11, 31)

        // Count bookings for this cart type in this year
        const bookingsInYear = events.filter((event) => {
          const eventStart = new Date(event.startDate)
          const eventEnd = new Date(event.endDate)

          // Check if event is in this year
          const inYear =
            (eventStart >= yearStart && eventStart <= yearEnd) ||
            (eventEnd >= yearStart && eventEnd <= yearEnd) ||
            (eventStart <= yearStart && eventEnd >= yearEnd)

          // Check if event includes this cart type
          const includesType = event.carts.some((cart) => cart.type === type)

          return inYear && includesType && event.type === "rental"
        }).length

        futureBookings[type].push(bookingsInYear)
      }
    })

    // Generate data points for each year
    for (let i = 0; i < forecastYears; i++) {
      const year = startYear + i
      const dataPoint = { year }

      cartTypes.forEach(({ type }) => {
        // Simple projection: current count + 5% growth per year - 2% for maintenance/retirement
        const projectedGrowth = Math.round(currentCounts[type] * (1 + 0.05 * i - 0.02 * i))
        const bookingDemand = futureBookings[type][i]

        // Projected available count
        dataPoint[`${type} Available`] = Math.max(0, projectedGrowth - bookingDemand)

        // Projected total count
        dataPoint[`${type} Total`] = projectedGrowth
      })

      data.push(dataPoint)
    }

    return data
  }

  const forecastData = generateForecastData()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Long-Term Fleet Forecast</CardTitle>
            <CardDescription>
              Projected fleet availability for {forecastYears} years starting from {startYear}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={startYear.toString()} onValueChange={(value) => setStartYear(Number.parseInt(value))}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Start Year" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() + i).map((y) => (
                  <SelectItem key={y} value={y.toString()}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
        <div className="mb-4 flex items-center justify-center gap-4 flex-wrap">
          {cartTypes.map(({ type, color }) => (
            <div key={type} className="flex items-center">
              <div className="w-3 h-3 rounded-sm mr-1" style={{ backgroundColor: color }}></div>
              <span className="text-xs">{type}</span>
            </div>
          ))}
        </div>

        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              {cartTypes.map(({ type, color }) => (
                <Line
                  key={`${type} Available`}
                  type="monotone"
                  dataKey={`${type} Available`}
                  stroke={color}
                  name={`${type} Available`}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 text-sm text-muted-foreground">
          <p>
            This forecast is based on current fleet size, projected growth, and scheduled bookings. Adjust your fleet
            size and maintenance schedules to meet future demand.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

