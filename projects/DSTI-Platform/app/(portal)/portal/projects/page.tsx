"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Eye, Edit, Trash2, Plus, FileText } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Project {
  id: string;
  title: string;
  sector: string | null;
  status: string;
  readinessScore: number | null;
  submittedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function ProjectsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    if (!session?.user?.email) return;

    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects");
        if (!response.ok) {
          const errorData = await response.json();
          console.error("API Error:", errorData);
          throw new Error(errorData.error || "Failed to fetch projects");
        }
        
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load projects.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [session, toast]);

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
      DRAFT: { variant: "secondary", label: "Draft" },
      SUBMITTED: { variant: "default", label: "Submitted" },
      UNDER_REVIEW: { variant: "outline", label: "Under Review" },
      APPROVED: { variant: "default", label: "Approved" },
      DECLINED: { variant: "destructive", label: "Declined" },
    };

    const config = statusConfig[status] || { variant: "secondary", label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredProjects = projects.filter((project) => {
    if (filter === "all") return true;
    return project.status === filter;
  });

  const handleDelete = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete project");
      }

      setProjects(projects.filter((p) => p.id !== projectId));
      toast({
        title: "Project deleted",
        description: "The project has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting project:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete project.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">My Projects</h1>
          <p className="text-muted-foreground mt-1 text-base">
            Manage your R&D tax incentive applications
          </p>
        </div>
        <Button 
          onClick={() => {
            sessionStorage.removeItem('currentProjectId');
            router.push("/portal/projects/new");
          }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Application
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
          className={filter === "all" ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" : "hover:border-blue-300 hover:bg-blue-50 transition-all"}
        >
          All ({projects.length})
        </Button>
        <Button
          variant={filter === "DRAFT" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("DRAFT")}
          className={filter === "DRAFT" ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" : "hover:border-gray-300 hover:bg-gray-50 transition-all"}
        >
          Drafts ({projects.filter((p) => p.status === "DRAFT").length})
        </Button>
        <Button
          variant={filter === "SUBMITTED" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("SUBMITTED")}
          className={filter === "SUBMITTED" ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" : "hover:border-green-300 hover:bg-green-50 transition-all"}
        >
          Submitted ({projects.filter((p) => p.status === "SUBMITTED").length})
        </Button>
        <Button
          variant={filter === "UNDER_REVIEW" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("UNDER_REVIEW")}
          className={filter === "UNDER_REVIEW" ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" : "hover:border-orange-300 hover:bg-orange-50 transition-all"}
        >
          Under Review ({projects.filter((p) => p.status === "UNDER_REVIEW").length})
        </Button>
      </div>

      {/* Projects List */}
      {filteredProjects.length === 0 ? (
        <Card className="border-2 shadow-lg">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mb-4">
              <FileText className="h-10 w-10 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No projects found</h3>
            <p className="text-sm text-muted-foreground mb-6 text-center max-w-md">
              {filter === "all"
                ? "You haven't created any applications yet. Start by creating your first R&D tax incentive application."
                : `No projects with status "${filter}"`}
            </p>
            <Button 
              onClick={() => router.push("/portal/projects/new")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Application
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200 hover:scale-[1.01]">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-lg sm:text-xl">{project.title || "Untitled Project"}</CardTitle>
                      {getStatusBadge(project.status)}
                    </div>
                    <CardDescription className="flex items-center gap-4 text-sm">
                      {project.sector && (
                        <span className="flex items-center gap-1">
                          <span className="font-medium">Sector:</span> {project.sector}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <span className="font-medium">Updated:</span>{" "}
                        {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
                      </span>
                      {project.submittedAt && (
                        <span className="flex items-center gap-1">
                          <span className="font-medium">Submitted:</span>{" "}
                          {formatDistanceToNow(new Date(project.submittedAt), { addSuffix: true })}
                        </span>
                      )}
                    </CardDescription>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {project.status === "DRAFT" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/portal/projects/new?id=${project.id}`)}
                        className="hover:bg-blue-50 hover:border-blue-300 transition-all"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/portal/projects/${project.id}/review`)}
                      className="hover:bg-purple-50 hover:border-purple-300 transition-all"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    {project.status === "DRAFT" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(project.id)}
                        className="hover:bg-red-50 hover:border-red-300 transition-all"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
