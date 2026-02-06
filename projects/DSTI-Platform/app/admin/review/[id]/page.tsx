"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  ClipboardCheck, 
  FileText, 
  Building2, 
  Calendar, 
  DollarSign,
  Users,
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Save
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Project {
  id: string;
  title: string;
  status: string;
  caseReference: string | null;
  sector: string | null;
  startDate: string | null;
  endDate: string | null;
  readinessScore: number | null;
  submittedAt: string | null;
  organisation: {
    name: string;
    registrationNo: string | null;
    sector: string | null;
  };
  sections: {
    sectionKey: string;
    sectionData: any;
  }[];
}

interface ReviewerAssignment {
  id: string;
  section11dScore: number | null;
  uncertaintyScore: number | null;
  innovationScore: number | null;
  budgetScore: number | null;
  timelineScore: number | null;
  recommendation: string | null;
  recommendationNote: string | null;
}

const statusColors: Record<string, string> = {
  SUBMITTED: "bg-blue-100 text-blue-700 border-blue-300",
  UNDER_REVIEW: "bg-yellow-100 text-yellow-700 border-yellow-300",
  PENDING_INFO: "bg-orange-100 text-orange-700 border-orange-300",
  APPROVED: "bg-green-100 text-green-700 border-green-300",
  DECLINED: "bg-red-100 text-red-700 border-red-300",
};

export default function ReviewerWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [assignment, setAssignment] = useState<ReviewerAssignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Rubric scores (1-5 scale)
  const [section11dScore, setSection11dScore] = useState<number | null>(null);
  const [uncertaintyScore, setUncertaintyScore] = useState<number | null>(null);
  const [innovationScore, setInnovationScore] = useState<number | null>(null);
  const [budgetScore, setBudgetScore] = useState<number | null>(null);
  const [timelineScore, setTimelineScore] = useState<number | null>(null);

  // Recommendation
  const [recommendation, setRecommendation] = useState<string>("");
  const [recommendationNote, setRecommendationNote] = useState<string>("");

  // Notes
  const [notes, setNotes] = useState<string>("");

  useEffect(() => {
    if (projectId) {
      fetchProject();
      fetchAssignment();
    }
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`);
      if (response.ok) {
        const data = await response.json();
        setProject(data);
      } else {
        console.error("Failed to fetch project:", response.status);
      }
    } catch (error) {
      console.error("Error fetching project:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignment = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/assign`);
      if (response.ok) {
        const data = await response.json();
        // Get the current user's assignment (assuming first one for now)
        if (data.assignments && data.assignments.length > 0) {
          const myAssignment = data.assignments[0];
          setAssignment(myAssignment);
          
          // Load existing scores and recommendation
          setSection11dScore(myAssignment.section11dScore);
          setUncertaintyScore(myAssignment.uncertaintyScore);
          setInnovationScore(myAssignment.innovationScore);
          setBudgetScore(myAssignment.budgetScore);
          setTimelineScore(myAssignment.timelineScore);
          setRecommendation(myAssignment.recommendation || "");
          setRecommendationNote(myAssignment.recommendationNote || "");
        }
      }
    } catch (error) {
      console.error("Error fetching assignment:", error);
    }
  };

  const handleSaveReview = async () => {
    if (!assignment) {
      alert("No assignment found. Please ensure you are assigned to this project.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`/api/reviews/${assignment.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section11dScore,
          uncertaintyScore,
          innovationScore,
          budgetScore,
          timelineScore,
          recommendation,
          recommendationNote,
        }),
      });

      if (response.ok) {
        alert("Review saved successfully!");
      } else {
        const data = await response.json();
        alert(data.error || "Failed to save review");
      }
    } catch (error) {
      console.error("Error saving review:", error);
      alert("Failed to save review");
    } finally {
      setSaving(false);
    }
  };

  const calculateAverageScore = () => {
    const scores = [section11dScore, uncertaintyScore, innovationScore, budgetScore, timelineScore].filter(s => s !== null) as number[];
    if (scores.length === 0) return null;
    return (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Project not found</p>
      </div>
    );
  }

  const averageScore = calculateAverageScore();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Review Application
            </h1>
            <p className="text-gray-600 mt-1">
              {project.caseReference || "No case reference"} • {project.organisation.name}
            </p>
          </div>
          <Badge
            variant="outline"
            className={`${statusColors[project.status]} border font-medium`}
          >
            {project.status.replace(/_/g, " ")}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Application Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Project Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{project.title}</h3>
                <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                  <div className="flex items-start gap-2">
                    <Building2 className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-gray-500">Organisation</p>
                      <p className="font-medium">{project.organisation.name}</p>
                      {project.organisation.registrationNo && (
                        <p className="text-xs text-gray-500">Reg: {project.organisation.registrationNo}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-gray-500">Project Duration</p>
                      <p className="font-medium">
                        {project.startDate && project.endDate
                          ? `${new Date(project.startDate).toLocaleDateString()} - ${new Date(project.endDate).toLocaleDateString()}`
                          : "Not specified"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Users className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-gray-500">Sector</p>
                      <p className="font-medium">{project.sector || "Not specified"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <ClipboardCheck className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-gray-500">Readiness Score</p>
                      <p className="font-medium">{project.readinessScore || 0}%</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Application Sections */}
          {project.sections && project.sections.map((section) => {
            const sectionTitles: Record<string, string> = {
              basics: "Project Basics",
              uncertainty: "Scientific/Technological Uncertainty",
              methodology: "Research Methodology",
              team: "Project Team",
              expenditure: "Expenditure Details",
            };

            return (
              <Card key={section.sectionKey}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {sectionTitles[section.sectionKey] || section.sectionKey}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    {Object.entries(section.sectionData || {}).map(([key, value]) => {
                      if (typeof value === "object" || value === null || value === undefined) return null;
                      return (
                        <div key={key}>
                          <p className="text-gray-500 font-medium capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}:
                          </p>
                          <p className="text-gray-900 mt-1 whitespace-pre-wrap">{String(value)}</p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Right Column - Review Form */}
        <div className="space-y-6">
          {/* Rubric Scoring */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5" />
                Rubric Scoring
              </CardTitle>
              <CardDescription>Rate each criterion on a scale of 1-5</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Section 11D Compliance */}
              <div>
                <Label className="text-sm font-medium">Section 11D Compliance</Label>
                <p className="text-xs text-gray-500 mb-2">
                  Does the project meet Section 11D requirements?
                </p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((score) => (
                    <Button
                      key={score}
                      size="sm"
                      variant={section11dScore === score ? "default" : "outline"}
                      onClick={() => setSection11dScore(score)}
                      className="flex-1"
                    >
                      {score}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Uncertainty Clarity */}
              <div>
                <Label className="text-sm font-medium">Uncertainty Clarity</Label>
                <p className="text-xs text-gray-500 mb-2">
                  Is the scientific/technological uncertainty clearly defined?
                </p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((score) => (
                    <Button
                      key={score}
                      size="sm"
                      variant={uncertaintyScore === score ? "default" : "outline"}
                      onClick={() => setUncertaintyScore(score)}
                      className="flex-1"
                    >
                      {score}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Innovation Significance */}
              <div>
                <Label className="text-sm font-medium">Innovation Significance</Label>
                <p className="text-xs text-gray-500 mb-2">
                  How innovative and significant is the project?
                </p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((score) => (
                    <Button
                      key={score}
                      size="sm"
                      variant={innovationScore === score ? "default" : "outline"}
                      onClick={() => setInnovationScore(score)}
                      className="flex-1"
                    >
                      {score}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Budget Reasonableness */}
              <div>
                <Label className="text-sm font-medium">Budget Reasonableness</Label>
                <p className="text-xs text-gray-500 mb-2">
                  Are the costs reasonable and well-justified?
                </p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((score) => (
                    <Button
                      key={score}
                      size="sm"
                      variant={budgetScore === score ? "default" : "outline"}
                      onClick={() => setBudgetScore(score)}
                      className="flex-1"
                    >
                      {score}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Timeline Feasibility */}
              <div>
                <Label className="text-sm font-medium">Timeline Feasibility</Label>
                <p className="text-xs text-gray-500 mb-2">
                  Is the proposed timeline realistic and achievable?
                </p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((score) => (
                    <Button
                      key={score}
                      size="sm"
                      variant={timelineScore === score ? "default" : "outline"}
                      onClick={() => setTimelineScore(score)}
                      className="flex-1"
                    >
                      {score}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Average Score */}
              {averageScore && (
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Average Score:</span>
                    <Badge className="text-base px-3 py-1">{averageScore} / 5.0</Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recommendation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Recommendation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Button
                  variant={recommendation === "APPROVE" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setRecommendation("APPROVE")}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Approve Application
                </Button>
                <Button
                  variant={recommendation === "DECLINE" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setRecommendation("DECLINE")}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Decline Application
                </Button>
                <Button
                  variant={recommendation === "REQUEST_INFO" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setRecommendation("REQUEST_INFO")}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Request More Information
                </Button>
              </div>

              <div>
                <Label htmlFor="recommendationNote" className="text-sm font-medium">
                  Justification / Notes
                </Label>
                <Textarea
                  id="recommendationNote"
                  value={recommendationNote}
                  onChange={(e) => setRecommendationNote(e.target.value)}
                  placeholder="Explain your recommendation..."
                  rows={6}
                  className="mt-2"
                />
              </div>

              <Button
                onClick={handleSaveReview}
                disabled={saving || !recommendation}
                className="w-full"
                size="lg"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving Review..." : "Save Review"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
