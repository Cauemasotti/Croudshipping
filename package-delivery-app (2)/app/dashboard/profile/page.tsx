"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { UserIcon, CreditCardIcon, ShieldCheckIcon, BellIcon, StarIcon } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile")
  const { user, refreshUser } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "Frequent traveler between the US and Europe. Happy to help deliver packages along my routes!",
  })

  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        location: user.location || "",
        bio: "Frequent traveler between the US and Europe. Happy to help deliver packages along my routes!",
      })
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }

  const handleSaveChanges = () => {
    setIsLoading(true)

    try {
      // Get all users from localStorage
      const users = JSON.parse(localStorage.getItem("users") || "[]")

      // Find and update the current user
      const updatedUsers = users.map((u: any) => {
        if (u.id === user?.id) {
          return {
            ...u,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            location: formData.location,
          }
        }
        return u
      })

      // Save back to localStorage
      localStorage.setItem("users", JSON.stringify(updatedUsers))

      // Update current user in localStorage
      if (user) {
        const updatedUser = {
          ...user,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          location: formData.location,
        }
        localStorage.setItem("currentUser", JSON.stringify(updatedUser))
      }

      // Refresh user context
      refreshUser()

      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error updating profile",
        description: "An error occurred while updating your profile.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <UserIcon className="h-4 w-4" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <CreditCardIcon className="h-4 w-4" />
            <span>Payment</span>
          </TabsTrigger>
          <TabsTrigger value="verification" className="flex items-center gap-2">
            <ShieldCheckIcon className="h-4 w-4" />
            <span>Verification</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <BellIcon className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details and public profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
                <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 text-2xl font-bold">
                  {formData.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .toUpperCase()
                    .substring(0, 2) || "JD"}
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-lg font-medium">{formData.name || "John Doe"}</h3>
                  <p className="text-sm text-gray-500">Joined April 2023</p>
                  <div className="flex items-center justify-center sm:justify-start mt-2">
                    <StarIcon className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <StarIcon className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <StarIcon className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <StarIcon className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <StarIcon className="h-4 w-4 text-gray-300" />
                    <span className="text-sm text-gray-500 ml-1">4.0 (15 reviews)</span>
                  </div>
                  <div className="mt-4">
                    <Button variant="outline" size="sm">
                      Change Photo
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" value={formData.name} onChange={handleChange} />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={formData.email} onChange={handleChange} />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" value={formData.phone} onChange={handleChange} />
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" value={formData.location} onChange={handleChange} />
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" rows={4} value={formData.bio} onChange={handleChange} />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="public-profile" defaultChecked />
                  <Label htmlFor="public-profile">Make my profile public</Label>
                </div>
              </div>

              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                onClick={handleSaveChanges}
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your payment methods and transaction history</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="border rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-8 bg-blue-100 rounded flex items-center justify-center text-blue-800 font-bold text-xs">
                      VISA
                    </div>
                    <div>
                      <div className="font-medium">Visa ending in 4242</div>
                      <div className="text-sm text-gray-500">Expires 05/2025</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                      Remove
                    </Button>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => (window.location.href = "/dashboard/payments/add-payment")}
                >
                  <CreditCardIcon className="mr-2 h-4 w-4" />
                  Add Payment Method
                </Button>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Transaction History</h3>
                <div className="space-y-3">
                  <div className="border-b pb-3">
                    <div className="flex justify-between">
                      <div>
                        <div className="font-medium">Package Delivery Payment</div>
                        <div className="text-sm text-gray-500">From: Sarah Johnson</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-emerald-600">+$30.00</div>
                        <div className="text-sm text-gray-500">May 18, 2023</div>
                      </div>
                    </div>
                  </div>
                  <div className="border-b pb-3">
                    <div className="flex justify-between">
                      <div>
                        <div className="font-medium">Package Delivery Payment</div>
                        <div className="text-sm text-gray-500">To: Michael Chen</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-red-600">-$25.00</div>
                        <div className="text-sm text-gray-500">May 10, 2023</div>
                      </div>
                    </div>
                  </div>
                  <div className="border-b pb-3">
                    <div className="flex justify-between">
                      <div>
                        <div className="font-medium">Platform Fee</div>
                        <div className="text-sm text-gray-500">Crowdshipping Service Fee</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-red-600">-$3.00</div>
                        <div className="text-sm text-gray-500">May 10, 2023</div>
                      </div>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" className="w-full mt-4">
                  View All Transactions
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verification">
          <Card>
            <CardHeader>
              <CardTitle>Identity Verification</CardTitle>
              <CardDescription>Verify your identity to increase trust and security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-800">
                      <ShieldCheckIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">Email Verification</div>
                      <div className="text-sm text-gray-500">{formData.email}</div>
                    </div>
                    <div className="ml-auto">
                      <span className="text-xs font-medium bg-green-100 text-green-800 px-2 py-1 rounded">
                        Verified
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-800">
                      <ShieldCheckIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">Phone Verification</div>
                      <div className="text-sm text-gray-500">{formData.phone}</div>
                    </div>
                    <div className="ml-auto">
                      <span className="text-xs font-medium bg-green-100 text-green-800 px-2 py-1 rounded">
                        Verified
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-800">
                      <ShieldCheckIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">ID Verification</div>
                      <div className="text-sm text-gray-500">Government-issued ID</div>
                    </div>
                    <div className="ml-auto">
                      <span className="text-xs font-medium bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        Pending
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">
                    Your ID verification is being processed. This usually takes 1-2 business days.
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-800">
                      <ShieldCheckIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">Address Verification</div>
                      <div className="text-sm text-gray-500">Proof of address</div>
                    </div>
                    <div className="ml-auto">
                      <span className="text-xs font-medium bg-gray-100 text-gray-800 px-2 py-1 rounded">
                        Not Started
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">
                    Verify your address to increase your trust score and access more features.
                  </p>
                  <Button variant="outline" size="sm">
                    Start Verification
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Email Notifications</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">New Messages</div>
                      <div className="text-sm text-gray-500">Receive emails when you get new messages</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Package Requests</div>
                      <div className="text-sm text-gray-500">Receive emails for new package requests</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Trip Matches</div>
                      <div className="text-sm text-gray-500">Receive emails when your trip matches a package</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Marketing & Promotions</div>
                      <div className="text-sm text-gray-500">Receive emails about offers and updates</div>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Push Notifications</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">New Messages</div>
                      <div className="text-sm text-gray-500">Receive push notifications for new messages</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Package Status Updates</div>
                      <div className="text-sm text-gray-500">Receive updates about your packages</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Payment Notifications</div>
                      <div className="text-sm text-gray-500">Receive notifications about payments</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
