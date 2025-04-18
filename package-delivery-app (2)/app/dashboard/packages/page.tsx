"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { PackageIcon, PlusIcon, SearchIcon, FilterIcon, Trash2Icon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { getUserPackages, type Package } from "@/lib/local-storage"
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

export default function PackagesPage() {
  const { toast } = useToast()
  const [packages, setPackages] = useState<Package[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [packageToDelete, setPackageToDelete] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const fetchPackages = () => {
    try {
      const result = getUserPackages()
      if (result.success && result.packages) {
        setPackages(result.packages)
      } else if (result.error) {
        toast({
          title: "Error loading packages",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error loading packages",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPackages()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Remove toast from dependencies

  const filteredPackages = packages.filter(
    (pkg) =>
      pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.destination.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const activePackages = filteredPackages.filter((pkg) => ["pending", "accepted", "in-transit"].includes(pkg.status))
  const pendingPackages = filteredPackages.filter((pkg) => pkg.status === "pending")
  const completedPackages = filteredPackages.filter((pkg) => pkg.status === "delivered")

  const handleDeletePackage = (packageId: string) => {
    setPackageToDelete(packageId)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeletePackage = () => {
    if (!packageToDelete) return

    try {
      // Get all packages from localStorage
      const allPackages = JSON.parse(localStorage.getItem("packages") || "[]")

      // Filter out the package to delete
      const updatedPackages = allPackages.filter((pkg: Package) => pkg.id !== packageToDelete)

      // Save back to localStorage
      localStorage.setItem("packages", JSON.stringify(updatedPackages))

      // Update state
      setPackages(packages.filter((pkg) => pkg.id !== packageToDelete))

      toast({
        title: "Package deleted",
        description: "The package has been successfully deleted.",
      })
    } catch (error) {
      toast({
        title: "Error deleting package",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setPackageToDelete(null)
      setIsDeleteDialogOpen(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Packages</h1>
        <Link href="/dashboard/packages/new">
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <PlusIcon className="mr-2 h-4 w-4" />
            New Package
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            className="pl-10"
            placeholder="Search packages..."
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
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-4 text-center">Loading packages...</div>
              ) : activePackages.length > 0 ? (
                <div className="divide-y">
                  {activePackages.map((pkg) => (
                    <PackageItem
                      key={pkg.id}
                      id={pkg.id}
                      name={pkg.name}
                      route={`${pkg.origin} → ${pkg.destination}`}
                      date={pkg.deliveryDate}
                      status={pkg.status as any}
                      traveler={pkg.status === "pending" ? "Awaiting traveler" : "Sarah Johnson"}
                      onDelete={handleDeletePackage}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">No active packages found.</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-4 text-center">Loading packages...</div>
              ) : pendingPackages.length > 0 ? (
                <div className="divide-y">
                  {pendingPackages.map((pkg) => (
                    <PackageItem
                      key={pkg.id}
                      id={pkg.id}
                      name={pkg.name}
                      route={`${pkg.origin} → ${pkg.destination}`}
                      date={pkg.deliveryDate}
                      status="pending"
                      traveler="Awaiting traveler"
                      onDelete={handleDeletePackage}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">No pending packages found.</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-4 text-center">Loading packages...</div>
              ) : completedPackages.length > 0 ? (
                <div className="divide-y">
                  {completedPackages.map((pkg) => (
                    <PackageItem
                      key={pkg.id}
                      id={pkg.id}
                      name={pkg.name}
                      route={`${pkg.origin} → ${pkg.destination}`}
                      date={pkg.deliveryDate}
                      status="delivered"
                      traveler="David Rodriguez"
                      onDelete={handleDeletePackage}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">No completed packages found.</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-4 text-center">Loading packages...</div>
              ) : filteredPackages.length > 0 ? (
                <div className="divide-y">
                  {filteredPackages.map((pkg) => (
                    <PackageItem
                      key={pkg.id}
                      id={pkg.id}
                      name={pkg.name}
                      route={`${pkg.origin} → ${pkg.destination}`}
                      date={pkg.deliveryDate}
                      status={pkg.status as any}
                      traveler={pkg.status === "pending" ? "Awaiting traveler" : "Sarah Johnson"}
                      onDelete={handleDeletePackage}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">No packages found.</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this package?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the package and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeletePackage} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function PackageItem({
  id,
  name,
  route,
  date,
  status,
  traveler,
  onDelete,
}: {
  id: string
  name: string
  route: string
  date: string
  status: "pending" | "accepted" | "in-transit" | "delivered" | "cancelled"
  traveler: string
  onDelete: (id: string) => void
}) {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    accepted: "bg-blue-100 text-blue-800",
    "in-transit": "bg-emerald-100 text-emerald-800",
    delivered: "bg-gray-100 text-gray-800",
    cancelled: "bg-red-100 text-red-800",
  }

  const statusLabels = {
    pending: "Pending",
    accepted: "Accepted",
    "in-transit": "In Transit",
    delivered: "Delivered",
    cancelled: "Cancelled",
  }

  return (
    <div className="p-4 hover:bg-gray-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-emerald-100 flex items-center justify-center">
            <PackageIcon className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <div className="font-medium">{name}</div>
            <div className="text-sm text-gray-500">{route}</div>
            <div className="text-xs text-gray-500">{date}</div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Badge className={statusColors[status]}>{statusLabels[status]}</Badge>
          <div className="text-xs text-gray-500">{traveler}</div>
        </div>
      </div>
      <div className="mt-3 flex justify-end gap-2">
        <Link href={`/dashboard/packages/${name.toLowerCase().replace(/\s+/g, "-")}`}>
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </Link>
        <Link href={`/dashboard/messages?package=${name.toLowerCase().replace(/\s+/g, "-")}`}>
          <Button variant="outline" size="sm">
            Message
          </Button>
        </Link>
        <Button
          variant="outline"
          size="sm"
          className="text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={() => onDelete(id)}
        >
          <Trash2Icon className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </div>
    </div>
  )
}
