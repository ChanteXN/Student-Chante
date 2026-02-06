"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Gavel,
  CheckCircle,
  XCircle,
  Download,
  ArrowLeft,
  Calendar,
  User,
  FileText,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";

interface ProjectDecision {
  project: {
    id: string;
    title: string;
    caseReference: string | null;
    status: string;
    organisation: {
      name: string;
    };
  };
  decision: {
    id: string;
    outcome: "APPROVED" | "DECLINED";
    reasoning: string;
    conditions: string | null;
    decidedBy: string;
    decidedAt: string;
  } | null;
}

export default function ProjectDecisionPage() {
  const params = useParams();
  const router = useRouter();
  const { data: _session } = useSession();
  const { toast } = useToast();
  const [data, setData] = useState<ProjectDecision | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  const fetchDecision = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/projects/${params.id}/decision`);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to fetch decision");
      }
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching decision:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load decision",
        variant: "destructive",
      });
      router.push("/portal/projects");
    } finally {
      setLoading(false);
    }
  }, [params.id, toast]);

  useEffect(() => {
    if (params.id) {
      fetchDecision();
    }
  }, [params.id, fetchDecision]);

  const handleDownloadLetter = async () => {
    try {
      setDownloading(true);
      const res = await fetch(`/api/projects/${params.id}/decision/letter`);
      
      if (!res.ok) {
        throw new Error("Failed to download decision letter");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Decision-Letter-${data?.project.caseReference || params.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success",
        description: "Decision letter downloaded successfully",
      });
    } catch (error) {
      console.error("Error downloading letter:", error);
      toast({
        title: "Error",
        description: "Failed to download decision letter",
        variant: "destructive",
      });
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!data?.decision) {
    return (
      <div className="container mx-auto py-8 max-w-4xl">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Gavel className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No Decision Yet</h2>
              <p className="text-gray-600 mb-4">
                A decision has not been made on this project yet.
              </p>
              <Button onClick={() => router.push("/portal/projects")} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Projects
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { decision, project } = data;
  const isApproved = decision.outcome === "APPROVED";

  return (
    <div className="container mx-auto py-8 max-w-4xl">
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

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Gavel className="h-8 w-8 text-red-600" />
              <h1 className="text-3xl font-bold">Application Decision</h1>
            </div>
            <p className="text-gray-600">{project.title}</p>
            {project.caseReference && (
              <p className="text-sm text-gray-500">Case: {project.caseReference}</p>
            )}
          </div>
          <Badge
            variant={isApproved ? "default" : "destructive"}
            className="text-lg px-4 py-2"
          >
            {isApproved ? (
              <>
                <CheckCircle className="h-5 w-5 mr-2" />
                Approved
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5 mr-2" />
                Declined
              </>
            )}
          </Badge>
        </div>
      </div>

      {/* Decision Details */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Decision Summary</CardTitle>
          <CardDescription>Official decision on your R&D tax incentive application</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">Decision Date:</span>
              <span className="font-medium">
                {format(new Date(decision.decidedAt), "MMMM d, yyyy")}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">Decided By:</span>
              <span className="font-medium">DSTI Review Committee</span>
            </div>
          </div>

          <hr className="my-4" />

          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Decision Reasoning
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap text-sm">
              {decision.reasoning}
            </div>
          </div>

          {isApproved && decision.conditions && (
            <>
              <hr className="my-4" />
              <div>
                <h3 className="font-semibold mb-2 text-orange-600">
                  Conditions and Requirements
                </h3>
                <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg whitespace-pre-wrap text-sm">
                  {decision.conditions}
                </div>
              </div>
            </>
          )}

          <hr className="my-4" />

          <div className="flex gap-3">
            <Button
              onClick={handleDownloadLetter}
              disabled={downloading}
              className="flex-1"
            >
              {downloading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Download Official Decision Letter (PDF)
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          {isApproved ? (
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-semibold text-sm">1</span>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Review Approval Conditions</h4>
                  <p className="text-sm text-gray-600">
                    Carefully review all conditions and requirements outlined above.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-semibold text-sm">2</span>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Download and Store Decision Letter</h4>
                  <p className="text-sm text-gray-600">
                    Keep the official decision letter for your records and tax compliance.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-semibold text-sm">3</span>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Submit Quarterly Progress Reports</h4>
                  <p className="text-sm text-gray-600">
                    Navigate to the Compliance tab to submit required progress reports.
                  </p>
                  <Button
                    onClick={() => router.push(`/portal/projects/${params.id}/compliance`)}
                    variant="outline"
                    size="sm"
                    className="mt-2"
                  >
                    Go to Compliance Dashboard
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-semibold text-sm">4</span>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Maintain R&D Documentation</h4>
                  <p className="text-sm text-gray-600">
                    Keep detailed records of all R&D activities and expenditure for audit purposes.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-red-600 font-semibold text-sm">1</span>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Review Decline Reasons</h4>
                  <p className="text-sm text-gray-600">
                    Carefully read the reasoning provided to understand why your application was not approved.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-red-600 font-semibold text-sm">2</span>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Address Identified Issues</h4>
                  <p className="text-sm text-gray-600">
                    Work on addressing the concerns and gaps identified in the decision.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-red-600 font-semibold text-sm">3</span>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Resubmit Application</h4>
                  <p className="text-sm text-gray-600">
                    Once you&apos;ve addressed the concerns, you may submit a new application.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-red-600 font-semibold text-sm">4</span>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Contact DSTI for Clarification</h4>
                  <p className="text-sm text-gray-600">
                    Email: rdtax@dsti.gov.za | Tel: +27 12 843 6300
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
