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

  if (loading) return <p className="text-center">Loading dashboard...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Quick Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-500" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  Connected Accounts
                </p>
                <p className="text-2xl font-bold">2</p>
                <p className="text-xs text-muted-foreground">
                  Instagram, YouTube
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-green-500" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  Scheduled Posts
                </p>
                <p className="text-2xl font-bold">12</p>
                <p className="text-xs text-muted-foreground">
                  Next: Today 2:00 PM
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-orange-500" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  Engagement Rate
                </p>
                <p className="text-2xl font-bold">4.2%</p>
                <p className="text-xs text-muted-foreground">+0.3% this week</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Settings className="h-4 w-4 text-purple-500" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Auto-posting</p>
                <p className="text-2xl font-bold">ON</p>
                <Badge variant="secondary" className="text-xs">
                  Active
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/dashboard/schedule">
              <Button
                variant="outline"
                className="w-full h-20 flex flex-col space-y-2"
              >
                <Calendar className="w-6 h-6" />
                <span>Schedule Content</span>
              </Button>
            </Link>

            <Link href="/dashboard/connections">
              <Button
                variant="outline"
                className="w-full h-20 flex flex-col space-y-2"
              >
                <Users className="w-6 h-6" />
                <span>Manage Accounts</span>
              </Button>
            </Link>

            <Link href="/dashboard/analytics">
              <Button
                variant="outline"
                className="w-full h-20 flex flex-col space-y-2"
              >
                <TrendingUp className="w-6 h-6" />
                <span>View Analytics</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <MetricsCards />

      {/* Instagram Profile Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {userInfo ? (
          <div className="bg-gradient-to-tr from-white via-[#fdfdfd] to-gray-50 p-6 rounded-2xl shadow-md border border-gray-100">
            <h2 className="text-xl font-bold mb-5 text-gray-800 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-pink-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2.2l3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.3-6.2 3.3 1.2-6.8-5-4.9 6.9-1L12 2.2z" />
              </svg>
              Instagram Profile
            </h2>

            <div className="flex items-start space-x-5">
              <img
                src={`https://images.weserv.nl/?url=${encodeURIComponent(
                  userInfo.ProfilePic.replace(/^https?:\/\//, ""),
                )}`}
                alt={`${userInfo.Username}'s profile`}
                className="w-20 h-20 rounded-full object-cover border-2 border-pink-500 shadow-sm"
              />

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg text-gray-800">
                    {userInfo.FullName}
                  </h3>
                  {userInfo.Verified && (
                    <svg
                      className="w-4 h-4 text-blue-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      title="Verified"
                    >
                      <path d="M22 12l-4.243-4.243 1.414-1.414L24.828 12l-5.657 5.657-1.414-1.414zM2 12l4.243 4.243-1.414 1.414L-.828 12l5.657-5.657 1.414 1.414z" />
                    </svg>
                  )}
                </div>
                <p className="text-gray-500 mb-1">@{userInfo.Username}</p>

                {userInfo.Biography && (
                  <p className="text-sm text-gray-600 italic mb-3">
                    “{userInfo.Biography}”
                  </p>
                )}

                <div className="flex items-center space-x-6 text-sm font-medium">
                  <div>
                    <span className="text-gray-900">
                      {userInfo.FollowersCount}
                    </span>
                    <span className="text-gray-500 ml-1">Followers</span>
                  </div>
                  <div>
                    <span className="text-gray-900">{userInfo.PostsCount}</span>
                    <span className="text-gray-500 ml-1">Posts</span>
                  </div>
                </div>

                <a
                  href={`https://www.instagram.com/${userInfo.Username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-sm text-blue-600 hover:underline font-medium"
                >
                  View on Instagram →
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-4 rounded-lg shadow">
            <p>No user info available.</p>
          </div>
        )}

        <PlatformBreakdown />
      </div>

      {/* Instagram Posts Section */}
      {userInfo?.LatestPosts?.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow space-y-6">
          <h2 className="text-xl font-semibold mb-4">Latest Instagram Posts</h2>

          {userInfo.LatestPosts.map((post: any, index: number) => {
            const embedId = post.url?.split("/").filter(Boolean).pop();
            return (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg shadow-sm max-w-xl mx-auto"
              >
                <div className="flex items-center justify-between p-3">
                  <div className="flex items-center space-x-3">
                    <img
                      src={`https://images.weserv.nl/?url=${encodeURIComponent(
                        userInfo.ProfilePic.replace(/^https?:\/\//, ""),
                      )}`}
                      alt={userInfo.Username}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-sm">
                          {userInfo.Username}
                        </span>
                        {userInfo.Verified && (
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
                      <p className="text-xs text-gray-500">
                        {new Date(post.timestamp * 1000).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {embedId ? (
                  <iframe
                    src={`https://www.instagram.com/p/${embedId}/embed`}
                    className="w-full aspect-square border-none rounded-t-lg"
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
                    loading="lazy"
                  />
                ) : (
                  <div className="aspect-square bg-gray-100 flex items-center justify-center text-gray-400">
                    Unable to embed
                  </div>
                )}

                <div className="px-4 py-3 space-y-2 text-sm">
                  {post.caption && (
                    <p>
                      <span className="font-semibold">{userInfo.Username}</span>{" "}
                      {post.caption}
                    </p>
                  )}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs text-gray-500">
                    <span>
                      {new Date(post.timestamp * 1000).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                        },
                      )}
                    </span>
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View on Instagram
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
