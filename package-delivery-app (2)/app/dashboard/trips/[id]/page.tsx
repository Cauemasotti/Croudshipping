"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeftIcon, MapIcon, PackageIcon, InfoIcon, EditIcon, Trash2Icon } from "lucide-react"
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

// Define Trip type (same as in trips/page.tsx)
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

export default function TripDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [trip, setTrip] = useState<Trip | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  useEffect(() => {
    const fetchTrip = () => {
      try {
        // Get trips from localStorage
        const storedTrips = localStorage.getItem("trips")
        if (storedTrips) {
          const trips = JSON.parse(storedTrips)
          const foundTrip = trips.find((t: Trip) => t.id === params.id)

          if (foundTrip) {
            setTrip(foundTrip)
          } else {
            toast({
              title: "Trip not found",
              description: "The requested trip could not be found.",
              variant: "destructive",
            })
            router.push("/dashboard/trips")
          }
        } else {
          toast({
            title: "No trips found",
            description: "There are no trips in your account.",
            variant: "destructive",
          })
          router.push("/dashboard/trips")
        }
      } catch (error) {
        toast({
          title: "Error loading trip",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchTrip()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id])

  const handleDeleteTrip = () => {
    try {
      // Get trips from localStorage
      const storedTrips = localStorage.getItem("trips")
      if (storedTrips && trip) {
        const trips = JSON.parse(storedTrips)
        const updatedTrips = trips.filter((t: Trip) => t.id !== trip.id)

        // Save back to localStorage
        localStorage.setItem("trips", JSON.stringify(updatedTrips))

        toast({
          title: "Trip deleted",
          description: "The trip has been successfully deleted.",
        })

        router.push("/dashboard/trips")
      }
    } catch (error) {
      toast({
        title: "Error deleting trip",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleteDialogOpen(false)
    }
  }

  const handleUpdateTripStatus = (newStatus: "active" | "completed" | "cancelled") => {
    try {
      // Get trips from localStorage
      const storedTrips = localStorage.getItem("trips")
      if (storedTrips && trip) {
        const trips = JSON.parse(storedTrips)
        const updatedTrips = trips.map((t: Trip) => {
          if (t.id === trip.id) {
            return { ...t, status: newStatus }
          }
          return t
        })

        // Save back to localStorage
        localStorage.setItem("trips", JSON.stringify(updatedTrips))

        // Update current trip
        setTrip({ ...trip, status: newStatus })

        toast({
          title: "Trip updated",
          description: `The trip status has been updated to ${newStatus}.`,
        })
      }
    } catch (error) {
      toast({
        title: "Error updating trip",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Format dates for display
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  }

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

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading trip details...</div>
  }

  if (!trip) {
    return <div className="flex items-center justify-center h-64">Trip not found</div>
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link href="/dashboard/trips" className="flex items-center text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeftIcon className="mr-1 h-4 w-4" />
          Back to My Trips
        </Link>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Trip Details</h1>
        <div className="flex gap-2">
          {trip.status === "active" && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                onClick={() => handleUpdateTripStatus("completed")}
              >
                Mark Completed
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-orange-500 hover:text-orange-600 hover:bg-orange-50"
                onClick={() => handleUpdateTripStatus("cancelled")}
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
              onClick={() => handleUpdateTripStatus("active")}
            >
              Reactivate
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2Icon className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapIcon className="h-5 w-5 text-emerald-600" />
              <CardTitle>
                {trip.originCity}, {trip.originCountry} → {trip.destinationCity}, {trip.destinationCountry}
              </CardTitle>
            </div>
            <Badge className={statusColors[trip.status]}>{statusLabels[trip.status]}</Badge>
          </div>
          <CardDescription>Created on {new Date(trip.createdAt).toLocaleDateString()}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Trip Details</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm font-medium">Route</div>
                  <div className="text-base">
                    {trip.originCity}, {trip.originCountry} → {trip.destinationCity}, {trip.destinationCountry}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">Dates</div>
                  <div className="text-base">
                    {formatDate(trip.departureDate)} - {formatDate(trip.arrivalDate)}
                    {trip.isRoundTrip && " (Round Trip)"}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">Transportation</div>
                  <div className="text-base capitalize">{trip.transportation}</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Package Capacity</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm font-medium">Available Space</div>
                  <div className="text-base">{trip.availableSpace}</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Maximum Weight</div>
                  <div className="text-base">{trip.availableWeight} kg</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Price Range</div>
                  <div className="text-base">
                    {trip.minPrice && trip.maxPrice ? `$${trip.minPrice} - $${trip.maxPrice} per kg` : "Not specified"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {trip.stops && trip.stops.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Stops</h3>
              <div className="space-y-2">
                {trip.stops.map((stop, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 border rounded-md">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">
                        {stop.city}, {stop.country}
                      </div>
                      <div className="text-xs text-gray-500">{formatDate(stop.date)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {trip.notes && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Additional Notes</h3>
              <div className="p-3 bg-gray-50 rounded-md text-gray-700">{trip.notes}</div>
            </div>
          )}

          <div className="pt-4 border-t">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Available Actions</h3>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <PackageIcon className="h-4 w-4" />
                View Matching Packages
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <EditIcon className="h-4 w-4" />
                Edit Trip
              </Button>
              <Link href="/dashboard/messages">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <InfoIcon className="h-4 w-4" />
                  Contact Support
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

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
            <AlertDialogAction onClick={handleDeleteTrip} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
