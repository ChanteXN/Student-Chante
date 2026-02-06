"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Search, Calendar, Building2, ExternalLink, Eye } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface ProgressReportWithProject {
  id: string;
  reportingPeriod: string;
  outcomes: string;
  milestones: string;
  staffing: string;
  learnings: string;
  expenditure: string | null;
  challenges: string | null;
  dueDate: string | null;
  submittedAt: string | null;
  status: string;
  createdAt: string;
  projectId: string;
  project: {
    id: string;
    title: string;
    caseReference: string | null;
    status: string;
    organisation: {
      id: string;
      name: string;
    };
  } | null;
}

export default function AdminProgressReportsPage() {
  const [reports, setReports] = useState<ProgressReportWithProject[]>([]);
  const [filteredReports, setFilteredReports] = useState<ProgressReportWithProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch("/api/admin/progress-reports");
      if (!response.ok) throw new Error("Failed to fetch reports");

      const data = await response.json();
      setReports(data.reports);
      setFilteredReports(data.reports);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const filterReports = useCallback(() => {
    let filtered = reports;

    // Filter by status
    if (statusFilter !== "ALL") {
      filtered = filtered.filter((report) => report.status === statusFilter);
    }

    // Filter by search term (project title, organization, or reporting period)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (report) =>
          report.project?.title.toLowerCase().includes(term) ||
          report.project?.organisation.name.toLowerCase().includes(term) ||
          report.reportingPeriod.toLowerCase().includes(term) ||
          report.project?.caseReference?.toLowerCase().includes(term)
      );
    }

    setFilteredReports(filtered);
  }, [reports, statusFilter, searchTerm]);

  useEffect(() => {
    filterReports();
  }, [filterReports]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SUBMITTED":
        return "bg-blue-100 text-blue-800";
      case "UNDER_REVIEW":
        return "bg-yellow-100 text-yellow-800";
      case "ACCEPTED":
        return "bg-green-100 text-green-800";
      case "DRAFT":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const statusCounts = {
    ALL: reports.length,
    SUBMITTED: reports.filter((r) => r.status === "SUBMITTED").length,
    UNDER_REVIEW: reports.filter((r) => r.status === "UNDER_REVIEW").length,
    ACCEPTED: reports.filter((r) => r.status === "ACCEPTED").length,
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <FileText className="h-8 w-8 text-blue-600" />
          Progress Reports Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Monitor post-approval project progress reports from all companies
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Reports</CardDescription>
            <CardTitle className="text-3xl">{statusCounts.ALL}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Submitted</CardDescription>
            <CardTitle className="text-3xl text-blue-600">
              {statusCounts.SUBMITTED}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Under Review</CardDescription>
            <CardTitle className="text-3xl text-yellow-600">
              {statusCounts.UNDER_REVIEW}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Accepted</CardDescription>
            <CardTitle className="text-3xl text-green-600">
              {statusCounts.ACCEPTED}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by project, organization, or period..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              {["ALL", "SUBMITTED", "UNDER_REVIEW", "ACCEPTED"].map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                >
                  {status.replace("_", " ")}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

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
      {!loading && !error && filteredReports.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Progress Reports Found
              </h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== "ALL"
                  ? "Try adjusting your filters"
                  : "No progress reports have been submitted yet"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {!loading && !error && filteredReports.length > 0 && (
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <Card key={report.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-xl">
                        {report.reportingPeriod}
                      </CardTitle>
                      <Badge className={getStatusColor(report.status)}>
                        {report.status}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground mt-1.5">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        <span className="font-semibold">
                          {report.project?.organisation.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span>{report.project?.title}</span>
                        {report.project?.caseReference && (
                          <Badge variant="outline" className="ml-2">
                            {report.project.caseReference}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Submitted{" "}
                          {report.submittedAt
                            ? formatDistanceToNow(new Date(report.submittedAt), {
                                addSuffix: true,
                              })
                            : "Not submitted"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/admin/progress-reports/${report.id}`}>
                      <Button variant="default" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Review
                      </Button>
                    </Link>
                    <Link
                      href={`/admin/projects/${report.projectId}`}
                      target="_blank"
                    >
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Project
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      Staffing Updates
                    </h4>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {report.staffing}
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
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
