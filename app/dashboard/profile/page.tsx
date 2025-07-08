"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Camera,
  Settings,
  Bell,
  Shield,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

type CreatorProfile = {
  id: string;
  displayName: string;
  username: string;
  email: string;
  bio: string;
  avatar: string;
  timezone: string;
  contentTypes: string[];
  platforms: {
    platform: string;
    username: string;
    isConnected: boolean;
    isActive: boolean;
  }[];
  settings: {
    autoPost: boolean;
    notifications: boolean;
    analytics: boolean;
    contentModeration: boolean;
  };
  stats: {
    totalFollowers: number;
    totalPosts: number;
    engagementRate: number;
    reachThisMonth: number;
  };
};

const mockProfile: CreatorProfile = {
  id: "1",
  displayName: "Creator Gaming",
  username: "creator_gaming",
  email: "creator@gaming.com",
  bio: "Professional gaming content creator. Streaming daily on multiple platforms. Tips, tricks, and epic gameplay!",
  avatar: "https://via.placeholder.com/150x150/4ECDC4/FFFFFF?text=CG",
  timezone: "America/New_York",
  contentTypes: ["Gaming", "Tutorials", "Live Streams", "Reviews"],
  platforms: [
    {
      platform: "instagram",
      username: "@creator_gaming",
      isConnected: true,
      isActive: true,
    },
    {
      platform: "youtube",
      username: "@creatorstudio",
      isConnected: true,
      isActive: false,
    },
    {
      platform: "facebook",
      username: "@gamingpage",
      isConnected: false,
      isActive: false,
    },
    {
      platform: "tiktok",
      username: "@gaming_creator",
      isConnected: false,
      isActive: false,
    },
  ],
  settings: {
    autoPost: true,
    notifications: true,
    analytics: true,
    contentModeration: false,
  },
  stats: {
    totalFollowers: 567800,
    totalPosts: 1247,
    engagementRate: 4.2,
    reachThisMonth: 2400000,
  },
};

const platformIcons = {
  instagram: Instagram,
  youtube: Youtube,
  facebook: Facebook,
  tiktok: Users,
};

const contentTypeOptions = [
  "Gaming",
  "Tutorials",
  "Live Streams",
  "Reviews",
  "Unboxing",
  "Tips & Tricks",
  "Entertainment",
  "Educational",
  "Lifestyle",
  "Tech",
];

export default function CreatorProfilePage() {
  const [profile, setProfile] = useState<CreatorProfile>(mockProfile);
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveProfile = () => {
    // In real app, this would save to backend
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  const handleToggleSetting = (setting: keyof CreatorProfile["settings"]) => {
    setProfile((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        [setting]: !prev.settings[setting],
      },
    }));
  };

  const handleContentTypeToggle = (contentType: string) => {
    setProfile((prev) => ({
      ...prev,
      contentTypes: prev.contentTypes.includes(contentType)
        ? prev.contentTypes.filter((type) => type !== contentType)
        : [...prev.contentTypes, contentType],
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Creator Profile</h1>
          <p className="text-muted-foreground">
            Manage your creator profile and platform settings
          </p>
        </div>
        <Button
          onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
          variant={isEditing ? "default" : "outline"}
        >
          {isEditing ? "Save Changes" : "Edit Profile"}
        </Button>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          {/* Profile Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={profile.avatar} />
                    <AvatarFallback>
                      {profile.displayName.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="space-y-2 flex-1">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Display Name</Label>
                      <Input
                        id="displayName"
                        value={profile.displayName}
                        disabled={!isEditing}
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev,
                            displayName: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={profile.username}
                        disabled={!isEditing}
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev,
                            username: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      disabled={!isEditing}
                      onChange={(e) =>
                        setProfile((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, bio: e.target.value }))
                  }
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={profile.timezone}
                    onValueChange={(value) =>
                      setProfile((prev) => ({ ...prev, timezone: value }))
                    }
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">
                        Eastern Time
                      </SelectItem>
                      <SelectItem value="America/Chicago">
                        Central Time
                      </SelectItem>
                      <SelectItem value="America/Denver">
                        Mountain Time
                      </SelectItem>
                      <SelectItem value="America/Los_Angeles">
                        Pacific Time
                      </SelectItem>
                      <SelectItem value="Europe/London">GMT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Content Types</Label>
                <div className="flex flex-wrap gap-2">
                  {contentTypeOptions.map((type) => (
                    <Badge
                      key={type}
                      variant={
                        profile.contentTypes.includes(type)
                          ? "default"
                          : "outline"
                      }
                      className={`cursor-pointer ${isEditing ? "hover:bg-primary/80" : ""}`}
                      onClick={
                        isEditing
                          ? () => handleContentTypeToggle(type)
                          : undefined
                      }
                    >
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="platforms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Connected Platforms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profile.platforms.map((platform) => {
                  const PlatformIcon =
                    platformIcons[
                      platform.platform as keyof typeof platformIcons
                    ];
                  return (
                    <div
                      key={platform.platform}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="p-2 rounded-lg bg-muted">
                          <PlatformIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-medium capitalize">
                            {platform.platform}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {platform.username}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <Badge
                          variant={platform.isConnected ? "default" : "outline"}
                        >
                          {platform.isConnected ? "Connected" : "Not Connected"}
                        </Badge>
                        {platform.isConnected && (
                          <div className="flex items-center space-x-2">
                            <Label
                              htmlFor={`active-${platform.platform}`}
                              className="text-sm"
                            >
                              Active
                            </Label>
                            <Switch
                              id={`active-${platform.platform}`}
                              checked={platform.isActive}
                              onCheckedChange={(checked) => {
                                setProfile((prev) => ({
                                  ...prev,
                                  platforms: prev.platforms.map((p) =>
                                    p.platform === platform.platform
                                      ? { ...p, isActive: checked }
                                      : p,
                                  ),
                                }));
                              }}
                            />
                          </div>
                        )}
                        <Button
                          variant={platform.isConnected ? "outline" : "default"}
                          size="sm"
                        >
                          {platform.isConnected ? "Manage" : "Connect"}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Creator Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Auto-Post</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically post scheduled content to connected
                      platforms
                    </p>
                  </div>
                  <Switch
                    checked={profile.settings.autoPost}
                    onCheckedChange={() => handleToggleSetting("autoPost")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications about post performance and
                      scheduling
                    </p>
                  </div>
                  <Switch
                    checked={profile.settings.notifications}
                    onCheckedChange={() => handleToggleSetting("notifications")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Analytics Tracking</Label>
                    <p className="text-sm text-muted-foreground">
                      Track engagement and performance metrics across platforms
                    </p>
                  </div>
                  <Switch
                    checked={profile.settings.analytics}
                    onCheckedChange={() => handleToggleSetting("analytics")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Content Moderation</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable AI-powered content moderation before posting
                    </p>
                  </div>
                  <Switch
                    checked={profile.settings.contentModeration}
                    onCheckedChange={() =>
                      handleToggleSetting("contentModeration")
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Total Followers
                    </p>
                    <p className="text-2xl font-bold">
                      {profile.stats.totalFollowers.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-muted-foreground" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Total Posts
                    </p>
                    <p className="text-2xl font-bold">
                      {profile.stats.totalPosts.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Engagement Rate
                    </p>
                    <p className="text-2xl font-bold">
                      {profile.stats.engagementRate}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Reach This Month
                    </p>
                    <p className="text-2xl font-bold">
                      {(profile.stats.reachThisMonth / 1000000).toFixed(1)}M
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
