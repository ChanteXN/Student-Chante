"use client";

import { BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl flex items-center justify-center shadow-xl">
            <BarChart3 className="h-12 w-12 text-white" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">Coming Soon</h1>
          <p className="text-lg text-gray-600">Analytics feature is under development</p>
        </div>
      </div>
    </div>
  );
}
