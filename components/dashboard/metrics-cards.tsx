import { TrendingUp, Share2, Users, BarChart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const metrics = [
  {
    title: "POSTS",
    subtitle: "Total posts across platforms",
    value: "382",
    change: "+3.2%",
    changeType: "positive",
    icon: BarChart,
  },
  {
    title: "REACH",
    subtitle: "Total audience reach",
    value: "525K",
    change: "+17.8%",
    changeType: "positive",
    icon: Share2,
  },
  {
    title: "ENGAGEMENT",
    subtitle: "Likes, comments, shares",
    value: "48.2K",
    change: "+5.1%",
    changeType: "positive",
    icon: Users,
  },
  {
    title: "GROWTH",
    subtitle: "Followers growth rate",
    value: "+7.5%",
    change: "+2.1%",
    changeType: "positive",
    icon: TrendingUp,
  },
]

export function MetricsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric) => (
        <Card key={metric.title} className="p-6">
          <CardContent className="p-0">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{metric.title}</p>
                <p className="text-sm text-gray-600">{metric.subtitle}</p>
                <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span className="text-sm font-medium text-green-600">{metric.change}</span>
                </div>
              </div>
              <div className="p-2 bg-gray-50 rounded-lg">
                <metric.icon className="w-5 h-5 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
