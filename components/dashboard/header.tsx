"use client";
import { Bell, Settings, User, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { parseJwt } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Accept optional currentTab for context-aware breadcrumbs
function ModernBreadcrumb({ segments }: { segments: string[] }) {
  return (
    <nav className="flex items-center gap-2 bg-muted/40 px-4 py-2 rounded-lg shadow-sm">
      {segments.map((seg, idx) => (
        <span key={seg + idx} className={`capitalize text-base font-medium ${idx === segments.length - 1 ? 'text-primary' : 'text-muted-foreground'}`}>
          {seg}
          {idx < segments.length - 1 && (
            <ChevronRight className="inline-block mx-2 w-4 h-4 text-muted-foreground" />
          )}
        </span>
      ))}
    </nav>
  );
}

function toTitleCase(str: string) {
  return str.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function Breadcrumb({ currentTab }: { currentTab?: string }) {
  const pathname = usePathname();
  const segments = pathname.replace(/^\//, '').split('/').filter(Boolean);
  let displaySegments = [];
  if (segments[0] === 'dashboard') {
    displaySegments = ['Dashboard', ...segments.slice(1)];
  } else {
    displaySegments = segments;
  }
  // If currentTab is provided (e.g. in settings), use it as the last segment
  if (currentTab) {
    if (displaySegments[displaySegments.length - 1]?.toLowerCase() !== currentTab.toLowerCase()) {
      displaySegments.push(currentTab);
    }
  }
  // Convert to title case for display
  const display = displaySegments.map(toTitleCase);
  return <ModernBreadcrumb segments={display} />;
}

export function Header({ currentTab }: { currentTab?: string }) {
  const { token, logout } = useAuth();
  const userInfo = token ? parseJwt(token) : null;

  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <Breadcrumb currentTab={currentTab} />
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground hover:bg-accent/10"
            >
              <Bell className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground hover:bg-accent/10"
            >
              <Settings className="w-5 h-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2 text-purple-200 hover:text-white hover:bg-white/10"
                >
                  <User className="w-5 h-5" />
                  {userInfo?.username && (
                    <span className="text-sm">{userInfo.username}</span>
                  )}
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 bg-gradient-cawar-card border-white/10 text-white"
              >
                <DropdownMenuItem
                  asChild
                  className="text-purple-200 hover:text-white hover:bg-white/10"
                >
                  <Link href="/dashboard/profile" className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="text-purple-200 hover:text-white hover:bg-white/10"
                >
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem
                  onClick={logout}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
