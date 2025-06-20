"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/dashboard/settings")
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
    </div>
  )
}
