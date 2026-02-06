"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Send,
  ArrowLeft,
  FileText,
  Loader2,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";

interface ProgressReport {
  id: string;
  reportingPeriod: string;
  outcomes: string;
  status: string;
  submittedAt: string;
}

interface ProjectData {
  project: {
    id: string;
    title: string;
    caseReference: string | null;
  };
  decision: {
    conditions: string | null;
  } | null;
  reports: ProgressReport[];
}

export default function CompliancePage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();

  const [data, setData] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    reportingPeriod: "",
    outcomes: "",
    milestones: "",
    staffing: "",
    learnings: "",
    expenditure: "",
    challenges: "",
  });

  useEffect(() => {
    if (params.id) {
      fetchData();
    }
  }, [params.id]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch decision
      const decisionRes = await fetch(`/api/projects/${params.id}/decision`);
      const decisionData = await decisionRes.json();

      // Fetch progress reports
      const reportsRes = await fetch(`/api/projects/${params.id}/progress-reports`);
      const reportsData = await reportsRes.json();

      setData({
        project: decisionData.project,
        decision: decisionData.decision,
        reports: reportsData.reports || [],
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load compliance data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.reportingPeriod || !formData.outcomes || !formData.milestones) {
      toast({
        title: "Validation Error",
        description: "Please fill in reporting period, outcomes, and milestones",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch(`/api/projects/${params.id}/progress-reports`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to submit report");
      }

      toast({
        title: "✅ Success!",
        description: "Your progress report has been submitted successfully. You can view it in the Submitted Reports section.",
        duration: 5000,
      });

      // Reset form and refresh data
      setFormData({
        reportingPeriod: "",
        outcomes: "",
        milestones: "",
        staffing: "",
        learnings: "",
        expenditure: "",
        challenges: "",
      });
      fetchData();
    } catch (error) {
      console.error("Error submitting report:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit report",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <Button
          onClick={() => router.push("/portal/projects")}
          variant="ghost"
          size="sm"
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Projects
        </Button>

        <div className="flex items-center gap-3 mb-2">
          <ShieldCheck className="h-8 w-8 text-green-600" />
          <h1 className="text-3xl font-bold">Compliance Dashboard</h1>
        </div>
        <p className="text-gray-600">{data.project.title}</p>
        {data.project.caseReference && (
          <p className="text-sm text-gray-500">Case: {data.project.caseReference}</p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Conditions & Reports */}
        <div className="lg:col-span-2 space-y-6">
          {/* Approval Conditions */}
          {data.decision?.conditions && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  Approval Conditions
                </CardTitle>
                <CardDescription>
                  Ensure compliance with all conditions outlined in your approval
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg whitespace-pre-wrap text-sm">
                  {data.decision.conditions}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submit Progress Report */}
          <Card>
            <CardHeader>
              <CardTitle>Submit Quarterly Progress Report</CardTitle>
              <CardDescription>
                Report on activities, milestones, and expenditure for the reporting period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="reportingPeriod">Reporting Period *</Label>
                  <Input
                    id="reportingPeriod"
                    placeholder="e.g., Q1 2026, Quarter 2 2026"
                    value={formData.reportingPeriod}
                    onChange={(e) =>
                      setFormData({ ...formData, reportingPeriod: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="outcomes">Outcomes Achieved *</Label>
                  <Textarea
                    id="outcomes"
                    placeholder="Describe the R&D outcomes achieved during this period..."
                    value={formData.outcomes}
                    onChange={(e) =>
                      setFormData({ ...formData, outcomes: e.target.value })
                    }
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="milestones">Milestones Reached *</Label>
                  <Textarea
                    id="milestones"
                    placeholder="List key milestones completed this quarter..."
                    value={formData.milestones}
                    onChange={(e) =>
                      setFormData({ ...formData, milestones: e.target.value })
                    }
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="expenditure">Expenditure Summary</Label>
                  <Textarea
                    id="expenditure"
                    placeholder="Summarize R&D expenditure for this period..."
                    value={formData.expenditure}
                    onChange={(e) =>
                      setFormData({ ...formData, expenditure: e.target.value })
                    }
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="staffing">Staffing Updates</Label>
                  <Textarea
                    id="staffing"
                    placeholder="Any changes to project team or key personnel..."
                    value={formData.staffing}
                    onChange={(e) =>
                      setFormData({ ...formData, staffing: e.target.value })
                    }
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="challenges">Challenges & Risks</Label>
                  <Textarea
                    id="challenges"
                    placeholder="Any challenges encountered or risks identified..."
                    value={formData.challenges}
                    onChange={(e) =>
                      setFormData({ ...formData, challenges: e.target.value })
                    }
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="learnings">Key Learnings</Label>
                  <Textarea
                    id="learnings"
                    placeholder="Important insights and learnings from this period..."
                    value={formData.learnings}
                    onChange={(e) =>
                      setFormData({ ...formData, learnings: e.target.value })
                    }
                    rows={3}
                  />
                </div>

                <Button type="submit" disabled={submitting} className="w-full">
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Progress Report
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Submitted Reports */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Submitted Reports</CardTitle>
              <CardDescription>History of your progress reports</CardDescription>
            </CardHeader>
            <CardContent>
              {data.reports.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No reports submitted yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {data.reports.map((report) => (
                    <div
                      key={report.id}
                      className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-sm">{report.reportingPeriod}</h4>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(report.submittedAt), "MMM d, yyyy")}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {report.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2">{report.outcomes}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Compliance Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Compliance Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <Clock className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span>Submit reports on time each quarter</span>
                </li>
                <li className="flex items-start gap-2">
                  <FileText className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span>Keep detailed R&D activity records</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span>Maintain expenditure documentation</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
