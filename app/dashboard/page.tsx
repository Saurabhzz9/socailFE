"use client";

import { useEffect, useState } from "react";
import { InstagramService } from "@/lib/services";
import { useAuth } from "@/context/AuthContext";
import { MetricsCards } from "@/components/dashboard/metrics-cards";
import { PlatformBreakdown } from "@/components/dashboard/platform-breakdown";
import {
  ExternalLink,
  Users,
  Calendar,
  TrendingUp,
  Settings,
  ArrowUpRight,
  Plus,
  Zap,
  BarChart3,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function DashboardPage() {
  const { token } = useAuth();
  const [userInfo, setUserInfo] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await InstagramService.fetchUserInfo(
          token,
          "virat.kohli",
        );

        const userData = response.info[0]?.data?.user;
        const latestPosts = response.info[0]?.latestPosts || [];

        if (userData) {
          const mappedData = {
            Username: userData.username,
            FullName: userData.fullName,
            FollowersCount: userData.followersCount?.toLocaleString() || "0",
            PostsCount: userData.postsCount?.toString() || "0",
            Biography: userData.biography,
            Verified: userData.verified,
            ProfilePic: userData.profilePicUrlHD || userData.profilePicUrl,
            LatestPosts: latestPosts,
          };
          setUserInfo(mappedData);
        } else {
          throw new Error("Invalid API response structure");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load user info");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <p className="text-orange-200">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 relative bg-background text-foreground">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4 py-8">
          <h1 className="text-4xl font-bold text-primary">
            Welcome back to <span className="text-accent">Quolo</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Manage your social media presence with powerful analytics and
            seamless scheduling
          </p>
        </div>

        {/* Quick Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-card border-border float-card hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Connected Accounts
                  </p>
                  <p className="text-3xl font-bold text-primary">2</p>
                  <p className="text-xs text-muted-foreground">Instagram, YouTube</p>
                </div>
                <div className="p-3 bg-accent rounded-xl">
                  <Users className="h-6 w-6 text-accent-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border float-card hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Scheduled Posts
                  </p>
                  <p className="text-3xl font-bold text-primary">12</p>
                  <p className="text-xs text-muted-foreground">Next: Today 2:00 PM</p>
                </div>
                <div className="p-3 bg-pink-500 rounded-xl">
                  <Calendar className="h-6 w-6 text-accent-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border float-card hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Engagement Rate
                  </p>
                  <p className="text-3xl font-bold text-primary">4.2%</p>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-3 w-3 text-emerald-400" />
                    <p className="text-xs text-emerald-400">+0.3% this week</p>
                  </div>
                </div>
                <div className="p-3 bg-blue-500 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-accent-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border float-card hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Auto-posting
                  </p>
                  <p className="text-3xl font-bold text-primary">ON</p>
                  <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs">
                    Active
                  </Badge>
                </div>
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl">
                  <Zap className="h-6 w-6 text-accent-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-card border-border float-card">
          <CardHeader className="border-b border-border">
            <CardTitle className="text-accent text-xl flex items-center">
              <Target className="w-6 h-6 mr-3 text-muted-foreground" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="/dashboard/schedule">
                <Button className="w-full h-24 bg-purple-500 hover:opacity-90 text-white border-0 flex flex-col space-y-3 transition-all duration-300 hover:scale-105">
                  <Calendar className="w-8 h-8 text-white" />
                  <span className="font-medium">Schedule Content</span>
                </Button>
              </Link>

              <Link href="/dashboard/connections">
                <Button className="w-full h-24 bg-pink-500 hover:opacity-90 text-white border-0 flex flex-col space-y-3 transition-all duration-300 hover:scale-105">
                  <Users className="w-8 h-8 text-white" />
                  <span className="font-medium">Manage Accounts</span>
                </Button>
              </Link>

              <Link href="/dashboard/analytics">
                <Button className="w-full h-24 bg-blue-500 hover:opacity-90 text-white border-0 flex flex-col space-y-3 transition-all duration-300 hover:scale-105">
                  <BarChart3 className="w-8 h-8 text-white" />
                  <span className="font-medium">View Analytics</span>
                </Button>
              </Link>
            </div>
          </CardContent>

        </Card>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-card border-border float-card">
            <CardContent className="p-6 text-center">
              <div className="space-y-2">
                <p className="text-sm font-medium text-orange-200 uppercase tracking-wide">
                  Posts
                </p>
                <p className="text-2xl font-bold text-primary">47</p>
                <p className="text-xs text-orange-300">Last 30 days</p>
                <div className="flex items-center justify-center space-x-1 mt-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span className="text-emerald-400 text-sm">+3.2%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border float-card">
            <CardContent className="p-6 text-center">
              <div className="space-y-2">
                <p className="text-sm font-medium text-orange-200 uppercase tracking-wide">
                  Reach
                </p>
                <p className="text-2xl font-bold text-primary">2.4M</p>
                <p className="text-xs text-orange-300">Total reach</p>
                <div className="flex items-center justify-center space-x-1 mt-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span className="text-emerald-400 text-sm">+12.8%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border float-card">
            <CardContent className="p-6 text-center">
              <div className="space-y-2">
                <p className="text-sm font-medium text-orange-200 uppercase tracking-wide">
                  Engagement
                </p>
                <p className="text-2xl font-bold text-primary">186K</p>
                <p className="text-xs text-orange-300">Likes & Comments</p>
                <div className="flex items-center justify-center space-x-1 mt-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span className="text-emerald-400 text-sm">+5.1%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border float-card">
            <CardContent className="p-6 text-center">
              <div className="space-y-2">
                <p className="text-sm font-medium text-orange-200 uppercase tracking-wide">
                  Growth
                </p>
                <p className="text-2xl font-bold text-primary">+2.1K</p>
                <p className="text-xs text-orange-300">New followers</p>
                <div className="flex items-center justify-center space-x-1 mt-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span className="text-emerald-400 text-sm">+9.1%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Instagram Profile and Platform Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {userInfo ? (
            <Card className="bg-card border-border float-card">
              <CardHeader className="border-b border-border">
                <CardTitle className="text-accent text-xl flex items-center">
                  <div className="w-6 h-6 bg-gradient-to-r from-orange-400 to-yellow-400 rounded mr-3"></div>
                  Instagram Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <img
                    src={`https://images.weserv.nl/?url=${encodeURIComponent(
                      userInfo.ProfilePic.replace(/^https?:\/\//, ""),
                    )}`}
                    alt={`${userInfo.Username}'s profile`}
                    className="w-16 h-16 rounded-full object-cover border-2 border-orange-400 shadow-lg"
                  />

                  <div className="flex-1 space-y-3">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-lg text-primary">
                        {userInfo.FullName}
                      </h3>
                      {userInfo.Verified && (
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg
                            className="w-3 h-3 text-accent-foreground"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    <p className="text-orange-200">@{userInfo.Username}</p>

                    <div className="flex items-center space-x-6 text-sm">
                      <div className="text-center">
                        <div className="text-primary font-bold text-lg">
                          {userInfo.FollowersCount}
                        </div>
                        <div className="text-orange-300">Followers</div>
                      </div>
                      <div className="text-center">
                        <div className="text-primary font-bold text-lg">
                          {userInfo.PostsCount}
                        </div>
                        <div className="text-orange-300">Posts</div>
                      </div>
                    </div>

                    <Link
                      href={`https://www.instagram.com/${userInfo.Username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-accent border-0 mt-3"
                      >
                        View Profile
                        <ArrowUpRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-card border-border float-card">
              <CardContent className="p-6">
                <p className="text-orange-200">No user info available.</p>
              </CardContent>
            </Card>
          )}

          <PlatformBreakdown />
        </div>

        {/* Instagram Posts Section */}
        {userInfo?.LatestPosts?.length > 0 && (
          <Card className="bg-card border-border float-card">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-accent text-xl">
                Latest Instagram Posts
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {userInfo.LatestPosts.slice(0, 2).map(
                  (post: any, index: number) => {
                    const embedId = post.url?.split("/").filter(Boolean).pop();
                    return (
                      <div
                        key={index}
                        className="bg-white/5 border border-border rounded-xl shadow-lg float-card"
                      >
                        <div className="flex items-center justify-between p-4 border-b border-border">
                          <div className="flex items-center space-x-3">
                            <img
                              src={`https://images.weserv.nl/?url=${encodeURIComponent(
                                userInfo.ProfilePic.replace(/^https?:\/\//, ""),
                              )}`}
                              alt={userInfo.Username}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <div>
                              <div className="flex items-center space-x-1">
                                <span className="font-semibold text-sm text-primary">
                                  {userInfo.Username}
                                </span>
                                {userInfo.Verified && (
                                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                    <svg
                                      className="w-2 h-2 text-accent-foreground"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </div>
                                )}
                              </div>
                              <p className="text-xs text-orange-300">
                                {new Date(
                                  post.timestamp * 1000,
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>

                        {embedId ? (
                          <iframe
                            src={`https://www.instagram.com/p/${embedId}/embed`}
                            className="w-full aspect-square border-none"
                            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
                            loading="lazy"
                          />
                        ) : (
                          <div className="aspect-square bg-white/5 flex items-center justify-center text-orange-300">
                            Unable to embed
                          </div>
                        )}

                        <div className="p-4">
                          <Link
                            href={post.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full bg-white/5 border-border text-orange-200 hover:bg-white/10"
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              View on Instagram
                            </Button>
                          </Link>
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
