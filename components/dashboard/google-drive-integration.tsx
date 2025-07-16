"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { GoogleDriveService } from "@/lib/services";
import { parseJwt } from "@/lib/utils";
import { toast } from "sonner";
import {
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  RefreshCw,
  Trash2,
  Clock,
  Shield,
  HardDrive,
} from "lucide-react";

export function GoogleDriveIntegration() {
  const { token } = useAuth();
  const [driveStatus, setDriveStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const userId = token ? parseJwt(token).user_id : undefined;

  // Check connection status on mount using the new API
  const checkDriveConnection = async () => {
    if (!token || !userId) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/api/v1/instagram/check-drive-connection`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user_id: userId }),
      });
      const data = await res.json();
      setDriveStatus(data);
    } catch {
      setDriveStatus(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    checkDriveConnection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, userId]);

  const refreshStatus = () => {
    setRefreshing(true);
    checkDriveConnection();
  };

  // UI helpers
  const isConnected = driveStatus && driveStatus.status === "FULLY_CONNECTED" && driveStatus.has_access_token && !driveStatus.is_expired;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HardDrive className="h-5 w-5" />
          Google Drive Integration
          {refreshing && <RefreshCw className="h-4 w-4 animate-spin text-gray-500" />}
        </CardTitle>
        <CardDescription>
          Connect your Google Drive to automatically backup Instagram reels
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection status UI */}
        {loading ? (
          <div className="text-sm text-gray-500">Checking Google Drive connection...</div>
        ) : isConnected ? (
          <Alert className="bg-green-50 border-green-200 text-green-600 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <span>✅ Fully Connected</span>
          </Alert>
        ) : (
          <Alert className="bg-red-50 border-red-200 text-red-600 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span>❌ Not Connected</span>
          </Alert>
        )}
        {/* Connection Details */}
        {driveStatus && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">Access Token:</span>
              <Badge variant={driveStatus.has_access_token ? "default" : "destructive"}>
                {driveStatus.has_access_token ? "Valid" : "Invalid"}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">Auto Refresh:</span>
              <Badge variant={driveStatus.can_auto_refresh ? "default" : "secondary"}>
                {driveStatus.can_auto_refresh ? "Available" : "Unavailable"}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">Expires In:</span>
              <span>{driveStatus.expires_in || "-"}</span>
            </div>
            <div className="flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">Status:</span>
              <Badge>{driveStatus.status || "Unknown"}</Badge>
            </div>
          </div>
        )}
        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={refreshStatus}
            variant="outline"
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh Status
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
