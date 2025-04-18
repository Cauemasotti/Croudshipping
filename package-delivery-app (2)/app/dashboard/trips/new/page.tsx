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
import { Switch } from "@/components/ui/switch"
import { ArrowLeftIcon, MapIcon, PlusIcon, XIcon } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function NewTripPage() {
  const [availableSpace, setAvailableSpace] = useState(2) // Medium by default
  const [availableWeight, setAvailableWeight] = useState(3) // 3kg by default
  const [stops, setStops] = useState<{ city: string; country: string; date: string }[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Form state
  const [formData, setFormData] = useState({
    originCity: "",
    originCountry: "",
    destinationCity: "",
    destinationCountry: "",
    departureDate: "",
    arrivalDate: "",
    transportation: "",
    minPrice: "",
    maxPrice: "",
    isRoundTrip: false,
    notes: "",
  })

  const getSpaceLabel = (space: number) => {
    if (space <= 1) return "Small"
    if (space <= 3) return "Medium"
    return "Large"
  }

  const addStop = () => {
    setStops([...stops, { city: "", country: "", date: "" }])
  }

  const removeStop = (index: number) => {
    const newStops = [...stops]
    newStops.splice(index, 1)
    setStops(newStops)
  }

  const updateStop = (index: number, field: string, value: string) => {
    const newStops = [...stops]
    newStops[index] = { ...newStops[index], [field]: value }
    setStops(newStops)
  }

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

  const handleSwitchChange = (checked: boolean) => {
    setFormData({
      ...formData,
      isRoundTrip: checked,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Verificar campos obrigatórios
      if (
        !formData.originCity ||
        !formData.originCountry ||
        !formData.destinationCity ||
        !formData.destinationCountry ||
        !formData.departureDate ||
        !formData.arrivalDate
      ) {
        toast({
          title: "Campos obrigatórios",
          description: "Por favor, preencha todos os campos obrigatórios.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Create trip object
      const trip = {
        id: Math.random().toString(36).substring(2, 15),
        originCity: formData.originCity,
        originCountry: formData.originCountry,
        destinationCity: formData.destinationCity,
        destinationCountry: formData.destinationCountry,
        departureDate: formData.departureDate,
        arrivalDate: formData.arrivalDate,
        stops: stops,
        availableSpace: getSpaceLabel(availableSpace),
        availableWeight: availableWeight.toFixed(1),
        transportation: formData.transportation || "other",
        minPrice: formData.minPrice || "0",
        maxPrice: formData.maxPrice || "0",
        isRoundTrip: formData.isRoundTrip,
        notes: formData.notes || "",
        status: "active",
        createdAt: new Date().toISOString(),
      }

      // Get existing trips from localStorage or initialize with empty array
      const existingTrips = JSON.parse(localStorage.getItem("trips") || "[]")

      // Add new trip
      const updatedTrips = [...existingTrips, trip]

      // Save to localStorage
      localStorage.setItem("trips", JSON.stringify(updatedTrips))

      toast({
        title: "Viagem criada com sucesso!",
        description: "Sua viagem foi salva e agora está visível em Minhas Viagens.",
      })

      // Redirect to trips page
      setTimeout(() => {
        router.push("/dashboard/trips")
      }, 1000)
    } catch (error) {
      console.error("Erro ao criar viagem:", error)
      toast({
        title: "Erro ao criar viagem",
        description: "Ocorreu um erro inesperado. Por favor, tente novamente.",
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
            <MapIcon className="h-5 w-5 text-emerald-600" />
            <CardTitle>Create New Trip</CardTitle>
          </div>
          <CardDescription>Enter the details of your upcoming trip</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="originCity">Origin City</Label>
                  <Input
                    id="originCity"
                    placeholder="e.g., New York"
                    value={formData.originCity}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="originCountry">Origin Country</Label>
                  <Input
                    id="originCountry"
                    placeholder="e.g., United States"
                    value={formData.originCountry}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="destinationCity">Destination City</Label>
                  <Input
                    id="destinationCity"
                    placeholder="e.g., London"
                    value={formData.destinationCity}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="destinationCountry">Destination Country</Label>
                  <Input
                    id="destinationCountry"
                    placeholder="e.g., United Kingdom"
                    value={formData.destinationCountry}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="departureDate">Departure Date</Label>
                  <Input
                    id="departureDate"
                    type="date"
                    value={formData.departureDate}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="arrivalDate">Arrival Date</Label>
                  <Input id="arrivalDate" type="date" value={formData.arrivalDate} onChange={handleChange} required />
                </div>
              </div>

              {/* Stops */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Stops (Optional)</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addStop}
                    className="flex items-center gap-1"
                  >
                    <PlusIcon className="h-3 w-3" />
                    Add Stop
                  </Button>
                </div>

                {stops.length > 0 ? (
                  <div className="space-y-3">
                    {stops.map((stop, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="grid grid-cols-3 gap-2 flex-1">
                          <Input
                            placeholder="City"
                            value={stop.city}
                            onChange={(e) => updateStop(index, "city", e.target.value)}
                          />
                          <Input
                            placeholder="Country"
                            value={stop.country}
                            onChange={(e) => updateStop(index, "country", e.target.value)}
                          />
                          <Input
                            type="date"
                            value={stop.date}
                            onChange={(e) => updateStop(index, "date", e.target.value)}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeStop(index)}
                          className="h-9 w-9"
                        >
                          <XIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No stops added yet.</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Available Space</Label>
                  <div className="mt-2">
                    <Slider
                      value={[availableSpace]}
                      min={0}
                      max={5}
                      step={1}
                      onValueChange={(value) => setAvailableSpace(value[0])}
                    />
                    <div className="flex justify-between mt-1 text-sm text-gray-500">
                      <span>Small</span>
                      <span>Medium</span>
                      <span>Large</span>
                    </div>
                    <div className="mt-2 text-sm font-medium">Selected: {getSpaceLabel(availableSpace)}</div>
                  </div>
                </div>

                <div>
                  <Label>Max Weight (kg)</Label>
                  <div className="mt-2">
                    <Slider
                      value={[availableWeight]}
                      min={0.5}
                      max={10}
                      step={0.5}
                      onValueChange={(value) => setAvailableWeight(value[0])}
                    />
                    <div className="flex justify-between mt-1 text-sm text-gray-500">
                      <span>0.5kg</span>
                      <span>5kg</span>
                      <span>10kg</span>
                    </div>
                    <div className="mt-2 text-sm font-medium">Selected: {availableWeight.toFixed(1)} kg</div>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="transportation">Método de Transporte</Label>
                <Select onValueChange={(value) => handleSelectChange("transportation", value)}>
                  <SelectTrigger id="transportation">
                    <SelectValue placeholder="Selecione o transporte" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plane">Avião</SelectItem>
                    <SelectItem value="train">Trem</SelectItem>
                    <SelectItem value="bus">Ônibus</SelectItem>
                    <SelectItem value="car">Carro</SelectItem>
                    <SelectItem value="other">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="price-range">Price Range (USD per kg)</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    id="minPrice"
                    type="number"
                    placeholder="Min (e.g., 10)"
                    value={formData.minPrice}
                    onChange={handleChange}
                  />
                  <Input
                    id="maxPrice"
                    type="number"
                    placeholder="Max (e.g., 30)"
                    value={formData.maxPrice}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="isRoundTrip" checked={formData.isRoundTrip} onCheckedChange={handleSwitchChange} />
                <Label htmlFor="isRoundTrip">This is a round trip</Label>
              </div>

              <div>
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional information about your trip or preferences for packages"
                  rows={3}
                  value={formData.notes}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
                {isLoading ? "Creating Trip..." : "Create Trip Listing"}
              </Button>
              <p className="mt-2 text-xs text-center text-gray-500">
                By creating this listing, you agree to our Terms of Service and Trip Guidelines
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
