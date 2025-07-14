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
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const userId = token ? parseJwt(token).user_id : undefined;

  // Check connection status on mount using new API
  useEffect(() => {
    if (userId) {
      fetch(`http://localhost:8080/api/v1/auth/google/drive/status?user_id=${userId}`)
        .then((res) => res.json())
        .then((data) => setIsConnected(data.connected))
        .catch(() => setIsConnected(false));
    }
  }, [userId]);

  // Remove checkConnection and connectionStatus logic
  // Add a refreshStatus function to re-call the status API
  const refreshStatus = () => {
    if (userId) {
      setRefreshing(true);
      fetch(`http://localhost:8080/api/v1/auth/google/drive/status?user_id=${userId}`)
        .then((res) => res.json())
        .then((data) => setIsConnected(data.connected))
        .catch(() => setIsConnected(false))
        .finally(() => setRefreshing(false));
    }
  };

  // Update connectToDrive and clearTokens to call refreshStatus after actions
  const connectToDrive = () => {
    setLoading(true);
    GoogleDriveService.authenticateWithGoogleDrive(
      () => {
        setLoading(false);
        toast.success("Google Drive connected successfully!");
        refreshStatus();
      },
      (error) => {
        setLoading(false);
        toast.error(`Connection failed: ${error}`);
      },
    );
  };

  const clearTokens = async () => {
    if (!token || !userId) return;
    try {
      await GoogleDriveService.clearTokens(token, userId);
      toast.success("Tokens cleared successfully. You can now reconnect.");
      refreshStatus();
    } catch (error: any) {
      toast.error(`Failed to clear tokens: ${error.message}`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONNECTED":
        return "text-green-600 bg-green-50 border-green-200";
      case "TOKEN_EXPIRED":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "INCOMPLETE_CONNECTION":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "CONNECTED":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "TOKEN_EXPIRED":
        return <Clock className="h-5 w-5 text-orange-600" />;
      case "INCOMPLETE_CONNECTION":
      case "NOT_CONNECTED":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      default:
        return <HardDrive className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HardDrive className="h-5 w-5" />
          Google Drive Integration
          {refreshing && (
            <RefreshCw className="h-4 w-4 animate-spin text-gray-500" />
          )}
        </CardTitle>
        <CardDescription>
          Connect your Google Drive to automatically backup Instagram reels
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* New connection status UI */}
        {isConnected === true && (
          <Alert className="bg-green-50 border-green-200 text-green-600 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <span>✅ Connected</span>
          </Alert>
        )}
        {isConnected === false && (
          <Alert className="bg-red-50 border-red-200 text-red-600 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span>❌ Not Connected</span>
          </Alert>
        )}
        {/* Connection Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">Access Token:</span>
            <Badge variant={isConnected === true ? "default" : "destructive"}>
              {isConnected === true ? "Valid" : "Invalid"}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">Auto Refresh:</span>
            <Badge variant={isConnected === true ? "default" : "secondary"}>
              {isConnected === true ? "Available" : "Unavailable"}
            </Badge>
          </div>
        </div>
        {/* Actions */}
        <div className="flex gap-2 pt-2">
          {isConnected !== true && (
            <Button
              onClick={connectToDrive}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              {loading ? "Connecting..." : "Connect Drive"}
            </Button>
          )}
          <Button
            onClick={refreshStatus}
            variant="outline"
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh Status
          </Button>
          {isConnected !== true && (
            <Button
              onClick={clearTokens}
              variant="destructive"
              size="sm"
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear Tokens
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
