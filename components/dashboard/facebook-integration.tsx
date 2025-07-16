import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { parseJwt } from "@/lib/utils";
import { toast } from "sonner";
import { Facebook, RefreshCw, CheckCircle2, AlertTriangle, ExternalLink } from "lucide-react";

export function FacebookIntegration() {
  const { token } = useAuth();
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [fbName, setFbName] = useState<string>("");

  const userId = token ? parseJwt(token).user_id : undefined;

  // Check Facebook connection status
  useEffect(() => {
    if (userId) {
      setRefreshing(true);
      fetch(`http://localhost:8080/api/v1/auth/facebook/check-connection`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      })
        .then((res) => res.json())
        .then((data) => {
          setIsConnected(data.connected);
          setFbName(data.username || "");
        })
        .catch(() => setIsConnected(false))
        .finally(() => setRefreshing(false));
    }
  }, [userId]);

  const handleConnect = () => {
    if (!userId) return;
    const url = process.env.NEXT_PUBLIC_API_URL
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/facebook/connect?user_id=${userId}`
      : `http://localhost:8080/api/v1/auth/facebook/connect?user_id=${userId}`;
    window.open(url, "_blank");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Facebook className="h-5 w-5 text-blue-600" />
          Facebook Integration
          {refreshing && <RefreshCw className="h-4 w-4 animate-spin text-gray-500" />}
        </CardTitle>
        <CardDescription>
          Connect your Facebook Page to enable auto-posting and analytics.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isConnected === true && (
          <Alert className="bg-green-50 border-green-200 text-green-600 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <span>✅ Connected</span>
            {fbName && <span className="ml-2">{fbName}</span>}
          </Alert>
        )}
        {isConnected === false && (
          <Alert className="bg-red-50 border-red-200 text-red-600 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span>❌ Not Connected</span>
          </Alert>
        )}
        <div className="flex gap-2 pt-2">
          <Button onClick={handleConnect} disabled={loading} className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4" />
            {loading ? "Connecting..." : isConnected ? "Reconnect Facebook" : "Connect Facebook"}
          </Button>
        </div>
        {/* Placeholder for insights/analytics */}
        {isConnected && (
          <div className="mt-4">
            <div className="text-sm font-semibold mb-2">Insights (Coming Soon)</div>
            <div className="text-xs text-muted-foreground">Facebook page analytics and insights will appear here.</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 