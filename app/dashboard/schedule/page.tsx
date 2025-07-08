"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Download,
  Instagram,
  Youtube,
  Zap,
  Facebook,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { parseJwt } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { EnhancedScheduler } from "@/components/dashboard/enhanced-scheduler";

// Scheduled posts fetched from backend
type ScheduledPost = {
  id: number;
  user_id: string;
  video_url: string;
  caption: string;
  scheduled_time: string;
  is_posted: boolean;
  created_at: string;
  thumbnail?: string;
};

const platformIcons = {
  youtube: Youtube,
  instagram: Instagram,
  tiktok: Zap,
};

const platformColors = {
  youtube: "bg-red-500",
  instagram: "bg-pink-500",
  tiktok: "bg-black",
};

// Add these helper functions for localStorage caching
const STORAGE_EXPIRY = 12 * 60 * 60 * 1000; // 12 hours in milliseconds

type StoredData<T> = {
  data: T;
  timestamp: number;
};

function getFromStorage<T>(key: string): T | null {
  const item = localStorage.getItem(key);
  if (!item) return null;
  try {
    const parsed = JSON.parse(item) as StoredData<T>;
    const now = Date.now();
    if (now - parsed.timestamp > STORAGE_EXPIRY) {
      localStorage.removeItem(key);
      return null;
    }
    return parsed.data;
  } catch {
    return null;
  }
}

export default function SchedulePage() {
  const [platformFilter, setPlatformFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [driveFiles, setDriveFiles] = useState<any[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [caption, setCaption] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("instagram");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { token } = useAuth();
  const userInfo = token ? parseJwt(token) : null;
  const [thumbnailStates, setThumbnailStates] = useState<
    Record<number, { url: string | null; error: boolean; isLoading: boolean }>
  >({});
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [loadingScheduled, setLoadingScheduled] = useState(false);

  // Load drive files from localStorage when dialog opens
  useEffect(() => {
    if (!dialogOpen) return;
    setStep(1); // Reset to step 1 when dialog opens
    setSelectedFileId(null);
    setSelectedDate(undefined);
    setSelectedTime("");
    setCaption("");
    setLoadingFiles(true);
    const files = getFromStorage<any[]>("driveDownloadsFiles") || [];
    setDriveFiles(files);
    setLoadingFiles(false);
    // Prepare thumbnail loading state
    const initialStates: Record<
      number,
      { url: string | null; error: boolean; isLoading: boolean }
    > = {};
    files.forEach((file) => {
      if (file.thumbnail) {
        initialStates[file.id] = { url: null, error: false, isLoading: true };
      }
    });
    setThumbnailStates(initialStates);
  }, [dialogOpen]);

  // Load thumbnails via proxy when driveFiles change
  useEffect(() => {
    if (!dialogOpen || !token) return;
    const filesToLoad = driveFiles.filter((file) => file.thumbnail);
    filesToLoad.forEach(async (file) => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/proxy-image?url=${encodeURIComponent(file.thumbnail)}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (!response.ok) throw new Error("Failed to load image");
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        setThumbnailStates((prev) => ({
          ...prev,
          [file.id]: { url: objectUrl, error: false, isLoading: false },
        }));
      } catch {
        setThumbnailStates((prev) => ({
          ...prev,
          [file.id]: { url: null, error: true, isLoading: false },
        }));
      }
    });
    // Cleanup function to revoke object URLs
    return () => {
      Object.values(thumbnailStates).forEach((state) => {
        if (state.url) URL.revokeObjectURL(state.url);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [driveFiles, dialogOpen, token]);

  // Helper to get today's date at midnight
  function getTodayMidnight() {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  }

  // Helper to get min time for today in HH:mm format
  function getMinTimeForToday() {
    const now = new Date();
    return now.toTimeString().slice(0, 5);
  }

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset dialog state
  const resetDialogState = () => {
    setStep(1);
    setSelectedFileId(null);
    setSelectedDate(undefined);
    setSelectedTime("");
    setCaption("");
    setSelectedFile(null);
    setFilePreview(null);
    setSelectedPlatform("instagram");
  };

  // Combine date and time into ISO string
  function getScheduledTime() {
    if (!selectedDate || !selectedTime) return null;
    const [hours, minutes] = selectedTime.split(":");
    const date = new Date(selectedDate);
    date.setHours(Number(hours));
    date.setMinutes(Number(minutes));
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date.toISOString();
  }

  // Handle schedule post
  async function handleSchedulePost() {
    if (
      !selectedFileId ||
      !selectedDate ||
      !selectedTime ||
      !token ||
      !userInfo?.user_id
    ) {
      toast.error("Please select a video, date, and time.");
      return;
    }
    // Validate scheduled time is in the future
    const scheduledTime = getScheduledTime();
    if (scheduledTime && new Date(scheduledTime) <= new Date()) {
      toast.error("Scheduled time must be in the future.");
      return;
    }
    const selectedFile = driveFiles.find(
      (f) => f.drive_file_id === selectedFileId,
    );
    const thumbnailUrl = selectedFile?.thumbnail || "";
    setSubmitting(true);
    try {
      const res = await fetch(
        `http://localhost:8080/schedule-post?user_id=${userInfo.user_id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            file_id: selectedFileId,
            caption: caption,
            scheduled_time: scheduledTime,
            thumbnail: thumbnailUrl,
          }),
        },
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to schedule post");
      }
      toast.success("Content scheduled successfully!");
      setDialogOpen(false);
      setSelectedFileId(null);
      setSelectedDate(undefined);
      setSelectedTime("");
    } catch (e: any) {
      toast.error(e.message || "Failed to schedule post");
    } finally {
      setSubmitting(false);
    }
  }

  // Fetch scheduled posts from backend
  const fetchScheduledPosts = useCallback(async () => {
    setLoadingScheduled(true);
    try {
      const res = await fetch("http://localhost:8080/api/scheduled-posts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        throw new Error("Failed to fetch scheduled posts");
      }
      const data = await res.json();
      console.log("[ScheduledPosts] Backend response:", data);
      setScheduledPosts(data);
    } catch (err) {
      console.error("[ScheduledPosts] Fetch error:", err);
      toast.error("Failed to fetch scheduled posts");
    } finally {
      setLoadingScheduled(false);
    }
  }, [token]);

  useEffect(() => {
    fetchScheduledPosts();
  }, [fetchScheduledPosts]);

  // You can add platform filtering if you want, for now show all
  const filteredPosts = scheduledPosts;
  console.log("[ScheduledPosts] Filtered posts:", filteredPosts);

  useEffect(() => {
    // Cleanup previous object URLs
    return () => {
      Object.values(thumbnailStates).forEach((state) => {
        if (state.url) URL.revokeObjectURL(state.url);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Set all thumbnails to loading state immediately
    const initialStates: Record<
      number,
      { url: string | null; error: boolean; isLoading: boolean }
    > = {};
    scheduledPosts?.forEach((post) => {
      if (post.thumbnail) {
        initialStates[post.id] = { url: null, error: false, isLoading: true };
      }
    });
    setThumbnailStates(initialStates);

    // Load all thumbnails in parallel
    const loadThumbnails = async () => {
      await Promise.all(
        scheduledPosts.map(async (post) => {
          if (!post.thumbnail) return;
          console.log("Token for proxy fetch:", token, "Post ID:", post.id);
          console.log(
            `[Thumbnail] Fetch start: post.id=${post.id}, url=${post.thumbnail}`,
          );
          try {
            const response = await fetch(
              `http://localhost:8080/api/proxy-image?url=${encodeURIComponent(post.thumbnail)}`,
              token
                ? { headers: { Authorization: `Bearer ${token}` } }
                : undefined,
            );
            if (!response.ok) {
              const errorText = await response.text();
              console.error(
                `[Thumbnail] Fetch failed: post.id=${post.id}, status=${response.status}, error=${errorText}`,
              );
              throw new Error(
                `Failed to load image: ${response.status} ${errorText}`,
              );
            }
            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);
            setThumbnailStates((prev) => ({
              ...prev,
              [post.id]: { url: objectUrl, error: false, isLoading: false },
            }));
            console.log(`[Thumbnail] Fetch success: post.id=${post.id}`);
          } catch (err) {
            console.error(
              `[Thumbnail] Exception: post.id=${post.id}, error=`,
              err,
            );
            setThumbnailStates((prev) => ({
              ...prev,
              [post.id]: { url: null, error: true, isLoading: false },
            }));
          }
        }),
      );
    };
    loadThumbnails();
    // Cleanup function to revoke object URLs
    return () => {
      Object.values(thumbnailStates).forEach((state) => {
        if (state.url) URL.revokeObjectURL(state.url);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduledPosts, token]);

  // Helper: Get weekday index (0=Mon, 6=Sun) from a date string
  function getWeekdayIndex(dateString: string) {
    const date = new Date(dateString);
    // getDay: 0=Sun, 1=Mon, ..., 6=Sat; we want 0=Mon, ..., 6=Sun
    return (date.getDay() + 6) % 7;
  }

  // Group scheduled posts by weekday
  const postsByWeekday: Record<number, ScheduledPost[]> = {};

  for (let i = 0; i < 7; i++) {
    postsByWeekday[i] = [];
  }

  scheduledPosts?.forEach((post) => {
    const idx = getWeekdayIndex(post.scheduled_time); // make sure this returns a number 0-6
    postsByWeekday[idx].push(post);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3">
            <CalendarIcon className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Content Scheduler
              </h1>
              <p className="text-muted-foreground">
                Schedule and manage your content across all platforms
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            CSV Import
          </Button>
          <Button size="sm" onClick={() => setDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Schedule Content
          </Button>
        </div>
      </div>

      {/* Account and Platform Selection */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-6">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Active Account:
                </label>
                <select className="px-3 py-2 border border-gray-300 rounded-lg bg-black text-white">
                  <option>@creator_gaming (Instagram)</option>
                  <option>@creatorstudio (YouTube)</option>
                  <option>@gamingpage (Facebook)</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Connected Platforms:
                </label>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-pink-500 text-white">
                    <Instagram className="w-3 h-3 mr-1" />
                    Instagram
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-red-500 border-red-500"
                  >
                    <Youtube className="w-3 h-3 mr-1" />
                    YouTube
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-gray-400 border-gray-300"
                  >
                    <Zap className="w-3 h-3 mr-1" />
                    TikTok
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Platform Status</span>
              <div
                className="w-3 h-3 bg-green-500 rounded-full"
                title="All platforms connected"
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Scheduler with Drag & Drop */}
      <EnhancedScheduler />

      {/* Scheduled Posts Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Scheduled Posts</CardTitle>
            <Badge variant="outline">
              {filteredPosts?.length || 0} posts scheduled
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {loadingScheduled ? (
            <div className="text-center text-muted-foreground py-10">
              Loading scheduled posts...
            </div>
          ) : filteredPosts?.length === 0 ? (
            <div className="text-center text-muted-foreground py-10">
              <CalendarIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p>No posts scheduled yet</p>
              <p className="text-sm">Click "Schedule Content" to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Content</th>
                    <th className="text-left py-3 px-4 font-medium">
                      Platform
                    </th>
                    <th className="text-left py-3 px-4 font-medium">
                      Scheduled Date
                    </th>
                    <th className="text-left py-3 px-4 font-medium">Time</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPosts?.map((post) => (
                    <tr key={post.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          {post?.thumbnail ? (
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                              {thumbnailStates[post.id]?.isLoading ? (
                                <div className="w-full h-full flex items-center justify-center animate-pulse">
                                  <div className="w-6 h-6 bg-gray-300 rounded"></div>
                                </div>
                              ) : thumbnailStates[post.id]?.error ? (
                                <div className="w-full h-full flex items-center justify-center text-red-400">
                                  <span className="text-xs">✕</span>
                                </div>
                              ) : thumbnailStates[post.id]?.url ? (
                                <img
                                  src={
                                    thumbnailStates[post.id]?.url || undefined
                                  }
                                  alt="Post thumbnail"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                  <span className="text-gray-400 text-xs">
                                    📷
                                  </span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                              <span className="text-gray-400 text-xs">📷</span>
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 line-clamp-2">
                              {post.caption || "(No caption)"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge
                          variant="secondary"
                          className="flex items-center gap-1 w-fit"
                        >
                          <Instagram className="w-3 h-3" />
                          Instagram
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {new Date(post.scheduled_time).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {new Date(post.scheduled_time).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-4 px-4">
                        <Badge
                          variant={post.is_posted ? "default" : "outline"}
                          className={
                            post.is_posted
                              ? "bg-green-100 text-green-800"
                              : "text-blue-600 border-blue-600"
                          }
                        >
                          {post.is_posted ? "Posted" : "Scheduled"}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetDialogState();
        }}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Schedule New Post</DialogTitle>
            <DialogDescription>
              Upload your content and schedule it across your connected
              platforms
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* Platform Selection */}
            <div className="space-y-2">
              <Label className="text-base font-semibold">Select Platform</Label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant={
                    selectedPlatform === "instagram" ? "default" : "outline"
                  }
                  onClick={() => setSelectedPlatform("instagram")}
                  className="flex items-center space-x-2"
                >
                  <Instagram className="w-4 h-4" />
                  <span>Instagram</span>
                </Button>
                <Button
                  variant={
                    selectedPlatform === "youtube" ? "default" : "outline"
                  }
                  onClick={() => setSelectedPlatform("youtube")}
                  className="flex items-center space-x-2"
                >
                  <Youtube className="w-4 h-4" />
                  <span>YouTube</span>
                </Button>
                <Button
                  variant={
                    selectedPlatform === "facebook" ? "default" : "outline"
                  }
                  onClick={() => setSelectedPlatform("facebook")}
                  className="flex items-center space-x-2"
                >
                  <Facebook className="w-4 h-4" />
                  <span>Facebook</span>
                </Button>
                <Button
                  variant={
                    selectedPlatform === "tiktok" ? "default" : "outline"
                  }
                  onClick={() => setSelectedPlatform("tiktok")}
                  className="flex items-center space-x-2"
                >
                  <Zap className="w-4 h-4" />
                  <span>TikTok</span>
                </Button>
              </div>
            </div>

            {/* Media Upload */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Upload Media</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {filePreview ? (
                  <div className="space-y-3">
                    {selectedFile?.type?.startsWith("image/") ? (
                      <img
                        src={filePreview}
                        alt="Preview"
                        className="max-w-full max-h-48 mx-auto rounded-lg object-cover"
                      />
                    ) : (
                      <video
                        src={filePreview}
                        className="max-w-full max-h-48 mx-auto rounded-lg"
                        controls
                      />
                    )}
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-sm text-muted-foreground">
                        {selectedFile?.name}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedFile(null);
                          setFilePreview(null);
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="mx-auto w-12 h-12 text-gray-400">
                      <svg
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          accept="image/*,video/*"
                          onChange={handleFileSelect}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF, MP4 up to 100MB
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Caption */}
            <div className="space-y-2">
              <Label htmlFor="caption" className="text-base font-semibold">
                Caption
              </Label>
              <Textarea
                id="caption"
                placeholder="Write your caption here..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={4}
                className="resize-none"
              />
              <div className="text-right text-sm text-muted-foreground">
                {caption.length}/2200
              </div>
            </div>

            {/* Schedule Settings */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="schedule-date"
                  className="text-base font-semibold"
                >
                  Date
                </Label>
                <Input
                  id="schedule-date"
                  type="date"
                  value={
                    selectedDate ? selectedDate.toISOString().split("T")[0] : ""
                  }
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="schedule-time"
                  className="text-base font-semibold"
                >
                  Time
                </Label>
                <Input
                  id="schedule-time"
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  min={
                    selectedDate &&
                    new Date(selectedDate).toDateString() ===
                      new Date().toDateString()
                      ? getMinTimeForToday()
                      : undefined
                  }
                />
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSchedulePost}
              disabled={
                submitting ||
                !selectedFile ||
                !selectedDate ||
                !selectedTime ||
                !caption.trim()
              }
              className="w-full sm:w-auto"
            >
              {submitting ? "Scheduling..." : "Schedule Post"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
