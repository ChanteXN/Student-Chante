"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, FileText, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function NewProgressReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: projectId } = use(params);
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    reportingPeriod: "",
    outcomes: "",
    milestones: "",
    staffing: "",
    learnings: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/projects/${projectId}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit progress report");
      }

      setSuccess(true);
      
      // Redirect to history page after 2 seconds
      setTimeout(() => {
        router.push(`/portal/projects/${projectId}/progress`);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-green-900 mb-2">
                  Progress Report Submitted!
                </h3>
                <p className="text-green-700">
                  Your progress report has been successfully submitted to DSTI.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/portal/projects/${projectId}/progress`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Reports
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="h-8 w-8 text-blue-600" />
            Submit Progress Report
          </h1>
          <p className="text-muted-foreground mt-1">
            Provide updates on your approved R&D project
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Progress Report Details</CardTitle>
            <CardDescription>
              Complete all fields to submit your periodic progress update to DSTI
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            {/* Reporting Period */}
            <div className="space-y-2">
              <Label htmlFor="reportingPeriod">
                Reporting Period <span className="text-red-500">*</span>
              </Label>
              <Input
                id="reportingPeriod"
                placeholder="e.g., Q1 2026, Annual 2025"
                value={formData.reportingPeriod}
                onChange={(e) => handleChange("reportingPeriod", e.target.value)}
                required
              />
              <p className="text-sm text-muted-foreground">
                Specify the time period this report covers
              </p>
            </div>

            {/* Outcomes */}
            <div className="space-y-2">
              <Label htmlFor="outcomes">
                Outcomes Achieved <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="outcomes"
                rows={5}
                placeholder="Describe the R&D outcomes and results achieved during this period..."
                value={formData.outcomes}
                onChange={(e) => handleChange("outcomes", e.target.value)}
                required
              />
              <p className="text-sm text-muted-foreground">
                What technical outcomes, discoveries, or results were achieved?
              </p>
            </div>

            {/* Milestones */}
            <div className="space-y-2">
              <Label htmlFor="milestones">
                Milestones Reached <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="milestones"
                rows={5}
                placeholder="List the key milestones completed during this period..."
                value={formData.milestones}
                onChange={(e) => handleChange("milestones", e.target.value)}
                required
              />
              <p className="text-sm text-muted-foreground">
                Which project milestones were successfully completed?
              </p>
            </div>

            {/* Staffing */}
            <div className="space-y-2">
              <Label htmlFor="staffing">
                Staffing Updates <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="staffing"
                rows={4}
                placeholder="Describe any changes to team composition, roles, or key personnel..."
                value={formData.staffing}
                onChange={(e) => handleChange("staffing", e.target.value)}
                required
              />
              <p className="text-sm text-muted-foreground">
                Any changes to your R&D team structure or personnel?
              </p>
            </div>

            {/* Learnings */}
            <div className="space-y-2">
              <Label htmlFor="learnings">
                Key Learnings & Insights <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="learnings"
                rows={5}
                placeholder="Share key learnings, challenges faced, and insights gained..."
                value={formData.learnings}
                onChange={(e) => handleChange("learnings", e.target.value)}
                required
              />
              <p className="text-sm text-muted-foreground">
                What did you learn? What challenges did you overcome?
              </p>
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? "Submitting..." : "Submit Progress Report"}
              </Button>
              <Link href={`/portal/projects/${projectId}/progress`}>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
