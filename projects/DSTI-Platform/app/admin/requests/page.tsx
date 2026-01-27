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
import { Search, Eye, MessageSquare, CheckCircle2, Clock } from "lucide-react";

interface ReviewRequest {
  id: string;
  subject: string;
  message: string;
  status: "PENDING" | "RESPONDED" | "RESOLVED";
  response: string | null;
  respondedAt: string | null;
  createdAt: string;
  project: {
    id: string;
    title: string;
    caseReference: string | null;
    organisation: {
      name: string;
    };
  };
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

export default function AdminRequestsPage() {
  const _router = useRouter();
  const [requests, setRequests] = useState<ReviewRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch("/api/admin/requests");
      if (response.ok) {
        const data = await response.json();
        setRequests(data.requests || []);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = requests
    .filter((request) => {
      const matchesSearch =
        request.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.project.organisation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.project.caseReference?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "ALL" || request.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "PENDING").length,
    responded: requests.filter((r) => r.status === "RESPONDED").length,
    resolved: requests.filter((r) => r.status === "RESOLVED").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Information Requests
        </h1>
        <p className="text-gray-600 mt-1 text-base">
          Manage all information requests and applicant responses
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-2 hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl w-12 h-12 flex items-center justify-center">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setStatusFilter("PENDING")}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl w-12 h-12 flex items-center justify-center">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setStatusFilter("RESPONDED")}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl w-12 h-12 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Responded</p>
                <p className="text-2xl font-bold text-gray-900">{stats.responded}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setStatusFilter("RESOLVED")}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl w-12 h-12 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-gray-900">{stats.resolved}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Card */}
      <Card className="border-2 hover:shadow-xl transition-shadow">
        <CardHeader>
          <CardTitle className="text-xl">Request Registry</CardTitle>
          <CardDescription className="text-base">
            Search and filter through all information requests
          </CardDescription>
          <div className="flex items-center gap-4 pt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by subject, project, organization, or case reference..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={statusFilter === "ALL" ? "default" : "outline"}
                onClick={() => setStatusFilter("ALL")}
                className={statusFilter === "ALL" ? "bg-gradient-to-r from-red-600 to-red-700" : ""}
              >
                All
              </Button>
              <Button
                size="sm"
                variant={statusFilter === "PENDING" ? "default" : "outline"}
                onClick={() => setStatusFilter("PENDING")}
                className={statusFilter === "PENDING" ? "bg-gradient-to-r from-orange-600 to-orange-700" : ""}
              >
                Pending
              </Button>
              <Button
                size="sm"
                variant={statusFilter === "RESPONDED" ? "default" : "outline"}
                onClick={() => setStatusFilter("RESPONDED")}
                className={statusFilter === "RESPONDED" ? "bg-gradient-to-r from-blue-600 to-blue-700" : ""}
              >
                Responded
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading requests...</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No requests found</p>
              <p className="text-sm text-gray-500 mt-1">
                {searchTerm || statusFilter !== "ALL"
                  ? "Try adjusting your search criteria"
                  : "Information requests will appear here"}
              </p>
            </div>
          ) : (
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">Case Reference</TableHead>
                    <TableHead className="font-semibold">Project</TableHead>
                    <TableHead className="font-semibold">Subject</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Created</TableHead>
                    <TableHead className="text-right font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => {
                    const StatusIcon = statusIcons[request.status];
                    return (
                      <TableRow key={request.id} className="hover:bg-gray-50 transition-colors">
                        <TableCell className="font-mono text-sm font-medium">
                          {request.project.caseReference || "—"}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-gray-900">{request.project.title}</p>
                            <p className="text-sm text-gray-600">{request.project.organisation.name}</p>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium text-gray-900 max-w-xs truncate">
                          {request.subject}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`${statusColors[request.status]} border font-medium inline-flex items-center gap-1`}
                          >
                            <StatusIcon className="h-3 w-3" />
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {new Date(request.createdAt).toLocaleDateString("en-ZA", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            className="hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                          disabled
                          title="Request detail page coming soon"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
          
          {/* Footer Stats */}
          {filteredRequests.length > 0 && (
            <div className="mt-4 flex items-center justify-between text-sm text-gray-600 border-t pt-4">
              <p>
                Showing <span className="font-semibold text-gray-900">{filteredRequests.length}</span> of{" "}
                <span className="font-semibold text-gray-900">{requests.length}</span> request(s)
              </p>
              {searchTerm && (
                <Button variant="ghost" size="sm" onClick={() => setSearchTerm("")}>
                  Clear search
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
