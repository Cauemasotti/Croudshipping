"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { CreditCardIcon, PlusIcon, DownloadIcon, ArrowUpIcon, ArrowDownIcon } from "lucide-react"
import { getUserPaymentMethods, type PaymentMethod } from "@/lib/local-storage"
import { useToast } from "@/components/ui/use-toast"

export default function PaymentsPage() {
  const { toast } = useToast()
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPaymentMethods = () => {
      try {
        const result = getUserPaymentMethods()
        if (result.success && result.paymentMethods) {
          setPaymentMethods(result.paymentMethods)
        } else if (result.error) {
          toast({
            title: "Error loading payment methods",
            description: result.error,
            variant: "destructive",
          })
        }
      } catch (error) {
        toast({
          title: "Error loading payment methods",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchPaymentMethods()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Remove toast from dependencies to prevent infinite loop

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Payments</h1>
        <Link href="/dashboard/payments/add-payment">
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Payment Method
          </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Available Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$245.00</div>
            <Button variant="outline" size="sm" className="mt-2">
              Withdraw
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,250.00</div>
            <p className="text-xs text-gray-500 mt-1">From 12 completed deliveries</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$850.00</div>
            <p className="text-xs text-gray-500 mt-1">For 8 package deliveries</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>Manage your payment methods</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
              <p className="text-center py-4 text-gray-500">Loading payment methods...</p>
            ) : paymentMethods.length > 0 ? (
              paymentMethods.map((method, index) => (
                <div key={index} className="border rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-8 rounded flex items-center justify-center text-xs font-bold
                      ${method.cardType === "visa" ? "bg-blue-100 text-blue-800" : ""}
                      ${method.cardType === "mastercard" ? "bg-green-100 text-green-800" : ""}
                      ${method.cardType === "amex" ? "bg-purple-100 text-purple-800" : ""}
                      ${method.cardType === "discover" ? "bg-orange-100 text-orange-800" : ""}
                    `}
                    >
                      {method.cardType === "visa" && "VISA"}
                      {method.cardType === "mastercard" && "MC"}
                      {method.cardType === "amex" && "AMEX"}
                      {method.cardType === "discover" && "DISC"}
                    </div>
                    <div>
                      <div className="font-medium">
                        {method.cardType.charAt(0).toUpperCase() + method.cardType.slice(1)} ending in{" "}
                        {method.lastFourDigits}
                      </div>
                      <div className="text-sm text-gray-500">
                        Expires {method.expiryMonth}/{method.expiryYear}
                      </div>
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
              ))
            ) : (
              <p className="text-center py-4 text-gray-500">No payment methods found. Add your first card.</p>
            )}

            <Link href="/dashboard/payments/add-payment">
              <Button variant="outline" className="w-full">
                <CreditCardIcon className="mr-2 h-4 w-4" />
                Add New Payment Method
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">All Transactions</TabsTrigger>
            <TabsTrigger value="incoming">Incoming</TabsTrigger>
            <TabsTrigger value="outgoing">Outgoing</TabsTrigger>
          </TabsList>
          <Button variant="outline" size="sm">
            <DownloadIcon className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                <TransactionItem
                  title="Package Delivery Payment"
                  description="From: Sarah Johnson"
                  amount={30}
                  date="May 18, 2023"
                  type="incoming"
                />
                <TransactionItem
                  title="Package Delivery Payment"
                  description="To: Michael Chen"
                  amount={25}
                  date="May 10, 2023"
                  type="outgoing"
                />
                <TransactionItem
                  title="Platform Fee"
                  description="Crowdshipping Service Fee"
                  amount={3}
                  date="May 10, 2023"
                  type="outgoing"
                />
                <TransactionItem
                  title="Package Delivery Payment"
                  description="From: Emma Wilson"
                  amount={45}
                  date="April 28, 2023"
                  type="incoming"
                />
                <TransactionItem
                  title="Withdrawal to Bank Account"
                  description="To: **** 5678"
                  amount={100}
                  date="April 15, 2023"
                  type="outgoing"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="incoming" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                <TransactionItem
                  title="Package Delivery Payment"
                  description="From: Sarah Johnson"
                  amount={30}
                  date="May 18, 2023"
                  type="incoming"
                />
                <TransactionItem
                  title="Package Delivery Payment"
                  description="From: Emma Wilson"
                  amount={45}
                  date="April 28, 2023"
                  type="incoming"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="outgoing" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                <TransactionItem
                  title="Package Delivery Payment"
                  description="To: Michael Chen"
                  amount={25}
                  date="May 10, 2023"
                  type="outgoing"
                />
                <TransactionItem
                  title="Platform Fee"
                  description="Crowdshipping Service Fee"
                  amount={3}
                  date="May 10, 2023"
                  type="outgoing"
                />
                <TransactionItem
                  title="Withdrawal to Bank Account"
                  description="To: **** 5678"
                  amount={100}
                  date="April 15, 2023"
                  type="outgoing"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function TransactionItem({
  title,
  description,
  amount,
  date,
  type,
}: {
  title: string
  description: string
  amount: number
  date: string
  type: "incoming" | "outgoing"
}) {
  return (
    <div className="p-4 hover:bg-gray-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              type === "incoming" ? "bg-emerald-100" : "bg-red-100"
            }`}
          >
            {type === "incoming" ? (
              <ArrowDownIcon className="h-5 w-5 text-emerald-600" />
            ) : (
              <ArrowUpIcon className="h-5 w-5 text-red-600" />
            )}
          </div>
          <div>
            <div className="font-medium">{title}</div>
            <div className="text-sm text-gray-500">{description}</div>
          </div>
        </div>
        <div className="text-right">
          <div className={`font-medium ${type === "incoming" ? "text-emerald-600" : "text-red-600"}`}>
            {type === "incoming" ? "+" : "-"}${amount.toFixed(2)}
          </div>
          <div className="text-sm text-gray-500">{date}</div>
        </div>
      </div>
    </div>
  )
}
