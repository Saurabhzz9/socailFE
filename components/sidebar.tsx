"use client"
import {
  Home,
  BarChart3,
  Calendar,
  Instagram,
  Youtube,
  Zap,
  Shield,
  TrendingUp,
  MessageCircle,
  Heart,
  Users,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", icon: Home, current: true },
  { name: "Analytics", icon: BarChart3, current: false },
  { name: "Schedule", icon: Calendar, current: false },
]

const agents = [
  { name: "Backup Agent", icon: Shield, active: true },
  { name: "Trend Agent", icon: TrendingUp, active: true },
  { name: "Outreach Agent", icon: MessageCircle, active: true },
  { name: "IG Warmer", icon: Heart, active: true },
  { name: "IG Support", icon: Users, active: true },
]

const connections = [
  { name: "Instagram", icon: Instagram },
  { name: "YouTube", icon: Youtube },
  { name: "TikTok", icon: Zap },
]

export function Sidebar() {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">Q</span>
          </div>
          <span className="text-xl font-semibold text-gray-900">Quolo</span>
          <span className="text-xs bg-gray-100 px-2 py-1 rounded">⌘K</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-8">
        <div>
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <a
                  href="#"
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    item.current ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  )}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Agents */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">AGENTS</h3>
          <ul className="space-y-2">
            {agents.map((agent) => (
              <li key={agent.name}>
                <a
                  href="#"
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                  <agent.icon className="w-5 h-5 mr-3" />
                  {agent.name}
                  {agent.active && <div className="ml-auto w-2 h-2 bg-green-500 rounded-full"></div>}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Connections */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">CONNECTIONS</h3>
          <ul className="space-y-2">
            {connections.map((connection) => (
              <li key={connection.name}>
                <a
                  href="#"
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                  <connection.icon className="w-5 h-5 mr-3" />
                  {connection.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  )
}
