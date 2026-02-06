"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  FileText,
  AlertCircle,
  Download,
  Loader2,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ReviewerAssignment {
  id: string;
  reviewer: {
    name: string | null;
    email: string;
  };
  section11dScore: number | null;
  uncertaintyScore: number | null;
  innovationScore: number | null;
  budgetScore: number | null;
  timelineScore: number | null;
  recommendation: string | null;
  recommendationNote: string | null;
  completedAt: string | null;
}

interface Project {
  id: string;
  title: string;
  caseReference: string | null;
  status: string;
  submittedAt: string | null;
  readinessScore: number | null;
  organisation: {
    name: string;
    registrationNo: string | null;
  };
  reviewerAssignments: ReviewerAssignment[];
  decision: {
    outcome: string;
    reasoning: string;
    conditions: string | null;
    decidedAt: string;
  } | null;
}

export default function AdminDecisionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [downloadingLetter, setDownloadingLetter] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [selectedOutcome, setSelectedOutcome] = useState<"APPROVED" | "DECLINED" | null>(null);
  const [reasoning, setReasoning] = useState("");
  const [conditions, setConditions] = useState("");

  useEffect(() => {
    fetchProject();
  }, []);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/projects/${resolvedParams.id}`);
      if (!res.ok) throw new Error("Failed to fetch project");
      const data = await res.json();
      setProject(data);

      // Pre-fill if decision already exists
      if (data.decision) {
        setSelectedOutcome(data.decision.outcome);
        setReasoning(data.decision.reasoning);
        setConditions(data.decision.conditions || "");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load project");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitDecision = async () => {
    if (!selectedOutcome) {
      setError("Please select a decision outcome");
      return;
    }
    if (!reasoning.trim()) {
      setError("Please provide reasoning for your decision");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const res = await fetch(`/api/admin/decisions/${resolvedParams.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          outcome: selectedOutcome,
          reasoning: reasoning.trim(),
          conditions: conditions.trim() || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit decision");
      }

      // Refresh project to show decision
      await fetchProject();
      
      // Show success and optionally redirect
      alert("Decision submitted successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit decision");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadLetter = async () => {
    try {
      setDownloadingLetter(true);
      const res = await fetch(`/api/admin/decisions/${resolvedParams.id}/letter`);
      if (!res.ok) throw new Error("Failed to generate letter");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `decision-letter-${project?.caseReference || resolvedParams.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to download letter");
    } finally {
      setDownloadingLetter(false);
    }
  };

  const calculateAverageScore = () => {
    if (!project?.reviewerAssignments.length) return null;
    
    let totalScore = 0;
    let scoreCount = 0;

    project.reviewerAssignments.forEach((assignment) => {
      [
        assignment.section11dScore,
        assignment.uncertaintyScore,
        assignment.innovationScore,
        assignment.budgetScore,
        assignment.timelineScore,
      ].forEach((score) => {
        if (score !== null) {
          totalScore += score;
          scoreCount++;
        }
      });
    });

    return scoreCount > 0 ? (totalScore / scoreCount).toFixed(1) : null;
  };

  const getRecommendationSummary = () => {
    if (!project?.reviewerAssignments.length) return { approve: 0, decline: 0, info: 0 };
    
    const summary = { approve: 0, decline: 0, info: 0 };
    project.reviewerAssignments.forEach((assignment) => {
      if (assignment.recommendation === "APPROVE") summary.approve++;
      else if (assignment.recommendation === "DECLINE") summary.decline++;
      else if (assignment.recommendation === "REQUEST_INFO") summary.info++;
    });

    return summary;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Project not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  const avgScore = calculateAverageScore();
  const recommendations = getRecommendationSummary();
  const hasDecision = !!project.decision;

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/admin/projects")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>Case: {project.caseReference || "N/A"}</span>
              <span>•</span>
              <span>Organisation: {project.organisation.name}</span>
              <span>•</span>
              <Badge variant="outline">{project.status}</Badge>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Project Summary */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Readiness Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {project.readinessScore !== null ? `${project.readinessScore}%` : "N/A"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Average Review Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {avgScore ? `${avgScore}/5` : "N/A"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Submitted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg">
              {project.submittedAt
                ? new Date(project.submittedAt).toLocaleDateString()
                : "Not submitted"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reviewer Recommendations */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Reviewer Recommendations</CardTitle>
          <CardDescription>
            Summary of reviewer assessments ({project.reviewerAssignments.length} reviewer(s))
          </CardDescription>
        </CardHeader>
        <CardContent>
          {project.reviewerAssignments.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No reviewer assignments found. Assign reviewers before making a decision.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              {/* Recommendation Summary */}
              <div className="flex gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-semibold">{recommendations.approve}</span>
                  <span className="text-sm text-gray-600">Approve</span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <span className="font-semibold">{recommendations.decline}</span>
                  <span className="text-sm text-gray-600">Decline</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  <span className="font-semibold">{recommendations.info}</span>
                  <span className="text-sm text-gray-600">Request Info</span>
                </div>
              </div>

              {/* Individual Reviews */}
              <div className="space-y-4">
                {project.reviewerAssignments.map((assignment) => (
                  <div key={assignment.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold">{assignment.reviewer.name || "Anonymous"}</p>
                        <p className="text-sm text-gray-600">{assignment.reviewer.email}</p>
                      </div>
                      {assignment.recommendation && (
                        <Badge
                          variant={
                            assignment.recommendation === "APPROVE"
                              ? "default"
                              : assignment.recommendation === "DECLINE"
                              ? "destructive"
                              : "outline"
                          }
                        >
                          {assignment.recommendation}
                        </Badge>
                      )}
                    </div>

                    {/* Rubric Scores */}
                    <div className="grid grid-cols-5 gap-3 mb-3">
                      <div>
                        <p className="text-xs text-gray-600">Section 11D</p>
                        <p className="font-semibold">
                          {assignment.section11dScore !== null ? `${assignment.section11dScore}/5` : "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Uncertainty</p>
                        <p className="font-semibold">
                          {assignment.uncertaintyScore !== null ? `${assignment.uncertaintyScore}/5` : "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Innovation</p>
                        <p className="font-semibold">
                          {assignment.innovationScore !== null ? `${assignment.innovationScore}/5` : "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Budget</p>
                        <p className="font-semibold">
                          {assignment.budgetScore !== null ? `${assignment.budgetScore}/5` : "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Timeline</p>
                        <p className="font-semibold">
                          {assignment.timelineScore !== null ? `${assignment.timelineScore}/5` : "N/A"}
                        </p>
                      </div>
                    </div>

                    {/* Recommendation Note */}
                    {assignment.recommendationNote && (
                      <div className="bg-gray-50 rounded p-3">
                        <p className="text-sm">{assignment.recommendationNote}</p>
                      </div>
                    )}

                    {!assignment.completedAt && (
                      <p className="text-xs text-orange-600 mt-2">⏱ Review in progress</p>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Decision Form */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Final Decision</CardTitle>
          <CardDescription>
            {hasDecision
              ? "Decision has been recorded. You can update it below."
              : "Make the final approval or decline decision for this application."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Outcome Selection */}
          <div>
            <Label className="mb-3 block">Decision Outcome</Label>
            <div className="flex gap-4">
              <Button
                type="button"
                variant={selectedOutcome === "APPROVED" ? "default" : "outline"}
                className={`flex-1 h-auto py-4 ${
                  selectedOutcome === "APPROVED" ? "bg-green-600 hover:bg-green-700" : ""
                }`}
                onClick={() => setSelectedOutcome("APPROVED")}
                disabled={hasDecision}
              >
                <CheckCircle className="mr-2 h-5 w-5" />
                Approve Application
              </Button>

              <Button
                type="button"
                variant={selectedOutcome === "DECLINED" ? "default" : "outline"}
                className={`flex-1 h-auto py-4 ${
                  selectedOutcome === "DECLINED" ? "bg-red-600 hover:bg-red-700" : ""
                }`}
                onClick={() => setSelectedOutcome("DECLINED")}
                disabled={hasDecision}
              >
                <XCircle className="mr-2 h-5 w-5" />
                Decline Application
              </Button>
            </div>
          </div>

          {/* Reasoning */}
          <div>
            <Label htmlFor="reasoning">Detailed Reasoning *</Label>
            <Textarea
              id="reasoning"
              placeholder="Provide a comprehensive explanation for this decision. This will be included in the decision letter."
              value={reasoning}
              onChange={(e) => setReasoning(e.target.value)}
              rows={6}
              className="mt-2"
              disabled={hasDecision}
            />
            <p className="text-xs text-gray-600 mt-1">
              Include specific references to the review criteria and evidence provided.
            </p>
          </div>

          {/* Conditions (for approvals) */}
          {selectedOutcome === "APPROVED" && (
            <div>
              <Label htmlFor="conditions">Conditions or Requirements (Optional)</Label>
              <Textarea
                id="conditions"
                placeholder="List any conditions, requirements, or next steps for the approval (e.g., 'Pending final audit', 'Quarterly reporting required')"
                value={conditions}
                onChange={(e) => setConditions(e.target.value)}
                rows={4}
                className="mt-2"
                disabled={hasDecision}
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            {!hasDecision ? (
              <Button
                onClick={handleSubmitDecision}
                disabled={!selectedOutcome || !reasoning.trim() || submitting}
                className="flex-1"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting Decision...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Submit Decision
                  </>
                )}
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={handleDownloadLetter}
                  disabled={downloadingLetter}
                  className="flex-1"
                >
                  {downloadingLetter ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Download Decision Letter
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push(`/admin/projects/${resolvedParams.id}`)}
                  className="flex-1"
                >
                  View Project Details
                </Button>
              </>
            )}
          </div>

          {hasDecision && (
            <Alert className="mt-4">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Decision recorded on {new Date(project.decision!.decidedAt).toLocaleString()}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
