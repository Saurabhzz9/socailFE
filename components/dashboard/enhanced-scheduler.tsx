"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Instagram,
  Youtube,
  Facebook,
  Users,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  Move,
} from "lucide-react";
import { toast } from "sonner";

type ScheduledPost = {
  id: string;
  content: string;
  platform: "instagram" | "youtube" | "facebook" | "tiktok";
  scheduledDate: string;
  scheduledTime: string;
  status: "scheduled" | "posted" | "failed";
  thumbnail?: string;
  engagement?: {
    likes: number;
    comments: number;
    shares: number;
  };
};

const platformConfig = {
  instagram: { icon: Instagram, color: "bg-pink-500", name: "Instagram" },
  youtube: { icon: Youtube, color: "bg-red-500", name: "YouTube" },
  facebook: { icon: Facebook, color: "bg-blue-600", name: "Facebook" },
  tiktok: { icon: Users, color: "bg-black", name: "TikTok" },
};

const mockPosts: ScheduledPost[] = [
  {
    id: "1",
    content: "New gaming setup reveal! 🎮 What do you think?",
    platform: "instagram",
    scheduledDate: "2024-01-15",
    scheduledTime: "10:00",
    status: "scheduled",
    thumbnail: "https://via.placeholder.com/150x150/FF6B6B/FFFFFF?text=Gaming",
  },
  {
    id: "2",
    content: "Tutorial: How to improve your aim in FPS games",
    platform: "youtube",
    scheduledDate: "2024-01-15",
    scheduledTime: "14:00",
    status: "scheduled",
    thumbnail:
      "https://via.placeholder.com/150x150/4ECDC4/FFFFFF?text=Tutorial",
  },
  {
    id: "3",
    content: "Live streaming tonight at 8PM! Join us for epic gameplay",
    platform: "instagram",
    scheduledDate: "2024-01-16",
    scheduledTime: "20:00",
    status: "scheduled",
    thumbnail: "https://via.placeholder.com/150x150/45B7D1/FFFFFF?text=Live",
  },
  {
    id: "4",
    content: "Gaming tips and tricks compilation",
    platform: "facebook",
    scheduledDate: "2024-01-17",
    scheduledTime: "12:00",
    status: "scheduled",
    thumbnail: "https://via.placeholder.com/150x150/96CEB4/FFFFFF?text=Tips",
  },
];

export function EnhancedScheduler() {
  const [posts, setPosts] = useState<ScheduledPost[]>(mockPosts);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [draggedPost, setDraggedPost] = useState<ScheduledPost | null>(null);

  // Generate calendar weeks
  const generateCalendarWeeks = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);

    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const weeks = [];
    const currentDate = new Date(startDate);

    for (let week = 0; week < 6; week++) {
      const days = [];
      for (let day = 0; day < 7; day++) {
        const dateStr = currentDate.toISOString().split("T")[0];
        const dayPosts = posts.filter((post) => post.scheduledDate === dateStr);

        days.push({
          date: new Date(currentDate),
          dateStr,
          isCurrentMonth: currentDate.getMonth() === currentMonth,
          isToday: currentDate.toDateString() === today.toDateString(),
          posts: dayPosts,
        });

        currentDate.setDate(currentDate.getDate() + 1);
      }
      weeks.push(days);

      if (currentDate.getMonth() !== currentMonth && week > 3) break;
    }

    return weeks;
  };

  const handleDragStart = (e: React.DragEvent, post: ScheduledPost) => {
    setDraggedPost(post);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetDate: string) => {
    e.preventDefault();

    if (!draggedPost) return;

    // Update the post's scheduled date
    setPosts((prev) =>
      prev.map((post) =>
        post.id === draggedPost.id
          ? { ...post, scheduledDate: targetDate }
          : post,
      ),
    );

    setDraggedPost(null);
    toast.success("Post rescheduled successfully!");
  };

  const weeks = generateCalendarWeeks();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Enhanced Scheduler</h2>
          <p className="text-muted-foreground">
            Drag and drop to reschedule posts
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
            <Button
              variant={view === "calendar" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("calendar")}
            >
              <CalendarIcon className="w-4 h-4 mr-1" />
              Calendar
            </Button>
            <Button
              variant={view === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("list")}
            >
              List
            </Button>
          </div>
        </div>
      </div>

      {view === "calendar" ? (
        /* Calendar View */
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CalendarIcon className="w-5 h-5" />
              <span>January 2024</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Calendar Grid */}
            <div className="space-y-4">
              {/* Days of week header */}
              <div className="grid grid-cols-7 gap-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
                      className="text-center text-sm font-medium text-muted-foreground p-2"
                    >
                      {day}
                    </div>
                  ),
                )}
              </div>

              {/* Calendar weeks */}
              <div className="space-y-2">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="grid grid-cols-7 gap-2">
                    {week.map((day, dayIndex) => (
                      <div
                        key={`${weekIndex}-${dayIndex}`}
                        className={`min-h-[120px] p-2 border rounded-lg transition-colors ${
                          day.isCurrentMonth ? "bg-background" : "bg-muted/50"
                        } ${day.isToday ? "ring-2 ring-primary" : ""}`}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, day.dateStr)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`text-sm ${day.isCurrentMonth ? "text-foreground" : "text-muted-foreground"}`}
                          >
                            {day.date.getDate()}
                          </span>
                          {day.posts.length > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {day.posts.length}
                            </Badge>
                          )}
                        </div>

                        <div className="space-y-1">
                          {day.posts.slice(0, 3).map((post) => {
                            const PlatformIcon =
                              platformConfig[post.platform].icon;
                            return (
                              <div
                                key={post.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, post)}
                                className="text-xs p-2 rounded border bg-card cursor-move hover:shadow-md transition-shadow"
                              >
                                <div className="flex items-center space-x-1 mb-1">
                                  <PlatformIcon className="w-3 h-3" />
                                  <span className="font-medium">
                                    {post.scheduledTime}
                                  </span>
                                </div>
                                <p className="line-clamp-2">{post.content}</p>
                              </div>
                            );
                          })}
                          {day.posts.length > 3 && (
                            <div className="text-xs text-muted-foreground text-center py-1">
                              +{day.posts.length - 3} more
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* List View */
        <Card>
          <CardHeader>
            <CardTitle>Scheduled Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {posts.map((post) => {
                const PlatformIcon = platformConfig[post.platform].icon;
                return (
                  <div
                    key={post.id}
                    className="flex items-center space-x-4 p-4 border rounded-lg"
                  >
                    <div
                      className={`p-2 rounded-lg ${platformConfig[post.platform].color}`}
                    >
                      <PlatformIcon className="w-5 h-5 text-white" />
                    </div>

                    <div className="flex-1">
                      <p className="font-medium">{post.content}</p>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center space-x-1">
                          <CalendarIcon className="w-4 h-4" />
                          <span>
                            {new Date(post.scheduledDate).toLocaleDateString()}
                          </span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{post.scheduledTime}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          post.status === "scheduled"
                            ? "default"
                            : post.status === "posted"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {post.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Move className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
