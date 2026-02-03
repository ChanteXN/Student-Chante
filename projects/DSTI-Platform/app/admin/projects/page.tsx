"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Eye, MessageSquarePlus, FolderOpen, ArrowUpDown, AlertCircle, FileText, TrendingUp, Filter } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Project {
  id: string;
  title: string;
  status: string;
  caseReference: string | null;
  submittedAt: string | null;
  readinessScore: number | null;
  organisation: {
    name: string;
  };
  evidenceFiles?: {
    category: string;
  }[];
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

const REQUIRED_EVIDENCE = ["RD_PLAN", "TIMESHEETS", "EXPERIMENTS"];

type SortField = "submittedAt" | "readinessScore" | "title" | "status";
type SortDirection = "asc" | "desc";

export default function AdminProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [readinessFilter, setReadinessFilter] = useState<number>(0);
  const [showOnlyWithMissingEvidence, setShowOnlyWithMissingEvidence] = useState(false);
  const [sortField, setSortField] = useState<SortField>("submittedAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/admin/projects");
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const getMissingEvidence = (project: Project) => {
    const uploadedCategories = (project.evidenceFiles || []).map(f => f.category);
    return REQUIRED_EVIDENCE.filter(req => !uploadedCategories.includes(req));
  };

  const getReadinessScoreColor = (score: number | null) => {
    if (score === null) return "bg-gray-100 text-gray-700";
    if (score >= 80) return "bg-green-100 text-green-700";
    if (score >= 60) return "bg-blue-100 text-blue-700";
    if (score >= 40) return "bg-amber-100 text-amber-700";
    return "bg-red-100 text-red-700";
  };

  const getRiskLevel = (project: Project) => {
    const missingEvidence = getMissingEvidence(project).length;
    const score = project.readinessScore || 0;
    
    if (missingEvidence >= 2 || score < 40) return { level: "HIGH", color: "text-red-600" };
    if (missingEvidence === 1 || score < 60) return { level: "MEDIUM", color: "text-amber-600" };
    return { level: "LOW", color: "text-green-600" };
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const filteredProjects = projects
    .filter((project) => {
      // Search filter
      const searchMatch = 
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.organisation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.caseReference?.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!searchMatch) return false;

      // Status filter
      if (statusFilter !== "ALL" && project.status !== statusFilter) return false;

      // Readiness filter
      if (readinessFilter > 0 && (project.readinessScore || 0) < readinessFilter) return false;

      // Missing evidence filter
      if (showOnlyWithMissingEvidence && getMissingEvidence(project).length === 0) return false;

      return true;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case "submittedAt":
          comparison = new Date(a.submittedAt || 0).getTime() - new Date(b.submittedAt || 0).getTime();
          break;
        case "readinessScore":
          comparison = (a.readinessScore || 0) - (b.readinessScore || 0);
          break;
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

  const stats = {
    total: projects.length,
    submitted: projects.filter(p => p.status === "SUBMITTED").length,
    underReview: projects.filter(p => p.status === "UNDER_REVIEW").length,
    pendingInfo: projects.filter(p => p.status === "PENDING_INFO").length,
    highRisk: projects.filter(p => getRiskLevel(p).level === "HIGH").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Application Screening Dashboard
        </h1>
        <p className="text-gray-600 mt-1 text-base">
          Triage and prioritize R&D tax incentive applications
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Applications</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Submitted</CardDescription>
            <CardTitle className="text-3xl text-blue-600">{stats.submitted}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Under Review</CardDescription>
            <CardTitle className="text-3xl text-yellow-600">{stats.underReview}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending Info</CardDescription>
            <CardTitle className="text-3xl text-orange-600">{stats.pendingInfo}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>High Risk</CardDescription>
            <CardTitle className="text-3xl text-red-600">{stats.highRisk}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Main Card */}
      <Card className="border-2 hover:shadow-xl transition-shadow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Application Registry
              </CardTitle>
              <CardDescription className="text-base">
                Search, filter, and sort applications for fast triage
              </CardDescription>
            </div>
          </div>
          
          {/* Search and Filters */}
          <div className="space-y-4 pt-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by title, organization, or case reference..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-3">
              {/* Status Filter */}
              <div className="flex gap-2">
                {["ALL", "SUBMITTED", "UNDER_REVIEW", "PENDING_INFO", "APPROVED", "DECLINED"].map((status) => (
                  <Button
                    key={status}
                    variant={statusFilter === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter(status)}
                    className={statusFilter === status ? "" : "hover:bg-gray-100"}
                  >
                    {status.replace(/_/g, " ")}
                  </Button>
                ))}
              </div>
            </div>

            {/* Additional Filters */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <label className="font-medium text-gray-700">Min Readiness:</label>
                <select
                  value={readinessFilter}
                  onChange={(e) => setReadinessFilter(Number(e.target.value))}
                  className="border border-gray-300 rounded px-2 py-1"
                >
                  <option value={0}>All</option>
                  <option value={40}>≥ 40%</option>
                  <option value={60}>≥ 60%</option>
                  <option value={80}>≥ 80%</option>
                </select>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showOnlyWithMissingEvidence}
                  onChange={(e) => setShowOnlyWithMissingEvidence(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="font-medium text-gray-700">Missing Evidence Only</span>
              </label>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading projects...</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <FolderOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No projects found</p>
              <p className="text-sm text-gray-500 mt-1">
                {searchTerm ? "Try adjusting your search criteria" : "Applications will appear here once submitted"}
              </p>
            </div>
          ) : (
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">Case Ref</TableHead>
                    <TableHead className="font-semibold">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 -ml-3"
                        onClick={() => handleSort("title")}
                      >
                        Project Title
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="font-semibold">Organisation</TableHead>
                    <TableHead className="font-semibold">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 -ml-3"
                        onClick={() => handleSort("status")}
                      >
                        Status
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="font-semibold">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 -ml-3"
                        onClick={() => handleSort("readinessScore")}
                      >
                        Readiness
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="font-semibold">Risk</TableHead>
                    <TableHead className="font-semibold">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 -ml-3"
                        onClick={() => handleSort("submittedAt")}
                      >
                        Submitted
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="text-right font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.map((project) => {
                    const missingEvidence = getMissingEvidence(project);
                    const risk = getRiskLevel(project);
                    
                    return (
                      <TableRow key={project.id} className="hover:bg-gray-50 transition-colors">
                        <TableCell className="font-mono text-xs font-medium">
                          {project.caseReference || "—"}
                        </TableCell>
                        <TableCell className="font-medium text-gray-900">
                          <div className="flex items-start gap-2">
                            {project.title}
                            {missingEvidence.length > 0 && (
                              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">
                                <FileText className="h-3 w-3 mr-1" />
                                {missingEvidence.length} missing
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-700 text-sm">
                          {project.organisation.name}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`${statusColors[project.status]} border font-medium text-xs`}
                          >
                            {project.status.replace(/_/g, " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className={`${getReadinessScoreColor(project.readinessScore)} border font-medium`}
                            >
                              <TrendingUp className="h-3 w-3 mr-1" />
                              {project.readinessScore || 0}%
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <AlertCircle className={`h-4 w-4 ${risk.color}`} />
                            <span className={`text-xs font-semibold ${risk.color}`}>
                              {risk.level}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600 text-sm">
                          {project.submittedAt
                            ? formatDistanceToNow(new Date(project.submittedAt), { addSuffix: true })
                            : "—"}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                            onClick={() => router.push(`/admin/projects/${project.id}`)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          {project.status !== "DRAFT" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="hover:bg-orange-50 hover:text-orange-700 hover:border-orange-300"
                              onClick={() => router.push(`/admin/projects/${project.id}/request`)}
                            >
                              <MessageSquarePlus className="h-4 w-4 mr-1" />
                              Request Info
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Footer */}
      <div className="flex items-center justify-between text-sm text-gray-600 px-4">
        <p>
          Showing <span className="font-semibold text-gray-900">{filteredProjects.length}</span> of{" "}
          <span className="font-semibold text-gray-900">{projects.length}</span> applications
        </p>
        {searchTerm && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setSearchTerm("")}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            Clear search
          </Button>
        )}
      </div>
    </div>
  );
}
