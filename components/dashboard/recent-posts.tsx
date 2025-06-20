import { ExternalLink, Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function RecentPosts() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center space-x-2">
          <CardTitle className="text-lg font-semibold">Recent Posts</CardTitle>
          <Info className="w-4 h-4 text-gray-400" />
        </div>
        <Button variant="ghost" size="sm" className="text-sm text-gray-600">
          View All
          <ExternalLink className="w-4 h-4 ml-1" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <div className="text-lg font-medium text-gray-900 mb-2">Recent Posts</div>
          <div className="text-sm text-gray-500">Post engagement across platforms</div>

          {/* Placeholder for chart */}
          <div className="mt-8 h-32 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-gray-400 text-sm">Chart visualization area</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
