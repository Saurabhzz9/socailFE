"use client";
import type React from "react";
import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { createPortal } from "react-dom";
import { parseJwt } from "@/lib/utils";
import { InstagramService, GoogleDriveService } from "@/lib/services";
import { useGoogleDriveConnection, useInstagramReels } from "@/hooks/use-api";
import { uploadToS3 } from "@/lib/api";
import { toast } from "sonner";
import { AlertTriangle, CheckCircle, ExternalLink } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { GoogleDriveIntegration } from "@/components/dashboard/google-drive-integration";
import { fetchReelsScraper } from "@/lib/services/instagram.service";
import { uploadInstagramReels } from "@/lib/api";

// Define a type for a Reel
type Reel = {
  id: number;
  caption: string;
  likes: number;
  views: number;
  playCount: number;
  commentCount: number;
  reel_url?: string;
  instagram_username?: string;
  timestamp?: number;
  thumbnail?: string;
};

// Tooltip component with delayed show and fixed overlay
const Tooltip: React.FC<{
  text: string;
  children: React.ReactNode;
  display?: "block" | "inline-block";
}> = ({ text, children, display = "inline-block" }) => {
  const [show, setShow] = useState(false);
  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const childRef = useRef<HTMLSpanElement>(null);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      if (childRef.current) {
        const rect = childRef.current.getBoundingClientRect();
        setCoords({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
        });
        setShow(true);
      }
    }, 2000); // 2 seconds
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShow(false);
  };

  // Touch events for mobile
  const handleTouchStart = () => {
    timeoutRef.current = setTimeout(() => {
      if (childRef.current) {
        const rect = childRef.current.getBoundingClientRect();
        setCoords({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
        });
        setShow(true);
      }
    }, 2000);
  };
  const handleTouchEnd = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShow(false);
  };

  // Tooltip overlay (portal)
  const tooltipNode =
    show && coords
      ? createPortal(
          <div
            className="z-[9999] fixed"
            style={{
              top: coords.top - 8, // 8px above the caption
              left: coords.left + coords.width / 2,
              transform: "translate(-50%, -100%)",
              pointerEvents: "none",
            }}
          >
            <div className="bg-gray-200 text-gray-900 px-5 py-2 rounded-lg text-left text-sm font-medium min-w-[300px] max-w-[400px] break-words shadow-xl border border-gray-300">
              {text}
            </div>
            <div className="w-4 h-4 bg-gray-200 border-l border-b border-gray-300 rotate-45 mx-auto -mt-2"></div>
          </div>,
          document.body,
        )
      : null;

  return (
    <span
      className="relative"
      style={{ display: display }}
      ref={childRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {children}
      {tooltipNode}
    </span>
  );
};

// Add these helper functions at the top of the file, after the imports
const STORAGE_EXPIRY = 12 * 60 * 60 * 1000; // 12 hours in milliseconds

type StoredData<T> = {
  data: T;
  timestamp: number;
};

function saveToStorage<T>(key: string, data: T): void {
  const item: StoredData<T> = {
    data,
    timestamp: Date.now(),
  };
  localStorage.setItem(key, JSON.stringify(item));
}

function getFromStorage<T>(key: string): T | null {
  const item = localStorage.getItem(key);
  if (!item) return null;

  try {
    const parsed = JSON.parse(item) as StoredData<T>;
    const now = Date.now();

    // Check if data has expired
    if (now - parsed.timestamp > STORAGE_EXPIRY) {
      localStorage.removeItem(key);
      return null;
    }

    return parsed.data;
  } catch {
    return null;
  }
}

export default function InstagramDownloader() {
  const { token } = useAuth();
  const [username, setUsername] = useState(() => {
    return getFromStorage<string>("instagram_username") || "";
  });
  const [limit, setLimit] = useState(10);
  const [reels, setReels] = useState<Reel[]>(() => {
    return getFromStorage<Reel[]>("instagram_reels") || [];
  });
  const [selected, setSelected] = useState<number[]>(() => {
    return getFromStorage<number[]>("instagram_selected") || [];
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [thumbnailStates, setThumbnailStates] = useState<
    Record<number, { url: string | null; error: boolean; isLoading: boolean }>
  >({});
  const [storingUserInfo, setStoringUserInfo] = useState(false);
  const [s3UploadLoading, setS3UploadLoading] = useState<number[]>([]);
  const [s3UploadResults, setS3UploadResults] = useState<
    Record<number, string>
  >({});

  const userId = token ? parseJwt(token).user_id : undefined;
  const { isConnected: isDriveConnected, checkConnection } = useGoogleDriveConnection();

  // Save username to localStorage when it changes
  useEffect(() => {
    if (username) {
      saveToStorage("instagram_username", username);
    }
  }, [username]);

  // Save reels to localStorage when they change
  useEffect(() => {
    if (reels.length > 0) {
      saveToStorage("instagram_reels", reels);
    }
  }, [reels]);

  // Save selected reels to localStorage when they change
  useEffect(() => {
    if (selected.length > 0) {
      saveToStorage("instagram_selected", selected);
    }
  }, [selected]);

  // Update the clearData function
  const clearData = () => {
    setReels([]);
    setSelected([]);
    setError(null);
    setUploadError(null);
    setUploadSuccess(false);
    localStorage.removeItem("instagram_reels");
    localStorage.removeItem("instagram_selected");
    localStorage.removeItem("instagram_username");
  };

  // Add a function to check and clear expired data
  const checkExpiredData = () => {
    const username = getFromStorage<string>("instagram_username");
    const reels = getFromStorage<Reel[]>("instagram_reels");
    const selected = getFromStorage<number[]>("instagram_selected");

    if (!username) setUsername("");
    if (!reels) setReels([]);
    if (!selected) setSelected([]);
  };

  // Check for expired data on component mount
  useEffect(() => {
    checkExpiredData();
  }, []);

  // Update the thumbnail loading effect
  useEffect(() => {
    const loadThumbnails = async () => {
      // Set all thumbnails to loading state immediately
      const initialStates: Record<
        number,
        { url: string | null; error: boolean; isLoading: boolean }
      > = {};
      reels.forEach((reel) => {
        if (reel.thumbnail) {
          initialStates[reel.id] = { url: null, error: false, isLoading: true };
        }
      });
      setThumbnailStates(initialStates);

      // Load all thumbnails in parallel
      const loadPromises = reels.map(async (reel) => {
        if (!reel.thumbnail || !token) return;

        try {
          const response = await fetch(
            `http://localhost:8080/api/proxy-image?url=${encodeURIComponent(reel.thumbnail)}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          if (!response.ok) {
            throw new Error("Failed to load image");
          }

          const blob = await response.blob();
          const objectUrl = URL.createObjectURL(blob);

          setThumbnailStates((prev) => ({
            ...prev,
            [reel.id]: { url: objectUrl, error: false, isLoading: false },
          }));
        } catch (err) {
          console.error("Error loading thumbnail:", err);
          setThumbnailStates((prev) => ({
            ...prev,
            [reel.id]: { url: null, error: true, isLoading: false },
          }));
        }
      });

      await Promise.all(loadPromises);
    };

    loadThumbnails();

    // Cleanup function to revoke object URLs
    return () => {
      Object.values(thumbnailStates).forEach((state) => {
        if (state.url) {
          URL.revokeObjectURL(state.url);
        }
      });
    };
  }, [reels, token]);

  // Fetch reels using the new scraper API
  const fetchReels = async () => {
    if (!username) {
      setError("Please enter a username");
      return;
    }

    setLoading(true);
    setError(null);
    setReels([]);
    setSelected([]);

    try {
      const response = await fetchReelsScraper(username, limit);
      // Map API response to local Reel type (add id field if needed)
      const reelsWithId = response.reels.map((reel, idx) => ({
        id: idx + 1, // Assign a local id for selection
        caption: reel.caption,
        likes: reel.likes,
        views: reel.views,
        playCount: reel.play_count,
        commentCount: reel.comment_count,
        reel_url: reel.reel_url,
        instagram_username: reel.instagram_username,
        timestamp: reel.timestamp,
        thumbnail: reel.thumbnail,
      }));
      setReels(reelsWithId);
      toast.success(`Fetched ${reelsWithId.length} reels successfully!`);
    } catch (e: any) {
      setError(e.message || "Unknown error");
      toast.error(`Failed to fetch reels: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  // Get selected reels
  const selectedReels = reels.filter((r) => selected.includes(r.id));

  // Upload to Drive using Instagram service
  const uploadToDrive = async () => {
    if (!token || !userId) {
      toast.error("Authentication required");
      return;
    }

    if (selectedReels.length === 0) {
      toast.error("No reels selected");
      return;
    }

    // Always check Google Drive connection and use the latest result
    const status = await checkConnection();
    console.log(status)
    if (!status || status.has_access_token !== true) {
      toast.error("Google Drive not connected. Please connect first.");
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      // Use the real API call
      await uploadInstagramReels(token, {
        reels: selectedReels.map((r) => ({
          instagram_username: r.instagram_username || username,
          reel_url: r.reel_url!,
          caption: r.caption,
          likes: r.likes,
          views: r.views,
          timestamp: r.timestamp!,
          play_count: r.playCount,
          comment_count: r.commentCount,
          thumbnail: r.thumbnail || "",
        })),
        custom_name: username,
      });
      setUploadSuccess(true);
      toast.success(`Successfully uploaded ${selectedReels.length} reels to Google Drive!`);
      // Trigger Drive Downloads page to refresh
      window.dispatchEvent(new Event("drive:refresh"));
    } catch (e: any) {
      setUploadError(e.message || "Unknown error");
      toast.error(`Upload failed: ${e.message}`);
    } finally {
      setUploading(false);
    }
  };

  // Store Instagram user info using static response for now
  const handleStoreUserInfo = async () => {
    if (!username) {
      toast.error("Please enter a username first");
      return;
    }

    setStoringUserInfo(true);
    try {
      // Using static response for now - API commented out
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      toast.success("User info stored successfully! (Static response)");
    } catch (error: any) {
      toast.error(`Failed to store user info: ${error.message}`);
    } finally {
      setStoringUserInfo(false);
    }
  };

  // Upload to S3
  const handleS3Upload = async (reelId: number, reelUrl: string) => {
    if (!token || !reelUrl) {
      toast.error("Invalid reel URL");
      return;
    }

    setS3UploadLoading((prev) => [...prev, reelId]);
    try {
      const result = await uploadToS3(token, reelUrl);
      setS3UploadResults((prev) => ({ ...prev, [reelId]: result.s3_url }));
      toast.success("Uploaded to S3 successfully!");
    } catch (error: any) {
      toast.error(`S3 upload failed: ${error.message}`);
    } finally {
      setS3UploadLoading((prev) => prev.filter((id) => id !== reelId));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Instagram Downloader
        </h1>
        <p className="text-muted-foreground">
          Fetch and download Instagram reels from any public profile.
        </p>
      </div>

      {/* Google Drive Connection Status */}
      <GoogleDriveIntegration />

      <div className="flex gap-6">
        {/* Main section */}
        <div className="flex-1 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Fetch reel data</CardTitle>
                <CardDescription>
                  Enter an Instagram username to fetch their latest reels
                </CardDescription>
              </div>
              <Button variant="outline" onClick={clearData}>
                Clear Data
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-40"
                />
                <Input
                  type="number"
                  placeholder="Limit"
                  value={limit}
                  onChange={(e) => setLimit(Number(e.target.value))}
                  className="w-24"
                  min={1}
                  max={50}
                />
                <Button onClick={fetchReels} disabled={loading || !username}>
                  {loading ? "Fetching..." : "Fetch (Static Data)"}
                </Button>
              </div>
              {error && <div className="text-red-500 mb-2">{error}</div>}
              {reels.length > 0 && (
                <div>
                  <div className="mb-2">
                    <label>
                      <input
                        type="checkbox"
                        checked={selected.length === reels.length}
                        onChange={(e) =>
                          setSelected(
                            e.target.checked ? reels.map((r) => r.id) : [],
                          )
                        }
                      />{" "}
                      Select All
                    </label>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {reels.map((reel) => (
                      <Card key={reel.id} className="relative">
                        <CardContent className="pt-4">
                          <label className="absolute top-2 left-2">
                            <input
                              type="checkbox"
                              checked={selected.includes(reel.id)}
                              onChange={() => handleSelect(reel.id)}
                            />
                          </label>
                          {reel.thumbnail && (
                            <div className="mb-3 rounded-lg overflow-hidden relative aspect-[4/5] bg-gray-100 max-h-[300px]">
                              {(() => {
                                const state = thumbnailStates[reel.id];
                                return (
                                  <>
                                    {state?.url && (
                                      <img
                                        src={state.url || "/placeholder.svg"}
                                        alt={`Thumbnail for reel ${reel.id}`}
                                        className="w-full h-full object-cover transition-opacity duration-200"
                                        onLoad={(e) => {
                                          e.currentTarget.style.opacity = "1";
                                        }}
                                        style={{ opacity: 0 }}
                                        loading="lazy"
                                      />
                                    )}
                                    {state?.error && (
                                      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                        <span>Failed to load thumbnail</span>
                                      </div>
                                    )}
                                    {state?.isLoading && (
                                      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                        <svg
                                          className="w-8 h-8 animate-spin"
                                          viewBox="0 0 24 24"
                                        >
                                          <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            fill="none"
                                          />
                                          <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                          />
                                        </svg>
                                      </div>
                                    )}
                                  </>
                                );
                              })()}
                            </div>
                          )}
                          <Tooltip text={reel.caption} display="block">
                            <div className="font-semibold mb-1 line-clamp-2 transition-all cursor-pointer max-w-full">
                              {reel.caption}
                            </div>
                          </Tooltip>
                          <div className="text-xs text-muted-foreground mb-2">
                            Reel {reel.id}
                          </div>
                          <div className="flex flex-wrap gap-2 text-xs">
                            <span>
                              ❤️ {reel.likes?.toLocaleString?.() ?? 0}
                            </span>
                            <span>
                              👁️ {reel.views?.toLocaleString?.() ?? 0}
                            </span>
                            <span>
                              ▶️ {reel.playCount?.toLocaleString?.() ?? 0}
                            </span>
                            <span>
                              💬 {reel.commentCount?.toLocaleString?.() ?? 0}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        {/* Download Cart */}
        <div className="w-80">
          <Card>
            <CardHeader>
              <CardTitle>Download Cart</CardTitle>
              <CardDescription>
                {selectedReels.length} reel(s) selected
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal pl-4 space-y-1">
                {selectedReels.map((reel) => (
                  <li key={reel.id}>
                    <div className="font-medium">Reel {reel.id}</div>
                    <div className="w-full overflow-hidden">
                      <Tooltip text={reel.caption} display="inline-block">
                        <div className="text-xs text-muted-foreground line-clamp-1 transition-all cursor-pointer">
                          {reel.caption}
                        </div>
                      </Tooltip>
                    </div>
                  </li>
                ))}
              </ol>
              {selectedReels.length > 0 && (
                <>
                  <Button
                    className="mt-4 w-full"
                    onClick={uploadToDrive}
                    disabled={uploading}
                  >
                    {uploading ? "Uploading..." : "Upload to Drive"}
                  </Button>
                  {uploadError && (
                    <div className="text-red-500 mt-2">{uploadError}</div>
                  )}
                  {uploadSuccess && (
                    <div className="text-green-600 mt-2">
                      Upload successful!
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
