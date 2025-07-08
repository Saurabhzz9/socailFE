import { handleApiResponse } from "../api";

const API_BASE_URL = "http://localhost:8080";

// =============================================================================
// AUTHENTICATION SERVICE - All auth related API calls
// =============================================================================

export interface RegisterData {
  full_name: string;
  email: string;
  username: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

/**
 * Register a new user
 * @param userData - User registration data
 */
export async function register(userData: RegisterData) {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  return handleApiResponse<AuthResponse>(response);
}

/**
 * Login user with email and password
 * @param credentials - User login credentials
 */
export async function login(credentials: LoginData) {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  return handleApiResponse<AuthResponse>(response);
}

/**
 * Get Google OAuth URL for user authentication
 */
export function getGoogleAuthUrl(): string {
  return `${API_BASE_URL}/api/v1/auth/google`;
}

/**
 * Open Google authentication in a new window
 * @param onSuccess - Callback when authentication is successful
 * @param onError - Callback when authentication fails
 */
export function authenticateWithGoogle(
  onSuccess?: (token: string) => void,
  onError?: (error: string) => void,
) {
  const authUrl = getGoogleAuthUrl();
  const authWindow = window.open(
    authUrl,
    "googleAuth",
    "width=600,height=600,scrollbars=yes,resizable=yes",
  );

  // Poll for window closure or success
  const pollTimer = setInterval(() => {
    try {
      if (authWindow?.closed) {
        clearInterval(pollTimer);
        // Window was closed, could be success or cancellation
        // In a real implementation, you'd need to handle the OAuth callback
        // and extract the token from the response
        onSuccess?.(""); // You'd pass the actual token here
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
