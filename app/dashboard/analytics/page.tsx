"use client";
import { useEffect, useState } from "react";
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
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);
      let url = "/api/v1/analytics/combined";
      if (platform === "facebook") url = "/api/v1/analytics/facebook";
      try {
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setAnalytics(Array.isArray(data) ? data : []);
      } catch (e) {
        setAnalytics([]);
      }
      setLoading(false);
    }
    if (token) fetchAnalytics();
  }, [platform, token]);

  // Helper to get today's analytics row
  function getTodayAnalytics() {
    const today = new Date().toISOString().slice(0, 10);
    return analytics.find(a => (a.date || a.Date)?.slice(0, 10) === today);
  }
  const todayAnalytics = getTodayAnalytics();

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
      <div className="mb-4 flex items-center space-x-4">
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
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(METRIC_LABELS).map(([key, label]) => (
          <div key={key} className="p-6 bg-gradient-cawar-card border-white/10 text-white rounded-xl flex flex-col justify-between">
            <div>
              <p className="text-purple-200 text-sm font-medium">{label}</p>
              <p className="text-3xl font-bold text-white">
                {loading ? <span className="text-muted-foreground">...</span> : (todayAnalytics?.[METRIC_KEYS[key as keyof typeof METRIC_KEYS]] ?? <span className="text-muted-foreground">-</span>)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
