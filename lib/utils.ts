import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

const GOOGLE_AUTH_ENDPOINT = "http://localhost:8080/api/v1/auth/google"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function handleGoogleLogin() {
  window.location.href = GOOGLE_AUTH_ENDPOINT
}

// Helper to parse JWT and extract user info
export function parseJwt(token: string): { user_id?: number; username?: string; email?: string } {
  try {
    const base64Url = token.split(".")[1]
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    )
    return JSON.parse(jsonPayload)
  } catch {
    return {}
  }
}
