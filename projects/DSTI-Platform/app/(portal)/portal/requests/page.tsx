"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Clock, CheckCircle2, ArrowRight } from "lucide-react";

interface InfoRequest {
  id: string;
  subject: string;
  message: string;
  status: "PENDING" | "RESPONDED" | "RESOLVED";
  response: string | null;
  createdAt: string;
  respondedAt: string | null;
  projectId: string;
}

interface ProjectWithRequests {
  id: string;
  title: string;
  caseReference: string | null;
  status: string;
  requests: InfoRequest[];
}

const statusColors: Record<string, string> = {
  PENDING: "bg-orange-100 text-orange-700 border-orange-300",
  RESPONDED: "bg-blue-100 text-blue-700 border-blue-300",
  RESOLVED: "bg-green-100 text-green-700 border-green-300",
};

const statusIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  PENDING: Clock,
  RESPONDED: CheckCircle2,
  RESOLVED: CheckCircle2,
};

export default function PortalRequestsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectWithRequests[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjectsWithRequests();
  }, []);

  const fetchProjectsWithRequests = async () => {
    try {
      // Fetch all user projects
      const projectsRes = await fetch("/api/projects");
      if (!projectsRes.ok) {
        setLoading(false);
        return;
      }

      const projectsData = await projectsRes.json();
      const submittedProjects = Array.isArray(projectsData)
        ? projectsData.filter((p) => p.status !== "DRAFT")
        : [];

      // Fetch requests for each project
      const projectsWithRequests = await Promise.all(
        submittedProjects.map(async (project) => {
          try {
            const requestsRes = await fetch(`/api/requests/list?projectId=${project.id}`);
            if (requestsRes.ok) {
              const requestsData = await requestsRes.json();
              return {
                ...project,
                requests: requestsData.requests || [],
              };
            }
            return { ...project, requests: [] };
          } catch {
            return { ...project, requests: [] };
          }
        })
      );

      // Filter to only projects with requests
      setProjects(projectsWithRequests.filter((p) => p.requests.length > 0));
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalRequests = projects.reduce((sum, p) => sum + p.requests.length, 0);
  const pendingRequests = projects.reduce(
    (sum, p) => sum + p.requests.filter((r) => r.status === "PENDING").length,
    0
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Information Requests
        </h1>
        <p className="text-gray-600 mt-1 text-base">
          View and respond to information requests from reviewers
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-2 hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl w-12 h-12 flex items-center justify-center">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold text-gray-900">{totalRequests}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl w-12 h-12 flex items-center justify-center">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending Response</p>
                <p className="text-2xl font-bold text-gray-900">{pendingRequests}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects with Requests */}
      {projects.length === 0 ? (
        <Card className="border-2">
          <CardContent className="pt-12 pb-12">
            <div className="text-center">
              <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No information requests yet</p>
              <p className="text-sm text-gray-500 mt-1">
                Requests from reviewers will appear here
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {projects.map((project) => (
            <Card key={project.id} className="border-2 hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{project.title}</CardTitle>
                    <CardDescription className="text-base mt-1">
                      Case Reference: {project.caseReference || "Not assigned"}
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/portal/projects/${project.id}/requests`)}
                  >
                    View All
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {project.requests.map((request) => {
                    const StatusIcon = statusIcons[request.status];
                    return (
                      <div
                        key={request.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer"
                        onClick={() => router.push(`/portal/projects/${project.id}/requests`)}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-gray-900">{request.subject}</p>
                            <Badge
                              variant="outline"
                              className={`${statusColors[request.status]} border text-xs inline-flex items-center gap-1`}
                            >
                              <StatusIcon className="h-3 w-3" />
                              {request.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2">{request.message}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            Requested on{" "}
                            {new Date(request.createdAt).toLocaleDateString("en-ZA", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
