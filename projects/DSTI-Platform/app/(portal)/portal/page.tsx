"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, FolderOpen, Clock, Bell, Plus, ArrowRight, CheckCircle } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";

interface ProjectStats {
  drafts: number;
  submitted: number;
  underReview: number;
  total: number;
  active: number;
}

interface RecentProject {
  id: string;
  title: string;
  status: string;
  updatedAt: string;
}

export default function PortalPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<ProjectStats | null>(null);
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    
    // Fetch project stats and recent projects
    if (status === "authenticated") {
      // Fetch stats
      fetch("/api/projects/stats")
        .then((res) => res.json())
        .then((data) => setStats(data))
        .catch((error) => console.error("Error fetching stats:", error));
      
      // Fetch recent projects
      fetch("/api/projects?limit=5")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setRecentProjects(data.slice(0, 5));
          }
        })
        .catch((error) => console.error("Error fetching projects:", error));
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  // Extract first name from email
  const firstName = session.user.email?.split('@')[0] || 'User';
  const displayName = firstName.charAt(0).toUpperCase() + firstName.slice(1);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {displayName}
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your DSTI funding applications and projects
          </p>
        </div>
        <Button 
          onClick={() => signOut({ callbackUrl: "/" })} 
          variant="outline" 
          className="w-full md:w-auto"
        >
          Sign Out
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Applications</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats?.active ?? 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats?.active === 0 ? "No active submissions" : "Currently being processed"}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft Projects</CardTitle>
            <FolderOpen className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats?.drafts ?? 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats?.drafts === 0 ? "No drafts" : "Awaiting submission"}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Review</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats?.underReview ?? 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats?.underReview === 0 ? "None in review" : "Pending evaluation"}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <Bell className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats?.total ?? 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats?.total === 0 ? "Get started" : "All time"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Get started with your application process</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button 
              className="h-auto py-4 flex flex-col items-start gap-2" 
              variant="outline"
              onClick={() => router.push("/portal/projects/new")}
            >
              <div className="flex items-center gap-2 w-full">
                <Plus className="h-5 w-5" />
                <span className="font-semibold">New Application</span>
              </div>
              <span className="text-xs text-muted-foreground text-left">
                Start a new funding application
              </span>
            </Button>

            <Button 
              className="h-auto py-4 flex flex-col items-start gap-2" 
              variant="outline"
              onClick={() => router.push("/portal/projects")}
            >
              <div className="flex items-center gap-2 w-full">
                <FolderOpen className="h-5 w-5" />
                <span className="font-semibold">View Projects</span>
              </div>
              <span className="text-xs text-muted-foreground text-left">
                Manage existing projects
              </span>
            </Button>

            <Button className="h-auto py-4 flex flex-col items-start gap-2" variant="outline">
              <div className="flex items-center gap-2 w-full">
                <FileText className="h-5 w-5" />
                <span className="font-semibold">Guidelines</span>
              </div>
              <span className="text-xs text-muted-foreground text-left">
                Review application guidelines
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity / Getting Started */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest projects and updates</CardDescription>
            </div>
            {recentProjects.length > 0 && (
              <Button variant="ghost" size="sm" onClick={() => router.push("/portal/projects")}>
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {recentProjects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <FileText className="h-12 w-12 text-gray-400 mb-3" />
                <p className="text-sm text-gray-600 font-medium">No recent activity</p>
                <p className="text-xs text-gray-500 mt-1">
                  Start by creating your first application
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentProjects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                    onClick={() => {
                      if (project.status === "DRAFT") {
                        router.push(`/portal/projects/new?id=${project.id}`);
                      } else {
                        router.push(`/portal/projects/${project.id}/review`);
                      }
                    }}
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium">{project.title || "Untitled Project"}</p>
                      <p className="text-xs text-muted-foreground">
                        Updated {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {project.status === "DRAFT" && (
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">Draft</span>
                      )}
                      {project.status === "SUBMITTED" && (
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">Submitted</span>
                      )}
                      {project.status === "UNDER_REVIEW" && (
                        <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded">Under Review</span>
                      )}
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>Complete these steps to begin</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Create your account</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="h-5 w-5 rounded-full border-2 border-gray-300 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Review eligibility criteria</p>
                  <p className="text-xs text-muted-foreground">Check if you qualify</p>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 mt-0.5" />
              </div>

              <div className="flex items-start gap-3">
                <div className="h-5 w-5 rounded-full border-2 border-gray-300 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Prepare required documents</p>
                  <p className="text-xs text-muted-foreground">Gather necessary files</p>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 mt-0.5" />
              </div>

              <div className="flex items-start gap-3">
                <div className="h-5 w-5 rounded-full border-2 border-gray-300 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Submit your application</p>
                  <p className="text-xs text-muted-foreground">Complete and submit</p>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 mt-0.5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
