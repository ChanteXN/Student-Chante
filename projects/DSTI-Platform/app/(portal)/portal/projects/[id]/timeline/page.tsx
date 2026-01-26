"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Clock, CheckCircle, FileText, AlertCircle, Eye, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TimelineEntry {
  id: string;
  status: string;
  notes: string | null;
  createdBy: string | null;
  createdAt: string;
}

interface Project {
  id: string;
  title: string;
  caseReference: string | null;
  status: string;
}

export default function ProjectTimelinePage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch project details
        const projectResponse = await fetch(`/api/projects/${params.id}`);
        if (projectResponse.ok) {
          const projectData = await projectResponse.json();
          setProject(projectData);
        }

        // Fetch timeline history
        const timelineResponse = await fetch(`/api/projects/${params.id}/timeline`);
        if (timelineResponse.ok) {
          const timelineData = await timelineResponse.json();
          setTimeline(timelineData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchData();
    }
  }, [params.id]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "DRAFT":
        return <FileText className="w-5 h-5 text-gray-500" />;
      case "SUBMITTED":
        return <CheckCircle className="w-5 h-5 text-blue-600" />;
      case "UNDER_REVIEW":
        return <Eye className="w-5 h-5 text-purple-600" />;
      case "APPROVED":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "REJECTED":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case "CHANGES_REQUESTED":
        return <AlertCircle className="w-5 h-5 text-amber-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "bg-gray-100 text-gray-800";
      case "SUBMITTED":
        return "bg-blue-100 text-blue-800";
      case "UNDER_REVIEW":
        return "bg-purple-100 text-purple-800";
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      case "CHANGES_REQUESTED":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatStatusLabel = (status: string) => {
    return status.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading timeline...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href={`/portal/projects/${params.id}/review`}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Review
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Case Timeline</h1>
          {project && (
            <div className="flex items-center gap-4">
              <p className="text-gray-600">{project.title}</p>
              {project.caseReference && (
                <Badge variant="outline" className="font-mono">
                  {project.caseReference}
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Current Status Card */}
        {project && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Current Status</span>
                <Badge className={getStatusColor(project.status)}>
                  {formatStatusLabel(project.status)}
                </Badge>
              </CardTitle>
            </CardHeader>
          </Card>
        )}

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300"></div>

          {/* Timeline entries */}
          <div className="space-y-6">
            {timeline.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-gray-500">No timeline events yet.</p>
                </CardContent>
              </Card>
            ) : (
              timeline.map((entry, _index) => (
                <div key={entry.id} className="relative pl-20">
                  {/* Icon */}
                  <div className="absolute left-5 w-8 h-8 bg-white rounded-full border-2 border-gray-300 flex items-center justify-center z-10">
                    {getStatusIcon(entry.status)}
                  </div>

                  {/* Content */}
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-2">
                        <Badge className={getStatusColor(entry.status)}>
                          {formatStatusLabel(entry.status)}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {new Date(entry.createdAt).toLocaleString("en-ZA", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </span>
                      </div>
                      {entry.notes && (
                        <p className="text-gray-700 mb-2">{entry.notes}</p>
                      )}
                      {entry.createdBy && (
                        <p className="text-sm text-gray-500">
                          Updated by: {entry.createdBy}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push("/portal/projects")}
          >
            Back to Projects
          </Button>
          {project?.status === "SUBMITTED" && (
            <Button
              onClick={() => router.push(`/portal/projects/${params.id}/submitted` as never)}
            >
              View Submission Details
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
