"use client"
import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface AuthContextType {
  token: string | null
  setToken: (token: string | null) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null)

  useEffect(() => {
    const savedToken = localStorage.getItem("auth_token")
    if (savedToken) {
      setTokenState(savedToken)
    }
  }, [])

  const setToken = (newToken: string | null) => {
    setTokenState(newToken)
    if (newToken) {
      localStorage.setItem("auth_token", newToken)
    } else {
      localStorage.removeItem("auth_token")
    }
  }

  const logout = () => {
    setToken(null)
    window.location.href = "/auth/login"
  }

  return <AuthContext.Provider value={{ token, setToken, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Export the context with both naming conventions for compatibility

// Also export with the original naming convention
export { AuthProvider as AuthContextProvider }
export { useAuth as useAuthContext }
