"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { toast } from "@/components/ui/use-toast"

// Define types for our data structures
export type CartType =
  | "2-Passenger Gas"
  | "4-Passenger Gas"
  | "4-Passenger Electric"
  | "6-Passenger Gas"
  | "6-Passenger Electric"
  | "Electric Ambulance"

export type Status = "available" | "rented" | "maintenance" | "pending" | "completed" | "cancelled"

export type EventType = "rental" | "service" | "sale" | "delivery" | "pickup"

export type Mechanic = "Ken" | "Brandon" | "Ben" | "Anyone"

export interface Customer {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  company?: string
  notes?: string
  createdAt: Date
}

export interface Cart {
  id: string
  type: CartType
  model: string
  year: number
  status: Status
  lastService?: Date
  nextService?: Date
  rentalCount: number
  condition: string
  notes?: string
  serialNumber: string
}

export interface Event {
  id: string
  title: string
  customerId: string
  customerName: string
  type: EventType
  startDate: Date
  endDate: Date
  carts: {
    type: CartType
    quantity: number
  }[]
  status: Status
  total: number
  notes?: string
  assignedTo?: Mechanic
  scheduledBy?: string
  createdAt: Date
}

interface AppContextType {
  // Customers
  customers: Customer[]
  addCustomer: (customer: Omit<Customer, "id" | "createdAt">) => string
  updateCustomer: (id: string, customer: Partial<Customer>) => void
  deleteCustomer: (id: string) => void
  getCustomerById: (id: string) => Customer | undefined

  // Fleet
  fleet: Cart[]
  addCart: (cart: Omit<Cart, "id">) => void
  updateCart: (id: string, cart: Partial<Cart>) => void
  deleteCart: (id: string) => void
  getCartsByType: (type: CartType) => Cart[]
  getAvailableCartsByType: (type: CartType, date?: Date) => number

  // Events (Rentals, Services, etc.)
  events: Event[]
  addEvent: (event: Omit<Event, "id" | "createdAt">) => void
  updateEvent: (id: string, event: Partial<Event>) => void
  deleteEvent: (id: string) => void
  getEventsByDate: (date: Date) => Event[]
  getEventsByDateRange: (startDate: Date, endDate: Date) => Event[]
  getEventsByCustomer: (customerId: string) => Event[]

  // Theme
  theme: "light" | "dark"
  setTheme: (theme: "light" | "dark") => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  // State for customers
  const [customers, setCustomers] = useState<Customer[]>([])

  // State for fleet
  const [fleet, setFleet] = useState<Cart[]>([])

  // State for events
  const [events, setEvents] = useState<Event[]>([])

  // State for theme
  const [theme, setTheme] = useState<"light" | "dark">("light")

  // Add this function at the beginning of the AppProvider component
  // This will initialize the fleet with the specified quantities if it's empty
  useEffect(() => {
    if (fleet.length === 0) {
      // Initialize fleet with specified quantities
      const initialFleet = [
        ...Array(68)
          .fill(0)
          .map((_, i) => ({
            id: `CART-2PG-${i + 1}`,
            type: "2-Passenger Gas" as CartType,
            model: "Club Car Precedent",
            year: 2022 + Math.floor(Math.random() * 3),
            status: "available" as Status,
            rentalCount: Math.floor(Math.random() * 20),
            condition: "Excellent",
            lastService: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
            nextService: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000),
            serialNumber: `2PG${Math.floor(10000 + Math.random() * 90000)}`,
          })),
        ...Array(40)
          .fill(0)
          .map((_, i) => ({
            id: `CART-4PG-${i + 1}`,
            type: "4-Passenger Gas" as CartType,
            model: "Club Car Onward",
            year: 2022 + Math.floor(Math.random() * 3),
            status: "available" as Status,
            rentalCount: Math.floor(Math.random() * 20),
            condition: "Excellent",
            lastService: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
            nextService: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000),
            serialNumber: `4PG${Math.floor(10000 + Math.random() * 90000)}`,
          })),
        ...Array(12)
          .fill(0)
          .map((_, i) => ({
            id: `CART-4PE-${i + 1}`,
            type: "4-Passenger Electric" as CartType,
            model: "E-Z-GO Express",
            year: 2022 + Math.floor(Math.random() * 3),
            status: "available" as Status,
            rentalCount: Math.floor(Math.random() * 20),
            condition: "Excellent",
            lastService: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
            nextService: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000),
            serialNumber: `4PE${Math.floor(10000 + Math.random() * 90000)}`,
          })),
        ...Array(6)
          .fill(0)
          .map((_, i) => ({
            id: `CART-6PG-${i + 1}`,
            type: "6-Passenger Gas" as CartType,
            model: "Club Car Transporter",
            year: 2022 + Math.floor(Math.random() * 3),
            status: "available" as Status,
            rentalCount: Math.floor(Math.random() * 20),
            condition: "Excellent",
            lastService: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
            nextService: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000),
            serialNumber: `6PG${Math.floor(10000 + Math.random() * 90000)}`,
          })),
        ...Array(2)
          .fill(0)
          .map((_, i) => ({
            id: `CART-6PE-${i + 1}`,
            type: "6-Passenger Electric" as CartType,
            model: "E-Z-GO Express L6",
            year: 2022 + Math.floor(Math.random() * 3),
            status: "available" as Status,
            rentalCount: Math.floor(Math.random() * 20),
            condition: "Excellent",
            lastService: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
            nextService: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000),
            serialNumber: `6PE${Math.floor(10000 + Math.random() * 90000)}`,
          })),
        {
          id: `CART-AMB-1`,
          type: "Electric Ambulance" as CartType,
          model: "Cushman Ambulance",
          year: 2023,
          status: "available" as Status,
          rentalCount: Math.floor(Math.random() * 10),
          condition: "Excellent",
          lastService: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
          nextService: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000),
          serialNumber: `AMB${Math.floor(10000 + Math.random() * 90000)}`,
        },
      ]

      setFleet(initialFleet)
    }
  }, [fleet.length])

  // Load data from localStorage on initial render
  useEffect(() => {
    const storedCustomers = localStorage.getItem("sgc-customers")
    if (storedCustomers) {
      try {
        const parsedCustomers = JSON.parse(storedCustomers)
        // Convert string dates back to Date objects
        const customersWithDates = parsedCustomers.map((customer: any) => ({
          ...customer,
          createdAt: new Date(customer.createdAt),
        }))
        setCustomers(customersWithDates)
      } catch (error) {
        console.error("Error parsing customers from localStorage:", error)
      }
    }

    const storedFleet = localStorage.getItem("sgc-fleet")
    if (storedFleet) {
      try {
        const parsedFleet = JSON.parse(storedFleet)
        // Convert string dates back to Date objects
        const fleetWithDates = parsedFleet.map((cart: any) => ({
          ...cart,
          lastService: cart.lastService ? new Date(cart.lastService) : undefined,
          nextService: cart.nextService ? new Date(cart.nextService) : undefined,
        }))
        setFleet(fleetWithDates)
      } catch (error) {
        console.error("Error parsing fleet from localStorage:", error)
      }
    }

    const storedEvents = localStorage.getItem("sgc-events")
    if (storedEvents) {
      try {
        const parsedEvents = JSON.parse(storedEvents)
        // Convert string dates back to Date objects
        const eventsWithDates = parsedEvents.map((event: any) => ({
          ...event,
          startDate: new Date(event.startDate),
          endDate: new Date(event.endDate),
          createdAt: new Date(event.createdAt),
        }))
        setEvents(eventsWithDates)
      } catch (error) {
        console.error("Error parsing events from localStorage:", error)
      }
    }

    const storedTheme = localStorage.getItem("sgc-theme")
    if (storedTheme === "dark" || storedTheme === "light") {
      setTheme(storedTheme)
    }
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("sgc-customers", JSON.stringify(customers))
  }, [customers])

  useEffect(() => {
    localStorage.setItem("sgc-fleet", JSON.stringify(fleet))
  }, [fleet])

  useEffect(() => {
    localStorage.setItem("sgc-events", JSON.stringify(events))
  }, [events])

  useEffect(() => {
    localStorage.setItem("sgc-theme", theme)
    // Also update the document class for theme
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [theme])

  // Customer functions
  const addCustomer = (customer: Omit<Customer, "id" | "createdAt">) => {
    const newCustomer: Customer = {
      ...customer,
      id: `CUST-${Date.now().toString(36)}`,
      createdAt: new Date(),
    }
    setCustomers((prev) => [...prev, newCustomer])

    // Show notification
    toast({
      title: "Customer Added",
      description: `${customer.firstName} ${customer.lastName} has been added to your customers.`,
    })

    return newCustomer.id // Return the new ID
  }

  const updateCustomer = (id: string, customer: Partial<Customer>) => {
    const originalCustomer = customers.find((c) => c.id === id)
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, ...customer } : c)))

    // Show notification
    if (originalCustomer) {
      toast({
        title: "Customer Updated",
        description: `${originalCustomer.firstName} ${originalCustomer.lastName}'s information has been updated.`,
      })
    }
  }

  const deleteCustomer = (id: string) => {
    const customerToDelete = customers.find((c) => c.id === id)
    setCustomers((prev) => prev.filter((c) => c.id !== id))

    // Show notification
    if (customerToDelete) {
      toast({
        title: "Customer Deleted",
        description: `${customerToDelete.firstName} ${customerToDelete.lastName} has been removed from your customers.`,
        variant: "destructive",
      })
    }
  }

  const getCustomerById = (id: string) => {
    return customers.find((c) => c.id === id)
  }

  // Fleet functions
  const addCart = (cart: Omit<Cart, "id">) => {
    const newCart: Cart = {
      ...cart,
      id: `CART-${Date.now().toString(36)}`,
    }
    setFleet((prev) => [...prev, newCart])

    // Show notification
    toast({
      title: "Cart Added",
      description: `A new ${cart.type} cart has been added to your fleet.`,
    })
  }

  const updateCart = (id: string, cart: Partial<Cart>) => {
    const originalCart = fleet.find((c) => c.id === id)
    setFleet((prev) => prev.map((c) => (c.id === id ? { ...c, ...cart } : c)))

    // Show notification
    if (originalCart) {
      toast({
        title: "Cart Updated",
        description: `${originalCart.type} (${originalCart.serialNumber}) has been updated.`,
      })
    }
  }

  const deleteCart = (id: string) => {
    const cartToDelete = fleet.find((c) => c.id === id)
    setFleet((prev) => prev.filter((c) => c.id !== id))

    // Show notification
    if (cartToDelete) {
      toast({
        title: "Cart Deleted",
        description: `${cartToDelete.type} (${cartToDelete.serialNumber}) has been removed from your fleet.`,
        variant: "destructive",
      })
    }
  }

  const getCartsByType = (type: CartType) => {
    return fleet.filter((c) => c.type === type)
  }

  const getAvailableCartsByType = (type: CartType, date?: Date) => {
    // Get total inventory for this cart type
    const totalInventory = fleet.filter((cart) => cart.type === type).length

    // If no date is provided, just return the count of available carts
    if (!date) {
      return fleet.filter((c) => c.type === type && c.status === "available").length
    }

    // Find all rentals that include this date
    const overlappingRentals = events.filter((event) => {
      // Only consider active rentals (not pending)
      if (event.type !== "rental" || event.status !== "active") return false

      const eventStart = new Date(event.startDate)
      const eventEnd = new Date(event.endDate)

      // Check if the date falls within this rental period
      return date >= eventStart && date <= eventEnd
    })

    // Count how many carts of this type are rented on this date
    let rentedCarts = 0
    overlappingRentals.forEach((rental) => {
      const rentalCartItem = rental.carts.find((cart) => cart.type === type)
      if (rentalCartItem) {
        rentedCarts += rentalCartItem.quantity
      }
    })

    // Return the available quantity
    return totalInventory - rentedCarts
  }

  // Event functions
  const addEvent = (event: Omit<Event, "id" | "createdAt">) => {
    const newEvent: Event = {
      ...event,
      id: `EVT-${Date.now().toString(36)}`,
      createdAt: new Date(),
    }
    setEvents((prev) => [...prev, newEvent])

    // Show notification based on event type
    const eventTypeDisplay = {
      rental: "Rental",
      service: "Service",
      sale: "Sale",
      delivery: "Delivery",
      pickup: "Pickup",
    }

    toast({
      title: `New ${eventTypeDisplay[event.type]} Created`,
      description: `${event.title} has been scheduled for ${new Date(event.startDate).toLocaleDateString()}.`,
    })

    // Update cart status only if it's an active rental or a service
    if ((event.type === "rental" && event.status === "active") || event.type === "service") {
      // Find carts to update
      const cartsToUpdate: string[] = []

      // This is a simplified approach - in a real system, you'd need to track
      // which specific cart IDs are assigned to which events
      event.carts.forEach((cartItem) => {
        const availableCarts = fleet
          .filter((c) => c.type === cartItem.type && c.status === "available")
          .slice(0, cartItem.quantity)

        availableCarts.forEach((cart) => {
          cartsToUpdate.push(cart.id)
        })
      })

      // Update the status of the selected carts
      setFleet((prev) =>
        prev.map((cart) =>
          cartsToUpdate.includes(cart.id)
            ? { ...cart, status: event.type === "rental" ? "rented" : "maintenance" }
            : cart,
        ),
      )
    }
  }

  const updateEvent = (id: string, event: Partial<Event>) => {
    // Get the original event
    const originalEvent = events.find((e) => e.id === id)

    if (!originalEvent) return

    // Update the event
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...event } : e)))

    // Show notification based on what changed
    if (event.status && event.status !== originalEvent.status) {
      const statusMessages = {
        active: "activated",
        pending: "marked as pending",
        completed: "completed",
        cancelled: "cancelled",
      }

      toast({
        title: "Status Updated",
        description: `${originalEvent.title} has been ${statusMessages[event.status] || "updated"}.`,
      })
    } else {
      toast({
        title: "Event Updated",
        description: `${originalEvent.title} has been updated.`,
      })
    }

    // If status changed to active, update cart status to rented
    if (event.status === "active" && originalEvent.status !== "active" && originalEvent.type === "rental") {
      // Find carts to update - simplified approach
      const cartsToUpdate: string[] = []

      originalEvent.carts.forEach((cartItem) => {
        const availableCarts = fleet
          .filter((c) => c.type === cartItem.type && c.status === "available")
          .slice(0, cartItem.quantity)

        availableCarts.forEach((cart) => {
          cartsToUpdate.push(cart.id)
        })
      })

      // Update the status of the selected carts to rented
      setFleet((prev) => prev.map((cart) => (cartsToUpdate.includes(cart.id) ? { ...cart, status: "rented" } : cart)))
    }

    // If status changed to completed or cancelled, update cart status
    if (
      (event.status === "completed" || event.status === "cancelled") &&
      originalEvent.status !== "completed" &&
      originalEvent.status !== "cancelled"
    ) {
      // Find carts to update - simplified approach
      const cartsToUpdate: string[] = []

      originalEvent.carts.forEach((cartItem) => {
        const rentedCarts = fleet
          .filter((c) => c.type === cartItem.type && (c.status === "rented" || c.status === "maintenance"))
          .slice(0, cartItem.quantity)

        rentedCarts.forEach((cart) => {
          cartsToUpdate.push(cart.id)
        })
      })

      // Update the status of the selected carts back to available
      setFleet((prev) =>
        prev.map((cart) => (cartsToUpdate.includes(cart.id) ? { ...cart, status: "available" } : cart)),
      )
    }
  }

  const deleteEvent = (id: string) => {
    // Get the event to delete
    const eventToDelete = events.find((e) => e.id === id)

    if (!eventToDelete) return

    // Delete the event
    setEvents((prev) => prev.filter((e) => e.id !== id))

    // Show notification
    toast({
      title: "Event Deleted",
      description: `${eventToDelete.title} has been deleted.`,
      variant: "destructive",
    })

    // If the event is active (not completed or cancelled), update cart status
    if (eventToDelete.status !== "completed" && eventToDelete.status !== "cancelled") {
      // Find carts to update - simplified approach
      const cartsToUpdate: string[] = []

      eventToDelete.carts.forEach((cartItem) => {
        const rentedCarts = fleet
          .filter((c) => c.type === cartItem.type && (c.status === "rented" || c.status === "maintenance"))
          .slice(0, cartItem.quantity)

        rentedCarts.forEach((cart) => {
          cartsToUpdate.push(cart.id)
        })
      })

      // Update the status of the selected carts back to available
      setFleet((prev) =>
        prev.map((cart) => (cartsToUpdate.includes(cart.id) ? { ...cart, status: "available" } : cart)),
      )
    }
  }

  const getEventsByDate = (date: Date) => {
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    return events.filter((event) => {
      const eventStart = new Date(event.startDate)
      return eventStart >= startOfDay && eventStart <= endOfDay
    })
  }

  const getEventsByDateRange = (startDate: Date, endDate: Date) => {
    return events.filter((event) => {
      const eventStart = new Date(event.startDate)
      const eventEnd = new Date(event.endDate)

      // Event starts during the range
      const startsInRange = eventStart >= startDate && eventStart <= endDate

      // Event ends during the range
      const endsInRange = eventEnd >= startDate && eventEnd <= endDate

      // Event spans the entire range
      const spansRange = eventStart <= startDate && eventEnd >= endDate

      return startsInRange || endsInRange || spansRange
    })
  }

  const getEventsByCustomer = (customerId: string) => {
    return events.filter((event) => event.customerId === customerId)
  }

  const value = {
    customers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomerById,

    fleet,
    addCart,
    updateCart,
    deleteCart,
    getCartsByType,
    getAvailableCartsByType,

    events,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventsByDate,
    getEventsByDateRange,
    getEventsByCustomer,

    theme,
    setTheme,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}

