import { parseJwt } from "./utils";

const API_BASE_URL = "http://localhost:8080";

// Helper function to get auth headers
export function getAuthHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

// Helper function to handle API responses
export async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ error: "Unknown error" }));

    // Handle specific error cases
    if (response.status === 401) {
      throw new Error("Authentication failed. Please log in again.");
    }
    if (response.status === 403) {
      throw new Error("Access denied. Insufficient permissions.");
    }
    if (response.status === 404) {
      throw new Error("Resource not found.");
    }
    if (response.status >= 500) {
      throw new Error("Server error. Please try again later.");
    }

    throw new Error(
      errorData.error || `HTTP ${response.status}: Request failed`,
    );
  }
  return response.json();
}

// =============================================================================
// AUTHENTICATION APIs
// =============================================================================

// Register a new user
export async function registerUser(userData: {
  full_name: string;
  email: string;
  username: string;
  password: string;
}) {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  return handleApiResponse<{ token: string }>(response);
}

// Login user with email and password
export async function loginUser(credentials: {
  email: string;
  password: string;
}) {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  return handleApiResponse<{ token: string }>(response);
}

// Google OAuth URLs
export function getGoogleAuthUrl() {
  return `${API_BASE_URL}/api/v1/auth/google`;
}

export function getGoogleDriveAuthUrl(user_id: number) {
  return `${API_BASE_URL}/api/v1/auth/google/drive`;
}

// Clear Google Drive tokens
export async function clearGoogleDriveTokens(token: string, userId: number) {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/auth/google/drive/clear`,
    {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify({ user_id: userId }),
    },
  );
  return handleApiResponse<{
    message: string;
    reconnect_url: string;
  }>(response);
}

// =============================================================================
// INSTAGRAM APIs
// =============================================================================

// Fetch Instagram user profile information
export async function fetchInstagramUserInfo(token: string, username: string) {
  const response = await fetch(`${API_BASE_URL}/api/v1/instagram/user-info`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify({ username }),
  });
  return handleApiResponse<{ info: InstagramUserInfo }>(response);
}

// Fetch Instagram user reels
export async function fetchInstagramUserReels(
  token: string,
  limit = 10,
) {
  const response = await fetch(`${API_BASE_URL}/api/v1/instagram/user-reels`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify({ limit }),
  });
  return handleApiResponse<InstagramReelsResponse>(response);
}

// Upload Instagram reels to Google Drive
export async function uploadInstagramReels(
  token: string,
  data: UploadReelsRequest,
) {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/instagram/upload-reels`,
    {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    },
  );
  return handleApiResponse<UploadReelsResponse>(response);
}

// Check Google Drive connection status
export async function checkGoogleDriveConnection(
  token: string,
  userId: number,
) {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/instagram/check-drive-connection`,
    {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify({ user_id: userId }),
    },
  );
  return handleApiResponse<GoogleDriveConnectionStatus>(response);
}

// Store Instagram user info in database
export async function storeInstagramUserInfo(token: string, username: string) {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/instagram/store-user-info`,
    {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify({ username }),
    },
  );
  return handleApiResponse<{ message: string; data: InstagramUserInfo }>(
    response,
  );
}

// Get User Reels API (remove userId from URL)
export async function getUserReels(token: string) {
  const response = await fetch(`${API_BASE_URL}/api/user-reels`, {
    method: "GET",
    headers: getAuthHeaders(token),
  });
  return handleApiResponse<UserReel[]>(response);
}

// Update Backup Frequency API
export async function updateBackupFrequency(
  token: string,
  frequency: "off" | "weekly" | "monthly",
) {
  const response = await fetch(`${API_BASE_URL}/api/user/backup-frequency`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify({ backup_frequency: frequency }),
  });
  return handleApiResponse<{ message: string }>(response);
}

// Auto Backup API
export async function triggerAutoBackup(
  token: string,
  data: AutoBackupRequest,
) {
  const response = await fetch(`${API_BASE_URL}/api/auto-backup`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });
  return handleApiResponse<AutoBackupResponse>(response);
}

// S3 Upload API
export async function uploadToS3(token: string, videoUrl: string) {
  const response = await fetch(`${API_BASE_URL}/api/upload-to-s3`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify({ video_url: videoUrl }),
  });
  return handleApiResponse<{ s3_url: string }>(response);
}

// Health Check API (no auth required)
export async function healthCheck() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/test`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return handleApiResponse<{ msg: string }>(response);
  } catch (error) {
    throw new Error(
      "Backend server is not accessible. Please ensure it's running on localhost:8080",
    );
  }
}

// Test Trigger APIs
export async function triggerBackupTest(token: string) {
  const response = await fetch(`${API_BASE_URL}/api/test/trigger-backup`, {
    method: "GET",
    headers: getAuthHeaders(token),
  });
  return handleApiResponse<{ message: string }>(response);
}

export async function triggerUserInfoTest(token: string) {
  const response = await fetch(`${API_BASE_URL}/api/test/trigger-userinfo`, {
    method: "GET",
    headers: getAuthHeaders(token),
  });
  return handleApiResponse<{ message: string }>(response);
}

// =============================================================================
// PROFILE APIs
// =============================================================================

// Fetch current user profile
export async function getProfile(token: string) {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/profile`, {
    method: "GET",
    headers: getAuthHeaders(token),
  });
  return handleApiResponse<any>(response);
}

// Update current user profile
export async function updateProfile(token: string, data: any) {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/profile`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });
  return handleApiResponse<any>(response);
}

// =============================================================================
// LEGACY/COMPATIBILITY APIs (keeping for backward compatibility)
// =============================================================================

export async function fetchInstagramUserInfoLegacy(username: string) {
  const token = localStorage.getItem("qoulo_token");

  if (!token) {
    throw new Error("No token found. User might not be logged in.");
  }

  const res = await fetch(
    `${API_BASE_URL}/api/dashboard/user-info?username=${encodeURIComponent(username)}`,
    {
      headers: getAuthHeaders(token),
    },
  );

  if (!res.ok) {
    const errorText = await res.text();
    console.error("API error:", res.status, errorText);
    throw new Error("Failed to fetch user info");
  }

  return res.json();
}

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export interface UserReel {
  id: number;
  file_name: string;
  drive_file_id: string;
  shareable_link: string;
  uploaded_at: string;
}

export interface AutoBackupRequest {
  username: string;
  limit?: number;
  custom_name?: string;
}

export interface AutoBackupResponse {
  message: string;
  updated_reels: number;
  uploaded_reels: number;
  upload_response: {
    message: string;
    uploaded_reels?: Array<{
      instagram_username: string;
      shareable_link: string;
    }>;
  };
}

// Instagram API Types
export interface InstagramUserInfo {
  id: string;
  username: string;
  full_name: string;
  biography: string;
  followers_count: number;
  following_count: number;
  media_count: number;
  profile_pic_url: string;
  is_verified: boolean;
  is_private: boolean;
}

export interface InstagramReel {
  instagram_username: string;
  reel_url: string;
  caption: string;
  likes: number;
  views: number;
  timestamp: number;
  play_count: number;
  comment_count: number;
  thumbnail: string;
}

export interface InstagramReelsResponse {
  reels: InstagramReel[];
  total_count: number;
}

export interface UploadReelsRequest {
  reels: InstagramReel[];
  custom_name?: string;
}

export interface UploadedReel {
  instagram_username: string;
  shareable_link: string;
}

export interface UploadReelsResponse {
  message: string;
  uploaded_reels: UploadedReel[];
}

export interface GoogleDriveConnectionStatus {
  [x: string]: boolean;
  status:
    | "CONNECTED"
    | "INCOMPLETE_CONNECTION"
    | "NOT_CONNECTED"
    | "TOKEN_EXPIRED";
  access_token_valid: boolean;
  refresh_token_available: boolean;
  token_expiry?: string;
  minutes_until_expiry?: number;
  auto_refresh_available: boolean;
  needs_reconnection?: boolean;
  action_required?: string;
  google_drive_url?: string;
}
