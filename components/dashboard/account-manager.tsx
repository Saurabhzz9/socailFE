"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Instagram,
  Youtube,
  Facebook,
  Users,
  Plus,
  Settings,
  Trash2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { parseJwt } from "@/lib/utils";

type SocialAccount = {
  id: string;
  platform: "instagram" | "facebook" | "youtube" | "tiktok";
  username: string;
  displayName: string;
  isConnected: boolean;
  isActive: boolean;
  followerCount?: number;
  profileImage?: string;
  accountType: "personal" | "business" | "creator";
  accessToken?: string;
  lastSync?: string;
};

const platformConfig = {
  instagram: {
    icon: Instagram,
    name: "Instagram",
    color: "bg-pink-500",
    textColor: "text-pink-500",
  },
  facebook: {
    icon: Facebook,
    name: "Facebook",
    color: "bg-blue-600",
    textColor: "text-blue-600",
  },
  google_drive: {
    icon: Users,
    name: "Google Drive",
    color: "bg-green-600",
    textColor: "text-green-600",
  },
};

const platforms = ["instagram", "facebook", "google_drive"] as const;

export function AccountManager() {
  const { token } = useAuth();
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStatus() {
      if (!token) return;
      setLoading(true);
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
        // Fetch social status for all platforms (Instagram, Facebook)
        const res = await fetch(`${API_BASE}/api/v1/social/status`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        let data = null;
        if (res.ok) {
          data = await res.json();
        }
        // Fetch Google Drive connection status using the correct API
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
        // Merge Google Drive connection status into status
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

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {platforms.map((platform) => {
          const p = platform as keyof typeof platformConfig;
          const connected = status?.[p]?.connected;
          const Icon = platformConfig[p].icon;
          return (
            <Card key={p}>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Icon className="h-4 w-4" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {platformConfig[p].name}
                    </p>
                    <p className="text-2xl font-bold">
                      {loading ? "..." : connected ? "Connected" : "Not Connected"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      {/* Account List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Social Media Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {platforms.map((platform) => {
              const p = platform as keyof typeof platformConfig;
              const Icon = platformConfig[p].icon;
              const connected = status?.[p]?.connected;
              const username = status?.[p]?.username || "-";
              return (
                <div
                  key={p}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${platformConfig[p].color}`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{platformConfig[p].name}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">{username}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {connected ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                      <span className="text-sm">
                        {connected ? "Connected" : "Not Connected"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
