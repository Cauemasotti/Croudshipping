"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BugIcon } from "lucide-react"

export default function TripsDebug() {
  const [debugInfo, setDebugInfo] = useState<string>("")

  const checkLocalStorage = () => {
    try {
      const trips = localStorage.getItem("trips")
      setDebugInfo(trips || "Nenhuma viagem encontrada no localStorage")
    } catch (error) {
      setDebugInfo(`Erro ao acessar localStorage: ${error}`)
    }
  }

  const resetTrips = () => {
    try {
      localStorage.setItem("trips", JSON.stringify([]))
      setDebugInfo("Viagens resetadas com sucesso!")
    } catch (error) {
      setDebugInfo(`Erro ao resetar viagens: ${error}`)
    }
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BugIcon className="h-5 w-5" />
          Ferramentas de Debug
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button variant="outline" onClick={checkLocalStorage}>
              Verificar localStorage
            </Button>
            <Button variant="outline" className="text-red-500" onClick={resetTrips}>
              Resetar Viagens
            </Button>
          </div>
          {debugInfo && (
            <div className="p-3 bg-gray-100 rounded-md overflow-auto max-h-40">
              <pre className="text-xs">{debugInfo}</pre>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
