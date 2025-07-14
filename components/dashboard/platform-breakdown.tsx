"use client";

import { Info, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function PlatformBreakdown() {
  return (
    <Card className="bg-gradient-cawar-card border-white/10 float-card">
      <CardHeader className="border-b border-white/10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-xl flex items-center">
            <TrendingUp className="w-6 h-6 mr-3 text-purple-400" />
            Platform Breakdown
          </CardTitle>
          <Info className="w-4 h-4 text-purple-300" />
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="text-center">
            {/* Time period selector */}
            <div className="flex justify-center space-x-2 mb-6">
              <Button
                variant="ghost"
                size="sm"
                className="text-purple-200 hover:text-white hover:bg-white/10"
              >
                Day
              </Button>
              <Button
                size="sm"
                className="bg-gradient-cawar-purple text-white border-0"
              >
                Week
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-purple-200 hover:text-white hover:bg-white/10"
              >
                Month
              </Button>
            </div>

            {/* Pie chart representation */}
            <div className="relative w-48 h-48 mx-auto">
              <svg
                className="w-full h-full transform -rotate-90"
                viewBox="0 0 100 100"
              >
                {/* Instagram - 50% */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#ec4899"
                  strokeWidth="20"
                  strokeDasharray="125.6 251.2"
                  strokeDashoffset="0"
                  className="drop-shadow-lg"
                />
                {/* YouTube - 30% */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="20"
                  strokeDasharray="75.4 251.2"
                  strokeDashoffset="-125.6"
                  className="drop-shadow-lg"
                />
                {/* TikTok - 20% */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="20"
                  strokeDasharray="50.2 251.2"
                  strokeDashoffset="-201"
                  className="drop-shadow-lg"
                />
              </svg>

              {/* Center labels */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">50%</div>
                  <div className="text-xs text-purple-200">Instagram</div>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-3 mt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-pink-500 rounded-full shadow-lg"></div>
                  <span className="text-sm text-purple-200">Instagram</span>
                </div>
                <div className="text-white font-medium">50%</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-cyan-500 rounded-full shadow-lg"></div>
                  <span className="text-sm text-purple-200">YouTube</span>
                </div>
                <div className="text-white font-medium">30%</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full shadow-lg"></div>
                  <span className="text-sm text-purple-200">TikTok</span>
                </div>
                <div className="text-white font-medium">20%</div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center justify-center space-x-2 text-emerald-400">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">
                  +12.5% growth this week
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
