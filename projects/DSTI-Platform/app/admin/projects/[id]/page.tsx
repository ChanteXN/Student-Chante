"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Building,
  Calendar,
  MapPin,
  FileText,
  Hash,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquarePlus,
  Download,
  TrendingUp,
  AlertTriangle,
  Users,
  Briefcase,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface ProjectSection {
  id: string;
  sectionKey: string;
  sectionData: Record<string, string>;
  isComplete: boolean;
}

interface Project {
  id: string;
  title: string;
  sector: string | null;
  startDate: string | null;
  endDate: string | null;
  location: string | null;
  status: string;
  caseReference: string | null;
  submittedAt: string | null;
  readinessScore: number | null;
  createdAt: string;
  updatedAt: string;
  organisation: {
    name: string;
    registrationNo: string | null;
    sector: string | null;
    address: string | null;
  };
  sections: ProjectSection[];
}

interface StatusHistory {
  id: string;
  status: string;
  notes: string | null;
  createdAt: string;
  createdBy: string | null;
}

const statusColors: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-700 border-gray-300",
  SUBMITTED: "bg-blue-100 text-blue-700 border-blue-300",
  UNDER_REVIEW: "bg-yellow-100 text-yellow-700 border-yellow-300",
  PENDING_INFO: "bg-orange-100 text-orange-700 border-orange-300",
  APPROVED: "bg-green-100 text-green-700 border-green-300",
  DECLINED: "bg-red-100 text-red-700 border-red-300",
  WITHDRAWN: "bg-gray-100 text-gray-600 border-gray-300",
};

const sectionLabels: Record<string, string> = {
  overview: "Project Overview",
  objectives: "Objectives & Innovation",
  technical: "Technical Details",
  team: "Team & Resources",
  budget: "Budget & Costs",
  timeline: "Timeline & Milestones",
  impact: "Impact & Outcomes",
};

export default function AdminProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [statusHistory, setStatusHistory] = useState<StatusHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchProject();
    fetchStatusHistory();
  }, []);

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${resolvedParams.id}`);
      if (response.ok) {
        const data = await response.json();
        setProject(data);
      }
    } catch (error) {
      console.error("Error fetching project:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatusHistory = async () => {
    try {
      const response = await fetch(`/api/projects/${resolvedParams.id}/history`);
      if (response.ok) {
        const data = await response.json();
        setStatusHistory(data.history || []);
      }
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  const handleDownloadPDF = async () => {
    setDownloadingPdf(true);
    try {
      const response = await fetch(`/api/projects/${resolvedParams.id}/download`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `DSTI-Application-${project?.caseReference || resolvedParams.id}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error("Error downloading PDF:", error);
    } finally {
      setDownloadingPdf(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Project Not Found</h2>
          <p className="text-gray-600 mb-4">
            The project you're looking for doesn't exist or you don't have access to it.
          </p>
          <Button onClick={() => router.push("/admin/projects" as any)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  const completionPercentage = Math.round(
    (project.sections.filter((s) => s.isComplete).length / project.sections.length) * 100
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button
            variant="ghost"
            onClick={() => router.push("/admin/projects" as any)}
            className="mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {project.title}
          </h1>
          <p className="text-gray-600 mt-1">
            Review application details and manage status
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleDownloadPDF}
            disabled={downloadingPdf}
          >
            <Download className="h-4 w-4 mr-2" />
            {downloadingPdf ? "Downloading..." : "Download PDF"}
          </Button>
          <Button
            onClick={() => router.push(`/admin/projects/${resolvedParams.id}/request` as any)}
            className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800"
          >
            <MessageSquarePlus className="h-4 w-4 mr-2" />
            Request Info
          </Button>
        </div>
      </div>

      {/* Status & Key Info Grid */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl w-12 h-12 flex items-center justify-center">
                <Hash className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Case Reference</p>
                <p className="text-lg font-bold text-gray-900">
                  {project.caseReference || "Not assigned"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl w-12 h-12 flex items-center justify-center">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <Badge
                  variant="outline"
                  className={`${statusColors[project.status]} border-2 font-semibold`}
                >
                  {project.status.replace(/_/g, " ")}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl w-12 h-12 flex items-center justify-center">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Readiness Score</p>
                <p className="text-lg font-bold text-gray-900">
                  {project.readinessScore !== null
                    ? `${project.readinessScore}/100`
                    : "Not calculated"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Project Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Organization Info */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-red-600" />
                Organization Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Organization Name</p>
                  <p className="font-semibold text-gray-900">{project.organisation.name}</p>
                </div>
                {project.organisation.registrationNo && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Registration Number</p>
                    <p className="font-semibold text-gray-900">
                      {project.organisation.registrationNo}
                    </p>
                  </div>
                )}
                {project.organisation.sector && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Sector</p>
                    <p className="font-semibold text-gray-900">{project.organisation.sector}</p>
                  </div>
                )}
                {project.organisation.address && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600 mb-1">Address</p>
                    <p className="font-semibold text-gray-900">{project.organisation.address}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Project Details */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-red-600" />
                Project Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {project.sector && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Sector</p>
                    <p className="font-semibold text-gray-900">{project.sector}</p>
                  </div>
                )}
                {project.location && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Location</p>
                    <p className="font-semibold text-gray-900">{project.location}</p>
                  </div>
                )}
                {project.startDate && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Start Date</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(project.startDate).toLocaleDateString("en-ZA", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                )}
                {project.endDate && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">End Date</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(project.endDate).toLocaleDateString("en-ZA", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                )}
                {project.submittedAt && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Submitted On</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(project.submittedAt).toLocaleDateString("en-ZA", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Application Sections */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-red-600" />
                Application Sections
              </CardTitle>
              <CardDescription>
                {project.sections.filter((s) => s.isComplete).length} of {project.sections.length}{" "}
                sections completed ({completionPercentage}%)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {project.sections.map((section) => {
                  const isExpanded = expandedSections[section.id];
                  const hasData = Object.keys(section.sectionData).length > 0;
                  
                  return (
                    <div
                      key={section.id}
                      className="bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div
                        className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() =>
                          setExpandedSections((prev) => ({
                            ...prev,
                            [section.id]: !prev[section.id],
                          }))
                        }
                      >
                        <div className="flex items-center gap-3 flex-1">
                          {section.isComplete ? (
                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                          ) : hasData ? (
                            <AlertTriangle className="h-5 w-5 text-orange-500 flex-shrink-0" />
                          ) : (
                            <XCircle className="h-5 w-5 text-gray-400 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              {sectionLabels[section.sectionKey] || section.sectionKey}
                            </p>
                            <p className="text-sm text-gray-600">
                              {hasData
                                ? `${Object.keys(section.sectionData).length} field(s) filled`
                                : "No data"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={
                              section.isComplete
                                ? "bg-green-100 text-green-700 border-green-300"
                                : hasData
                                ? "bg-orange-100 text-orange-700 border-orange-300"
                                : "bg-gray-100 text-gray-600 border-gray-300"
                            }
                          >
                            {section.isComplete ? "Complete" : hasData ? "In Progress" : "Empty"}
                          </Badge>
                          {isExpanded ? (
                            <ChevronUp className="h-5 w-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                      </div>

                      {/* Expanded Section Data */}
                      {isExpanded && hasData && (
                        <div className="px-3 pb-3 pt-0 border-t border-gray-200 bg-white">
                          <div className="mt-3 space-y-3">
                            {Object.entries(section.sectionData).map(([key, value]) => (
                              <div key={key} className="grid grid-cols-3 gap-2">
                                <p className="text-sm font-medium text-gray-700 capitalize">
                                  {key.replace(/([A-Z])/g, " $1").trim()}:
                                </p>
                                <p className="text-sm text-gray-900 col-span-2">
                                  {typeof value === "string"
                                    ? value || "—"
                                    : JSON.stringify(value)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {isExpanded && !hasData && (
                        <div className="px-3 pb-3 pt-0 border-t border-gray-200 bg-white">
                          <p className="text-sm text-gray-500 mt-3 text-center py-4">
                            No data submitted for this section
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Timeline & Actions */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-white">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start hover:bg-orange-50 hover:text-orange-700 hover:border-orange-300"
                onClick={() => router.push(`/admin/projects/${resolvedParams.id}/request` as any)}
              >
                <MessageSquarePlus className="h-4 w-4 mr-2" />
                Request Information
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                onClick={handleDownloadPDF}
                disabled={downloadingPdf}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Application
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300"
                onClick={() => router.push(`/portal/projects/${resolvedParams.id}/timeline` as any)}
              >
                <Clock className="h-4 w-4 mr-2" />
                View Timeline
              </Button>
            </CardContent>
          </Card>

          {/* Status History */}
          {statusHistory.length > 0 && (
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-red-600" />
                  Status History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {statusHistory.map((history, index) => (
                    <div
                      key={history.id}
                      className={`pl-4 pb-3 ${
                        index !== statusHistory.length - 1 ? "border-l-2 border-gray-300" : ""
                      }`}
                    >
                      <div className="relative">
                        <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-red-600 border-2 border-white"></div>
                        <Badge
                          variant="outline"
                          className={`${statusColors[history.status]} border mb-1`}
                        >
                          {history.status.replace(/_/g, " ")}
                        </Badge>
                        <p className="text-xs text-gray-600">
                          {new Date(history.createdAt).toLocaleDateString("en-ZA", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        {history.notes && (
                          <p className="text-sm text-gray-700 mt-1">{history.notes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Application Stats */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-lg">Application Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Completion</span>
                <span className="text-sm font-semibold">{completionPercentage}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-green-600"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm text-gray-600">Created</span>
                <span className="text-sm font-medium">
                  {new Date(project.createdAt).toLocaleDateString("en-ZA", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Last Updated</span>
                <span className="text-sm font-medium">
                  {new Date(project.updatedAt).toLocaleDateString("en-ZA", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
