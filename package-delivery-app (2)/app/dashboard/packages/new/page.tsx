"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { ArrowLeftIcon, PackageIcon, ImageIcon } from "lucide-react"
import { addPackage } from "@/lib/local-storage"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"

export default function NewPackagePage() {
  const [packageSize, setPackageSize] = useState(2) // Medium by default
  const [packageWeight, setPackageWeight] = useState(2) // 2kg by default
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    origin: "",
    destination: "",
    deliveryDate: "",
    budget: "",
    category: "",
    specialInstructions: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const getSizeLabel = (size: number) => {
    if (size <= 1) return "Small"
    if (size <= 3) return "Medium"
    return "Large"
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para criar um pacote",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const packageData = {
        ...formData,
        size: getSizeLabel(packageSize),
        weight: packageWeight.toFixed(1),
      }

      const result = addPackage(packageData)

      if (result.success) {
        toast({
          title: "Pacote criado com sucesso!",
          description: "Seu pacote foi listado e está disponível para viajantes.",
        })
        router.push("/dashboard/packages")
      } else {
        toast({
          title: "Erro ao criar pacote",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erro ao criar pacote",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/dashboard" className="flex items-center text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeftIcon className="mr-1 h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <PackageIcon className="h-5 w-5 text-emerald-600" />
            <CardTitle>Create New Package</CardTitle>
          </div>
          <CardDescription>Enter the details of the package you want to send</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Package Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Birthday Gift, Documents, etc."
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your package contents and any special handling instructions"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Package Size</Label>
                  <div className="mt-2">
                    <Slider
                      value={[packageSize]}
                      min={0}
                      max={5}
                      step={1}
                      onValueChange={(value) => setPackageSize(value[0])}
                    />
                    <div className="flex justify-between mt-1 text-sm text-gray-500">
                      <span>Small</span>
                      <span>Medium</span>
                      <span>Large</span>
                    </div>
                    <div className="mt-2 text-sm font-medium">Selected: {getSizeLabel(packageSize)}</div>
                  </div>
                </div>

                <div>
                  <Label>Package Weight (kg)</Label>
                  <div className="mt-2">
                    <Slider
                      value={[packageWeight]}
                      min={0.1}
                      max={10}
                      step={0.1}
                      onValueChange={(value) => setPackageWeight(value[0])}
                    />
                    <div className="flex justify-between mt-1 text-sm text-gray-500">
                      <span>0.1kg</span>
                      <span>5kg</span>
                      <span>10kg</span>
                    </div>
                    <div className="mt-2 text-sm font-medium">Selected: {packageWeight.toFixed(1)} kg</div>
                  </div>
                </div>
              </div>

              <div>
                <Label>Package Photos</Label>
                <div className="mt-2 border-2 border-dashed rounded-md p-6 text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-300" />
                  <div className="mt-2">
                    <Button variant="outline" size="sm" type="button">
                      Upload Photos
                    </Button>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Upload up to 3 photos of your package. This helps travelers understand what they'll be carrying.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="origin">Origin</Label>
                  <Input
                    id="origin"
                    placeholder="City, Country"
                    value={formData.origin}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="destination">Destination</Label>
                  <Input
                    id="destination"
                    placeholder="City, Country"
                    value={formData.destination}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="deliveryDate">Delivery By</Label>
                  <Input id="deliveryDate" type="date" value={formData.deliveryDate} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="budget">Budget (USD)</Label>
                  <Input
                    id="budget"
                    type="number"
                    placeholder="50"
                    value={formData.budget}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select onValueChange={(value) => handleSelectChange("category", value)}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="documents">Documents</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="clothing">Clothing</SelectItem>
                    <SelectItem value="gifts">Gifts</SelectItem>
                    <SelectItem value="food">Food (non-perishable)</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="specialInstructions">Special Instructions</Label>
                <Textarea
                  id="specialInstructions"
                  placeholder="Any special handling instructions or requirements"
                  rows={2}
                  value={formData.specialInstructions}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
                {isLoading ? "Creating Package..." : "Create Package Listing"}
              </Button>
              <p className="mt-2 text-xs text-center text-gray-500">
                By creating this listing, you agree to our Terms of Service and Package Guidelines
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
