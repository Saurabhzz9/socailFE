"use client"

import { Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function PlatformBreakdown() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center space-x-2">
          <CardTitle className="text-lg font-semibold">Platform Breakdown</CardTitle>
          <Info className="w-4 h-4 text-gray-400" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-lg font-medium text-gray-900 mb-2">Platform Breakdown</div>

            {/* Time period selector */}
            <div className="flex justify-center space-x-1 mb-6">
              <Button variant="ghost" size="sm" className="text-sm">
                Day
              </Button>
              <Button variant="ghost" size="sm" className="text-sm bg-gray-100">
                Week
              </Button>
              <Button variant="ghost" size="sm" className="text-sm">
                Month
              </Button>
            </div>

            {/* Pie chart representation */}
            <div className="relative w-48 h-48 mx-auto">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
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
                />
                {/* TikTok - 20% */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="20"
                  strokeDasharray="50.2 251.2"
                  strokeDashoffset="-201"
                />
              </svg>

              {/* Center labels */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">50%</div>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex justify-center space-x-6 mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Instagram</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                <span className="text-sm text-gray-600">YouTube</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600">TikTok</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
