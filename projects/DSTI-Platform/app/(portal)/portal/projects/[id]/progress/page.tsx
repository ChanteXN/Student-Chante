"use client";

import { useState, useEffect, use } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Calendar, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface ProgressReport {
  id: string;
  reportingPeriod: string;
  outcomes: string;
  milestones: string;
  staffing: string;
  learnings: string;
  dueDate: string | null;
  submittedAt: string | null;
  status: string;
  createdAt: string;
}

interface Project {
  id: string;
  title: string;
  status: string;
}

export default function ProgressReportsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: projectId } = use(params);

  const [reports, setReports] = useState<ProgressReport[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReports();
    fetchProject();
  }, [projectId]);

  const fetchReports = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/progress`);
      if (!response.ok) throw new Error("Failed to fetch reports");

      const data = await response.json();
      setReports(data.reports);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`);
      if (!response.ok) throw new Error("Failed to fetch project");

      const data = await response.json();
      setProject(data);
    } catch (err) {
      console.error("Error fetching project:", err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SUBMITTED":
        return "bg-blue-100 text-blue-800";
      case "UNDER_REVIEW":
        return "bg-yellow-100 text-yellow-800";
      case "ACCEPTED":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const isOverdue = (dueDate: string | null) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="h-8 w-8 text-blue-600" />
            Progress Reports
          </h1>
          <p className="text-muted-foreground mt-1">
            {project?.title || "Loading project..."}
          </p>
        </div>
        {project?.status === "APPROVED" && (
          <Link href={`/portal/projects/${projectId}/progress/new`}>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Submit New Report
            </Button>
          </Link>
        )}
      </div>

      {/* Due Date Reminder (UI Stub) */}
      {project?.status === "APPROVED" && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-amber-900 mb-1">
                  Progress Report Due Soon
                </h3>
                <p className="text-sm text-amber-700">
                  Your next progress report is due on{" "}
                  <strong>March 31, 2026</strong>. Please submit your update
                  before the deadline to remain compliant with DSTI requirements.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-700">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Loading progress reports...
            </p>
          </CardContent>
        </Card>
      )}

      {/* Reports List */}
      {!loading && !error && reports.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Progress Reports Yet
              </h3>
              <p className="text-gray-500 mb-6">
                {project?.status === "APPROVED"
                  ? "Submit your first progress report to keep DSTI updated on your R&D project."
                  : "Progress reports are only available for approved projects."}
              </p>
              {project?.status === "APPROVED" && (
                <Link href={`/portal/projects/${projectId}/progress/new`}>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Submit First Report
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {!loading && !error && reports.length > 0 && (
        <div className="space-y-4">
          {reports.map((report) => (
            <Card
              key={report.id}
              className={
                report.dueDate && isOverdue(report.dueDate)
                  ? "border-red-200"
                  : ""
              }
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-3">
                      {report.reportingPeriod}
                      <Badge className={getStatusColor(report.status)}>
                        {report.status}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Submitted{" "}
                        {report.submittedAt
                          ? formatDistanceToNow(new Date(report.submittedAt), {
                              addSuffix: true,
                            })
                          : "Not submitted"}
                      </span>
                      {report.dueDate && (
                        <span
                          className={`flex items-center gap-1 ${
                            isOverdue(report.dueDate)
                              ? "text-red-600 font-semibold"
                              : ""
                          }`}
                        >
                          <Clock className="h-4 w-4" />
                          Due: {new Date(report.dueDate).toLocaleDateString()}
                          {isOverdue(report.dueDate) && " (Overdue)"}
                        </span>
                      )}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm text-gray-700 mb-1">
                    Outcomes Achieved
                  </h4>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {report.outcomes}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-700 mb-1">
                    Milestones Reached
                  </h4>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {report.milestones}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-700 mb-1">
                    Key Learnings
                  </h4>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {report.learnings}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
