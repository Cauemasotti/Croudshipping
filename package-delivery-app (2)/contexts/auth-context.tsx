"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { getCurrentUser, type User, initializeWithSampleData } from "@/lib/local-storage"

type AuthContextType = {
  user: User | null
  loading: boolean
  refreshUser: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  refreshUser: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = () => {
    const { user } = getCurrentUser()
    setUser(user)
  }

  useEffect(() => {
    // Inicializar dados de exemplo
    if (typeof window !== "undefined") {
      try {
        initializeWithSampleData()
        refreshUser()
      } catch (error) {
        console.error("Error initializing data:", error)
      } finally {
        setLoading(false)
      }
    }
  }, [])

  return <AuthContext.Provider value={{ user, loading, refreshUser }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
