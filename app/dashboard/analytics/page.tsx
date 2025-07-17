"use client";
import { useState, useEffect } from "react";
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
import { useAuth } from "@/context/AuthContext";
import { startOfToday, startOfWeek, endOfWeek, subWeeks, subMonths, subYears, format } from "date-fns";

const PLATFORMS = [
  { label: "All", value: "all" },
  { label: "Facebook", value: "facebook" },
  { label: "Instagram", value: "instagram" },
  { label: "YouTube", value: "youtube" },
];

const USER_ID = 1; // TODO: Replace with real user ID from auth context

const METRIC_LABELS = {
  page_impressions: "Total Reach",
  page_engaged_users: "Engagement",
  page_fans: "Followers",
  posts_published: "Posts Published",
};

const METRIC_KEYS = {
  page_impressions: "page_impressions",
  page_engaged_users: "page_engaged_users",
  page_fans: "page_fans",
  posts_published: "posts_published",
};

export default function AnalyticsPage() {
  const { token } = useAuth();
  const [platform, setPlatform] = useState("all");
  const [since, setSince] = useState("");
  const [until, setUntil] = useState("");
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const quickRanges = [
    { label: "Today", value: "today" },
    { label: "This Week", value: "this_week" },
    { label: "Last Week", value: "last_week" },
    { label: "Last 6 Months", value: "last_6_months" },
    { label: "Last 1 Year", value: "last_1_year" },
  ];
  const [selectedRange, setSelectedRange] = useState("today");

  // Set default date to today on mount
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    setSince(today);
    setUntil(today);
  }, []);

  // Helper to set since/until based on dropdown
  useEffect(() => {
    const today = startOfToday();
    let since = format(today, "yyyy-MM-dd");
    let until = format(today, "yyyy-MM-dd");
    if (selectedRange === "this_week") {
      since = format(startOfWeek(today, { weekStartsOn: 1 }), "yyyy-MM-dd");
      until = format(endOfWeek(today, { weekStartsOn: 1 }), "yyyy-MM-dd");
    } else if (selectedRange === "last_week") {
      const lastWeekStart = startOfWeek(subWeeks(today, 1), { weekStartsOn: 1 });
      const lastWeekEnd = endOfWeek(subWeeks(today, 1), { weekStartsOn: 1 });
      since = format(lastWeekStart, "yyyy-MM-dd");
      until = format(lastWeekEnd, "yyyy-MM-dd");
    } else if (selectedRange === "last_6_months") {
      since = format(subMonths(today, 6), "yyyy-MM-dd");
      until = format(today, "yyyy-MM-dd");
    } else if (selectedRange === "last_1_year") {
      since = format(subYears(today, 1), "yyyy-MM-dd");
      until = format(today, "yyyy-MM-dd");
    }
    setSince(since);
    setUntil(until);
  }, [selectedRange]);

  // Only fetch analytics when token and dates are set, and only once per change
  useEffect(() => {
    if (!token || !since || !until) return;
    setLoading(true);
    let url = "/api/v1/analytics/combined";
    if (platform === "facebook") url = "/api/v1/analytics/facebook";
    try {
      fetch(`${url}?since=${since}&until=${until}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then(setAnalytics);
    } catch (e) {
      setAnalytics(null);
    }
    setLoading(false);
  }, [since, until, token, platform]);

  // Helper to get today's analytics row
  // Use analytics summary object directly
  const summaryAnalytics = analytics || {};

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

      {/* Platform Dropdown */}
      <label className="font-medium">Platform:</label>
      <select
        className="bg-accent text-foreground rounded px-3 py-2"
        value={platform}
        onChange={e => setPlatform(e.target.value)}
      >
        <option value="all">All</option>
        <option value="facebook">Facebook</option>
        <option value="instagram">Instagram</option>
        <option value="youtube">YouTube</option>
      </select>
      {loading && <span className="ml-2 text-sm text-muted-foreground">Loading...</span>}

      {/* Date Picker */}
      <div className="mb-4 flex items-center space-x-4">
        <label className="font-medium">Range:</label>
        <select
          value={selectedRange}
          onChange={e => setSelectedRange(e.target.value)}
          className="rounded px-3 py-2 bg-accent text-foreground border border-white/10"
        >
          {quickRanges.map(r => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
      </div>

      {/* Date Range Display */}
      {summaryAnalytics?.date_range && (
        <div className="mb-4 text-sm text-muted-foreground">
          Showing analytics from <span className="font-semibold">{summaryAnalytics.date_range.since}</span> to <span className="font-semibold">{summaryAnalytics.date_range.until}</span>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(METRIC_LABELS).map(([key, label]) => (
          <div key={key} className="p-6 bg-gradient-cawar-card border-white/10 text-white rounded-xl flex flex-col justify-between">
            <div>
              <p className="text-purple-200 text-sm font-medium">{label}</p>
              <p className="text-3xl font-bold text-white">
                {loading ? <span className="text-muted-foreground">...</span> : (summaryAnalytics?.[METRIC_KEYS[key as keyof typeof METRIC_KEYS]] ?? <span className="text-muted-foreground">-</span>)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
