import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapIcon, PackageIcon, StarIcon } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          <Link href="/dashboard/packages/new">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <PackageIcon className="mr-2 h-4 w-4" />
              New Package
            </Button>
          </Link>
          <Link href="/dashboard/trips/new">
            <Button variant="outline">
              <MapIcon className="mr-2 h-4 w-4" />
              New Trip
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active Packages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-gray-500 mt-1">2 in transit, 1 pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active Trips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-gray-500 mt-1">Next: Paris → London (May 15)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Unread Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-gray-500 mt-1">From 3 different conversations</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Packages</CardTitle>
            <CardDescription>Your recently created or accepted packages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-emerald-100 flex items-center justify-center">
                    <PackageIcon className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="font-medium">Small Electronics Package</div>
                    <div className="text-sm text-gray-500">New York → London</div>
                  </div>
                </div>
                <div className="text-sm font-medium text-yellow-600 bg-yellow-50 px-2 py-1 rounded">Pending</div>
              </div>
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-emerald-100 flex items-center justify-center">
                    <PackageIcon className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="font-medium">Documents Envelope</div>
                    <div className="text-sm text-gray-500">London → Paris</div>
                  </div>
                </div>
                <div className="text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">In Transit</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-emerald-100 flex items-center justify-center">
                    <PackageIcon className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="font-medium">Gift Box</div>
                    <div className="text-sm text-gray-500">Paris → Berlin</div>
                  </div>
                </div>
                <div className="text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">In Transit</div>
              </div>
            </div>
            <Button variant="ghost" className="w-full mt-4">
              View All Packages
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Messages</CardTitle>
            <CardDescription>Your recent conversations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <UserAvatar name="Sarah Johnson" />
                  </div>
                  <div>
                    <div className="font-medium">Sarah Johnson</div>
                    <div className="text-sm text-gray-500">Is the package ready for pickup?</div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">2h ago</div>
              </div>
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <UserAvatar name="Michael Chen" />
                  </div>
                  <div>
                    <div className="font-medium">Michael Chen</div>
                    <div className="text-sm text-gray-500">I'll be at the airport by 3 PM</div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">5h ago</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <UserAvatar name="Emma Wilson" />
                  </div>
                  <div>
                    <div className="font-medium">Emma Wilson</div>
                    <div className="text-sm text-gray-500">Package delivered successfully!</div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">1d ago</div>
              </div>
            </div>
            <Button variant="ghost" className="w-full mt-4">
              View All Messages
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recommended Opportunities</CardTitle>
          <CardDescription>Packages and trips that match your profile</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-emerald-100 flex items-center justify-center">
                  <PackageIcon className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <div className="font-medium">Small Clothing Package</div>
                  <div className="text-sm text-gray-500">New York → London (May 20-25)</div>
                  <div className="flex items-center mt-1">
                    <StarIcon className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                    <StarIcon className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                    <StarIcon className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                    <StarIcon className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                    <StarIcon className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs text-gray-500 ml-1">Sender: 5.0 (23 reviews)</span>
                  </div>
                </div>
              </div>
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                View Details
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-blue-100 flex items-center justify-center">
                  <MapIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">London → Berlin Trip</div>
                  <div className="text-sm text-gray-500">June 5-7 (2 packages available)</div>
                  <div className="flex items-center mt-1">
                    <StarIcon className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                    <StarIcon className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                    <StarIcon className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                    <StarIcon className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                    <StarIcon className="h-3 w-3 text-gray-300" />
                    <span className="text-xs text-gray-500 ml-1">Traveler: 4.0 (12 reviews)</span>
                  </div>
                </div>
              </div>
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                View Details
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Simple avatar component that generates initials from name
function UserAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)

  return <div className="text-sm font-medium text-gray-700">{initials}</div>
}
