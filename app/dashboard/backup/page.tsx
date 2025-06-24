"use client";
import { useState, useEffect, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { parseJwt } from "@/lib/utils";
import {
  triggerAutoBackup,
  updateBackupFrequency,
  type AutoBackupRequest,
  type AutoBackupResponse,
} from "@/lib/api";
import { toast } from "sonner";
import {
  Shield,
  Play,
  Settings,
  Clock,
  Download,
  Users,
  Activity,
} from "lucide-react";

export default function BackupPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [backupFrequency, setBackupFrequency] = useState<
    "off" | "weekly" | "monthly"
  >("off");
  const [frequencyLoading, setFrequencyLoading] = useState(false);

  // Auto backup form state
  const [autoBackupForm, setAutoBackupForm] = useState({
    username: "",
    limit: 10,
    customName: "",
  });
  const [autoBackupLoading, setAutoBackupLoading] = useState(false);
  const [lastBackupResult, setLastBackupResult] =
    useState<AutoBackupResponse | null>(null);

  const userInfo = token ? parseJwt(token) : null;

  // Handle backup frequency update
  const handleFrequencyUpdate = async (
    frequency: "off" | "weekly" | "monthly",
  ) => {
    if (!token) return;

    setFrequencyLoading(true);
    try {
      await updateBackupFrequency(token, frequency);
      setBackupFrequency(frequency);
      toast.success(`Backup frequency updated to ${frequency}`);
    } catch (error: any) {
      toast.error(`Failed to update backup frequency: ${error.message}`);
    } finally {
      setFrequencyLoading(false);
    }
  };

  // Handle manual auto backup trigger
  const handleAutoBackup = async () => {
    if (!token || !userInfo?.user_id || !autoBackupForm.username) {
      toast.error("Please fill in all required fields");
      return;
    }

    setAutoBackupLoading(true);
    try {
      const request: AutoBackupRequest = {
        user_id: userInfo.user_id,
        username: autoBackupForm.username,
        limit: autoBackupForm.limit,
        custom_name: autoBackupForm.customName || undefined,
      };

      const result = await triggerAutoBackup(token, request);
      setLastBackupResult(result);
      toast.success("Auto backup completed successfully!");
    } catch (error: any) {
      toast.error(`Auto backup failed: ${error.message}`);
    } finally {
      setAutoBackupLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8 text-green-600" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Backup Manager
              </h1>
              <p className="text-muted-foreground">
                Manage automated backups and manual backup operations
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Backup Frequency Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Backup Frequency</span>
            </CardTitle>
            <CardDescription>
              Set how often you want automatic backups to run
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="off"
                  name="frequency"
                  checked={backupFrequency === "off"}
                  onChange={() => handleFrequencyUpdate("off")}
                  disabled={frequencyLoading}
                />
                <Label htmlFor="off" className="cursor-pointer">
                  <div className="flex items-center space-x-2">
                    <span>Off</span>
                    <Badge variant="secondary">No automatic backups</Badge>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="weekly"
                  name="frequency"
                  checked={backupFrequency === "weekly"}
                  onChange={() => handleFrequencyUpdate("weekly")}
                  disabled={frequencyLoading}
                />
                <Label htmlFor="weekly" className="cursor-pointer">
                  <div className="flex items-center space-x-2">
                    <span>Weekly</span>
                    <Badge variant="outline">Every 7 days</Badge>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="monthly"
                  name="frequency"
                  checked={backupFrequency === "monthly"}
                  onChange={() => handleFrequencyUpdate("monthly")}
                  disabled={frequencyLoading}
                />
                <Label htmlFor="monthly" className="cursor-pointer">
                  <div className="flex items-center space-x-2">
                    <span>Monthly</span>
                    <Badge variant="outline">Every 30 days</Badge>
                  </div>
                </Label>
              </div>
            </div>

            {frequencyLoading && (
              <div className="text-sm text-muted-foreground">
                Updating frequency...
              </div>
            )}
          </CardContent>
        </Card>

        {/* Manual Auto Backup */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Play className="w-5 h-5" />
              <span>Manual Auto Backup</span>
            </CardTitle>
            <CardDescription>
              Trigger an immediate auto backup for a specific Instagram account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <Label htmlFor="username">Instagram Username *</Label>
                <Input
                  id="username"
                  placeholder="Enter Instagram username"
                  value={autoBackupForm.username}
                  onChange={(e) =>
                    setAutoBackupForm((prev) => ({
                      ...prev,
                      username: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <Label htmlFor="limit">Limit (number of reels)</Label>
                <Input
                  id="limit"
                  type="number"
                  min="1"
                  max="50"
                  value={autoBackupForm.limit}
                  onChange={(e) =>
                    setAutoBackupForm((prev) => ({
                      ...prev,
                      limit: Number(e.target.value),
                    }))
                  }
                />
              </div>

              <div>
                <Label htmlFor="customName">Custom Name (optional)</Label>
                <Input
                  id="customName"
                  placeholder="Custom file name prefix"
                  value={autoBackupForm.customName}
                  onChange={(e) =>
                    setAutoBackupForm((prev) => ({
                      ...prev,
                      customName: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <Button
              onClick={handleAutoBackup}
              disabled={autoBackupLoading || !autoBackupForm.username}
              className="w-full"
            >
              {autoBackupLoading
                ? "Running Auto Backup..."
                : "Start Auto Backup"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Last Backup Result */}
      {lastBackupResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>Last Backup Result</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Badge variant="default" className="bg-green-500">
                  {lastBackupResult.message}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Download className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">
                    Uploaded: {lastBackupResult.uploaded_reels} reels
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span className="text-sm">
                    Updated: {lastBackupResult.updated_reels} reels
                  </span>
                </div>
              </div>

              {lastBackupResult.upload_response.uploaded_reels && (
                <div>
                  <h4 className="font-medium mb-2">Newly Uploaded Reels:</h4>
                  <div className="space-y-2">
                    {lastBackupResult.upload_response.uploaded_reels.map(
                      (reel: { instagram_username: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; shareable_link: string | undefined; }, index: Key | null | undefined) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded"
                        >
                          <span className="text-sm font-medium">
                            @{reel.instagram_username}
                          </span>
                          <a
                            href={reel.shareable_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-700 text-sm"
                          >
                            View in Drive
                          </a>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Backup Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Backup Overview</span>
          </CardTitle>
          <CardDescription>Current backup settings and status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {backupFrequency}
              </div>
              <div className="text-sm text-muted-foreground">
                Current Frequency
              </div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {userInfo?.user_id || "N/A"}
              </div>
              <div className="text-sm text-muted-foreground">User ID</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">Active</div>
              <div className="text-sm text-muted-foreground">Backup Status</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
