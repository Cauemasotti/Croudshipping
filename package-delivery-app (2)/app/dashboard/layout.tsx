"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  PackageIcon,
  HomeIcon,
  MapIcon,
  MessageSquareIcon,
  UserIcon,
  BellIcon,
  LogOutIcon,
  HistoryIcon,
  CreditCardIcon,
} from "lucide-react"
import { logoutUser } from "@/lib/local-storage"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading, refreshUser } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  const handleLogout = async () => {
    const result = logoutUser()
    if (result.success) {
      refreshUser()
      toast({
        title: "Logout bem-sucedido",
        description: "Você foi desconectado com sucesso.",
      })
      router.push("/")
    } else {
      toast({
        title: "Erro ao fazer logout",
        description: result.error,
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center gap-2">
            <PackageIcon className="h-6 w-6 text-emerald-600" />
            <span className="text-xl font-bold">Crowdshipping</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <BellIcon className="h-5 w-5" />
            </Button>
            <Link href="/dashboard/profile">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                <UserIcon className="h-4 w-4 text-emerald-600" />
              </div>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="w-64 border-r hidden md:block">
          <nav className="p-4 space-y-2">
            <Link href="/dashboard">
              <Button variant="ghost" className="w-full justify-start">
                <HomeIcon className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/dashboard/trips">
              <Button variant="ghost" className="w-full justify-start">
                <MapIcon className="mr-2 h-4 w-4" />
                My Trips
              </Button>
            </Link>
            <Link href="/dashboard/packages">
              <Button variant="ghost" className="w-full justify-start">
                <PackageIcon className="mr-2 h-4 w-4" />
                My Packages
              </Button>
            </Link>
            <Link href="/dashboard/messages">
              <Button variant="ghost" className="w-full justify-start">
                <MessageSquareIcon className="mr-2 h-4 w-4" />
                Messages
              </Button>
            </Link>
            <Link href="/dashboard/history">
              <Button variant="ghost" className="w-full justify-start">
                <HistoryIcon className="mr-2 h-4 w-4" />
                Shipping History
              </Button>
            </Link>
            <Link href="/dashboard/payments">
              <Button variant="ghost" className="w-full justify-start">
                <CreditCardIcon className="mr-2 h-4 w-4" />
                Payments
              </Button>
            </Link>
            <Link href="/dashboard/profile">
              <Button variant="ghost" className="w-full justify-start">
                <UserIcon className="mr-2 h-4 w-4" />
                Profile
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOutIcon className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </nav>
        </aside>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
