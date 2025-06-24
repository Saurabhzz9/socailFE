"use client";
import { useAuth } from "@/context/AuthContext";
import { parseJwt } from "@/lib/utils";
import { healthCheck } from "@/lib/api";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TokenDebug() {
  const { token, logout } = useAuth();
  const [healthStatus, setHealthStatus] = useState<string | null>(null);

  const userInfo = token ? parseJwt(token) : null;

  const testBackend = async () => {
    try {
      setHealthStatus("Testing...");
      await healthCheck();
      setHealthStatus("✅ Backend is accessible");
    } catch (error: any) {
      setHealthStatus(`❌ Backend error: ${error.message}`);
    }
  };

  const testAuthenticatedEndpoint = async () => {
    if (!token || !userInfo?.user_id) {
      setHealthStatus("❌ No token or user ID");
      return;
    }

    try {
      setHealthStatus("Testing authenticated endpoint...");
      const response = await fetch(`http://localhost:8080/api/health`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setHealthStatus(`✅ Auth test passed: ${data.status}`);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setHealthStatus(
          `❌ Auth test failed: ${errorData.error || response.status}`,
        );
      }
    } catch (error: any) {
      setHealthStatus(`❌ Network error: ${error.message}`);
    }
  };

  return (
    <Card className="mt-4 border-yellow-200 bg-yellow-50">
      <CardHeader>
        <CardTitle className="text-sm">🔧 Debug Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-sm">
          <div>
            <strong>Token exists:</strong> {token ? "✅ Yes" : "❌ No"}
          </div>
          <div>
            <strong>User ID:</strong> {userInfo?.user_id || "N/A"}
          </div>
          <div>
            <strong>Username:</strong> {userInfo?.username || "N/A"}
          </div>
          {token && (
            <div className="text-xs text-gray-600 font-mono bg-gray-100 p-2 rounded mt-2">
              Token: {token.substring(0, 50)}...
            </div>
          )}
        </div>

        <div className="space-x-2">
          <Button size="sm" variant="outline" onClick={testBackend}>
            Test Backend
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={testAuthenticatedEndpoint}
          >
            Test Auth
          </Button>
          <Button size="sm" variant="destructive" onClick={logout}>
            Logout & Restart
          </Button>
        </div>

        {healthStatus && (
          <div className="text-sm p-2 bg-white rounded border">
            {healthStatus}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
