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
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { parseJwt } from "@/lib/utils";

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
    name: "Connections",
    icon: Users,
    href: "/dashboard/connections",
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

const platformConnections = [
  { name: "Instagram", icon: Instagram, key: "instagram" },
  { name: "Google Drive", icon: HardDrive, key: "google_drive" },
  { name: "Facebook", icon: Users, key: "facebook" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout, token } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStatus() {
      if (!token) return;
      setLoading(true);
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
        const res = await fetch(`${API_BASE}/api/v1/social/status`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        let data = null;
        if (res.ok) {
          data = await res.json();
        }
        // Google Drive: check connection using the same logic as AccountManager
        let driveConnected = false;
        let driveStatus = null;
        const userId = token ? parseJwt(token).user_id : undefined;
        if (userId) {
          const driveRes = await fetch(`${API_BASE}/api/v1/instagram/check-drive-connection`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ user_id: userId }),
          });
          if (driveRes.ok) {
            driveStatus = await driveRes.json();
            driveConnected = driveStatus.status === "FULLY_CONNECTED" && driveStatus.has_access_token && !driveStatus.is_expired;
          }
        }
        setStatus({
          ...data,
          google_drive: {
            ...(data?.google_drive || {}),
            connected: driveConnected,
            status: driveStatus,
          },
        });
      } catch (e) {
        setStatus(null);
      } finally {
        setLoading(false);
      }
    }
    fetchStatus();
  }, [token]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const NavItem = ({ item, isActive }: { item: any; isActive: boolean }) => (
    <Link
      href={item.href}
      className={cn(
        "flex items-center text-sm font-medium rounded-xl transition-all duration-200 group relative",
        isCollapsed ? "px-3 py-3 justify-center" : "px-4 py-3",
        isActive
          ? "bg-primary text-primary-foreground shadow-lg"
          : "text-muted-foreground hover:bg-accent hover:text-foreground",
      )}
      title={isCollapsed ? item.name : undefined}
    >
      <item.icon className={cn("w-5 h-5", !isCollapsed && "mr-3")} />
      {!isCollapsed && <span>{item.name}</span>}
      {isCollapsed && (
        <div className="absolute left-full ml-3 px-3 py-2 bg-card border border-primary/30 text-foreground text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg">
          {item.name}
        </div>
      )}
    </Link>
  );

  const ConnectionItem = ({ connection }: { connection: any }) => {
    const isConnected = status?.[connection.key]?.connected;
    return (
      <div
        className={cn(
          "flex items-center text-sm font-medium text-muted-foreground rounded-xl transition-all duration-200 group relative",
          isCollapsed ? "px-3 py-3 justify-center" : "px-4 py-3",
        )}
        title={isCollapsed ? connection.name : undefined}
      >
        <connection.icon className={cn("w-5 h-5", !isCollapsed && "mr-3")} />
        {!isCollapsed && (
          <>
            <span className="flex-1">{connection.name}</span>
            <div
              className={`w-2 h-2 rounded-full ${isConnected ? "bg-emerald-400 shadow-sm" : "bg-primary/30"}`}
            ></div>
          </>
        )}
        {isCollapsed && (
          <>
            <div
              className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${isConnected ? "bg-emerald-400" : "bg-primary/30"}`}
            ></div>
            <div className="absolute left-full ml-3 px-3 py-2 bg-card border border-primary/30 text-foreground text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg">
              {connection.name} {isConnected ? "• Connected" : "• Disconnected"}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div
      className={cn(
        "bg-card border-r border-border flex flex-col transition-all duration-300 relative shadow-xl",
        isCollapsed ? "w-20" : "w-72",
      )}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-6 z-10 w-7 h-7 bg-primary border border-primary/30 rounded-full flex items-center justify-center hover:opacity-80 transition-all shadow-lg"
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4 text-primary-foreground" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-primary-foreground" />
        )}
      </button>

      {/* Logo */}
      <div
        className={cn(
          "border-b border-border flex-shrink-0 transition-all duration-300",
          isCollapsed ? "p-4" : "p-6",
        )}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-primary-foreground font-bold text-lg">Q</span>
          </div>
          {!isCollapsed && (
            <span className="text-xl font-semibold text-foreground">Quolo</span>
          )}
        </div>
      </div>

      {/* Scrollable Navigation */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <nav
          className={cn(
            "py-6 space-y-8 transition-all duration-300",
            isCollapsed ? "px-2" : "px-4",
          )}
        >
          {/* Main Navigation */}
          <div>
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <NavItem item={item} isActive={pathname === item.href} />
                </li>
              ))}
            </ul>
          </div>

          {/* Tools */}
          <div>
            {!isCollapsed && (
              <h3 className="text-xs font-semibold text-accent uppercase tracking-wider mb-3 px-1">
                TOOLS
              </h3>
            )}
            <ul className="space-y-2">
              {tools.map((tool) => (
                <li key={tool.name}>
                  <NavItem item={tool} isActive={pathname === tool.href} />
                </li>
              ))}
            </ul>
          </div>

          {/* Admin Tools */}
          <div>
            {!isCollapsed && (
              <h3 className="text-xs font-semibold text-accent uppercase tracking-wider mb-3 px-1">
                ADMIN
              </h3>
            )}
            <ul className="space-y-2">
              {adminTools.map((tool) => (
                <li key={tool.name}>
                  <NavItem item={tool} isActive={pathname === tool.href} />
                </li>
              ))}
            </ul>
          </div>

          {/* Platform Status */}
          <div>
            {!isCollapsed && (
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
                PLATFORM STATUS
              </h3>
            )}
            <ul className="space-y-2">
              {loading ? (
                <li className="text-xs text-muted-foreground px-2 py-2">Loading status...</li>
              ) : (
                platformConnections.map((connection) => (
                  <li key={connection.name}>
                    <ConnectionItem connection={connection} />
                  </li>
                ))
              )}
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
}
