"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ClipboardCheck, Building2, Calendar, TrendingUp, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Assignment {
  id: string;
  projectId: string;
  assignedAt: string;
  completedAt: string | null;
  section11dScore: number | null;
  uncertaintyScore: number | null;
  innovationScore: number | null;
  budgetScore: number | null;
  timelineScore: number | null;
  recommendation: string | null;
  project: {
    id: string;
    title: string;
    status: string;
    caseReference: string | null;
    readinessScore: number | null;
    submittedAt: string | null;
    organisation: {
      name: string;
    };
  };
}

const statusColors: Record<string, string> = {
  SUBMITTED: "bg-blue-100 text-blue-700 border-blue-300",
  UNDER_REVIEW: "bg-yellow-100 text-yellow-700 border-yellow-300",
  PENDING_INFO: "bg-orange-100 text-orange-700 border-orange-300",
  APPROVED: "bg-green-100 text-green-700 border-green-300",
  DECLINED: "bg-red-100 text-red-700 border-red-300",
};

export default function MyReviewsPage() {
  const router = useRouter();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyAssignments();
  }, []);

  const fetchMyAssignments = async () => {
    try {
      const response = await fetch("/api/reviews/my-assignments");
      if (response.ok) {
        const data = await response.json();
        setAssignments(data.assignments || []);
      }
    } catch (error) {
      console.error("Error fetching assignments:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAverageScore = (assignment: Assignment) => {
    const scores = [
      assignment.section11dScore,
      assignment.uncertaintyScore,
      assignment.innovationScore,
      assignment.budgetScore,
      assignment.timelineScore,
    ].filter((s) => s !== null) as number[];

    if (scores.length === 0) return null;
    return (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
  };

  const pendingReviews = assignments.filter((a) => !a.completedAt);
  const completedReviews = assignments.filter((a) => a.completedAt);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Reviews</h1>
        <p className="text-gray-600 mt-1">
          Applications assigned to you for review
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Assigned</CardDescription>
            <CardTitle className="text-3xl">{assignments.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending Review</CardDescription>
            <CardTitle className="text-3xl text-orange-600">{pendingReviews.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Completed</CardDescription>
            <CardTitle className="text-3xl text-green-600">{completedReviews.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Pending Reviews */}
      {pendingReviews.length > 0 && (
        <Card className="border-2 hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              Pending Reviews ({pendingReviews.length})
            </CardTitle>
            <CardDescription>Applications awaiting your review</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">Case Ref</TableHead>
                    <TableHead className="font-semibold">Project Title</TableHead>
                    <TableHead className="font-semibold">Organisation</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Assigned</TableHead>
                    <TableHead className="text-right font-semibold">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingReviews.map((assignment) => (
                    <TableRow key={assignment.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="font-mono text-xs font-medium">
                        {assignment.project.caseReference || "—"}
                      </TableCell>
                      <TableCell className="font-medium text-gray-900">
                        {assignment.project.title}
                      </TableCell>
                      <TableCell className="text-gray-700 text-sm">
                        {assignment.project.organisation.name}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`${statusColors[assignment.project.status]} border font-medium text-xs`}
                        >
                          {assignment.project.status.replace(/_/g, " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600 text-sm">
                        {formatDistanceToNow(new Date(assignment.assignedAt), { addSuffix: true })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          onClick={() => router.push(`/admin/review/${assignment.projectId}`)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <ClipboardCheck className="h-4 w-4 mr-1" />
                          Start Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completed Reviews */}
      {completedReviews.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-green-600" />
              Completed Reviews ({completedReviews.length})
            </CardTitle>
            <CardDescription>Your completed review submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">Case Ref</TableHead>
                    <TableHead className="font-semibold">Project Title</TableHead>
                    <TableHead className="font-semibold">Organisation</TableHead>
                    <TableHead className="font-semibold">Avg Score</TableHead>
                    <TableHead className="font-semibold">Recommendation</TableHead>
                    <TableHead className="font-semibold">Completed</TableHead>
                    <TableHead className="text-right font-semibold">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {completedReviews.map((assignment) => {
                    const avgScore = calculateAverageScore(assignment);
                    return (
                      <TableRow key={assignment.id} className="hover:bg-gray-50 transition-colors">
                        <TableCell className="font-mono text-xs font-medium">
                          {assignment.project.caseReference || "—"}
                        </TableCell>
                        <TableCell className="font-medium text-gray-900">
                          {assignment.project.title}
                        </TableCell>
                        <TableCell className="text-gray-700 text-sm">
                          {assignment.project.organisation.name}
                        </TableCell>
                        <TableCell>
                          {avgScore ? (
                            <Badge variant="outline" className="font-medium">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              {avgScore} / 5.0
                            </Badge>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {assignment.recommendation ? (
                            <Badge
                              variant="outline"
                              className={
                                assignment.recommendation === "APPROVE"
                                  ? "bg-green-100 text-green-700 border-green-300"
                                  : assignment.recommendation === "DECLINE"
                                  ? "bg-red-100 text-red-700 border-red-300"
                                  : "bg-orange-100 text-orange-700 border-orange-300"
                              }
                            >
                              {assignment.recommendation.replace(/_/g, " ")}
                            </Badge>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-gray-600 text-sm">
                          {assignment.completedAt
                            ? formatDistanceToNow(new Date(assignment.completedAt), { addSuffix: true })
                            : "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push(`/admin/review/${assignment.projectId}`)}
                          >
                            View Review
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {assignments.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <ClipboardCheck className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">No reviews assigned yet</p>
            <p className="text-sm text-gray-500 mt-1">
              You'll see applications here once they are assigned to you for review
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
