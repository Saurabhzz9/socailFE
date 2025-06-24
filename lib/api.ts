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

// Instagram Store User Info API
export async function storeInstagramUserInfo(token: string, username: string) {
  const response = await fetch(`${API_BASE_URL}/api/instagram/store-userinfo`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify({ username }),
  });
  return handleApiResponse<{ message: string }>(response);
}

// Get User Reels API
export async function getUserReels(token: string, userId: number) {
  const response = await fetch(`${API_BASE_URL}/api/user-reels/${userId}`, {
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

// Google Drive OAuth
export function getGoogleDriveAuthUrl(userId: number) {
  return `${API_BASE_URL}/api/auth/google/drive?user_id=${userId}`;
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

// Types
export interface UserReel {
  id: number;
  file_name: string;
  drive_file_id: string;
  shareable_link: string;
  uploaded_at: string;
}

export interface AutoBackupRequest {
  user_id: number;
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
