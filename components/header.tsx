import { Bell, Settings, User, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-600">Welcome back to Quolo</p>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" className="text-sm">
            <Zap className="w-4 h-4 mr-2" />
            Quick actions
            <span className="ml-2 text-xs bg-gray-100 px-1.5 py-0.5 rounded">⌘</span>
          </Button>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm">
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
