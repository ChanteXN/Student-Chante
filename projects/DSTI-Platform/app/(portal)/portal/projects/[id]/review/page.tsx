"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Edit, CheckCircle, AlertCircle, FileText, TrendingUp, AlertTriangle, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface ProjectSection {
  id: string;
  sectionKey: string;
  sectionData: Record<string, string>;
  isComplete: boolean;
}

interface ReadinessFix {
  id: string;
  severity: "critical" | "warning" | "info";
  category: string;
  title: string;
  description: string;
  section?: string;
  points: number;
}

interface ReadinessResult {
  totalScore: number;
  breakdown: {
    completeness: number;
    evidence: number;
    quality: number;
  };
  fixes: ReadinessFix[];
  lastCalculated: string;
}

interface Project {
  id: string;
  title: string;
  sector: string | null;
  startDate: string | null;
  endDate: string | null;
  location: string | null;
  status: string;
  readinessScore: number | null;
  sections: ProjectSection[];
}

export default function ProjectReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();

  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [readiness, setReadiness] = useState<ReadinessResult | null>(null);
  const [loadingReadiness, setLoadingReadiness] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      if (!session?.user?.email) return;

      try {
        const response = await fetch(`/api/projects/${resolvedParams.id}`);
        if (!response.ok) throw new Error("Failed to load project");

        const data = await response.json();
        setProject(data);
        
        // Fetch readiness score
        fetchReadinessScore();
      } catch (error) {
        console.error("Error loading project:", error);
        toast({
          title: "Error",
          description: "Failed to load project details.",
          variant: "destructive",
        });
        router.push("/portal");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [resolvedParams.id, session, router, toast]);

  const fetchReadinessScore = async () => {
    try {
      setLoadingReadiness(true);
      const response = await fetch(`/api/projects/${resolvedParams.id}/readiness`);
      if (response.ok) {
        const data = await response.json();
        setReadiness(data);
      }
    } catch (error) {
      console.error("Error fetching readiness score:", error);
    } finally {
      setLoadingReadiness(false);
    }
  };

  const getSectionData = (sectionKey: string) => {
    const section = project?.sections.find(s => s.sectionKey === sectionKey);
    return section?.sectionData || null;
  };

  const handleEdit = (stepIndex: number) => {
    router.push(`/portal/projects/new?id=${resolvedParams.id}&step=${stepIndex}` as never);
  };

  const handleSubmit = async () => {
    if (completeness < 100) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/projects/${resolvedParams.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "SUBMITTED",
          submittedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error("Failed to submit application");

      toast({
        title: "Application Submitted!",
        description: "Your R&D tax incentive application has been successfully submitted.",
      });

      // Redirect to portal after a brief delay
      setTimeout(() => {
        router.push("/portal");
      }, 1500);
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateCompleteness = () => {
    if (!project) return 0;
    const requiredSections = ["basics", "uncertainty", "methodology", "team", "expenditure"];
    const completedSections = requiredSections.filter(key => {
      const section = project.sections.find(s => s.sectionKey === key);
      return section && Object.keys(section.sectionData).length > 0;
    });
    return Math.round((completedSections.length / requiredSections.length) * 100);
  };

  if (isLoading || !project) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading project details...</p>
        </div>
      </div>
    );
  }

  const basicsData = getSectionData("basics");
  const uncertaintyData = getSectionData("uncertainty");
  const methodologyData = getSectionData("methodology");
  const teamData = getSectionData("team");
  const expenditureData = getSectionData("expenditure");
  const completeness = calculateCompleteness();

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">Application Review</h1>
            <p className="text-muted-foreground mt-1">
              Review your R&D tax incentive application before submission
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => router.push(`/portal/projects/${resolvedParams.id}/evidence`)}
            >
              <FileText className="h-4 w-4 mr-2" />
              Evidence Vault
            </Button>
            <Badge variant={completeness === 100 ? "default" : "secondary"} className="text-lg px-4 py-2">
              {completeness}% Complete
            </Badge>
          </div>
        </div>

        {completeness < 100 && (
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-amber-900">Application Incomplete</p>
              <p className="text-sm text-amber-700">
                Please complete all sections before submitting your application.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Readiness Score */}
      {readiness && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Application Readiness Score
                </CardTitle>
                <CardDescription>
                  Based on completeness, evidence quality, and content analysis
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchReadinessScore}
                disabled={loadingReadiness}
              >
                {loadingReadiness ? "Calculating..." : "Recalculate"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Score Circle */}
              <div className="flex flex-col items-center justify-center p-6">
                <div className="relative w-40 h-40 mb-4">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      className="text-gray-200"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 70}`}
                      strokeDashoffset={`${2 * Math.PI * 70 * (1 - readiness.totalScore / 100)}`}
                      className={
                        readiness.totalScore >= 80
                          ? "text-green-500"
                          : readiness.totalScore >= 60
                          ? "text-blue-500"
                          : readiness.totalScore >= 40
                          ? "text-amber-500"
                          : "text-red-500"
                      }
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold">{readiness.totalScore}</span>
                    <span className="text-sm text-muted-foreground">out of 100</span>
                  </div>
                </div>
                <Badge
                  variant={
                    readiness.totalScore >= 80
                      ? "default"
                      : readiness.totalScore >= 60
                      ? "secondary"
                      : "outline"
                  }
                  className="text-sm"
                >
                  {readiness.totalScore >= 80
                    ? "Excellent"
                    : readiness.totalScore >= 60
                    ? "Good"
                    : readiness.totalScore >= 40
                    ? "Fair"
                    : "Needs Improvement"}
                </Badge>
              </div>

              {/* Breakdown */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Completeness</span>
                    <span className="text-sm font-bold">{readiness.breakdown.completeness}/40</span>
                  </div>
                  <Progress value={(readiness.breakdown.completeness / 40) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Evidence Quality</span>
                    <span className="text-sm font-bold">{readiness.breakdown.evidence}/30</span>
                  </div>
                  <Progress value={(readiness.breakdown.evidence / 30) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Content Quality</span>
                    <span className="text-sm font-bold">{readiness.breakdown.quality}/30</span>
                  </div>
                  <Progress value={(readiness.breakdown.quality / 30) * 100} className="h-2" />
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  Last calculated: {new Date(readiness.lastCalculated).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Fixes */}
      {readiness && readiness.fixes.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Top Fixes to Improve Your Score
            </CardTitle>
            <CardDescription>
              Address these issues to strengthen your application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {readiness.fixes.slice(0, 5).map((fix) => (
                <div
                  key={fix.id}
                  className="flex items-start gap-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  {fix.severity === "critical" && (
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  )}
                  {fix.severity === "warning" && (
                    <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  )}
                  {fix.severity === "info" && (
                    <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{fix.title}</p>
                      <Badge variant="outline" className="text-xs">
                        +{fix.points} points
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{fix.description}</p>
                  </div>
                  {fix.section && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const stepMap: Record<string, number> = {
                          basics: 0,
                          uncertainty: 1,
                          methodology: 2,
                          team: 3,
                          expenditure: 4,
                        };
                        const stepIndex = fix.section ? stepMap[fix.section] : undefined;
                        if (stepIndex !== undefined) {
                          handleEdit(stepIndex);
                        }
                      }}
                    >
                      Fix Now
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Project Basics */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {basicsData ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-amber-600" />
              )}
              Step 1: Project Basics
            </CardTitle>
            <CardDescription>Basic information about your R&D project</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => handleEdit(0)}>
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </CardHeader>
        <CardContent>
          {basicsData ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Project Title</p>
                <p className="text-base">{project.title || "Untitled Project"}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Sector</p>
                  <p className="text-base capitalize">{project.sector || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Location</p>
                  <p className="text-base">{project.location || "Not specified"}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Start Date</p>
                  <p className="text-base">
                    {project.startDate ? new Date(project.startDate).toLocaleDateString() : "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">End Date</p>
                  <p className="text-base">
                    {project.endDate ? new Date(project.endDate).toLocaleDateString() : "Not specified"}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground italic">No data provided</p>
          )}
        </CardContent>
      </Card>

      {/* R&D Uncertainty */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {uncertaintyData ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-amber-600" />
              )}
              Step 2: R&D Uncertainty
            </CardTitle>
            <CardDescription>Technical or scientific challenges</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => handleEdit(1)}>
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </CardHeader>
        <CardContent>
          {uncertaintyData ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Technical/Scientific Uncertainty</p>
                <p className="text-base whitespace-pre-wrap">{uncertaintyData.uncertainty || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">R&D Objectives</p>
                <p className="text-base whitespace-pre-wrap">{uncertaintyData.objectives || "Not provided"}</p>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground italic">No data provided</p>
          )}
        </CardContent>
      </Card>

      {/* Methodology */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {methodologyData ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-amber-600" />
              )}
              Step 3: Methodology & Innovation
            </CardTitle>
            <CardDescription>Research approach and innovation details</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => handleEdit(2)}>
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </CardHeader>
        <CardContent>
          {methodologyData ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Research Approach</p>
                <p className="text-base whitespace-pre-wrap">{methodologyData.researchApproach || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Innovation Description</p>
                <p className="text-base whitespace-pre-wrap">{methodologyData.innovationDescription || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Challenges Overcome</p>
                <p className="text-base whitespace-pre-wrap">{methodologyData.challengesOvercome || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Experiments Planned/Conducted</p>
                <p className="text-base whitespace-pre-wrap">{methodologyData.experimentsPlanned || "Not provided"}</p>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground italic">No data provided</p>
          )}
        </CardContent>
      </Card>

      {/* Team */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {teamData ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-amber-600" />
              )}
              Step 4: Team & Expertise
            </CardTitle>
            <CardDescription>R&D team composition and qualifications</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => handleEdit(3)}>
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </CardHeader>
        <CardContent>
          {teamData ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Team Size</p>
                <p className="text-base">{teamData.teamSize || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Key Personnel</p>
                <p className="text-base whitespace-pre-wrap">{teamData.keyPersonnel || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Relevant Qualifications</p>
                <p className="text-base whitespace-pre-wrap">{teamData.qualifications || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Roles & Responsibilities</p>
                <p className="text-base whitespace-pre-wrap">{teamData.rolesResponsibilities || "Not provided"}</p>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground italic">No data provided</p>
          )}
        </CardContent>
      </Card>

      {/* Expenditure */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {expenditureData ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-amber-600" />
              )}
              Step 5: Budget & Expenditure
            </CardTitle>
            <CardDescription>R&D budget and cost breakdown</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => handleEdit(4)}>
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </CardHeader>
        <CardContent>
          {expenditureData ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total R&D Budget</p>
                <p className="text-base">{expenditureData.totalBudget || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">R&D Costs Breakdown</p>
                <p className="text-base whitespace-pre-wrap">{expenditureData.rdCostsBreakdown || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Expenditure Timeline</p>
                <p className="text-base whitespace-pre-wrap">{expenditureData.expenditureTimeline || "Not provided"}</p>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground italic">No data provided</p>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between mt-8 p-6 bg-gray-50 rounded-lg border">
        <div>
          <p className="font-medium">Ready to submit?</p>
          <p className="text-sm text-muted-foreground">
            {completeness === 100
              ? "Your application is complete and ready for submission."
              : "Please complete all sections before submitting."}
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => router.push(`/portal/projects/new?id=${resolvedParams.id}`)}
          >
            Back to Editor
          </Button>
          <Button 
            disabled={completeness < 100 || isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Application"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
