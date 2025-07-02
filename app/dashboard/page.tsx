"use client"

import { useEffect, useState } from "react"
import { fetchInstagramUserInfo } from "@/lib/api"
import { MetricsCards } from "@/components/dashboard/metrics-cards"
import { RecentPosts } from "@/components/dashboard/recent-posts"
import { PlatformBreakdown } from "@/components/dashboard/platform-breakdown"

export default function DashboardPage() {
  const [userInfo, setUserInfo] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchInstagramUserInfo("lexfridman")
        console.log("Fetched user info:", data)
        setUserInfo(data)
      } catch (err) {
        console.error(err)
        setError("Failed to load user info")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) return <p className="text-center">Loading dashboard...</p>
  if (error) return <p className="text-center text-red-600">{error}</p>

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <MetricsCards />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {userInfo ? (
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">User Info</h2>
            <p><strong>Username:</strong> {userInfo.Username}</p>
            <p><strong>Full Name:</strong> {userInfo.FullName}</p>
            <p><strong>Followers:</strong> {userInfo.FollowersCount}</p>
            <p><strong>Posts:</strong> {userInfo.PostsCount}</p>
          </div>
        ) : (
          <div className="bg-white p-4 rounded-lg shadow">
            <p>No user info available.</p>
          </div>
        )}

        <PlatformBreakdown />
      </div>

      <RecentPosts />
    </div>
  )
}
