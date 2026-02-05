"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Gavel,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  Filter,
  RefreshCw,
} from "lucide-react";

interface Project {
  id: string;
  title: string;
  caseReference: string | null;
  status: string;
  submittedAt: string | null;
  readinessScore: number | null;
  organisation: {
    name: string;
  };
  reviewerAssignments: Array<{
    completedAt: string | null;
    recommendation: string | null;
  }>;
  decision: {
    outcome: string;
    decidedAt: string;
  } | null;
}

export default function AdminDecisionsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "decided">("all");

  useEffect(() => {
    fetchProjects();

    // Refetch when page becomes visible (user navigates back)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchProjects();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    // Also refetch when window gains focus
    window.addEventListener("focus", fetchProjects);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", fetchProjects);
    };
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      // Fetch projects that are UNDER_REVIEW, APPROVED, or DECLINED
      const res = await fetch("/api/admin/projects");
      if (!res.ok) throw new Error("Failed to fetch projects");
      const data = await res.json();
      
      // Filter to show only projects relevant for decisions
      const filtered = data.projects.filter((p: Project) => 
        ["UNDER_REVIEW", "APPROVED", "DECLINED"].includes(p.status)
      );
      
      setProjects(filtered);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const getReviewStatus = (project: Project) => {
    const total = project.reviewerAssignments.length;
    const completed = project.reviewerAssignments.filter((a) => a.completedAt).length;
    return { total, completed };
  };

  const getRecommendationSummary = (project: Project) => {
    const recommendations = project.reviewerAssignments
      .filter((a) => a.recommendation)
      .map((a) => a.recommendation);
    
    const approve = recommendations.filter((r) => r === "APPROVE").length;
    const decline = recommendations.filter((r) => r === "DECLINE").length;
    
    return { approve, decline, total: recommendations.length };
  };

  const filteredProjects = projects
    .filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.caseReference?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.organisation.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "pending" && !project.decision) ||
        (statusFilter === "decided" && project.decision);

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // Pending decisions first
      if (!a.decision && b.decision) return -1;
      if (a.decision && !b.decision) return 1;
      
      // Then by submitted date
      const dateA = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
      const dateB = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
      return dateB - dateA;
    });

  const stats = {
    pending: projects.filter((p) => !p.decision).length,
    approved: projects.filter((p) => p.decision?.outcome === "APPROVED").length,
    declined: projects.filter((p) => p.decision?.outcome === "DECLINED").length,
  };

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Gavel className="h-8 w-8 text-red-600" />
            <h1 className="text-3xl font-bold">Decisions</h1>
          </div>
          <Button
            onClick={fetchProjects}
            disabled={loading}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        <p className="text-gray-600">
          Review applications and make final approval or decline decisions
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Pending Decision</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.approved}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Declined</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{stats.declined}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by project title, case reference, or organisation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                onClick={() => setStatusFilter("all")}
              >
                All
              </Button>
              <Button
                variant={statusFilter === "pending" ? "default" : "outline"}
                onClick={() => setStatusFilter("pending")}
              >
                Pending
              </Button>
              <Button
                variant={statusFilter === "decided" ? "default" : "outline"}
                onClick={() => setStatusFilter("decided")}
              >
                Decided
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects List */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading projects...</div>
      ) : filteredProjects.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            No projects found matching your criteria
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredProjects.map((project) => {
            const reviewStatus = getReviewStatus(project);
            const recommendations = getRecommendationSummary(project);
            const hasDecision = !!project.decision;

            return (
              <Card key={project.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{project.title}</h3>
                        {hasDecision ? (
                          <Badge
                            variant={
                              project.decision?.outcome === "APPROVED" ? "default" : "destructive"
                            }
                          >
                            {project.decision?.outcome === "APPROVED" ? (
                              <>
                                <CheckCircle className="mr-1 h-3 w-3" />
                                Approved
                              </>
                            ) : (
                              <>
                                <XCircle className="mr-1 h-3 w-3" />
                                Declined
                              </>
                            )}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-orange-600 border-orange-300">
                            <Clock className="mr-1 h-3 w-3" />
                            Pending Decision
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <span>Case: {project.caseReference || "N/A"}</span>
                        <span>•</span>
                        <span>{project.organisation.name}</span>
                        <span>•</span>
                        <span>
                          Submitted:{" "}
                          {project.submittedAt
                            ? new Date(project.submittedAt).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-sm">
                          <span className="text-gray-600">Readiness:</span>
                          <span className="font-semibold ml-1">
                            {project.readinessScore !== null ? `${project.readinessScore}%` : "N/A"}
                          </span>
                        </div>

                        <div className="text-sm">
                          <span className="text-gray-600">Reviews:</span>
                          <span className="font-semibold ml-1">
                            {reviewStatus.completed}/{reviewStatus.total}
                          </span>
                        </div>

                        {recommendations.total > 0 && (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-600">Recommendations:</span>
                            {recommendations.approve > 0 && (
                              <span className="text-green-600 font-semibold">
                                {recommendations.approve} Approve
                              </span>
                            )}
                            {recommendations.decline > 0 && (
                              <span className="text-red-600 font-semibold">
                                {recommendations.decline} Decline
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {hasDecision && (
                        <div className="mt-3 text-xs text-gray-500">
                          Decision made on{" "}
                          {new Date(project.decision!.decidedAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    <Button
                      onClick={() => router.push(`/admin/decisions/${project.id}`)}
                      variant={hasDecision ? "outline" : "default"}
                    >
                      {hasDecision ? "View Decision" : "Make Decision"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
