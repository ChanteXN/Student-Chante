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
import { Search, Eye, MessageSquarePlus, FolderOpen } from "lucide-react";

interface Project {
  id: string;
  title: string;
  status: string;
  caseReference: string | null;
  submittedAt: string | null;
  organisation: {
    name: string;
  };
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

export default function AdminProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.organisation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.caseReference?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          All Projects
        </h1>
        <p className="text-gray-600 mt-1 text-base">
          Review and manage all R&D tax incentive applications
        </p>
      </div>

      {/* Main Card */}
      <Card className="border-2 hover:shadow-xl transition-shadow">
        <CardHeader>
          <CardTitle className="text-xl">Application Registry</CardTitle>
          <CardDescription className="text-base">
            Search and filter through submitted applications
          </CardDescription>
          <div className="flex items-center gap-4 pt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by title, organization, or case reference..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
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
                    <TableHead className="font-semibold">Case Reference</TableHead>
                    <TableHead className="font-semibold">Project Title</TableHead>
                    <TableHead className="font-semibold">Organisation</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Submitted</TableHead>
                    <TableHead className="text-right font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.map((project) => (
                    <TableRow key={project.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="font-mono text-sm font-medium">
                        {project.caseReference || "—"}
                      </TableCell>
                      <TableCell className="font-medium text-gray-900">
                        {project.title}
                      </TableCell>
                      <TableCell className="text-gray-700">{project.organisation.name}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`${statusColors[project.status]} border font-medium`}
                        >
                          {project.status.replace(/_/g, " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {project.submittedAt
                          ? new Date(project.submittedAt).toLocaleDateString('en-ZA', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })
                          : "—"}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                          onClick={() =>
                            router.push(`/admin/projects/${project.id}`)
                          }
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        {project.status !== "DRAFT" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="hover:bg-orange-50 hover:text-orange-700 hover:border-orange-300"
                            onClick={() =>
                              router.push(`/admin/projects/${project.id}/request`)
                            }
                          >
                            <MessageSquarePlus className="h-4 w-4 mr-1" />
                            Request Info
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
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
