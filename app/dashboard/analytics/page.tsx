"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Download, FileText, RefreshCw, TrendingUp, Calendar, ImportIcon as Export } from "lucide-react"

// Mock analytics data
const analyticsData = {
  overview: {
    reach: "525K",
    engagement: "48.2K",
    engagementChange: "+10%",
    growth: "+7.5%",
    growthPeriod: "7 days",
  },
  engagementCurve: [
    { date: "May 15", value: 3200 },
    { date: "May 16", value: 3400 },
    { date: "May 17", value: 3100 },
    { date: "May 18", value: 3600 },
    { date: "May 19", value: 4200 },
    { date: "May 20", value: 4800 },
    { date: "May 21", value: 5200 },
  ],
  topPosts: [
    {
      id: 1,
      date: "May 21",
      time: "12:45 PM",
      engagement: "125.6K",
      change: "+12.5%",
      thumbnail: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      date: "May 20",
      time: "10:00 AM",
      engagement: "110.2K",
      change: "+10.0%",
      thumbnail: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      date: "May 19",
      time: "1:30 PM",
      engagement: "95.8K",
      change: "+8.5%",
      thumbnail: "/placeholder.svg?height=40&width=40",
    },
  ],
  audienceBreakdown: {
    instagram: 40,
    youtube: 35,
    tiktok: 25,
  },
  abTests: [
    {
      testName: "Call to Action",
      variantA: "None",
      variantB: "Explicit",
      resultA: "1.8%",
      resultB: "3.2%",
      winner: "B",
      improvement: "+77.8%",
    },
    {
      testName: "Content Type",
      variantA: "Photo",
      variantB: "Carousel",
      resultA: "2.9%",
      resultB: "4.1%",
      winner: "B",
      improvement: "+41.4%",
    },
  ],
  singlePost: {
    id: "#56",
    engagement: "8.9%",
    reach: "74.5K",
    likes: "9.1K",
    comments: "624",
    shares: "825",
    thumbnail: "/placeholder.svg?height=60&width=60",
  },
  recommendations: ["Experiment with carousel posts", "Post more frequently on YouTube", "Try an evening posting time"],
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("week")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Analytics Agent</h1>
              <p className="text-muted-foreground">Analyzes content performance and surfaces insights</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="w-4 h-4 mr-2" />
            Create Report
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex space-x-4">
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Select dates
              </Button>
              <Button variant="outline" size="sm">
                <Export className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Next update in 0:26</span>
              </div>
              <span className="text-sm text-gray-500">Last updated: 19:58:59</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gray-900 text-white">
          <CardContent className="pt-6">
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-2">Reach</h3>
              <p className="text-3xl font-bold">{analyticsData.overview.reach}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 text-white">
          <CardContent className="pt-6">
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-2">Engagement</h3>
              <p className="text-3xl font-bold">{analyticsData.overview.engagement}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                <span className="text-sm text-green-400">{analyticsData.overview.engagementChange}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 text-white">
          <CardContent className="pt-6">
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-2">Growth</h3>
              <p className="text-3xl font-bold">{analyticsData.overview.growth}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                <span className="text-sm text-green-400">{analyticsData.overview.growthPeriod}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Engagement Curve */}
        <Card className="bg-gray-900 text-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Engagement Curve</CardTitle>
                <p className="text-sm text-green-400">+59.4% trend</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="bg-orange-500 text-white border-orange-500">
                  📈
                </Button>
                <Button variant="outline" size="sm" className="text-white border-gray-600">
                  📊
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-end space-x-2">
              {analyticsData.engagementCurve.map((point, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-blue-500 rounded-t"
                    style={{ height: `${(point.value / 6000) * 100}%` }}
                  ></div>
                  <span className="text-xs text-gray-400 mt-2">{point.date.split(" ")[1]}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analyticsData.recommendations.map((rec, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm">{rec}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Audience Breakdown */}
        <Card className="bg-gray-900 text-white">
          <CardHeader>
            <CardTitle className="text-white">Audience Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#ec4899"
                    strokeWidth="20"
                    strokeDasharray={`${analyticsData.audienceBreakdown.instagram * 2.51} 251`}
                    strokeDashoffset="0"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="20"
                    strokeDasharray={`${analyticsData.audienceBreakdown.youtube * 2.51} 251`}
                    strokeDashoffset={`-${analyticsData.audienceBreakdown.instagram * 2.51}`}
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="20"
                    strokeDasharray={`${analyticsData.audienceBreakdown.tiktok * 2.51} 251`}
                    strokeDashoffset={`-${(analyticsData.audienceBreakdown.instagram + analyticsData.audienceBreakdown.youtube) * 2.51}`}
                  />
                </svg>
              </div>
            </div>
            <div className="flex justify-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                <span className="text-sm text-white">Instagram</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                <span className="text-sm text-white">YouTube</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-white">TikTok</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Posts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Top Posts</CardTitle>
              <Button variant="outline" size="sm">
                <Export className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.topPosts.map((post) => (
                <div key={post.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img src={post.thumbnail || "/placeholder.svg"} alt="Post" className="w-10 h-10 rounded" />
                    <div>
                      <p className="font-medium">{post.date}</p>
                      <p className="text-sm text-gray-500">{post.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{post.engagement}</p>
                    <p className="text-sm text-green-600">{post.change}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* A/B Test Results */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>A/B Test Results</CardTitle>
            <Button variant="outline" size="sm">
              <Export className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
          <p className="text-sm text-gray-500">Performance data from Scheduler tags</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3">Test Name</th>
                  <th className="text-left py-3">Variant A</th>
                  <th className="text-left py-3">Variant B</th>
                  <th className="text-left py-3">Result A</th>
                  <th className="text-left py-3">Result B</th>
                  <th className="text-left py-3">Winner</th>
                  <th className="text-left py-3">Improvement</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.abTests.map((test, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3">{test.testName}</td>
                    <td className="py-3">{test.variantA}</td>
                    <td className="py-3">{test.variantB}</td>
                    <td className="py-3">{test.resultA}</td>
                    <td className="py-3">{test.resultB}</td>
                    <td className="py-3">
                      <Badge className="bg-orange-500 text-white">Variant {test.winner}</Badge>
                    </td>
                    <td className="py-3 text-green-600">{test.improvement}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Single Post Analytics */}
      <Card className="bg-gray-900 text-white">
        <CardHeader>
          <CardTitle className="text-white">Single Post Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-6 mb-6">
            <img
              src={analyticsData.singlePost.thumbnail || "/placeholder.svg"}
              alt="Post"
              className="w-16 h-16 rounded"
            />
            <div>
              <h3 className="text-xl font-bold">{analyticsData.singlePost.id}</h3>
              <p className="text-green-400">Engagement {analyticsData.singlePost.engagement}</p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-6">
            <div>
              <h4 className="text-sm text-gray-300 mb-1">Reach</h4>
              <p className="text-2xl font-bold">{analyticsData.singlePost.reach}</p>
            </div>
            <div>
              <h4 className="text-sm text-gray-300 mb-1">Likes</h4>
              <p className="text-2xl font-bold">{analyticsData.singlePost.likes}</p>
            </div>
            <div>
              <h4 className="text-sm text-gray-300 mb-1">Comments</h4>
              <p className="text-2xl font-bold">{analyticsData.singlePost.comments}</p>
            </div>
            <div>
              <h4 className="text-sm text-gray-300 mb-1">Shares</h4>
              <p className="text-2xl font-bold">{analyticsData.singlePost.shares}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
