"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Plus, Download, Instagram, Youtube, Zap } from "lucide-react"

// Mock data for scheduled posts
const scheduledPosts = [
  {
    id: 1,
    platform: "youtube",
    title: "Watch my new gaming setup reveal!",
    scheduledTime: "2024-01-15T10:00:00",
    status: "scheduled",
    thumbnail: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 2,
    platform: "instagram",
    title: "Morning motivation session 💪",
    scheduledTime: "2024-01-16T08:00:00",
    status: "scheduled",
    thumbnail: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 3,
    platform: "instagram",
    title: "Enjoying some quality time with friends",
    scheduledTime: "2024-01-17T15:30:00",
    status: "scheduled",
    thumbnail: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 4,
    platform: "tiktok",
    title: "Wrapping up the week with this amazing view",
    scheduledTime: "2024-01-19T18:00:00",
    status: "scheduled",
    thumbnail: "/placeholder.svg?height=60&width=60",
  },
]

const weekDays = [
  { day: "Mon", date: "Monday", posts: 1 },
  { day: "Tue", date: "Tuesday", posts: 1 },
  { day: "Wed", date: "Wednesday", posts: 1 },
  { day: "Thu", date: "Thursday", posts: 0 },
  { day: "Fri", date: "Friday", posts: 1 },
  { day: "Sat", date: "Saturday", posts: 1 },
  { day: "Sun", date: "Sunday", posts: 0 },
]

const platformIcons = {
  youtube: Youtube,
  instagram: Instagram,
  tiktok: Zap,
}

const platformColors = {
  youtube: "bg-red-500",
  instagram: "bg-pink-500",
  tiktok: "bg-black",
}

export default function SchedulePage() {
  const [selectedPlatform, setSelectedPlatform] = useState("all")

  const filteredPosts =
    selectedPlatform === "all" ? scheduledPosts : scheduledPosts.filter((post) => post.platform === selectedPlatform)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3">
            <Calendar className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Content Scheduler</h1>
              <p className="text-muted-foreground">Plan, organize and optimize your content across all platforms</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            CSV Import
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Content
          </Button>
        </div>
      </div>

      {/* Account and Platform Selection */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Account:</label>
              <select className="px-3 py-2 border border-gray-300 rounded-lg bg-black text-white">
                <option>@creator_gaming</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Platform TZ</span>
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Schedule */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Weekly Schedule</CardTitle>
            <div className="flex space-x-2">
              <Button
                variant={selectedPlatform === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPlatform("all")}
              >
                All
              </Button>
              <Button
                variant={selectedPlatform === "youtube" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPlatform("youtube")}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                YouTube
              </Button>
              <Button
                variant={selectedPlatform === "instagram" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPlatform("instagram")}
                className="bg-pink-500 hover:bg-pink-600 text-white"
              >
                Instagram
              </Button>
              <Button
                variant={selectedPlatform === "tiktok" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPlatform("tiktok")}
                className="bg-black hover:bg-gray-800 text-white"
              >
                TikTok
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-4">
            {weekDays.map((day, index) => (
              <div key={day.day} className="text-center">
                <div className="font-semibold text-lg mb-2">{day.day}</div>
                <div className="text-sm text-gray-500 mb-4">{day.date}</div>
                <div className="text-blue-500 text-sm mb-4">
                  {day.posts} post{day.posts !== 1 ? "s" : ""}
                </div>

                {/* Sample scheduled posts for specific days */}
                {index === 0 && (
                  <Card className="border-red-200 bg-red-50">
                    <CardContent className="p-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <Youtube className="w-4 h-4 text-red-500" />
                        <span className="text-xs text-red-600">YouTube</span>
                      </div>
                      <p className="text-xs text-gray-700 line-clamp-2">Watch my new gaming setup...</p>
                    </CardContent>
                  </Card>
                )}

                {index === 2 && (
                  <Card className="border-pink-200 bg-pink-50">
                    <CardContent className="p-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <Instagram className="w-4 h-4 text-pink-500" />
                        <span className="text-xs text-pink-600">Instagram</span>
                      </div>
                      <p className="text-xs text-gray-700 line-clamp-2">Morning motivation...</p>
                    </CardContent>
                  </Card>
                )}

                {index === 4 && (
                  <Card className="border-pink-200 bg-pink-50">
                    <CardContent className="p-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <Instagram className="w-4 h-4 text-pink-500" />
                        <span className="text-xs text-pink-600">Instagram</span>
                      </div>
                      <p className="text-xs text-gray-700 line-clamp-2">Enjoying some quality...</p>
                    </CardContent>
                  </Card>
                )}

                {index === 5 && (
                  <Card className="border-gray-200 bg-gray-50">
                    <CardContent className="p-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <Zap className="w-4 h-4 text-black" />
                        <span className="text-xs text-gray-600">TikTok</span>
                      </div>
                      <p className="text-xs text-gray-700 line-clamp-2">Wrapping up the week...</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scheduled Posts List */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPosts.map((post) => {
              const PlatformIcon = platformIcons[post.platform as keyof typeof platformIcons]
              const platformColor = platformColors[post.platform as keyof typeof platformColors]

              return (
                <div key={post.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50">
                  <img
                    src={post.thumbnail || "/placeholder.svg"}
                    alt="Post thumbnail"
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <PlatformIcon className="w-4 h-4" />
                      <Badge variant="secondary" className={`${platformColor} text-white`}>
                        {post.platform.charAt(0).toUpperCase() + post.platform.slice(1)}
                      </Badge>
                    </div>
                    <h3 className="font-medium text-gray-900">{post.title}</h3>
                    <p className="text-sm text-gray-500">
                      Scheduled for {new Date(post.scheduledTime).toLocaleDateString()} at{" "}
                      {new Date(post.scheduledTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    {post.status}
                  </Badge>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
