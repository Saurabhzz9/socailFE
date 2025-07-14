"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Download,
  FileText,
  RefreshCw,
  TrendingUp,
  Calendar,
  ImportIcon as Export,
  Eye,
  Heart,
  MessageSquare,
  Share2,
  Users,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Enhanced mock analytics data
const analyticsData = {
  overview: {
    reach: "2.4M",
    engagement: "186K",
    engagementChange: "+23.4%",
    growth: "+15.8%",
    growthPeriod: "30 days",
    posts: "47",
    followers: "125K",
  },

  engagementTrend: [
    {
      date: "Dec 1",
      engagement: 12400,
      reach: 45000,
      likes: 2100,
      comments: 340,
      shares: 180,
    },
    {
      date: "Dec 5",
      engagement: 15200,
      reach: 52000,
      likes: 2650,
      comments: 420,
      shares: 220,
    },
    {
      date: "Dec 10",
      engagement: 18900,
      reach: 68000,
      likes: 3200,
      comments: 580,
      shares: 290,
    },
    {
      date: "Dec 15",
      engagement: 22100,
      reach: 78000,
      likes: 3850,
      comments: 680,
      shares: 340,
    },
    {
      date: "Dec 20",
      engagement: 19800,
      reach: 71000,
      likes: 3420,
      comments: 590,
      shares: 310,
    },
    {
      date: "Dec 25",
      engagement: 25600,
      reach: 89000,
      likes: 4100,
      comments: 750,
      shares: 420,
    },
    {
      date: "Dec 30",
      engagement: 31200,
      reach: 105000,
      likes: 4850,
      comments: 890,
      shares: 520,
    },
  ],

  platformBreakdown: [
    { platform: "Instagram", users: 45200, color: "#E1306C", percentage: 42 },
    { platform: "TikTok", users: 32800, color: "#000000", percentage: 31 },
    { platform: "YouTube", users: 18900, color: "#FF0000", percentage: 18 },
    { platform: "Twitter", users: 9100, color: "#1DA1F2", percentage: 9 },
  ],

  contentPerformance: [
    { type: "Reels", posts: 15, avgEngagement: 4.2, reach: 340000 },
    { type: "Carousel", posts: 12, avgEngagement: 3.8, reach: 280000 },
    { type: "Single Photo", posts: 18, avgEngagement: 2.1, reach: 210000 },
    { type: "Stories", posts: 22, avgEngagement: 1.8, reach: 120000 },
  ],

  hourlyEngagement: [
    { hour: "6AM", engagement: 850 },
    { hour: "9AM", engagement: 2100 },
    { hour: "12PM", engagement: 3200 },
    { hour: "3PM", engagement: 4100 },
    { hour: "6PM", engagement: 5200 },
    { hour: "9PM", engagement: 4800 },
    { hour: "12AM", engagement: 2200 },
  ],

  topPosts: [
    {
      id: 1,
      date: "Dec 28",
      time: "6:30 PM",
      engagement: "47.2K",
      change: "+28.5%",
      platform: "Instagram",
      type: "Reel",
      thumbnail: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      date: "Dec 25",
      time: "2:15 PM",
      engagement: "38.9K",
      change: "+21.2%",
      platform: "TikTok",
      type: "Video",
      thumbnail: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      date: "Dec 22",
      time: "11:45 AM",
      engagement: "29.1K",
      change: "+18.7%",
      platform: "Instagram",
      type: "Carousel",
      thumbnail: "/placeholder.svg?height=40&width=40",
    },
  ],

  recommendations: [
    "Peak engagement occurs at 6PM - schedule more content during this time",
    "Reels generate 2.3x more engagement than static posts",
    "TikTok audience engagement is 15% higher on weekends",
    "Carousel posts have the highest conversion rate at 3.8%",
  ],
};

const COLORS = ["#a855f7", "#ec4899", "#f59e0b", "#06b6d4", "#10b981"];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("month");
  const [selectedMetric, setSelectedMetric] = useState("engagement");

  return (
    <div className="min-h-screen bg-background p-6 space-y-6 text-foreground">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-accent rounded-xl">
              <BarChart3 className="w-8 h-8 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-primary">
                Analytics Dashboard
              </h1>
              <p className="text-muted-foreground">
                Track your social media performance
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <FileText className="w-4 h-4 mr-2" />
            Report
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-cawar-card border-white/10 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm font-medium">
                  Total Reach
                </p>
                <p className="text-3xl font-bold text-white">
                  {analyticsData.overview.reach}
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400 mr-1" />
                  <span className="text-emerald-400 text-sm">
                    {analyticsData.overview.growth}
                  </span>
                </div>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-full">
                <Eye className="w-6 h-6 text-purple-300" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-cawar-card border-white/10 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm font-medium">
                  Engagement
                </p>
                <p className="text-3xl font-bold text-white">
                  {analyticsData.overview.engagement}
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400 mr-1" />
                  <span className="text-emerald-400 text-sm">
                    {analyticsData.overview.engagementChange}
                  </span>
                </div>
              </div>
              <div className="p-3 bg-pink-500/20 rounded-full">
                <Heart className="w-6 h-6 text-pink-300" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-cawar-card border-white/10 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm font-medium">Followers</p>
                <p className="text-3xl font-bold text-white">
                  {analyticsData.overview.followers}
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400 mr-1" />
                  <span className="text-emerald-400 text-sm">+5.2%</span>
                </div>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-full">
                <Users className="w-6 h-6 text-blue-300" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-cawar-card border-white/10 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm font-medium">
                  Posts Published
                </p>
                <p className="text-3xl font-bold text-white">
                  {analyticsData.overview.posts}
                </p>
                <div className="flex items-center mt-2">
                  <Calendar className="w-4 h-4 text-amber-400 mr-1" />
                  <span className="text-amber-400 text-sm">This month</span>
                </div>
              </div>
              <div className="p-3 bg-amber-500/20 rounded-full">
                <FileText className="w-6 h-6 text-amber-300" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Engagement Trend Chart */}
        <Card className="bg-gradient-cawar-card border-white/10 text-white">
          <CardHeader className="border-b border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white text-xl">
                  Engagement Trend
                </CardTitle>
                <p className="text-purple-200 text-sm">
                  30-day performance overview
                </p>
              </div>
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                +23.4% growth
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analyticsData.engagementTrend}>
                <defs>
                  <linearGradient
                    id="engagementGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#e2e8f0", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#e2e8f0", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e1f2e",
                    border: "1px solid #a855f7",
                    borderRadius: "8px",
                    color: "#ffffff",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="engagement"
                  stroke="#a855f7"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#engagementGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Platform Breakdown */}
        <Card className="bg-gradient-cawar-card border-white/10 text-white">
          <CardHeader className="border-b border-white/10">
            <CardTitle className="text-white text-xl">
              Platform Distribution
            </CardTitle>
            <p className="text-purple-200 text-sm">Audience across platforms</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-center mb-6">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={analyticsData.platformBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="users"
                  >
                    {analyticsData.platformBreakdown.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e1f2e",
                      border: "1px solid #a855f7",
                      borderRadius: "8px",
                      color: "#ffffff",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {analyticsData.platformBreakdown.map((platform, index) => (
                <div
                  key={platform.platform}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-white">{platform.platform}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-medium">
                      {platform.users.toLocaleString()}
                    </div>
                    <div className="text-purple-200 text-sm">
                      {platform.percentage}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Performance */}
        <Card className="bg-gradient-cawar-card border-white/10 text-white">
          <CardHeader className="border-b border-white/10">
            <CardTitle className="text-white text-xl">
              Content Performance
            </CardTitle>
            <p className="text-purple-200 text-sm">
              Engagement by content type
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={analyticsData.contentPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis
                  dataKey="type"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#e2e8f0", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#e2e8f0", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e1f2e",
                    border: "1px solid #a855f7",
                    borderRadius: "8px",
                    color: "#ffffff",
                  }}
                />
                <Bar
                  dataKey="avgEngagement"
                  fill="#ec4899"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Hourly Engagement */}
        <Card className="bg-gradient-cawar-card border-white/10 text-white">
          <CardHeader className="border-b border-white/10">
            <CardTitle className="text-white text-xl">
              Best Posting Times
            </CardTitle>
            <p className="text-purple-200 text-sm">Engagement by hour</p>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={analyticsData.hourlyEngagement}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis
                  dataKey="hour"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#e2e8f0", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#e2e8f0", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e1f2e",
                    border: "1px solid #a855f7",
                    borderRadius: "8px",
                    color: "#ffffff",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="engagement"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={{ fill: "#f59e0b", strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Posts */}
        <Card className="bg-gradient-cawar-card border-white/10 text-white">
          <CardHeader className="border-b border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white text-xl">
                  Top Performing Posts
                </CardTitle>
                <p className="text-purple-200 text-sm">
                  Your best content this month
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Export className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {analyticsData.topPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={post.thumbnail || "/placeholder.svg"}
                      alt="Post"
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-white">{post.date}</p>
                        <Badge className="bg-purple-500/20 text-purple-300 text-xs">
                          {post.platform}
                        </Badge>
                      </div>
                      <p className="text-sm text-purple-200">
                        {post.time} • {post.type}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white">{post.engagement}</p>
                    <p className="text-sm text-emerald-400">{post.change}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Recommendations */}
        <Card className="bg-gradient-cawar-card border-white/10 text-white">
          <CardHeader className="border-b border-white/10">
            <CardTitle className="text-white text-xl flex items-center">
              <span className="mr-2">🤖</span>
              AI Recommendations
            </CardTitle>
            <p className="text-purple-200 text-sm">
              Data-driven insights for growth
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {analyticsData.recommendations.map((rec, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-white leading-relaxed">{rec}</p>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4 bg-gradient-cawar-purple text-white hover:opacity-90">
              Get More Insights
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
