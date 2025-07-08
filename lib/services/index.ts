// =============================================================================
// SERVICES INDEX - Export all service modules
// =============================================================================

export * as AuthService from "./auth.service";
export * as InstagramService from "./instagram.service";
export * as GoogleDriveService from "./google-drive.service";

// Export types for easy access
export type { RegisterData, LoginData, AuthResponse } from "./auth.service";

export type {
  InstagramUserInfo,
  InstagramReel,
  InstagramReelsResponse,
  UploadReelsRequest,
  UploadedReel,
  UploadReelsResponse,
  getInstagramConnectUrl
} from "./instagram.service";

export type { GoogleDriveConnectionStatus } from "./google-drive.service";


