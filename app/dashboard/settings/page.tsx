"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/context/AuthContext"
import { parseJwt } from "@/lib/utils"
import { toast } from "sonner"
import { User, Bell, Shield, Zap, Palette, Upload, Eye, EyeOff } from "lucide-react"

type UserProfile = {
  id: number
  username: string
  email: string
  display_name: string
  createdAt: string
  planID: number
  googleID?: string
  google_drive_access_token?: string
  googleDriveRefreshToken?: string
  googleDriveTokenExpiry?: string
  passwordHash?: string
}

export default function SettingsPage() {
  const { token } = useAuth()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  })
  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false,
  })

  const userInfo = token ? parseJwt(token) : null

  // Fetch user profile data using the provided API
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token || !userInfo?.user_id) return

      try {
        setLoading(true)
        const response = await fetch(`http://localhost:8080/api/user/${userInfo.user_id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || `HTTP ${response.status}: Failed to fetch user profile`)
        }

        const data = await response.json()
        setUserProfile(data)
        toast.success("Profile loaded successfully")
      } catch (error: any) {
        console.error("Error fetching user profile:", error)
        toast.error(`Failed to load profile: ${error.message}`)
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [token, userInfo?.user_id])

  // Update password using the provided API
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match")
      return
    }

    if (passwordData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long")
      return
    }

    setUpdating(true)
    try {
      const response = await fetch("http://localhost:8080/api/settings/password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          password: passwordData.newPassword,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to update password`)
      }

      const result = await response.json()
      toast.success("Password updated successfully")
      setPasswordData({
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error: any) {
      console.error("Error updating password:", error)
      toast.error(`Failed to update password: ${error.message}`)
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to load profile</h2>
          <p className="text-gray-600">Please try refreshing the page</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account and application preferences.</p>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile" className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="w-4 h-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span>Privacy</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center space-x-2">
            <Zap className="w-4 h-4" />
            <span>Integrations</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center space-x-2">
            <Palette className="w-4 h-4" />
            <span>Appearance</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <p className="text-sm text-muted-foreground">Update your personal information and account details.</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Upload */}
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-gray-400" />
                </div>
                <div>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <Upload className="w-4 h-4" />
                    <span>Upload new photo</span>
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">JPG, PNG up to 10MB</p>
                </div>
              </div>

              {/* Profile Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={userProfile.display_name || ""}
                    onChange={(e) =>
                      setUserProfile((prev) => (prev ? { ...prev, display_name: e.target.value } : null))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={userProfile.email || ""} disabled className="bg-gray-50" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" value={userProfile.username || ""} disabled className="bg-gray-50" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option>Eastern Time (UTC-5)</option>
                    <option>Central Time (UTC-6)</option>
                    <option>Mountain Time (UTC-7)</option>
                    <option>Pacific Time (UTC-8)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input id="company" placeholder="Quolo Agency" />
              </div>

              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>

          {/* Password Update */}
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <p className="text-sm text-muted-foreground">Update your password to keep your account secure.</p>
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
                      onChange={(e) => setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))}
                      required
                      minLength={8}
                      placeholder="Enter new password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPasswords((prev) => ({ ...prev, new: !prev.new }))}
                    >
                      {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                      onChange={(e) => setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                      required
                      minLength={8}
                      placeholder="Confirm new password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPasswords((prev) => ({ ...prev, confirm: !prev.confirm }))}
                    >
                      {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                  <Label className="text-sm font-medium text-gray-500">User ID</Label>
                  <p className="text-sm">{userProfile.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Plan ID</Label>
                  <p className="text-sm">{userProfile.planID}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Account Created</Label>
                  <p className="text-sm">
                    {userProfile.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : "N/A"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Google Connected</Label>
                  <p className="text-sm">{userProfile.googleID ? "Yes" : "No"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other Tabs - Placeholder Content */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <p className="text-sm text-muted-foreground">Configure how you receive notifications.</p>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Notification settings coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <p className="text-sm text-muted-foreground">Manage your privacy and data preferences.</p>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Privacy settings coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>API Configuration</CardTitle>
              <p className="text-sm text-muted-foreground">Manage your API keys and access tokens.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Google Drive Integration</Label>
                <p className="text-sm">{userProfile.google_drive_access_token ? "✅ Connected" : "❌ Not Connected"}</p>
                {userProfile.googleDriveTokenExpiry && (
                  <p className="text-xs text-gray-500">
                    Expires: {new Date(userProfile.googleDriveTokenExpiry).toLocaleDateString()}
                  </p>
                )}
              </div>

              {userProfile.googleDriveRefreshToken && (
                <div>
                  <Label className="text-sm font-medium text-gray-500">Refresh Token</Label>
                  <p className="text-xs text-gray-400 font-mono">
                    {userProfile.googleDriveRefreshToken.substring(0, 20)}...
                  </p>
                </div>
              )}
            </CardContent>
          </Card> 
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <p className="text-sm text-muted-foreground">Customize the look and feel of your dashboard.</p>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Appearance settings coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
