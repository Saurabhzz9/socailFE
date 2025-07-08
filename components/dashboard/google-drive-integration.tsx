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
  const [connectionStatus, setConnectionStatus] =
    useState<GoogleDriveService.GoogleDriveConnectionStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const userId = token ? parseJwt(token).user_id : undefined;

  // Check connection status on mount
  useEffect(() => {
    if (token && userId) {
      checkConnection();
    }
  }, [token, userId]);

  const checkConnection = async () => {
    if (!token || !userId) return;

    setRefreshing(true);
    try {
      const status = await GoogleDriveService.checkConnection(token, userId);
      setConnectionStatus(status);
    } catch (error: any) {
      console.error("Failed to check Google Drive connection:", error);
      toast.error("Failed to check Google Drive connection");
    } finally {
      setRefreshing(false);
    }
  };

  const connectToDrive = () => {
    setLoading(true);
    GoogleDriveService.authenticateWithGoogleDrive(
      () => {
        setLoading(false);
        toast.success("Google Drive connected successfully!");
        checkConnection();
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
      checkConnection();
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
        {connectionStatus ? (
          <>
            {/* Connection Status */}
            <Alert className={getStatusColor(connectionStatus.status)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(connectionStatus.status)}
                  <div>
                    <AlertDescription className="font-medium">
                      Status: {connectionStatus.status.replace(/_/g, " ")}
                    </AlertDescription>
                    {connectionStatus.token_expiry &&
                      connectionStatus.minutes_until_expiry && (
                        <AlertDescription className="text-sm mt-1">
                          Token expires in{" "}
                          {connectionStatus.minutes_until_expiry} minutes
                        </AlertDescription>
                      )}
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={getStatusColor(connectionStatus.status)}
                >
                  {connectionStatus.status}
                </Badge>
              </div>
            </Alert>

            {/* Connection Details */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Access Token:</span>
                <Badge
                  variant={
                    connectionStatus.access_token_valid
                      ? "default"
                      : "destructive"
                  }
                >
                  {connectionStatus.access_token_valid ? "Valid" : "Invalid"}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Auto Refresh:</span>
                <Badge
                  variant={
                    connectionStatus.auto_refresh_available
                      ? "default"
                      : "secondary"
                  }
                >
                  {connectionStatus.auto_refresh_available
                    ? "Available"
                    : "Unavailable"}
                </Badge>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              {connectionStatus.status !== "CONNECTED" && (
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
                onClick={checkConnection}
                variant="outline"
                disabled={refreshing}
                className="flex items-center gap-2"
              >
                <RefreshCw
                  className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                />
                Refresh Status
              </Button>

              {connectionStatus.refresh_token_available && (
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

            {/* Reconnection Alert */}
            {connectionStatus.needs_reconnection && (
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription>
                  <strong>Action Required:</strong> Your Google Drive connection
                  needs to be refreshed. Please reconnect to continue uploading
                  reels.
                </AlertDescription>
              </Alert>
            )}
          </>
        ) : (
          /* Initial Connection */
          <div className="text-center py-6">
            <HardDrive className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              Connect your Google Drive account to automatically backup
              Instagram reels
            </p>
            <Button
              onClick={connectToDrive}
              disabled={loading}
              className="flex items-center gap-2 mx-auto"
            >
              <ExternalLink className="h-4 w-4" />
              {loading ? "Connecting..." : "Connect Google Drive"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
