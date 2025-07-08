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
    if (!token || !userId) return;

    setLoading(true);
    setError(null);
    try {
      // Using static data for now - API commented out
      const status: GoogleDriveService.GoogleDriveConnectionStatus = {
        status: "NOT_CONNECTED",
        access_token_valid: false,
        refresh_token_available: false,
        auto_refresh_available: false,
      };
      setConnectionStatus(status);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearTokens = async () => {
    if (!token || !userId) return;

    setLoading(true);
    setError(null);
    try {
      await GoogleDriveService.clearTokens(token, userId);
      await checkConnection(); // Refresh status
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const connect = () => {
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

  const fetchUserInfo = async (username: string) => {
    if (!token) return;

    setLoading(true);
    setError(null);
    try {
      const response = await InstagramService.fetchUserInfo(token, username);
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
      // Using static data for now - API commented out
      const staticUserInfo: InstagramService.InstagramUserInfo = {
        id: "12345",
        username: username,
        full_name: "John Doe",
        biography: "Content creator & influencer",
        followers_count: 15420,
        following_count: 892,
        media_count: 156,
        profile_pic_url: "https://via.placeholder.com/150",
        is_verified: false,
        is_private: false,
      };
      setUserInfo(staticUserInfo);
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
      // Using static data for now - API commented out
      const staticReels: InstagramService.InstagramReel[] = [
        {
          instagram_username: userId,
          reel_url: "https://example.com/reel1.mp4",
          caption: "Amazing sunset vibes 🌅 #sunset #nature",
          likes: 1234,
          views: 5678,
          timestamp: Date.now() / 1000,
          play_count: 2341,
          comment_count: 45,
          thumbnail: "https://via.placeholder.com/300x400",
        },
        {
          instagram_username: userId,
          reel_url: "https://example.com/reel2.mp4",
          caption: "Coffee time ☕ Starting the day right!",
          likes: 890,
          views: 3456,
          timestamp: Date.now() / 1000 - 86400,
          play_count: 1567,
          comment_count: 23,
          thumbnail: "https://via.placeholder.com/300x400",
        },
      ];
      setReels(staticReels);
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
      // Using static response for now - API commented out
      const staticResponse: InstagramService.UploadReelsResponse = {
        message: "Reels uploaded successfully (static data)",
        uploaded_reels: data.reels.map((reel) => ({
          instagram_username: reel.instagram_username,
          shareable_link: "https://drive.google.com/file/d/static-link/view",
        })),
      };
      return staticResponse;
    } catch (err: any) {
      setError(err.message);
      throw err;
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
    clearReels: () => setReels([]),
  };
}
