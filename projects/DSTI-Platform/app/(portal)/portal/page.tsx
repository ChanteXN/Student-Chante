import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, FolderOpen, Clock, Bell, Plus, ArrowRight, CheckCircle } from "lucide-react";

export default async function PortalPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
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
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <Button type="submit" variant="outline" className="w-full md:w-auto">
            Sign Out
          </Button>
        </form>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Applications</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">0</div>
            <p className="text-xs text-muted-foreground mt-1">
              No active submissions
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft Projects</CardTitle>
            <FolderOpen className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">0</div>
            <p className="text-xs text-muted-foreground mt-1">
              Awaiting submission
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Review</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">0</div>
            <p className="text-xs text-muted-foreground mt-1">
              Pending evaluation
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notifications</CardTitle>
            <Bell className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">0</div>
            <p className="text-xs text-muted-foreground mt-1">
              No new updates
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
            <Button className="h-auto py-4 flex flex-col items-start gap-2" variant="outline">
              <div className="flex items-center gap-2 w-full">
                <Plus className="h-5 w-5" />
                <span className="font-semibold">New Application</span>
              </div>
              <span className="text-xs text-muted-foreground text-left">
                Start a new funding application
              </span>
            </Button>

            <Button className="h-auto py-4 flex flex-col items-start gap-2" variant="outline">
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
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest actions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <FileText className="h-12 w-12 text-gray-400 mb-3" />
              <p className="text-sm text-gray-600 font-medium">No recent activity</p>
              <p className="text-xs text-gray-500 mt-1">
                Start by creating your first application
              </p>
            </div>
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
