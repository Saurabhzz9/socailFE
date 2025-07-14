"use client";
import { useState, useEffect } from "react";
import type React from "react";
import { useTheme } from "next-themes";
import { useRouter, useSearchParams } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { parseJwt } from "@/lib/utils";
import { getProfile, updateProfile } from "@/lib/api";
import { InstagramService } from "@/lib/services";
import { toast } from "sonner";
import {
  User,
  Bell,
  Shield,
  Zap,
  Palette,
  Upload,
  Eye,
  EyeOff,
  Database,
  ExternalLink,
  Instagram,
  Heart,
  MessageCircle,
  Share,
  Bookmark,
  MoreHorizontal,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GoogleDriveIntegration } from "@/components/dashboard/google-drive-integration";

export default function SettingsPage() {
  const { token } = useAuth();
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false,
  });
  const [backupFrequency, setBackupFrequency] = useState<
    "off" | "weekly" | "monthly"
  >("off");
  const [frequencyLoading, setFrequencyLoading] = useState(false);
  const [instagramUsername, setInstagramUsername] = useState("");
  const [instagramUserInfo, setInstagramUserInfo] = useState<any>(null);
  const [instagramLoading, setInstagramLoading] = useState(false);
  const [instagramConnected, setInstagramConnected] = useState(false);

  const userInfo = token ? parseJwt(token) : null;
  const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const initialTab = searchParams?.get("tab") || "profile";
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (searchParams) {
      const tab = searchParams.get("tab");
      if (tab && tab !== activeTab) setActiveTab(tab);
    }
  }, [typeof window !== "undefined" ? window.location.search : ""]);

  useEffect(() => {
    if (!token || !userInfo?.user_id) return;

    const checkConnection = async () => {
      try {
        const result = await InstagramService.checkInstagramConnection(
          token,
          userInfo.user_id,
        );
        setInstagramConnected(result.connected);
        if (result.username) setInstagramUsername(result.username);
      } catch (err) {
        console.error("Failed to check Instagram connection:", err);
      }
    };

    checkConnection();
  }, [token, userInfo]);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    getProfile(token)
      .then((data) => {
        setUserProfile(data);
        setBackupFrequency(data.backup_frequency || "off");
      })
      .catch((error) => {
        toast.error(`Failed to load profile: ${error.message}`);
      })
      .finally(() => setLoading(false));
  }, [token]);

  // Update password using the provided API
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setUpdating(true);
    try {
      // Static response for now - API commented out
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call

      toast.success("Password updated successfully (Static response)");
      setPasswordData({
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      console.error("Error updating password:", error);
      toast.error(`Failed to update password: ${error.message}`);
    } finally {
      setUpdating(false);
    }
  };

  // Add after handlePasswordUpdate and before handleFrequencyUpdate
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !userProfile) return;
    setUpdating(true);
    try {
      const updateData: any = {
        full_name: userProfile.full_name,
        username: userProfile.username,
        company: userProfile.company,
        timezone: userProfile.timezone,
        profile_image_url: userProfile.profile_image_url,
        profile_image: userProfile.profile_image,
        backup_frequency: backupFrequency,
      };
      // Only send password if not Google user and provided
      if (!userProfile.is_google_user && passwordData.newPassword) {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
          toast.error("New passwords don't match");
          setUpdating(false);
          return;
        }
        if (passwordData.newPassword.length < 8) {
          toast.error("Password must be at least 8 characters long");
          setUpdating(false);
          return;
        }
        updateData.password = passwordData.newPassword;
      }
      await updateProfile(token, updateData);
      toast.success("Profile updated successfully");
      setPasswordData({ newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      toast.error(`Failed to update profile: ${error.message}`);
    } finally {
      setUpdating(false);
    }
  };

  // Handle backup frequency update
  const handleFrequencyUpdate = async (
    frequency: "off" | "weekly" | "monthly",
  ) => {
    if (!token) return;

    setFrequencyLoading(true);
    try {
      // Assuming updateProfile handles backup frequency update
      await updateProfile(token, { backup_frequency: frequency });
      setBackupFrequency(frequency);
      toast.success(`Backup frequency updated to ${frequency}`);
    } catch (error: any) {
      toast.error(`Failed to update backup frequency: ${error.message}`);
    } finally {
      setFrequencyLoading(false);
    }
  };

  // Handle Google Drive connection
  const handleGoogleDriveConnect = () => {
    if (userInfo?.user_id) {
      const authUrl = getGoogleDriveAuthUrl(userInfo.user_id);
      window.open(authUrl, "_blank");
    }
  };

  // Fetch Instagram user info using real API
  const handleFetchInstagramInfo = async () => {
    if (!token || !instagramUsername.trim()) {
      toast.error("Please enter an Instagram username");
      return;
    }

    setInstagramLoading(true);
    try {
      const response = await InstagramService.fetchUserInfo(
        token,
        instagramUsername.trim(),
      );

      // Handle the actual API response structure: response.info[0].data.user
      const userData = response.info[0]?.data?.user;
      const latestPosts = response.info[0]?.latestPosts || [];

      if (userData) {
        // Map ALL available fields from the API response
        const mappedUserInfo = {
          // Basic Info
          id: userData.id,
          username: userData.username,
          full_name: userData.fullName,
          biography: userData.biography,

          // URLs
          input_url: userData.inputUrl,
          profile_url: userData.url,
          external_url: userData.externalUrl,
          external_url_shimmed: userData.externalUrlShimmed,

          // Profile Pictures
          profile_pic_url: userData.profilePicUrl,
          profile_pic_url_hd: userData.profilePicUrlHD,

          // Counts
          followers_count: userData.followersCount,
          following_count: userData.followsCount,
          posts_count: userData.postsCount,
          igtv_video_count: userData.igtvVideoCount,
          highlight_reel_count: userData.highlightReelCount,

          // Account Status
          is_verified: userData.verified,
          is_private: userData.private,
          is_business_account: userData.isBusinessAccount,
          joined_recently: userData.joinedRecently,
          has_channel: userData.hasChannel,

          // Business Info
          business_category: userData.businessCategoryName,

          // Technical IDs
          fbid: userData.fbid,
          external_urls: userData.externalUrls,

          // Latest Posts
          latest_posts: latestPosts,
        };

        setInstagramUserInfo(mappedUserInfo);
        toast.success("Instagram user info fetched successfully!");
      } else {
        throw new Error("Invalid API response structure");
      }
    } catch (error: any) {
      toast.error(`Failed to fetch Instagram info: ${error.message}`);
      setInstagramUserInfo(null);
    } finally {
      setInstagramLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Failed to load profile
          </h2>
          <p className="text-muted-foreground">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and application preferences.
        </p>
      </div>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profile" className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger
            value="instagram"
            className="flex items-center space-x-2"
          >
            <Instagram className="w-4 h-4" />
            <span>Instagram</span>
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center space-x-2"
          >
            <Bell className="w-4 h-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span>Privacy</span>
          </TabsTrigger>
          <TabsTrigger
            value="integrations"
            className="flex items-center space-x-2"
          >
            <Zap className="w-4 h-4" />
            <span>Integrations</span>
          </TabsTrigger>
          <TabsTrigger
            value="appearance"
            className="flex items-center space-x-2"
          >
            <Palette className="w-4 h-4" />
            <span>Appearance</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <p className="text-sm text-muted-foreground">
                Update your personal information and account details.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Upload */}
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-gray-400" />
                </div>
                <div>
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload new photo</span>
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    JPG, PNG up to 10MB
                  </p>
                </div>
              </div>

              {/* Profile Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={userProfile.full_name || ""}
                    onChange={(e) =>
                      setUserProfile((prev: any) =>
                        prev ? { ...prev, full_name: e.target.value } : null,
                      )
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={userProfile.email || ""}
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={userProfile.username || ""}
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <select
                    id="timezone"
                    value={userProfile.timezone || ""}
                    onChange={(e) =>
                      setUserProfile((prev: any) =>
                        prev ? { ...prev, timezone: e.target.value } : null,
                      )
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"

                  >
                    <option value="">Select Timezone</option>
                    <option value="UTC-5">Eastern Time (UTC-5)</option>
                    <option value="UTC-6">Central Time (UTC-6)</option>
                    <option value="UTC-7">Mountain Time (UTC-7)</option>
                    <option value="UTC-8">Pacific Time (UTC-8)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={userProfile.company || ""}
                  onChange={(e) =>
                    setUserProfile((prev: any) =>
                      prev ? { ...prev, company: e.target.value } : null,
                    )
                  }
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={handleProfileUpdate} disabled={updating}>
                  {updating ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Password Update */}
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <p className="text-sm text-muted-foreground">
                Update your password to keep your account secure.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPasswords.new ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData((prev) => ({
                          ...prev,
                          newPassword: e.target.value,
                        }))
                      }
                      required
                      minLength={8}
                      placeholder="Enter new password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() =>
                        setShowPasswords((prev) => ({
                          ...prev,
                          new: !prev.new,
                        }))
                      }
                    >
                      {showPasswords.new ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showPasswords.confirm ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData((prev) => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }))
                      }
                      required
                      minLength={8}
                      placeholder="Confirm new password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() =>
                        setShowPasswords((prev) => ({
                          ...prev,
                          confirm: !prev.confirm,
                        }))
                      }
                    >
                      {showPasswords.confirm ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={updating}>
                    {updating ? "Updating..." : "Update Password"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-foreground">
                    User ID
                  </Label>
                  <p className="text-sm">{userProfile.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-foreground">
                    Plan ID
                  </Label>
                  <p className="text-sm">{userProfile.plan_id || userProfile.planID}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-foreground">
                    Account Created
                  </Label>
                  <p className="text-sm">
                    {userProfile.created_at
                      ? new Date(userProfile.created_at).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-foreground">
                    Google Connected
                  </Label>
                  <p className="text-sm">
                    {userProfile.is_google_user ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Instagram Tab */}
        <TabsContent value="instagram" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Instagram className="w-5 h-5" />
                <span>Instagram User Info</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Fetch and view Instagram user profile information
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter Instagram username"
                  value={instagramUsername}
                  onChange={(e) => setInstagramUsername(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && handleFetchInstagramInfo()
                  }
                />
                <Button
                  onClick={handleFetchInstagramInfo}
                  disabled={instagramLoading || !instagramUsername.trim()}
                >
                  {instagramLoading ? "Fetching..." : "Fetch Info"}
                </Button>
              </div>

              {instagramUserInfo && (
                <div className="border rounded-lg p-6 space-y-6">
                  {/* Header with Profile Picture */}
                  <div className="flex items-start space-x-6">
                    <div className="flex-shrink-0">
                      {instagramUserInfo.profile_pic_url_hd ? (
                        <img
                          src={`https://images.weserv.nl/?url=${encodeURIComponent(
                            instagramUserInfo.profile_pic_url_hd.replace(
                              /^https?:\/\//,
                              "",
                            ),
                          )}`}
                          alt={instagramUserInfo.username}
                          className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                          <User className="w-10 h-10 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-xl text-foreground">
                          {instagramUserInfo.full_name}
                        </h3>
                        {instagramUserInfo.is_verified && (
                          <Badge
                            variant="default"
                            className="bg-blue-500 text-white text-xs"
                          >
                            ✓ Verified
                          </Badge>
                        )}
                        {instagramUserInfo.is_business_account && (
                          <Badge variant="outline" className="text-xs">
                            Business
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground font-medium">
                        @{instagramUserInfo.username}
                      </p>
                      <div className="flex gap-2 mt-2">
                        {instagramUserInfo.is_private && (
                          <Badge variant="secondary" className="text-xs">
                            Private
                          </Badge>
                        )}
                        {instagramUserInfo.joined_recently && (
                          <Badge variant="outline" className="text-xs">
                            New User
                          </Badge>
                        )}
                        {instagramUserInfo.has_channel && (
                          <Badge variant="outline" className="text-xs">
                            Has Channel
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <div className="font-bold text-2xl text-blue-600">
                        {instagramUserInfo.posts_count?.toLocaleString() || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">Posts</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-2xl text-green-600">
                        {instagramUserInfo.followers_count?.toLocaleString() ||
                          0}
                      </div>
                      <div className="text-sm text-muted-foreground">Followers</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-2xl text-purple-600">
                        {instagramUserInfo.following_count?.toLocaleString() ||
                          0}
                      </div>
                      <div className="text-sm text-muted-foreground">Following</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-2xl text-orange-600">
                        {instagramUserInfo.igtv_video_count?.toLocaleString() ||
                          0}
                      </div>
                      <div className="text-sm text-muted-foreground">IGTV Videos</div>
                    </div>
                  </div>

                  {/* Biography */}
                  {instagramUserInfo.biography && (
                    <div>
                      <Label className="text-sm font-semibold text-foreground">
                        Biography
                      </Label>
                      <p className="text-sm mt-2 p-3 bg-gray-50 rounded border-l-4 border-blue-500">
                        {instagramUserInfo.biography}
                      </p>
                    </div>
                  )}

                  {/* Business Information */}
                  {(instagramUserInfo.business_category ||
                    instagramUserInfo.is_business_account) && (
                    <div>
                      <Label className="text-sm font-semibold text-foreground">
                        Business Information
                      </Label>
                      <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                        {instagramUserInfo.business_category && (
                          <div>
                            <span className="text-muted-foreground">Category:</span>
                            <p className="font-medium">
                              {instagramUserInfo.business_category}
                            </p>
                          </div>
                        )}
                        <div>
                          <span className="text-muted-foreground">Account Type:</span>
                          <p className="font-medium">
                            {instagramUserInfo.is_business_account
                              ? "Business Account"
                              : "Personal Account"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Latest Posts - Instagram Style */}
                  {instagramUserInfo.latest_posts &&
                    instagramUserInfo.latest_posts.length > 0 && (
                      <div>
                        <Label className="text-sm font-semibold text-foreground mb-4 block">
                          Latest Posts
                        </Label>
                        {instagramUserInfo.latest_posts.map(
                          (post: any, index: number) => (
                            <div
                              key={index}
                              className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6 max-w-lg mx-auto"
                            >
                              {/* Post Header */}
                              <div className="flex items-center justify-between p-3">
                                <div className="flex items-center space-x-3">
                                  <img
                                    src={`https://images.weserv.nl/?url=${encodeURIComponent(
                                      (
                                        instagramUserInfo.profile_pic_url_hd ||
                                        instagramUserInfo.profile_pic_url
                                      ).replace(/^https?:\/\//, ""),
                                    )}`}
                                    alt={instagramUserInfo.username}
                                    className="w-8 h-8 rounded-full object-cover"
                                  />

                                  <div>
                                    <div className="flex items-center gap-1">
                                      <span className="font-semibold text-sm">
                                        {instagramUserInfo.username}
                                      </span>
                                      {instagramUserInfo.is_verified && (
                                        <svg
                                          className="w-3 h-3 text-blue-500"
                                          fill="currentColor"
                                          viewBox="0 0 20 20"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                          />
                                        </svg>
                                      )}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                      {new Date(
                                        post.timestamp * 1000,
                                      ).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="p-1"
                                >
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </div>

                              {/* Post Image Placeholder */}
                              <div className="relative">
                                {/* Live Instagram Embed */}
                                <div className="relative">
                                  <iframe
                                    src={`https://www.instagram.com/p/${post.url
                                      .split("/")
                                      .filter(Boolean)
                                      .pop()}/embed`}
                                    className="w-full aspect-square border-none rounded-t-lg"
                                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
                                    loading="lazy"
                                  />
                                </div>

                                {post.videoViewCount > 0 && (
                                  <div className="absolute top-3 right-3 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                                    <svg
                                      className="w-3 h-3"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    {post.videoViewCount?.toLocaleString()}
                                  </div>
                                )}
                              </div>

                              {/* Post Actions */}
                              <div className="p-3">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center space-x-4">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="p-0 hover:bg-transparent"
                                    >
                                      <Heart className="w-6 h-6 hover:text-red-500 transition-colors" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="p-0 hover:bg-transparent"
                                    >
                                      <MessageCircle className="w-6 h-6 hover:text-gray-600 transition-colors" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="p-0 hover:bg-transparent"
                                    >
                                      <Share className="w-6 h-6 hover:text-gray-600 transition-colors" />
                                    </Button>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="p-0 hover:bg-transparent"
                                  >
                                    <Bookmark className="w-6 h-6 hover:text-gray-600 transition-colors" />
                                  </Button>
                                </div>

                                {/* Likes Count */}
                                <div className="mb-2">
                                  <span className="font-semibold text-sm">
                                    {post.likesCount?.toLocaleString()} likes
                                  </span>
                                </div>

                                {/* Caption */}
                                <div className="mb-2">
                                  <span className="font-semibold text-sm mr-2">
                                    {instagramUserInfo.username}
                                  </span>
                                  <span className="text-sm">
                                    {post.caption}
                                  </span>
                                </div>

                                {/* Comments Count */}
                                {post.commentsCount > 0 && (
                                  <div className="mb-2">
                                    <button className="text-sm text-gray-500 hover:text-gray-700">
                                      View all{" "}
                                      {post.commentsCount?.toLocaleString()}{" "}
                                      comments
                                    </button>
                                  </div>
                                )}

                                {/* Time and View on Instagram */}
                                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                  <span className="text-xs text-muted-foreground uppercase tracking-wide">
                                    {new Date(
                                      post.timestamp * 1000,
                                    ).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                    })}
                                  </span>
                                  <a
                                    href={post.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                    View on Instagram
                                  </a>
                                </div>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other Tabs - Placeholder Content */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <p className="text-sm text-muted-foreground">
                Configure how you receive notifications.
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Notification settings coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <p className="text-sm text-muted-foreground">
                Manage your privacy and data preferences.
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Privacy settings coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          {/* Google Drive Integration */}
          <GoogleDriveIntegration />

          {/* Instagram Integration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Instagram className="w-5 h-5 text-pink-500" />
                <span>Instagram Integration</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Connect your Instagram Business account via Meta.
              </p>
            </CardHeader>

            <CardContent className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold">
                  {instagramConnected ? "✅ Connected" : "❌ Not Connected"}
                </div>
                {instagramUsername && (
                  <p className="text-xs text-muted-foreground">
                    @{instagramUsername}
                  </p>
                )}
              </div>

              <Button
                onClick={async () => {
                  const connectUrl =
                    await InstagramService.getInstagramConnectUrl(
                      userInfo.user_id,
                    );
                  window.open(connectUrl, "_blank");
                }}
                size="sm"
                variant={instagramConnected ? "outline" : "default"}
              >
                {instagramConnected ? "Reconnect" : "Connect"}
              </Button>
            </CardContent>
          </Card>

          {/* Backup Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Backup Settings</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Configure automatic backup frequency
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="backup-off"
                    name="backup-frequency"
                    checked={backupFrequency === "off"}
                    onChange={() => handleFrequencyUpdate("off")}
                    disabled={frequencyLoading}
                  />
                  <Label htmlFor="backup-off" className="cursor-pointer">
                    <div className="flex items-center space-x-2">
                      <span>Off</span>
                      <Badge variant="secondary">No automatic backups</Badge>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="backup-weekly"
                    name="backup-frequency"
                    checked={backupFrequency === "weekly"}
                    onChange={() => handleFrequencyUpdate("weekly")}
                    disabled={frequencyLoading}
                  />
                  <Label htmlFor="backup-weekly" className="cursor-pointer">
                    <div className="flex items-center space-x-2">
                      <span>Weekly</span>
                      <Badge variant="outline">Every 7 days</Badge>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="backup-monthly"
                    name="backup-frequency"
                    checked={backupFrequency === "monthly"}
                    onChange={() => handleFrequencyUpdate("monthly")}
                    disabled={frequencyLoading}
                  />
                  <Label htmlFor="backup-monthly" className="cursor-pointer">
                    <div className="flex items-center space-x-2">
                      <span>Monthly</span>
                      <Badge variant="outline">Every 30 days</Badge>
                    </div>
                  </Label>
                </div>
              </div>

              {frequencyLoading && (
                <div className="text-sm text-muted-foreground">
                  Updating frequency...
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <p className="text-sm text-muted-foreground">
                Customize the look and feel of your dashboard.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <ThemeSelector />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const themes = [
    {
      name: "nebula-dark",
      label: "Dark Nebula",
      description: "Subtle purple cosmic glow",
      preview:
        "bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900",
      accent: "bg-purple-500",
    },
    {
      name: "cawar-orange",
      label: "Cawar Orange",
      description: "Vibrant orange energy",
      preview:
        "bg-gradient-to-br from-slate-900 via-orange-900/30 to-slate-900",
      accent: "bg-orange-500",
    },
    {
      name: "matrix-green",
      label: "Matrix Green",
      description: "Digital matrix vibes",
      preview: "bg-gradient-to-br from-slate-900 via-green-900/30 to-slate-900",
      accent: "bg-green-500",
    },
    {
      name: "cyber-blue",
      label: "Cyber Blue",
      description: "Futuristic blue glow",
      preview: "bg-gradient-to-br from-slate-900 via-blue-900/30 to-slate-900",
      accent: "bg-blue-500",
    },
    {
      name: "cosmic-purple",
      label: "Cosmic Purple",
      description: "Deep space purple vibes",
      preview:
        "bg-gradient-to-br from-slate-900 via-purple-800/40 to-slate-900",
      accent: "bg-purple-600",
    },
    {
      name: "fire-red",
      label: "Fire Red",
      description: "Intense red flame energy",
      preview: "bg-gradient-to-br from-slate-900 via-red-900/30 to-slate-900",
      accent: "bg-red-500",
    },
    {
      name: "neon-pink",
      label: "Neon Pink",
      description: "Electric pink cyberpunk",
      preview: "bg-gradient-to-br from-slate-900 via-pink-900/30 to-slate-900",
      accent: "bg-pink-500",
    },
    {
      name: "ocean-teal",
      label: "Ocean Teal",
      description: "Deep ocean depths",
      preview: "bg-gradient-to-br from-slate-900 via-teal-900/30 to-slate-900",
      accent: "bg-teal-500",
    },
    {
      name: "sunset-gold",
      label: "Sunset Gold",
      description: "Golden hour warmth",
      preview:
        "bg-gradient-to-br from-slate-900 via-yellow-900/30 to-slate-900",
      accent: "bg-yellow-500",
    },
    {
      name: "light",
      label: "Light",
      description: "Clean and minimal",
      preview: "bg-gradient-to-br from-white to-gray-100",
      accent: "bg-gray-900",
    },
    {
      name: "dark",
      label: "Dark",
      description: "Pure dark mode",
      preview: "bg-gradient-to-br from-gray-900 to-black",
      accent: "bg-white",
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-foreground">Color Theme</h3>
        <p className="text-sm text-muted-foreground">
          Choose a color theme that suits your style
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {themes.map((themeOption) => (
          <div
            key={themeOption.name}
            className={`cursor-pointer rounded-lg border-2 p-4 transition-all hover:scale-105 ${
              theme === themeOption.name
                ? "border-primary shadow-md ring-2 ring-primary/20"
                : "border-border hover:border-primary/50"
            }`}
            onClick={() => setTheme(themeOption.name)}
          >
            <div
              className={`mb-3 h-20 w-full rounded-md ${themeOption.preview} relative overflow-hidden`}
            >
              <div
                className={`absolute bottom-2 right-2 h-3 w-3 rounded-full ${themeOption.accent}`}
              />
            </div>
            <div className="space-y-1">
              <h4 className="font-medium text-foreground">{themeOption.label}</h4>
              <p className="text-sm text-muted-foreground">
                {themeOption.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-lg bg-muted/50 p-4">
        <div className="flex items-center space-x-2">
          <Palette className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Your theme preference is saved automatically and syncs across all
            your devices.
          </span>
        </div>
      </div>
    </div>
  );
}
