"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { triggerBackupTest, triggerUserInfoTest } from "@/lib/api";
import { toast } from "sonner";
import {
  Settings,
  Play,
  TestTube,
  Activity,
  Shield,
  Users,
} from "lucide-react";

export default function AdminPage() {
  const { token } = useAuth();
  const [backupTestLoading, setBackupTestLoading] = useState(false);
  const [userInfoTestLoading, setUserInfoTestLoading] = useState(false);
  const [lastBackupTest, setLastBackupTest] = useState<string | null>(null);
  const [lastUserInfoTest, setLastUserInfoTest] = useState<string | null>(null);

  // Handle backup test trigger
  const handleBackupTest = async () => {
    if (!token) return;

    setBackupTestLoading(true);
    try {
      const result = await triggerBackupTest(token);
      setLastBackupTest(new Date().toLocaleString());
      toast.success(result.message);
    } catch (error: any) {
      toast.error(`Backup test failed: ${error.message}`);
    } finally {
      setBackupTestLoading(false);
    }
  };

  // Handle user info test trigger
  const handleUserInfoTest = async () => {
    if (!token) return;

    setUserInfoTestLoading(true);
    try {
      const result = await triggerUserInfoTest(token);
      setLastUserInfoTest(new Date().toLocaleString());
      toast.success(result.message);
    } catch (error: any) {
      toast.error(`User info test failed: ${error.message}`);
    } finally {
      setUserInfoTestLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3">
            <Settings className="w-8 h-8 text-purple-600" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
              <p className="text-muted-foreground">
                Administrative tools and system testing utilities
              </p>
            </div>
          </div>
        </div>
        <Badge variant="secondary" className="bg-purple-100 text-purple-800">
          Admin Only
        </Badge>
      </div>

      {/* Warning Notice */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2 text-orange-800">
            <TestTube className="w-5 h-5" />
            <span className="font-medium">
              Warning: These are testing tools for administrators only.
            </span>
          </div>
          <p className="text-orange-700 text-sm mt-1">
            Use these functions carefully as they can trigger system-wide
            operations.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Backup Test Trigger */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Backup System Test</span>
            </CardTitle>
            <CardDescription>
              Manually trigger the backup scheduler to test backup functionality
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              This will trigger a manual check of the backup scheduler system.
              It will process any pending automatic backups for users who have
              backup frequency enabled.
            </div>

            <Button
              onClick={handleBackupTest}
              disabled={backupTestLoading}
              className="w-full"
              variant="outline"
            >
              <Play className="w-4 h-4 mr-2" />
              {backupTestLoading
                ? "Running Backup Test..."
                : "Trigger Backup Test"}
            </Button>

            {lastBackupTest && (
              <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
                Last test run: {lastBackupTest}
              </div>
            )}
          </CardContent>
        </Card>

        {/* User Info Test Trigger */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>User Info Update Test</span>
            </CardTitle>
            <CardDescription>
              Manually trigger the user info scheduler to test user profile
              updates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              This will trigger a manual check of the user info scheduler
              system. It will update Instagram user profile information for
              tracked accounts.
            </div>

            <Button
              onClick={handleUserInfoTest}
              disabled={userInfoTestLoading}
              className="w-full"
              variant="outline"
            >
              <Activity className="w-4 h-4 mr-2" />
              {userInfoTestLoading
                ? "Running User Info Test..."
                : "Trigger User Info Test"}
            </Button>

            {lastUserInfoTest && (
              <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
                Last test run: {lastUserInfoTest}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
          <CardDescription>
            Current system status and configuration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">Active</div>
              <div className="text-sm text-muted-foreground">
                Backup Scheduler
              </div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">Active</div>
              <div className="text-sm text-muted-foreground">
                User Info Scheduler
              </div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">Running</div>
              <div className="text-sm text-muted-foreground">API Server</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      <Card>
        <CardHeader>
          <CardTitle>Test History</CardTitle>
          <CardDescription>
            Recent test executions and their timestamps
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="font-medium">Backup Test</span>
              <span className="text-sm text-muted-foreground">
                {lastBackupTest || "Not run yet"}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="font-medium">User Info Test</span>
              <span className="text-sm text-muted-foreground">
                {lastUserInfoTest || "Not run yet"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
