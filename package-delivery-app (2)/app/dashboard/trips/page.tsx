"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { MapIcon, PlusIcon, SearchIcon, FilterIcon, Trash2Icon, CalendarIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Importe o componente de debug:
import TripsDebug from "./debug"

// Define Trip type
interface Trip {
  id: string
  originCity: string
  originCountry: string
  destinationCity: string
  destinationCountry: string
  departureDate: string
  arrivalDate: string
  stops: { city: string; country: string; date: string }[]
  availableSpace: string
  availableWeight: string
  transportation: string
  minPrice: string
  maxPrice: string
  isRoundTrip: boolean
  notes: string
  status: "active" | "completed" | "cancelled"
  createdAt: string
}

export default function TripsPage() {
  const { toast } = useToast()
  const [trips, setTrips] = useState<Trip[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [tripToDelete, setTripToDelete] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const fetchTrips = () => {
    try {
      // Get trips from localStorage
      const storedTrips = localStorage.getItem("trips")
      if (storedTrips) {
        setTrips(JSON.parse(storedTrips))
      } else {
        // Initialize with empty array if no trips exist
        localStorage.setItem("trips", JSON.stringify([]))
        setTrips([])
      }
    } catch (error) {
      console.error("Erro ao carregar viagens:", error)
      toast({
        title: "Erro ao carregar viagens",
        description: "Ocorreu um erro inesperado. Por favor, tente novamente.",
        variant: "destructive",
      })
      setTrips([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTrips()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filteredTrips = trips.filter(
    (trip) =>
      trip.originCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.originCountry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.destinationCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.destinationCountry.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const activeTrips = filteredTrips.filter((trip) => trip.status === "active")
  const completedTrips = filteredTrips.filter((trip) => trip.status === "completed")
  const cancelledTrips = filteredTrips.filter((trip) => trip.status === "cancelled")

  const handleDeleteTrip = (tripId: string) => {
    setTripToDelete(tripId)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteTrip = () => {
    if (!tripToDelete) return

    try {
      // Filter out the trip to delete
      const updatedTrips = trips.filter((trip) => trip.id !== tripToDelete)

      // Save back to localStorage
      localStorage.setItem("trips", JSON.stringify(updatedTrips))

      // Update state
      setTrips(updatedTrips)

      toast({
        title: "Trip deleted",
        description: "The trip has been successfully deleted.",
      })
    } catch (error) {
      toast({
        title: "Error deleting trip",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setTripToDelete(null)
      setIsDeleteDialogOpen(false)
    }
  }

  const handleUpdateTripStatus = (tripId: string, newStatus: "active" | "completed" | "cancelled") => {
    try {
      // Find and update the trip status
      const updatedTrips = trips.map((trip) => {
        if (trip.id === tripId) {
          return { ...trip, status: newStatus }
        }
        return trip
      })

      // Save back to localStorage
      localStorage.setItem("trips", JSON.stringify(updatedTrips))

      // Update state
      setTrips(updatedTrips)

      toast({
        title: "Trip updated",
        description: `The trip status has been updated to ${newStatus}.`,
      })
    } catch (error) {
      toast({
        title: "Error updating trip",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Trips</h1>
        <Link href="/dashboard/trips/new">
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <PlusIcon className="mr-2 h-4 w-4" />
            New Trip
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            className="pl-10"
            placeholder="Search trips..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <FilterIcon className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-4 text-center">Loading trips...</div>
              ) : activeTrips.length > 0 ? (
                <div className="divide-y">
                  {activeTrips.map((trip) => (
                    <TripItem
                      key={trip.id}
                      trip={trip}
                      onDelete={handleDeleteTrip}
                      onUpdateStatus={handleUpdateTripStatus}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">No active trips found.</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-4 text-center">Loading trips...</div>
              ) : completedTrips.length > 0 ? (
                <div className="divide-y">
                  {completedTrips.map((trip) => (
                    <TripItem
                      key={trip.id}
                      trip={trip}
                      onDelete={handleDeleteTrip}
                      onUpdateStatus={handleUpdateTripStatus}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">No completed trips found.</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-4 text-center">Loading trips...</div>
              ) : cancelledTrips.length > 0 ? (
                <div className="divide-y">
                  {cancelledTrips.map((trip) => (
                    <TripItem
                      key={trip.id}
                      trip={trip}
                      onDelete={handleDeleteTrip}
                      onUpdateStatus={handleUpdateTripStatus}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">No cancelled trips found.</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-4 text-center">Loading trips...</div>
              ) : filteredTrips.length > 0 ? (
                <div className="divide-y">
                  {filteredTrips.map((trip) => (
                    <TripItem
                      key={trip.id}
                      trip={trip}
                      onDelete={handleDeleteTrip}
                      onUpdateStatus={handleUpdateTripStatus}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">No trips found.</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Componente de Debug - Remova em produção */}
      <TripsDebug />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this trip?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the trip and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteTrip} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function TripItem({
  trip,
  onDelete,
  onUpdateStatus,
}: {
  trip: Trip
  onDelete: (id: string) => void
  onUpdateStatus: (id: string, status: "active" | "completed" | "cancelled") => void
}) {
  const statusColors = {
    active: "bg-emerald-100 text-emerald-800",
    completed: "bg-blue-100 text-blue-800",
    cancelled: "bg-red-100 text-red-800",
  }

  const statusLabels = {
    active: "Active",
    completed: "Completed",
    cancelled: "Cancelled",
  }

  const transportationIcons = {
    plane: "✈️",
    train: "🚆",
    bus: "🚌",
    car: "🚗",
    other: "🚢",
  }

  // Format dates for display
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  }

  return (
    <div className="p-4 hover:bg-gray-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-blue-100 flex items-center justify-center">
            <MapIcon className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <div className="font-medium">
              {trip.originCity}, {trip.originCountry} → {trip.destinationCity}, {trip.destinationCountry}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <CalendarIcon className="h-3 w-3 mr-1" />
              {formatDate(trip.departureDate)} - {formatDate(trip.arrivalDate)}
              {trip.isRoundTrip && " (Round Trip)"}
            </div>
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <span className="mr-2">
                {transportationIcons[trip.transportation as keyof typeof transportationIcons] || "🚢"}{" "}
                {trip.transportation.charAt(0).toUpperCase() + trip.transportation.slice(1)}
              </span>
              <span className="mr-2">Space: {trip.availableSpace}</span>
              <span>Weight: {trip.availableWeight}kg</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Badge className={statusColors[trip.status]}>{statusLabels[trip.status]}</Badge>
          <div className="text-xs text-gray-500">
            {trip.minPrice && trip.maxPrice ? `$${trip.minPrice}-$${trip.maxPrice}/kg` : "Price not specified"}
          </div>
        </div>
      </div>
      <div className="mt-3 flex justify-end gap-2">
        <Link href={`/dashboard/trips/${trip.id}`}>
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </Link>
        {trip.status === "active" && (
          <>
            <Button
              variant="outline"
              size="sm"
              className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
              onClick={() => onUpdateStatus(trip.id, "completed")}
            >
              Mark Completed
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-orange-500 hover:text-orange-600 hover:bg-orange-50"
              onClick={() => onUpdateStatus(trip.id, "cancelled")}
            >
              Cancel Trip
            </Button>
          </>
        )}
        {trip.status === "cancelled" && (
          <Button
            variant="outline"
            size="sm"
            className="text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50"
            onClick={() => onUpdateStatus(trip.id, "active")}
          >
            Reactivate
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          className="text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={() => onDelete(trip.id)}
        >
          <Trash2Icon className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </div>
    </div>
  )
}
