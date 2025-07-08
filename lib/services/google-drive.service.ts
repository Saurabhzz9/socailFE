import { getAuthHeaders, handleApiResponse } from "../api";

const API_BASE_URL = "http://localhost:8080";

// =============================================================================
// GOOGLE DRIVE SERVICE - All Google Drive related API calls
// =============================================================================

export interface GoogleDriveConnectionStatus {
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

/**
 * Get Google Drive OAuth URL for authentication
 */
export function getGoogleDriveAuthUrl(): string {
  return `${API_BASE_URL}/api/v1/auth/google/drive`;
}

/**
 * Check Google Drive connection status for a user - COMMENTED OUT FOR NOW
 * @param token - Auth token
 * @param userId - User ID
 */
// export async function checkConnection(token: string, userId: number) {
//   const response = await fetch(`${API_BASE_URL}/api/v1/instagram/check-drive-connection`, {
//     method: "POST",
//     headers: getAuthHeaders(token),
//     body: JSON.stringify({ user_id: userId }),
//   });
//   return handleApiResponse<GoogleDriveConnectionStatus>(response);
// }

/**
 * Clear Google Drive tokens to allow re-authentication
 * @param token - Auth token
 * @param userId - User ID
 */
export async function clearTokens(token: string, userId: number) {
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

/**
 * Open Google Drive authentication in a new window
 * @param onSuccess - Callback when authentication is successful
 * @param onError - Callback when authentication fails
 */
export function authenticateWithGoogleDrive(
  onSuccess?: () => void,
  onError?: (error: string) => void,
) {
  const authUrl = getGoogleDriveAuthUrl();
  const authWindow = window.open(
    authUrl,
    "googleDriveAuth",
    "width=600,height=600,scrollbars=yes,resizable=yes",
  );

  // Poll for window closure or success
  const pollTimer = setInterval(() => {
    try {
      if (authWindow?.closed) {
        clearInterval(pollTimer);
        // Window was closed, could be success or cancellation
        // You might want to check the connection status here
        onSuccess?.();
      }
    } catch (error) {
      // Cross-origin error when trying to access closed window
      clearInterval(pollTimer);
      onError?.("Authentication window was closed");
    }
  }, 1000);

  // Cleanup after 5 minutes
  setTimeout(
    () => {
      clearInterval(pollTimer);
      if (authWindow && !authWindow.closed) {
        authWindow.close();
        onError?.("Authentication timed out");
      }
    },
    5 * 60 * 1000,
  );
}
