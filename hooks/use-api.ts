import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { parseJwt } from "@/lib/utils";
import { InstagramService, GoogleDriveService } from "@/lib/services";

// =============================================================================
// GOOGLE DRIVE HOOKS
// =============================================================================

export function useGoogleDriveConnection() {
  const { token } = useAuth();
  const [connectionStatus, setConnectionStatus] =
    useState<GoogleDriveService.GoogleDriveConnectionStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userId = token ? parseJwt(token).user_id : undefined;

  const checkConnection = async () => {
    if (!token || !userId) return null;

    setLoading(true);
    setError(null);
    try {
      // Use the real API call
      const response = await import("@/lib/api").then(api => api.checkGoogleDriveConnection(token, userId));
      setConnectionStatus(response);
      return response;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const clearTokens = async () => {
    if (!token || !userId) return;

    setLoading(true);
    setError(null);
    try {
      await import("@/lib/api").then(api => api.clearGoogleDriveTokens(token, userId));
      await checkConnection(); // Refresh status
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const connect = () => {
    // This may still be a frontend redirect, so keep as is if not API-based
    GoogleDriveService.authenticateWithGoogleDrive(
      () => {
        checkConnection(); // Refresh status after connection
      },
      (error) => {
        setError(error);
      },
    );
  };

  // Auto-check connection on mount
  useEffect(() => {
    if (token && userId) {
      checkConnection();
    }
  }, [token, userId]);

  return {
    connectionStatus,
    loading,
    error,
    checkConnection,
    clearTokens,
    connect,
    isConnected: connectionStatus?.status === "CONNECTED",
  };
}

// =============================================================================
// INSTAGRAM HOOKS
// =============================================================================

export function useInstagramUserInfo() {
  const { token } = useAuth();
  const [userInfo, setUserInfo] =
    useState<InstagramService.InstagramUserInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Import the real API functions
  // (Assuming fetchInstagramUserInfo and storeInstagramUserInfo are exported from lib/api.ts)
  // If not, adjust the import accordingly.
  // import { fetchInstagramUserInfo, storeInstagramUserInfo } from "@/lib/api";
  // But since this is a code edit, just use them directly below.

  const fetchUserInfo = async (username: string) => {
    if (!token) return;

    setLoading(true);
    setError(null);
    try {
      // Use the real API call
      const response = await import("@/lib/api").then(api => api.fetchInstagramUserInfo(token, username));
      setUserInfo(response.info);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const storeUserInfo = async (username: string) => {
    if (!token) return;

    setLoading(true);
    setError(null);
    try {
      // Use the real API call
      const response = await import("@/lib/api").then(api => api.storeInstagramUserInfo(token, username));
      setUserInfo(response.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    userInfo,
    loading,
    error,
    fetchUserInfo,
    storeUserInfo,
  };
}

export function useInstagramReels() {
  const { token } = useAuth();
  const [reels, setReels] = useState<InstagramService.InstagramReel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReels = async (userId: string, limit = 10) => {
    if (!token) return;

    setLoading(true);
    setError(null);
    try {
      // Use the real API call
      const response = await import("@/lib/api").then(api => api.fetchInstagramUserReels(token, userId, limit));
      setReels(response.reels);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const uploadReels = async (data: InstagramService.UploadReelsRequest) => {
    if (!token) return;

    setLoading(true);
    setError(null);
    try {
      // Use the real API call
      await import("@/lib/api").then(api => api.uploadInstagramReels(token, data));
      // Optionally refresh reels after upload
      if (data.user_id) {
        await fetchReels(data.user_id.toString());
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    reels,
    loading,
    error,
    fetchReels,
    uploadReels,
  };
}
