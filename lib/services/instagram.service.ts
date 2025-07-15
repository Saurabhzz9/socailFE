import { getAuthHeaders, handleApiResponse } from "../api";

const API_BASE_URL = "http://localhost:8080";

// =============================================================================
// INSTAGRAM SERVICE - All Instagram related API calls
// =============================================================================

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
  user_id: number;
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

/**
 * Fetch Instagram user profile information
 * @param token - Auth token
 * @param username - Instagram username
 */
export async function fetchUserInfo(token: string, username: string) {
  const response = await fetch(`${API_BASE_URL}/api/v1/instagram/user-info`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify({ username }),
  });
  return handleApiResponse<{ info: InstagramUserInfo }>(response);
}

/**
 * Fetch Instagram user reels - COMMENTED OUT FOR NOW
 * @param token - Auth token
 * @param userId - Instagram user ID (can be username)
 * @param limit - Number of reels to fetch (default: 10)
 */
// export async function fetchUserReels(token: string, userId: string, limit = 10) {
//   const response = await fetch(`${API_BASE_URL}/api/v1/instagram/user-reels`, {
//     method: "POST",
//     headers: getAuthHeaders(token),
//     body: JSON.stringify({ user_id: userId, limit }),
//   });
//   return handleApiResponse<InstagramReelsResponse>(response);
// }

/**
 * Upload Instagram reels to Google Drive - COMMENTED OUT FOR NOW
 * @param token - Auth token
 * @param data - Upload request data
 */
// export async function uploadReels(token: string, data: UploadReelsRequest) {
//   const response = await fetch(`${API_BASE_URL}/api/v1/instagram/upload-reels`, {
//     method: "POST",
//     headers: getAuthHeaders(token),
//     body: JSON.stringify(data),
//   });
//   return handleApiResponse<UploadReelsResponse>(response);
// }

/**
 * Store Instagram user info in database - COMMENTED OUT FOR NOW
 * @param token - Auth token
 * @param username - Instagram username
 */
// export async function storeUserInfo(token: string, username: string) {
//   const response = await fetch(`${API_BASE_URL}/api/v1/instagram/store-user-info`, {
//     method: "POST",
//     headers: getAuthHeaders(token),
//     body: JSON.stringify({ username }),
//   });
//   return handleApiResponse<{ message: string; data: InstagramUserInfo }>(response);
// }
// Open Meta OAuth connect page
export async function getInstagramConnectUrl(userId: number) {
  return `${API_BASE_URL}/api/v1/instagram/connect?user_id=${userId}`;
}

// Check if user has Instagram connected
export async function checkInstagramConnection(token: string, userId: number) {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/instagram/check-connection`,
    {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify({ user_id: userId }),
    },
  );
  return handleApiResponse<{
    connected: boolean;
    username?: string;
  }>(response);
}

/**
 * Fetch Instagram reels using the scraper endpoint (no auth required)
 * @param username - Instagram username
 * @param limit - Number of reels to fetch
 */
export async function fetchReelsScraper(username: string, limit: number) {
  const response = await fetch(`${API_BASE_URL}/api/v1/scraper/instagram/reels`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, limit }),
  });
  return handleApiResponse<InstagramReelsResponse>(response);
}
