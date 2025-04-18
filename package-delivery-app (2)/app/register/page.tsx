"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PackageIcon, PlaneIcon } from "lucide-react"
import { registerUser } from "@/lib/local-storage"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"

export default function RegisterPage() {
  const searchParams = useSearchParams()
  const defaultType = searchParams.get("type") || "sender"
  const [activeTab, setActiveTab] = useState(defaultType)
  const router = useRouter()
  const { toast } = useToast()
  const { refreshUser } = useAuth()

  const [isLoading, setIsLoading] = useState(false)

  // Sender form state
  const [senderForm, setSenderForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    location: "",
  })

  // Traveler form state
  const [travelerForm, setTravelerForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    location: "",
  })

  const handleSenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSenderForm({
      ...senderForm,
      [e.target.id.replace("sender-", "")]: e.target.value,
    })
  }

  const handleTravelerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTravelerForm({
      ...travelerForm,
      [e.target.id.replace("traveler-", "")]: e.target.value,
    })
  }

  const handleSenderSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = registerUser({
        name: senderForm.name,
        email: senderForm.email,
        password: senderForm.password,
        phone: senderForm.phone,
        location: senderForm.location,
        userType: "sender",
      })

      if (result.success) {
        refreshUser()
        toast({
          title: "Conta criada com sucesso!",
          description: "Redirecionando para o dashboard...",
        })
        router.push("/dashboard")
      } else {
        toast({
          title: "Erro ao criar conta",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erro ao criar conta",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleTravelerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = registerUser({
        name: travelerForm.name,
        email: travelerForm.email,
        password: travelerForm.password,
        phone: travelerForm.phone,
        location: travelerForm.location,
        userType: "traveler",
      })

      if (result.success) {
        refreshUser()
        toast({
          title: "Conta criada com sucesso!",
          description: "Redirecionando para o dashboard...",
        })
        router.push("/dashboard")
      } else {
        toast({
          title: "Erro ao criar conta",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erro ao criar conta",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <PackageIcon className="h-6 w-6 text-emerald-600" />
        <span className="text-xl font-bold">Crowdshipping</span>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>Join Crowdshipping to start sending or carrying packages</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="sender" className="flex items-center gap-2">
                <PackageIcon className="h-4 w-4" />
                <span>Sender</span>
              </TabsTrigger>
              <TabsTrigger value="traveler" className="flex items-center gap-2">
                <PlaneIcon className="h-4 w-4" />
                <span>Traveler</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sender">
              <form onSubmit={handleSenderSubmit}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="sender-name">Full Name</Label>
                    <Input
                      id="sender-name"
                      placeholder="John Doe"
                      value={senderForm.name}
                      onChange={handleSenderChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="sender-email">Email</Label>
                    <Input
                      id="sender-email"
                      type="email"
                      placeholder="john@example.com"
                      value={senderForm.email}
                      onChange={handleSenderChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="sender-password">Password</Label>
                    <Input
                      id="sender-password"
                      type="password"
                      value={senderForm.password}
                      onChange={handleSenderChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="sender-phone">Phone Number</Label>
                    <Input
                      id="sender-phone"
                      placeholder="+1 (555) 123-4567"
                      value={senderForm.phone}
                      onChange={handleSenderChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="sender-location">Location</Label>
                    <Input
                      id="sender-location"
                      placeholder="City, Country"
                      value={senderForm.location}
                      onChange={handleSenderChange}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
                  {isLoading ? "Creating Account..." : "Create Sender Account"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="traveler">
              <form onSubmit={handleTravelerSubmit}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="traveler-name">Full Name</Label>
                    <Input
                      id="traveler-name"
                      placeholder="Jane Doe"
                      value={travelerForm.name}
                      onChange={handleTravelerChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="traveler-email">Email</Label>
                    <Input
                      id="traveler-email"
                      type="email"
                      placeholder="jane@example.com"
                      value={travelerForm.email}
                      onChange={handleTravelerChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="traveler-password">Password</Label>
                    <Input
                      id="traveler-password"
                      type="password"
                      value={travelerForm.password}
                      onChange={handleTravelerChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="traveler-phone">Phone Number</Label>
                    <Input
                      id="traveler-phone"
                      placeholder="+1 (555) 123-4567"
                      value={travelerForm.phone}
                      onChange={handleTravelerChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="traveler-location">Home Location</Label>
                    <Input
                      id="traveler-location"
                      placeholder="City, Country"
                      value={travelerForm.location}
                      onChange={handleTravelerChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="traveler-id">ID Verification</Label>
                    <div className="border border-dashed rounded-md p-4 text-center">
                      <p className="text-sm text-gray-500 mb-2">Upload a photo of your ID for verification</p>
                      <Button variant="outline" size="sm">
                        Upload ID
                      </Button>
                    </div>
                  </div>
                </div>
                <Button type="submit" className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
                  {isLoading ? "Creating Account..." : "Create Traveler Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col items-center">
          <p className="text-sm text-gray-500 mt-2">
            Already have an account?{" "}
            <Link href="/login" className="text-emerald-600 hover:underline">
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
