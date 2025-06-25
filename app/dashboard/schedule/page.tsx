"use client"
import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Download, Instagram, Youtube, Zap } from "lucide-react"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { parseJwt } from "@/lib/utils"
import { useAuth } from "@/context/AuthContext"
import { toast } from "sonner"

// Scheduled posts fetched from backend
type ScheduledPost = {
  id: number
  user_id: string
  video_url: string
  caption: string
  scheduled_time: string
  is_posted: boolean
  created_at: string
  thumbnail?: string
}

const weekDays = [
  { day: "Mon", date: "Monday", posts: 1 },
  { day: "Tue", date: "Tuesday", posts: 1 },
  { day: "Wed", date: "Wednesday", posts: 1 },
  { day: "Thu", date: "Thursday", posts: 0 },
  { day: "Fri", date: "Friday", posts: 1 },
  { day: "Sat", date: "Saturday", posts: 1 },
  { day: "Sun", date: "Sunday", posts: 0 },
]

const platformIcons = {
  youtube: Youtube,
  instagram: Instagram,
  tiktok: Zap,
}

const platformColors = {
  youtube: "bg-red-500",
  instagram: "bg-pink-500",
  tiktok: "bg-black",
}

// Add these helper functions for localStorage caching
const STORAGE_EXPIRY = 12 * 60 * 60 * 1000 // 12 hours in milliseconds

type StoredData<T> = {
  data: T
  timestamp: number
}

function getFromStorage<T>(key: string): T | null {
  const item = localStorage.getItem(key)
  if (!item) return null
  try {
    const parsed = JSON.parse(item) as StoredData<T>
    const now = Date.now()
    if (now - parsed.timestamp > STORAGE_EXPIRY) {
      localStorage.removeItem(key)
      return null
    }
    return parsed.data
  } catch {
    return null
  }
}

export default function SchedulePage() {
  const [selectedPlatform, setSelectedPlatform] = useState("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [step, setStep] = useState<1 | 2>(1)
  const [driveFiles, setDriveFiles] = useState<any[]>([])
  const [loadingFiles, setLoadingFiles] = useState(false)
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [caption, setCaption] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const { token } = useAuth()
  const userInfo = token ? parseJwt(token) : null
  const [thumbnailStates, setThumbnailStates] = useState<Record<number, { url: string | null; error: boolean; isLoading: boolean }>>({})
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([])
  const [loadingScheduled, setLoadingScheduled] = useState(false)

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
    const initialStates: Record<number, { url: string | null; error: boolean; isLoading: boolean }> = {}
    files.forEach((file) => {
      if (file.thumbnail) {
        initialStates[file.id] = { url: null, error: false, isLoading: true }
      }
    })
    setThumbnailStates(initialStates)
  }, [dialogOpen]);

  // Load thumbnails via proxy when driveFiles change
  useEffect(() => {
    if (!dialogOpen || !token) return
    const filesToLoad = driveFiles.filter((file) => file.thumbnail)
    filesToLoad.forEach(async (file) => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/proxy-image?url=${encodeURIComponent(file.thumbnail)}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )
        if (!response.ok) throw new Error("Failed to load image")
        const blob = await response.blob()
        const objectUrl = URL.createObjectURL(blob)
        setThumbnailStates((prev) => ({
          ...prev,
          [file.id]: { url: objectUrl, error: false, isLoading: false },
        }))
      } catch {
        setThumbnailStates((prev) => ({
          ...prev,
          [file.id]: { url: null, error: true, isLoading: false },
        }))
      }
    })
    // Cleanup function to revoke object URLs
    return () => {
      Object.values(thumbnailStates).forEach((state) => {
        if (state.url) URL.revokeObjectURL(state.url)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [driveFiles, dialogOpen, token])

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

  // Combine date and time into ISO string
  function getScheduledTime() {
    if (!selectedDate || !selectedTime) return null
    const [hours, minutes] = selectedTime.split(":")
    const date = new Date(selectedDate)
    date.setHours(Number(hours))
    date.setMinutes(Number(minutes))
    date.setSeconds(0)
    date.setMilliseconds(0)
    return date.toISOString()
  }

  // Handle schedule post
  async function handleSchedulePost() {
    if (!selectedFileId || !selectedDate || !selectedTime || !token || !userInfo?.user_id) {
      toast.error("Please select a video, date, and time.")
      return
    }
    // Validate scheduled time is in the future
    const scheduledTime = getScheduledTime();
    if (scheduledTime && new Date(scheduledTime) <= new Date()) {
      toast.error("Scheduled time must be in the future.");
      return;
    }
    const selectedFile = driveFiles.find(f => f.drive_file_id === selectedFileId);
    const thumbnailUrl = selectedFile?.thumbnail || "";
    setSubmitting(true)
    try {
      const res = await fetch(`http://localhost:8080/schedule-post?user_id=${userInfo.user_id}`, {
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
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || "Failed to schedule post")
      }
      toast.success("Content scheduled successfully!")
      setDialogOpen(false)
      setSelectedFileId(null)
      setSelectedDate(undefined)
      setSelectedTime("")
    } catch (e: any) {
      toast.error(e.message || "Failed to schedule post")
    } finally {
      setSubmitting(false)
    }
  }

  // Fetch scheduled posts from backend
  const fetchScheduledPosts = useCallback(async () => {
    setLoadingScheduled(true)
    try {
      const res = await fetch("http://localhost:8080/api/scheduled-posts", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) {
        throw new Error("Failed to fetch scheduled posts")
      }
      const data = await res.json()
      console.log("[ScheduledPosts] Backend response:", data)
      setScheduledPosts(data)
    } catch (err) {
      console.error("[ScheduledPosts] Fetch error:", err)
      toast.error("Failed to fetch scheduled posts")
    } finally {
      setLoadingScheduled(false)
    }
  }, [token])

  useEffect(() => {
    fetchScheduledPosts()
  }, [fetchScheduledPosts])

  // You can add platform filtering if you want, for now show all
  const filteredPosts = scheduledPosts
  console.log("[ScheduledPosts] Filtered posts:", filteredPosts)

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
    const initialStates: Record<number, { url: string | null; error: boolean; isLoading: boolean }> = {};
    scheduledPosts.forEach((post) => {
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
          console.log(`[Thumbnail] Fetch start: post.id=${post.id}, url=${post.thumbnail}`);
          try {
            const response = await fetch(
              `http://localhost:8080/api/proxy-image?url=${encodeURIComponent(post.thumbnail)}`,
              token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
            );
            if (!response.ok) {
              const errorText = await response.text();
              console.error(`[Thumbnail] Fetch failed: post.id=${post.id}, status=${response.status}, error=${errorText}`);
              throw new Error(`Failed to load image: ${response.status} ${errorText}`);
            }
            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);
            setThumbnailStates((prev) => ({
              ...prev,
              [post.id]: { url: objectUrl, error: false, isLoading: false },
            }));
            console.log(`[Thumbnail] Fetch success: post.id=${post.id}`);
          } catch (err) {
            console.error(`[Thumbnail] Exception: post.id=${post.id}, error=`, err);
            setThumbnailStates((prev) => ({
              ...prev,
              [post.id]: { url: null, error: true, isLoading: false },
            }));
          }
        })
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
  for (let i = 0; i < 7; i++) postsByWeekday[i] = [];
  scheduledPosts.forEach(post => {
    const idx = getWeekdayIndex(post.scheduled_time);
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
              <h1 className="text-3xl font-bold tracking-tight">Content Scheduler</h1>
              <p className="text-muted-foreground">Plan, organize and optimize your content across all platforms</p>
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
            Add Content
          </Button>
        </div>
      </div>

      {/* Account and Platform Selection */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Account:</label>
              <select className="px-3 py-2 border border-gray-300 rounded-lg bg-black text-white">
                <option>@creator_gaming</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Platform TZ</span>
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Schedule */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Weekly Schedule</CardTitle>
            <div className="flex space-x-2">
              <Button
                variant={selectedPlatform === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPlatform("all")}
              >
                All
              </Button>
              <Button
                variant={selectedPlatform === "youtube" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPlatform("youtube")}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                YouTube
              </Button>
              <Button
                variant={selectedPlatform === "instagram" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPlatform("instagram")}
                className="bg-pink-500 hover:bg-pink-600 text-white"
              >
                Instagram
              </Button>
              <Button
                variant={selectedPlatform === "tiktok" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPlatform("tiktok")}
                className="bg-black hover:bg-gray-800 text-white"
              >
                TikTok
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-4">
            {weekDays.map((day, index) => (
              <div key={day.day} className="text-center">
                <div className="font-semibold text-lg mb-2">{day.day}</div>
                <div className="text-sm text-gray-500 mb-4">{day.date}</div>
                <div className="text-blue-500 text-sm mb-4">
                  {postsByWeekday[index].length} post{postsByWeekday[index].length !== 1 ? "s" : ""}
                </div>
                {postsByWeekday[index].map((post, i) => (
                  <Card
                    key={post.id}
                    className={
                      // Use platform color for border/background if you want to match the old design
                      post.video_url?.includes("youtube")
                        ? "border-red-200 bg-red-50 mt-2"
                        : post.video_url?.includes("tiktok")
                        ? "border-gray-200 bg-gray-50 mt-2"
                        : "border-pink-200 bg-pink-50 mt-2"
                    }
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center space-x-2 mb-2">
                        {/* Platform badge: hardcoded Instagram for now, can be dynamic later */}
                        <Instagram className="w-4 h-4 text-pink-500" />
                        <span className="text-xs text-pink-600">Instagram</span>
                      </div>
                      <p className="text-xs text-gray-700 line-clamp-2">{post.caption || "(No caption)"}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scheduled Posts List */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loadingScheduled ? (
              <div className="text-center text-muted-foreground py-10">Loading scheduled posts...</div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center text-muted-foreground py-10">No upcoming posts scheduled.</div>
            ) : (
              filteredPosts.map((post) => {
                console.log(`[PostRender] post.id=${post.id}, hasThumbnail=${!!post.thumbnail}`);
                return (
                  <div key={post.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50">
                    {post.thumbnail ? (
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                        {thumbnailStates[post.id]?.isLoading ? (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100 animate-pulse">
                            Loading...
                          </div>
                        ) : thumbnailStates[post.id]?.error ? (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-red-400">
                            Failed to load
                          </div>
                        ) : thumbnailStates[post.id]?.url !== null ? (
                          <img
                            src={thumbnailStates[post.id]?.url || undefined}
                            alt="Post thumbnail"
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <span className="text-gray-400 text-sm">No thumbnail</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <img
                        src="/placeholder.svg"
                        alt="Post thumbnail"
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge variant="secondary" className="text-pink-500 flex items-center gap-1">
                          <Instagram className="w-4 h-4" />
                          Instagram
                        </Badge>
                      </div>
                      <h3 className="font-medium text-gray-900">{post.caption || "(No caption)"}</h3>
                      <p className="text-sm text-gray-500">
                        Scheduled for {new Date(post.scheduled_time).toLocaleDateString()} at{" "}
                        {new Date(post.scheduled_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      {post.is_posted ? "Posted" : "Scheduled"}
                    </Badge>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule New Content</DialogTitle>
            <DialogDescription>
              {step === 1
                ? "Select a video to schedule."
                : "Choose date and time for your scheduled post."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {step === 1 && (
              <>
                <div className="font-semibold mb-2">Select Video</div>
                {loadingFiles ? (
                  <div className="text-center text-muted-foreground py-4">Loading videos...</div>
                ) : driveFiles.length === 0 ? (
                  <div className="text-center text-muted-foreground py-4">No videos found in your drive.</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-64 overflow-y-auto">
                    {driveFiles.map((file: any) => (
                      <div
                        key={file.id}
                        className={`flex flex-col items-center p-3 border rounded-lg cursor-pointer transition min-h-[140px] min-w-0 ${selectedFileId === file.drive_file_id ? "border-blue-500 bg-blue-50" : "hover:border-blue-300"}`}
                        onClick={() => setSelectedFileId(file.drive_file_id)}
                        style={{ maxWidth: 220 }}
                      >
                        <img
                          src={
                            thumbnailStates[file.id]?.isLoading
                              ? undefined
                              : thumbnailStates[file.id]?.error
                              ? "/placeholder.svg"
                              : thumbnailStates[file.id]?.url || "/placeholder.svg"
                          }
                          alt={file.file_name}
                          className="w-20 h-20 rounded object-cover bg-gray-100 mb-2"
                        />
                        {thumbnailStates[file.id]?.isLoading && (
                          <div className="w-20 h-20 flex items-center justify-center absolute bg-gray-100 rounded mb-2">
                            <span className="text-xs text-gray-400">Loading...</span>
                          </div>
                        )}
                        {thumbnailStates[file.id]?.error && !thumbnailStates[file.id]?.isLoading && (
                          <div className="w-20 h-20 flex items-center justify-center absolute bg-gray-100 rounded mb-2">
                            <span className="text-xs text-red-400">Failed</span>
                          </div>
                        )}
                        <div className="w-full text-center">
                          <div className="font-medium text-gray-900 text-sm truncate" title={file.file_name}>
                            {file.file_name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Uploaded: {new Date(file.uploaded_at).toLocaleDateString()}
                          </div>
                        </div>
                        <input
                          type="radio"
                          checked={selectedFileId === file.drive_file_id}
                          onChange={() => setSelectedFileId(file.drive_file_id)}
                          className="accent-blue-500 mt-2"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
            {step === 2 && (
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div>
                  <div className="font-semibold mb-2">Select Date</div>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                    disabled={(date) => date < getTodayMidnight()}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="font-semibold mb-2">Select Time</div>
                  <Input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-32"
                    min={selectedDate && new Date(selectedDate).toDateString() === new Date().toDateString() ? getMinTimeForToday() : undefined}
                  />
                  <div className="font-semibold mb-2 mt-4">Caption</div>
                  <Input
                    type="text"
                    placeholder="Enter caption (optional)"
                    value={caption}
                    onChange={e => setCaption(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            {step === 1 && (
              <Button
                onClick={() => setStep(2)}
                disabled={!selectedFileId}
              >
                Next
              </Button>
            )}
            {step === 2 && (
              <div className="flex w-full justify-between gap-2">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button
                  onClick={handleSchedulePost}
                  disabled={submitting || !selectedFileId || !selectedDate || !selectedTime}
                >
                  {submitting ? "Scheduling..." : "Schedule"}
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
