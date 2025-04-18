"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PackageIcon } from "lucide-react"
import { loginUser } from "@/lib/local-storage"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { refreshUser } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = loginUser(formData.email, formData.password)

      if (result.success) {
        refreshUser()
        toast({
          title: "Login bem-sucedido!",
          description: "Redirecionando para o dashboard...",
        })
        router.push("/dashboard")
      } else {
        toast({
          title: "Erro ao fazer login",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erro ao fazer login",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Função para login rápido com o usuário de demonstração
  const handleDemoLogin = () => {
    setIsLoading(true)
    try {
      const result = loginUser("demo@example.com", "password")
      if (result.success) {
        refreshUser()
        toast({
          title: "Login de demonstração bem-sucedido!",
          description: "Redirecionando para o dashboard...",
        })
        router.push("/dashboard")
      } else {
        toast({
          title: "Erro ao fazer login de demonstração",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erro ao fazer login",
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
          <CardTitle>Log in to your account</CardTitle>
          <CardDescription>Enter your email and password to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-sm text-emerald-600 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input id="password" type="password" value={formData.password} onChange={handleChange} required />
              </div>
              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Log In"}
              </Button>
            </div>
          </form>

          <div className="mt-4">
            <Button type="button" variant="outline" className="w-full" onClick={handleDemoLogin} disabled={isLoading}>
              {isLoading ? "Logging in..." : "Demo Login (Quick Access)"}
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center">
          <p className="text-sm text-gray-500 mt-2">
            Don't have an account?{" "}
            <Link href="/register" className="text-emerald-600 hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
