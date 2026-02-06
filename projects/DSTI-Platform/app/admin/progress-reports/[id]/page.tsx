"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, AlertCircle, ArrowLeft, Building, User, Mail, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProgressReport {
  id: string;
  projectId: string;
  reportingPeriod: string;
  outcomes: string;
  milestones: string;
  staffing: string;
  learnings: string;
  expenditure: string | null;
  challenges: string | null;
  dueDate: Date | null;
  status: string;
  submittedBy: string | null;
  submittedAt: Date | null;
  reviewedBy: string | null;
  reviewedAt: Date | null;
  feedback: string | null;
  createdAt: Date;
  updatedAt: Date;
  project: {
    id: string;
    caseReference: string;
    title: string;
    organisation: {
      name: string;
      memberships: {
        user: {
          name: string | null;
          email: string;
        };
      }[];
    };
  };
}

export default function ReviewProgressReportPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const reportId = params.id as string;

  const [report, setReport] = useState<ProgressReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<"accept" | "request_changes" | null>(null);
  const [feedback, setFeedback] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);

  const fetchReport = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/progress-reports/${reportId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch report");
      }
      const data = await response.json();
      setReport(data);
      
      // Pre-fill feedback if exists
      if (data.feedback) {
        setFeedback(data.feedback);
      }
    } catch (error) {
      console.error("Error fetching report:", error);
      toast({
        title: "Error",
        description: "Failed to load progress report",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [reportId, toast]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const handleAccept = async () => {
    setActionLoading("accept");
    try {
      const response = await fetch(`/api/admin/progress-reports/${reportId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "accept",
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to accept report");
      }

      toast({
        title: "✅ Report Accepted",
        description: "Progress report has been accepted successfully",
        duration: 5000,
      });

      // Refresh report
      await fetchReport();
    } catch (error: unknown) {
      console.error("Error accepting report:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to accept report",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleRequestChanges = async () => {
    if (!feedback.trim()) {
      toast({
        title: "Feedback Required",
        description: "Please provide feedback for the changes requested",
        variant: "destructive",
      });
      return;
    }

    setActionLoading("request_changes");
    try {
      const response = await fetch(`/api/admin/progress-reports/${reportId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "request_changes",
          feedback: feedback.trim(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to request changes");
      }

      toast({
        title: "✅ Changes Requested",
        description: "Feedback has been sent to the applicant",
        duration: 5000,
      });

      // Refresh report
      await fetchReport();
      setShowFeedback(false);
    } catch (error: unknown) {
      console.error("Error requesting changes:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to request changes",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      DRAFT: { label: "Draft", variant: "secondary" },
      SUBMITTED: { label: "Submitted", variant: "default" },
      UNDER_REVIEW: { label: "Under Review", variant: "default" },
      REQUIRES_CHANGES: { label: "Requires Changes", variant: "destructive" },
      ACCEPTED: { label: "Accepted", variant: "outline" },
    };

    const config = statusConfig[status] || { label: status, variant: "default" };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Progress report not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isReviewed = report.status === "ACCEPTED" || report.status === "REQUIRES_CHANGES";

  return (
    <div className="container mx-auto py-8 max-w-5xl">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/admin/progress-reports")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Reports
        </Button>
        <h1 className="text-3xl font-bold">Review Progress Report</h1>
        <p className="text-muted-foreground mt-2">
          Review and provide feedback on this progress report
        </p>
      </div>

      <div className="grid gap-6">
        {/* Project Information */}
        <Card>
          <CardHeader>
            <CardTitle>Project Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Case Reference</p>
                <p className="font-mono">{report.project.caseReference}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                {getStatusBadge(report.status)}
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground">Project Title</p>
              <p className="font-semibold">{report.project.title}</p>
            </div>

            <hr className="my-4" />

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <User className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Applicant</p>
                  <p>
                    {report.project.organisation.memberships[0]?.user.name || "N/A"}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-sm">{report.project.organisation.memberships[0]?.user.email || "N/A"}</p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Building className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Organisation</p>
                <p>{report.project.organisation.name}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Report Details */}
        <Card>
          <CardHeader>
            <CardTitle>Report Details</CardTitle>
            <div className="text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 inline mr-1" />
              Submitted: {report.submittedAt ? new Date(report.submittedAt).toLocaleString() : "Not submitted"}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Reporting Period</h3>
              <p>{report.reportingPeriod}</p>
            </div>

            <hr className="my-4" />

            <div>
              <h3 className="font-semibold mb-2">Outcomes Achieved</h3>
              <p className="whitespace-pre-wrap">{report.outcomes}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Milestones Reached</h3>
              <p className="whitespace-pre-wrap">{report.milestones}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Staffing Updates</h3>
              <p className="whitespace-pre-wrap">{report.staffing}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Key Learnings</h3>
              <p className="whitespace-pre-wrap">{report.learnings}</p>
            </div>

            {report.expenditure && (
              <div>
                <h3 className="font-semibold mb-2">Expenditure</h3>
                <p className="whitespace-pre-wrap">{report.expenditure}</p>
              </div>
            )}

            {report.challenges && (
              <div>
                <h3 className="font-semibold mb-2">Challenges</h3>
                <p className="whitespace-pre-wrap">{report.challenges}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Review History (if reviewed) */}
        {isReviewed && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {report.status === "ACCEPTED" ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                )}
                Review History
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Reviewed By</p>
                  <p>{report.reviewedBy}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Reviewed At</p>
                  <p>{report.reviewedAt ? new Date(report.reviewedAt).toLocaleString() : "N/A"}</p>
                </div>
              </div>

              {report.feedback && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Feedback</p>
                  <div className="bg-muted p-4 rounded-md">
                    <p className="whitespace-pre-wrap">{report.feedback}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Review Actions */}
        {!isReviewed && (
          <Card>
            <CardHeader>
              <CardTitle>Review Actions</CardTitle>
              <CardDescription>
                Accept this report or request changes from the applicant
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {showFeedback && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Feedback for Applicant <span className="text-destructive">*</span>
                  </label>
                  <Textarea
                    placeholder="Explain what changes are needed..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={5}
                    className="resize-none"
                  />
                  <p className="text-sm text-muted-foreground">
                    This feedback will be visible to the applicant
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                {!showFeedback ? (
                  <>
                    <Button
                      onClick={handleAccept}
                      disabled={actionLoading !== null}
                      className="flex-1"
                    >
                      {actionLoading === "accept" ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Accepting...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Accept Report
                        </>
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => setShowFeedback(true)}
                      disabled={actionLoading !== null}
                      className="flex-1"
                    >
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Request Changes
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowFeedback(false);
                        setFeedback(report.feedback || "");
                      }}
                      disabled={actionLoading !== null}
                    >
                      Cancel
                    </Button>

                    <Button
                      onClick={handleRequestChanges}
                      disabled={actionLoading !== null || !feedback.trim()}
                      className="flex-1"
                      variant="destructive"
                    >
                      {actionLoading === "request_changes" ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-4 w-4 mr-2" />
                          Submit Feedback
                        </>
                      )}
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* View Project Link */}
        <div className="flex justify-center">
          <Button
            variant="link"
            onClick={() => router.push(`/admin/projects`)}
          >
            View All Projects
          </Button>
        </div>
      </div>
    </div>
  );
}
