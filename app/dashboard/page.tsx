import { MetricsCards } from "@/components/dashboard/metrics-cards"
import { RecentPosts } from "@/components/dashboard/recent-posts"
import { PlatformBreakdown } from "@/components/dashboard/platform-breakdown"

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <MetricsCards />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentPosts />
        <PlatformBreakdown />
      </div>
    </div>
  )
}
