"use client";
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
  HardDrive,
  ChevronLeft,
  ChevronRight,
  Settings as SettingsIcon,
  Database,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

const navigation = [
  { name: "Dashboard", icon: Home, href: "/dashboard", current: false },
  {
    name: "Analytics",
    icon: BarChart3,
    href: "/dashboard/analytics",
    current: false,
  },
  {
    name: "Schedule",
    icon: Calendar,
    href: "/dashboard/schedule",
    current: false,
  },
  {
    name: "Backup Manager",
    icon: Database,
    href: "/dashboard/backup",
    current: false,
  },
  {
    name: "Settings",
    icon: SettingsIcon,
    href: "/dashboard/settings",
    current: false,
  },
];

const agents = [
  { name: "Backup Agent", icon: Shield, active: true },
  { name: "Trend Agent", icon: TrendingUp, active: true },
  { name: "Outreach Agent", icon: MessageCircle, active: true },
  { name: "IG Warmer", icon: Heart, active: true },
  { name: "IG Support", icon: Users, active: true },
];

const tools = [
  {
    name: "Instagram Downloader",
    icon: Instagram,
    href: "/dashboard/instagram",
  },
  { name: "Drive Downloads", icon: HardDrive, href: "/dashboard/drive" },
];

const adminTools = [
  { name: "Admin Panel", icon: SettingsIcon, href: "/dashboard/admin" },
];

const connections = [
  { name: "Instagram", icon: Instagram },
  { name: "YouTube", icon: Youtube },
  { name: "TikTok", icon: Zap },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={cn(
        "bg-white border-r border-gray-200 flex flex-col transition-all duration-300 relative",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-6 z-10 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4 text-gray-600" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        )}
      </button>

      {/* Logo */}
      <div className="p-6 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">Q</span>
          </div>
          {!isCollapsed && (
            <span className="text-xl font-semibold text-gray-900">Quolo</span>
          )}
        </div>
      </div>

      {/* Scrollable Navigation */}
      <div className="flex-1 overflow-y-auto">
        <nav className="px-4 py-6 space-y-8">
          <div>
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                      pathname === item.href
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                    )}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {!isCollapsed && item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools */}
          <div>
            {!isCollapsed && (
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                TOOLS
              </h3>
            )}
            <ul className="space-y-2">
              {tools.map((tool) => (
                <li key={tool.name}>
                  <Link
                    href={tool.href}
                    className={cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                      pathname === tool.href
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                    )}
                    title={isCollapsed ? tool.name : undefined}
                  >
                    <tool.icon className="w-5 h-5 mr-3" />
                    {!isCollapsed && tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Agents */}
          <div>
            {!isCollapsed && (
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                AGENTS
              </h3>
            )}
            <ul className="space-y-2">
              {agents.map((agent) => (
                <li key={agent.name}>
                  <a
                    href="#"
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    title={isCollapsed ? agent.name : undefined}
                  >
                    <agent.icon className="w-5 h-5 mr-3" />
                    {!isCollapsed && agent.name}
                    {agent.active && !isCollapsed && (
                      <div className="ml-auto w-2 h-2 bg-green-500 rounded-full"></div>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Admin Tools */}
          <div>
            {!isCollapsed && (
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                ADMIN
              </h3>
            )}
            <ul className="space-y-2">
              {adminTools.map((tool) => (
                <li key={tool.name}>
                  <Link
                    href={tool.href}
                    className={cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                      pathname === tool.href
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                    )}
                    title={isCollapsed ? tool.name : undefined}
                  >
                    <tool.icon className="w-5 h-5 mr-3" />
                    {!isCollapsed && tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connections */}
          <div>
            {!isCollapsed && (
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                CONNECTIONS
              </h3>
            )}
            <ul className="space-y-2">
              {connections.map((connection) => (
                <li key={connection.name}>
                  <a
                    href="#"
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    title={isCollapsed ? connection.name : undefined}
                  >
                    <connection.icon className="w-5 h-5 mr-3" />
                    {!isCollapsed && connection.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
}
