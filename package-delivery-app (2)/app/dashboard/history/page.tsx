"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PackageIcon, MapIcon, CalendarIcon, Trash2Icon } from "lucide-react"
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

// Define the history item type
interface HistoryItem {
  id: string
  title: string
  route: string
  date: string
  status: "completed" | "cancelled"
  role: "sender" | "traveler"
  counterparty: string
}

export default function ShippingHistoryPage() {
  const { toast } = useToast()
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Load history items from localStorage
  useEffect(() => {
    const fetchHistoryItems = () => {
      try {
        // Get history items from localStorage or use default data if none exists
        const storedItems = localStorage.getItem("shippingHistory")
        if (storedItems) {
          setHistoryItems(JSON.parse(storedItems))
        } else {
          // Default history items
          const defaultItems: HistoryItem[] = [
            {
              id: "1",
              title: "Small Electronics Package",
              route: "New York → London",
              date: "May 15-25, 2023",
              status: "completed",
              role: "sender",
              counterparty: "Sarah Johnson",
            },
            {
              id: "2",
              title: "Documents Delivery",
              route: "London → Paris",
              date: "April 10-12, 2023",
              status: "completed",
              role: "traveler",
              counterparty: "Michael Chen",
            },
            {
              id: "3",
              title: "Gift Box",
              route: "Paris → Berlin",
              date: "March 5-8, 2023",
              status: "completed",
              role: "sender",
              counterparty: "Emma Wilson",
            },
            {
              id: "4",
              title: "Clothing Package",
              route: "Berlin → Madrid",
              date: "February 20-25, 2023",
              status: "cancelled",
              role: "traveler",
              counterparty: "Carlos Rodriguez",
            },
          ]
          setHistoryItems(defaultItems)
          localStorage.setItem("shippingHistory", JSON.stringify(defaultItems))
        }
      } catch (error) {
        toast({
          title: "Error loading shipping history",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchHistoryItems()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDeleteItem = (id: string) => {
    setItemToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteItem = () => {
    if (!itemToDelete) return

    try {
      // Filter out the item to delete
      const updatedItems = historyItems.filter((item) => item.id !== itemToDelete)

      // Save back to localStorage
      localStorage.setItem("shippingHistory", JSON.stringify(updatedItems))

      // Update state
      setHistoryItems(updatedItems)

      toast({
        title: "History item deleted",
        description: "The shipping history item has been successfully deleted.",
      })
    } catch (error) {
      toast({
        title: "Error deleting history item",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setItemToDelete(null)
      setIsDeleteDialogOpen(false)
    }
  }

  // Filter items by role
  const senderItems = historyItems.filter((item) => item.role === "sender")
  const travelerItems = historyItems.filter((item) => item.role === "traveler")

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Shipping History</h1>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="all">All History</TabsTrigger>
          <TabsTrigger value="as-sender">As Sender</TabsTrigger>
          <TabsTrigger value="as-traveler">As Traveler</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Shipping History</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-4 text-center">Loading history...</div>
              ) : historyItems.length > 0 ? (
                <div className="divide-y">
                  {historyItems.map((item) => (
                    <HistoryItemComponent key={item.id} item={item} onDelete={handleDeleteItem} />
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">No shipping history found.</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="as-sender" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Packages You've Sent</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-4 text-center">Loading history...</div>
              ) : senderItems.length > 0 ? (
                <div className="divide-y">
                  {senderItems.map((item) => (
                    <HistoryItemComponent key={item.id} item={item} onDelete={handleDeleteItem} />
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">No sender history found.</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="as-traveler" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Packages You've Delivered</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-4 text-center">Loading history...</div>
              ) : travelerItems.length > 0 ? (
                <div className="divide-y">
                  {travelerItems.map((item) => (
                    <HistoryItemComponent key={item.id} item={item} onDelete={handleDeleteItem} />
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">No traveler history found.</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this history item?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the shipping history record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteItem} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function HistoryItemComponent({
  item,
  onDelete,
}: {
  item: HistoryItem
  onDelete: (id: string) => void
}) {
  const statusColors = {
    completed: "bg-emerald-100 text-emerald-800",
    cancelled: "bg-red-100 text-red-800",
  }

  const roleIcons = {
    sender: <PackageIcon className="h-5 w-5 text-emerald-600" />,
    traveler: <MapIcon className="h-5 w-5 text-blue-600" />,
  }

  const roleColors = {
    sender: "bg-emerald-100",
    traveler: "bg-blue-100",
  }

  return (
    <div className="p-4 hover:bg-gray-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded flex items-center justify-center ${roleColors[item.role]}`}>
            {roleIcons[item.role]}
          </div>
          <div>
            <div className="font-medium">{item.title}</div>
            <div className="text-sm text-gray-500">{item.route}</div>
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <CalendarIcon className="h-3 w-3 mr-1" />
              {item.date}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Badge className={statusColors[item.status]}>{item.status === "completed" ? "Completed" : "Cancelled"}</Badge>
          <div className="text-xs text-gray-500">
            {item.role === "sender" ? "Delivered by" : "Sent by"}: {item.counterparty}
          </div>
        </div>
      </div>
      <div className="mt-3 flex justify-end">
        <Button
          variant="outline"
          size="sm"
          className="text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={() => onDelete(item.id)}
        >
          <Trash2Icon className="h-4 w-4 mr-1" />
          Delete from History
        </Button>
      </div>
    </div>
  )
}
