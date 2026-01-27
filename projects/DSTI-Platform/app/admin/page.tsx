"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp,
  Users,
  LogOut,
  FolderOpen,
  ArrowRight,
  Plus,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";

interface DashboardStats {
  submitted: number;
  underReview: number;
  pendingInfo: number;
  approved: number;
  declined: number;
  total: number;
}

export default function AdminPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats>({
    submitted: 0,
    underReview: 0,
    pendingInfo: 0,
    approved: 0,
    declined: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  // Extract admin name
  const adminName = session?.user?.email?.split('@')[0] || 'Admin';
  const displayName = adminName.charAt(0).toUpperCase() + adminName.slice(1);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Welcome back, {displayName}
          </h1>
          <p className="text-gray-600 mt-1 text-base">
            Monitor and manage DSTI R&D tax incentive applications
          </p>
        </div>
        <Button 
          onClick={handleSignOut} 
          variant="outline" 
          className="w-full md:w-auto"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
              <FileText className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.total === 0 ? "No applications yet" : "All submitted applications"}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-yellow-200 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Review</CardTitle>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center shadow-md">
              <Clock className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-700 bg-clip-text text-transparent">{stats.underReview}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.underReview === 0 ? "None in review" : "Being evaluated by reviewers"}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-orange-200 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Information</CardTitle>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
              <AlertCircle className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">{stats.pendingInfo}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.pendingInfo === 0 ? "None pending" : "Awaiting applicant response"}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-green-200 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md">
              <CheckCircle2 className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">{stats.approved}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.approved === 0 ? "None approved yet" : "Successfully approved"}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-red-200 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Declined</CardTitle>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-md">
              <XCircle className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">{stats.declined}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.declined === 0 ? "None declined" : "Applications not approved"}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-200 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Submissions</CardTitle>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-md">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">{stats.submitted}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.submitted === 0 ? "None submitted" : "Recently submitted"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-2 hover:shadow-xl transition-shadow">
        <CardHeader>
          <CardTitle className="text-xl">Quick Actions</CardTitle>
          <CardDescription className="text-base">Access key administrative functions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button 
              className="h-auto py-4 flex flex-col items-start gap-2 hover:border-blue-300 hover:shadow-lg transition-all" 
              variant="outline"
              onClick={() => router.push("/admin/projects")}
            >
              <div className="flex items-center gap-2 w-full">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <FolderOpen className="h-4 w-4 text-white" />
                </div>
                <span className="font-semibold">All Projects</span>
              </div>
              <span className="text-xs text-muted-foreground text-left">
                View and manage all submitted applications
              </span>
            </Button>

            <Button 
              className="h-auto py-4 flex flex-col items-start gap-2 hover:border-orange-300 hover:shadow-lg transition-all" 
              variant="outline"
              onClick={() => router.push("/admin/projects")}
            >
              <div className="flex items-center gap-2 w-full">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                  <AlertCircle className="h-4 w-4 text-white" />
                </div>
                <span className="font-semibold">Pending Requests</span>
              </div>
              <span className="text-xs text-muted-foreground text-left">
                Review applications awaiting information
              </span>
            </Button>

            <Button 
              className="h-auto py-4 flex flex-col items-start gap-2 hover:border-purple-300 hover:shadow-lg transition-all" 
              variant="outline"
              onClick={() => router.push("/admin/reviewers" as any)}
            >
              <div className="flex items-center gap-2 w-full">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                  <Users className="h-4 w-4 text-white" />
                </div>
                <span className="font-semibold">Manage Reviewers</span>
              </div>
              <span className="text-xs text-muted-foreground text-left">
                Assign and manage review teams
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity - Placeholder for future enhancement */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-xl">Recent Activity</CardTitle>
          <CardDescription className="text-base">Latest updates across all applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>Activity tracking coming soon</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
