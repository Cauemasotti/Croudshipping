"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeftIcon, CreditCardIcon } from "lucide-react"
import { addPaymentMethod } from "@/lib/local-storage"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"

export default function AddPaymentMethodPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    cardNumber: "",
    cardholderName: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    cardType: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value

    // Format card number with spaces
    if (e.target.id === "cardNumber") {
      value = value
        .replace(/\s/g, "")
        .replace(/(.{4})/g, "$1 ")
        .trim()
    }

    setFormData({
      ...formData,
      [e.target.id]: value,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Error",
        description: "You need to be logged in to add a payment method",
        variant: "destructive",
      })
      return
    }

    // Validate form
    if (!formData.cardType) {
      toast({
        title: "Error",
        description: "Please select a card type",
        variant: "destructive",
      })
      return
    }

    if (formData.cardNumber.replace(/\s/g, "").length < 16) {
      toast({
        title: "Error",
        description: "Please enter a valid card number",
        variant: "destructive",
      })
      return
    }

    if (!formData.cardholderName) {
      toast({
        title: "Error",
        description: "Please enter the cardholder name",
        variant: "destructive",
      })
      return
    }

    if (!formData.expiryMonth || !formData.expiryYear) {
      toast({
        title: "Error",
        description: "Please select an expiry date",
        variant: "destructive",
      })
      return
    }

    if (!formData.cvv || formData.cvv.length < 3) {
      toast({
        title: "Error",
        description: "Please enter a valid CVV",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Mask the card number for security
      const lastFourDigits = formData.cardNumber.replace(/\s/g, "").slice(-4)
      const maskedCardNumber = `**** **** **** ${lastFourDigits}`

      const paymentData = {
        cardType: formData.cardType,
        cardholderName: formData.cardholderName,
        maskedCardNumber,
        lastFourDigits,
        expiryMonth: formData.expiryMonth,
        expiryYear: formData.expiryYear,
      }

      const result = addPaymentMethod(paymentData)

      if (result.success) {
        toast({
          title: "Payment method added successfully!",
          description: "Your card has been added to your account.",
        })
        router.push("/dashboard/payments")
      } else {
        toast({
          title: "Error adding payment method",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error adding payment method",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/dashboard/payments" className="flex items-center text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeftIcon className="mr-1 h-4 w-4" />
          Back to Payments
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CreditCardIcon className="h-5 w-5 text-emerald-600" />
            <CardTitle>Add Payment Method</CardTitle>
          </div>
          <CardDescription>Enter your card details to add a new payment method</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="cardType">Card Type</Label>
                <Select onValueChange={(value) => handleSelectChange("cardType", value)} required>
                  <SelectTrigger id="cardType">
                    <SelectValue placeholder="Select card type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="visa">Visa</SelectItem>
                    <SelectItem value="mastercard">Mastercard</SelectItem>
                    <SelectItem value="amex">American Express</SelectItem>
                    <SelectItem value="discover">Discover</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  maxLength={19}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">For testing, you can use: 4242 4242 4242 4242</p>
              </div>

              <div>
                <Label htmlFor="cardholderName">Cardholder Name</Label>
                <Input
                  id="cardholderName"
                  placeholder="John Doe"
                  value={formData.cardholderName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Select onValueChange={(value) => handleSelectChange("expiryMonth", value)} required>
                      <SelectTrigger id="expiryMonth">
                        <SelectValue placeholder="MM" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => {
                          const month = i + 1
                          return (
                            <SelectItem key={month} value={month.toString().padStart(2, "0")}>
                              {month.toString().padStart(2, "0")}
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                    <Select onValueChange={(value) => handleSelectChange("expiryYear", value)} required>
                      <SelectTrigger id="expiryYear">
                        <SelectValue placeholder="YY" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 10 }, (_, i) => {
                          const year = new Date().getFullYear() + i
                          return (
                            <SelectItem key={year} value={year.toString().slice(-2)}>
                              {year.toString().slice(-2)}
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    value={formData.cvv}
                    onChange={handleChange}
                    maxLength={4}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">For testing, you can use: 123</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
                {isLoading ? "Adding Card..." : "Add Card"}
              </Button>
              <p className="mt-2 text-xs text-center text-gray-500">
                Your card information is encrypted and secure. We comply with PCI DSS standards.
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
