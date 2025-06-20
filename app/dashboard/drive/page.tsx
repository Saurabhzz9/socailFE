"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, Download, CheckCircle, XCircle, X, ChevronDown, RefreshCw } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import { useAuth } from "@/context/AuthContext"

// Helper to parse JWT and extract user_id
function parseJwtLocal(token: string): { user_id?: number } {
  try {
    const base64Url = token.split(".")[1]
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    )
    return JSON.parse(jsonPayload)
  } catch {
    return {}
  }
}

type DriveFile = {
  id: number
  file_name: string
  drive_file_id: string
  shareable_link: string
  uploaded_at: string
  exists_in_drive: boolean
  likes: number
  views: number
  play_count: number
  comment_count: string
  thumbnail: string
}

// Add these helper functions at the top of the file, after the imports
const STORAGE_EXPIRY = 12 * 60 * 60 * 1000 // 12 hours in milliseconds

type StoredData<T> = {
  data: T
  timestamp: number
}

function saveToStorage<T>(key: string, data: T): void {
  const item: StoredData<T> = {
    data,
    timestamp: Date.now(),
  }
  localStorage.setItem(key, JSON.stringify(item))
}

function getFromStorage<T>(key: string): T | null {
  const item = localStorage.getItem(key)
  if (!item) return null

  try {
    const parsed = JSON.parse(item) as StoredData<T>
    const now = Date.now()

    // Check if data has expired
    if (now - parsed.timestamp > STORAGE_EXPIRY) {
      localStorage.removeItem(key)
      return null
    }

    return parsed.data
  } catch {
    return null
  }
}

export default function DriveDownloadsPage() {
  const { token } = useAuth()
  const [files, setFiles] = useState<DriveFile[]>(() => {
    return getFromStorage<DriveFile[]>("driveDownloadsFiles") || []
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [initialLoadDone, setInitialLoadDone] = useState(() => {
    return getFromStorage<boolean>("driveDownloadsInitialLoadDone") || false
  })

  // Thumbnail state: { [file.id]: { url, error, isLoading } }
  const [thumbnailStates, setThumbnailStates] = useState<
    Record<number, { url: string | null; error: boolean; isLoading: boolean }>
  >({})

  // Filter state
  const [showFilters, setShowFilters] = useState(false)
  const [likeMin, setLikeMin] = useState("")
  const [likeMax, setLikeMax] = useState("")
  const [viewMin, setViewMin] = useState("")
  const [viewMax, setViewMax] = useState("")
  const [playMin, setPlayMin] = useState("")
  const [playMax, setPlayMax] = useState("")
  const [existsFilter, setExistsFilter] = useState("all") // all, true, false

  // Sort state and ref (move above logic that uses them)
  const [showSort, setShowSort] = useState(false)
  const [sortOption, setSortOption] = useState("uploaded_desc")
  const sortPanelRef = useRef<HTMLDivElement>(null)

  // Ref for filter panel
  const filterPanelRef = useRef<HTMLDivElement>(null)

  // Close filter panel on outside click
  useEffect(() => {
    if (!showFilters) return
    function handleClick(e: MouseEvent) {
      if (filterPanelRef.current && !filterPanelRef.current.contains(e.target as Node)) {
        setShowFilters(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [showFilters])

  // Close sort panel on outside click
  useEffect(() => {
    if (!showSort) return
    function handleClick(e: MouseEvent) {
      if (sortPanelRef.current && !sortPanelRef.current.contains(e.target as Node)) {
        setShowSort(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [showSort])

  // Thumbnail loading effect
  useEffect(() => {
    // Cleanup previous object URLs
    return () => {
      Object.values(thumbnailStates).forEach((state) => {
        if (state.url) URL.revokeObjectURL(state.url)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // Set all thumbnails to loading state immediately
    const initialStates: Record<number, { url: string | null; error: boolean; isLoading: boolean }> = {}
    files.forEach((file) => {
      if (file.thumbnail) {
        initialStates[file.id] = { url: null, error: false, isLoading: true }
      }
    })
    setThumbnailStates(initialStates)

    // Load all thumbnails in parallel
    const loadThumbnails = async () => {
      await Promise.all(
        files.map(async (file) => {
          if (!file.thumbnail || !token) return

          try {
            const response = await fetch(
              `http://localhost:8080/api/proxy-image?url=${encodeURIComponent(file.thumbnail)}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              },
            )

            if (!response.ok) {
              const errorText = await response.text()
              console.error(`Failed to load thumbnail for file ${file.id}:`, {
                status: response.status,
                error: errorText,
              })
              throw new Error(`Failed to load image: ${response.status} ${errorText}`)
            }

            const blob = await response.blob()
            const objectUrl = URL.createObjectURL(blob)
            setThumbnailStates((prev) => ({
              ...prev,
              [file.id]: { url: objectUrl, error: false, isLoading: false },
            }))
          } catch (err) {
            console.error(`Error loading thumbnail for file ${file.id}:`, err)
            setThumbnailStates((prev) => ({
              ...prev,
              [file.id]: { url: null, error: true, isLoading: false },
            }))
          }
        }),
      )
    }

    loadThumbnails()
    // Cleanup function to revoke object URLs
    return () => {
      Object.values(thumbnailStates).forEach((state) => {
        if (state.url) URL.revokeObjectURL(state.url)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files, token])

  const fetchFiles = async () => {
    if (!token) return
    setLoading(true)
    setError(null)
    try {
      const { user_id } = parseJwtLocal(token)
      const resp = await fetch(`http://localhost:8080/api/verify-drive-files/${user_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}))
        console.error("Files API error:", err)
        throw new Error(err.error || "Failed to fetch drive files")
      }

      const data = await resp.json()
      const newFiles = data.files || data || []
      setFiles(newFiles)
      saveToStorage("driveDownloadsFiles", newFiles)
    } catch (e: any) {
      console.error("Error fetching files:", e)
      setError(e.message || "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  // Initial load only
  useEffect(() => {
    if (!initialLoadDone && token) {
      fetchFiles()
      setInitialLoadDone(true)
      saveToStorage("driveDownloadsInitialLoadDone", true)
    }
  }, [token, initialLoadDone])

  // Check for expired data on mount
  useEffect(() => {
    const checkExpiredData = () => {
      const cachedFiles = getFromStorage<DriveFile[]>("driveDownloadsFiles")
      const cachedInitialLoad = getFromStorage<boolean>("driveDownloadsInitialLoadDone")

      if (!cachedFiles) {
        setFiles([])
      }
      if (!cachedInitialLoad) {
        setInitialLoadDone(false)
      }
    }

    checkExpiredData()
  }, [])

  // Filtering logic
  const filteredFiles = files.filter((file) => {
    // Search filter
    if (searchTerm && !file.file_name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false
    }
    if (likeMin && file.likes < Number(likeMin)) return false
    if (likeMax && file.likes > Number(likeMax)) return false
    if (viewMin && file.views < Number(viewMin)) return false
    if (viewMax && file.views > Number(viewMax)) return false
    if (playMin && file.play_count < Number(playMin)) return false
    if (playMax && file.play_count > Number(playMax)) return false
    if (existsFilter === "true" && !file.exists_in_drive) return false
    if (existsFilter === "false" && file.exists_in_drive) return false
    return true
  })

  // Sorting logic
  const sortedFiles = [...filteredFiles].sort((a, b) => {
    switch (sortOption) {
      case "file_asc":
        return a.file_name.localeCompare(b.file_name)
      case "file_desc":
        return b.file_name.localeCompare(a.file_name)
      case "uploaded_asc":
        return new Date(a.uploaded_at).getTime() - new Date(b.uploaded_at).getTime()
      case "uploaded_desc":
        return new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime()
      case "likes_asc":
        return a.likes - b.likes
      case "likes_desc":
        return b.likes - a.likes
      case "views_asc":
        return a.views - b.views
      case "views_desc":
        return b.views - a.views
      case "play_asc":
        return a.play_count - b.play_count
      case "play_desc":
        return b.play_count - a.play_count
      default:
        return 0
    }
  })

  const clearFilters = () => {
    setLikeMin("")
    setLikeMax("")
    setViewMin("")
    setViewMax("")
    setPlayMin("")
    setPlayMax("")
    setExistsFilter("all")
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Drive Downloads</h1>
          <p className="text-muted-foreground">Access and download files from your connected drives.</p>
        </div>
        <Button variant="outline" onClick={fetchFiles} disabled={loading} className="flex items-center gap-2">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Available Files</CardTitle>
          <CardDescription>Browse and download files from your drives</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4 gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search files..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative flex gap-2">
              <Button variant="outline" size="icon" onClick={() => setShowSort((v) => !v)}>
                <ChevronDown className="h-4 w-4" />
                <span className="sr-only">Sort</span>
              </Button>
              {showSort && (
                <div
                  ref={sortPanelRef}
                  className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 p-3 space-y-1"
                >
                  <div className="font-semibold mb-2 text-base">Sort By</div>
                  <button
                    className={`block w-full text-left px-2 py-1 rounded hover:bg-gray-100 ${sortOption === "uploaded_desc" ? "bg-gray-200" : ""}`}
                    onClick={() => {
                      setSortOption("uploaded_desc")
                      setShowSort(false)
                    }}
                  >
                    Uploaded (Newest)
                  </button>
                  <button
                    className={`block w-full text-left px-2 py-1 rounded hover:bg-gray-100 ${sortOption === "uploaded_asc" ? "bg-gray-200" : ""}`}
                    onClick={() => {
                      setSortOption("uploaded_asc")
                      setShowSort(false)
                    }}
                  >
                    Uploaded (Oldest)
                  </button>
                  <button
                    className={`block w-full text-left px-2 py-1 rounded hover:bg-gray-100 ${sortOption === "file_asc" ? "bg-gray-200" : ""}`}
                    onClick={() => {
                      setSortOption("file_asc")
                      setShowSort(false)
                    }}
                  >
                    File Name (A-Z)
                  </button>
                  <button
                    className={`block w-full text-left px-2 py-1 rounded hover:bg-gray-100 ${sortOption === "file_desc" ? "bg-gray-200" : ""}`}
                    onClick={() => {
                      setSortOption("file_desc")
                      setShowSort(false)
                    }}
                  >
                    File Name (Z-A)
                  </button>
                  <button
                    className={`block w-full text-left px-2 py-1 rounded hover:bg-gray-100 ${sortOption === "likes_desc" ? "bg-gray-200" : ""}`}
                    onClick={() => {
                      setSortOption("likes_desc")
                      setShowSort(false)
                    }}
                  >
                    Likes (High-Low)
                  </button>
                  <button
                    className={`block w-full text-left px-2 py-1 rounded hover:bg-gray-100 ${sortOption === "likes_asc" ? "bg-gray-200" : ""}`}
                    onClick={() => {
                      setSortOption("likes_asc")
                      setShowSort(false)
                    }}
                  >
                    Likes (Low-High)
                  </button>
                  <button
                    className={`block w-full text-left px-2 py-1 rounded hover:bg-gray-100 ${sortOption === "views_desc" ? "bg-gray-200" : ""}`}
                    onClick={() => {
                      setSortOption("views_desc")
                      setShowSort(false)
                    }}
                  >
                    Views (High-Low)
                  </button>
                  <button
                    className={`block w-full text-left px-2 py-1 rounded hover:bg-gray-100 ${sortOption === "views_asc" ? "bg-gray-200" : ""}`}
                    onClick={() => {
                      setSortOption("views_asc")
                      setShowSort(false)
                    }}
                  >
                    Views (Low-High)
                  </button>
                  <button
                    className={`block w-full text-left px-2 py-1 rounded hover:bg-gray-100 ${sortOption === "play_desc" ? "bg-gray-200" : ""}`}
                    onClick={() => {
                      setSortOption("play_desc")
                      setShowSort(false)
                    }}
                  >
                    Play Count (High-Low)
                  </button>
                  <button
                    className={`block w-full text-left px-2 py-1 rounded hover:bg-gray-100 ${sortOption === "play_asc" ? "bg-gray-200" : ""}`}
                    onClick={() => {
                      setSortOption("play_asc")
                      setShowSort(false)
                    }}
                  >
                    Play Count (Low-High)
                  </button>
                </div>
              )}
              <Button variant="outline" size="icon" onClick={() => setShowFilters((v) => !v)}>
                <Filter className="h-4 w-4" />
              </Button>
              {showFilters && (
                <div
                  ref={filterPanelRef}
                  className="absolute right-0 mt-2 w-80 bg-gray-50 border border-gray-200 rounded-xl shadow-2xl z-50 p-5 space-y-4"
                  style={{ minWidth: 300 }}
                >
                  <button
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
                    onClick={() => setShowFilters(false)}
                    aria-label="Close filter panel"
                    type="button"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <div className="font-semibold mb-2 text-lg">Filters</div>
                  <div className="flex gap-2 items-center">
                    <span className="w-24 text-xs">Likes</span>
                    <Input
                      type="number"
                      min={0}
                      value={likeMin}
                      onChange={(e) => setLikeMin(e.target.value)}
                      placeholder="Min"
                      className="w-16"
                    />
                    <Input
                      type="number"
                      min={0}
                      value={likeMax}
                      onChange={(e) => setLikeMax(e.target.value)}
                      placeholder="Max"
                      className="w-16"
                    />
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="w-24 text-xs">Views</span>
                    <Input
                      type="number"
                      min={0}
                      value={viewMin}
                      onChange={(e) => setViewMin(e.target.value)}
                      placeholder="Min"
                      className="w-16"
                    />
                    <Input
                      type="number"
                      min={0}
                      value={viewMax}
                      onChange={(e) => setViewMax(e.target.value)}
                      placeholder="Max"
                      className="w-16"
                    />
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="w-24 text-xs">Play Count</span>
                    <Input
                      type="number"
                      min={0}
                      value={playMin}
                      onChange={(e) => setPlayMin(e.target.value)}
                      placeholder="Min"
                      className="w-16"
                    />
                    <Input
                      type="number"
                      min={0}
                      value={playMax}
                      onChange={(e) => setPlayMax(e.target.value)}
                      placeholder="Max"
                      className="w-16"
                    />
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="w-24 text-xs">Exists in Drive</span>
                    <select
                      value={existsFilter}
                      onChange={(e) => setExistsFilter(e.target.value)}
                      className="border rounded px-2 py-1 text-xs"
                    >
                      <option value="all">All</option>
                      <option value="true">Exists</option>
                      <option value="false">Missing</option>
                    </select>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-2" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
          {loading && <div className="text-center text-muted-foreground py-10">Loading files...</div>}
          {error && <div className="text-center text-red-500 py-10">{error}</div>}
          {!loading && !error && sortedFiles.length === 0 && (
            <div className="flex items-center justify-center h-[200px] text-muted-foreground">
              No files found in your drive.
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedFiles.map((file) => (
              <Card key={file.id} className="relative border">
                <CardContent className="pt-4 pb-2">
                  <div className="flex items-center gap-2 mb-2">
                    {file.exists_in_drive ? (
                      <span className="flex items-center gap-1 text-green-600 text-xs font-semibold">
                        <CheckCircle className="w-4 h-4" /> Exists in Drive
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-500 text-xs font-semibold">
                        <XCircle className="w-4 h-4" /> Missing from Drive
                      </span>
                    )}
                  </div>
                  {file.thumbnail ? (
                    <div className="relative w-full aspect-video mb-2 rounded-lg overflow-hidden">
                      {thumbnailStates[file.id]?.isLoading ? (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 animate-pulse">
                          Loading...
                        </div>
                      ) : thumbnailStates[file.id]?.error ? (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-red-400">
                          Failed to load
                        </div>
                      ) : thumbnailStates[file.id]?.url !== null ? (
                        <img
                          src={thumbnailStates[file.id]?.url || undefined}
                          alt={file.file_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <span className="text-gray-400 text-sm">No thumbnail</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full aspect-video mb-2 rounded-lg bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">No thumbnail</span>
                    </div>
                  )}
                  <div className="font-semibold text-base mb-1 break-words">{file.file_name}</div>
                  <div className="text-xs text-muted-foreground mb-2">
                    Uploaded: {new Date(file.uploaded_at).toLocaleString()}
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs mb-2">
                    <span>❤️ {file.likes}</span>
                    <span>👁️ {file.views}</span>
                    <span>▶️ {file.play_count}</span>
                    <span>💬 {file.comment_count}</span>
                  </div>
                  {file.exists_in_drive && file.shareable_link && (
                    <a href={file.shareable_link} target="_blank" rel="noopener noreferrer">
                      <Button className="w-full mt-2" variant="secondary">
                        <Download className="w-4 h-4 mr-2" /> Download
                      </Button>
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
