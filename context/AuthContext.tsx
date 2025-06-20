"use client"
import { createContext, useContext, useEffect, useState } from "react"
import type React from "react"

interface AuthContextType {
  /* TODO add user details in the context */
  token: string | null
  setToken: (token: string) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const getTokenFromCookie = (): string | null => {
    const match = document.cookie.match("(^|;)\\s*qoulo_token=([^;]*)")
    return match ? decodeURIComponent(match[2]) : null
  }

  useEffect(() => {
    const localToken = localStorage.getItem("qoulo_token")
    const cookieToken = getTokenFromCookie()

    if (localToken) {
      setTokenState(localToken)
    } else if (cookieToken) {
      setTokenState(cookieToken)
      localStorage.setItem("qoulo_token", cookieToken)
    }

    setLoading(false)
  }, [])

  // Set token in all places
  const setToken = (newToken: string) => {
    setTokenState(newToken)
    localStorage.setItem("qoulo_token", newToken)
    document.cookie = `qoulo_token=${encodeURIComponent(newToken)}; path=/; SameSite=Lax;`
  }

  const logout = () => {
    setTokenState(null)
    localStorage.removeItem("qoulo_token")
    document.cookie = `qoulo_token=; path=/; Max-Age=-1;`
    window.location.href = "/auth/login"
  }

  if (loading) return null // Prevent rendering until token is restored

  return (
    <AuthContext.Provider value={{ token, setToken, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}
