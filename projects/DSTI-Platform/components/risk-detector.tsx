"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Lightbulb, Sparkles, X, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface ApplicationRisk {
  category: string;
  severity: "critical" | "high" | "medium" | "low";
  issue: string;
  recommendation: string;
}

interface DetectedRisks {
  risks: ApplicationRisk[];
  overallAssessment: string;
  strengthAreas: string[];
}

interface RiskDetectorProps {
  projectId: string;
  className?: string;
}

export function RiskDetector({ projectId, className }: RiskDetectorProps) {
  const [loading, setLoading] = useState(false);
  const [risks, setRisks] = useState<DetectedRisks | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const analyzeRisks = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/detect-gaps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          context: "submission_risk_analysis",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze application risks");
      }

      const data = await response.json();
      setRisks(data);
      setIsExpanded(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze");
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    setIsExpanded(false);
    setRisks(null);
    setError(null);
  };

  const getSeverityColor = (severity: "critical" | "high" | "medium" | "low") => {
    switch (severity) {
      case "critical":
        return "destructive";
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
    }
  };

  const getSeverityIcon = (severity: "critical" | "high" | "medium" | "low") => {
    return severity === "critical" || severity === "high" ? (
      <ShieldAlert className="h-4 w-4" />
    ) : (
      <AlertTriangle className="h-4 w-4" />
    );
  };

  if (!isExpanded) {
    return (
      <Button
        onClick={analyzeRisks}
        disabled={loading}
        variant="outline"
        className={cn("w-full", className)}
      >
        <Sparkles className="h-4 w-4 mr-2" />
        {loading ? "Analyzing Application..." : "AI Risk Analysis"}
      </Button>
    );
  }

  return (
    <Card className={cn("border-purple-200 bg-purple-50/50", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <CardTitle className="text-lg">AI Risk Analysis</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>
          Identify potential compliance risks and weak areas before submission
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-800">
            <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {risks && (
          <>
            {/* Overall Assessment */}
            {risks.overallAssessment && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm font-medium text-blue-900 mb-1">
                  Overall Assessment
                </p>
                <p className="text-sm text-blue-800">{risks.overallAssessment}</p>
              </div>
            )}

            {/* Detected Risks */}
            {risks.risks.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Detected Risks ({risks.risks.length})
                </h4>
                <div className="space-y-3">
                  {risks.risks.map((risk, index) => (
                    <div
                      key={index}
                      className="p-4 bg-white border rounded-md space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2 flex-1">
                          {getSeverityIcon(risk.severity)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">
                                {risk.category}
                              </span>
                              <Badge variant={getSeverityColor(risk.severity)} className="text-xs">
                                {risk.severity}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {risk.issue}
                            </p>
                            <div className="flex items-start gap-2 mt-2 p-2 bg-blue-50 rounded">
                              <Lightbulb className="h-3.5 w-3.5 text-blue-600 mt-0.5 flex-shrink-0" />
                              <p className="text-xs text-blue-800">
                                <span className="font-medium">Recommendation:</span>{" "}
                                {risk.recommendation}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Strength Areas */}
            {risks.strengthAreas.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-green-900 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Strength Areas
                </h4>
                <ul className="space-y-1">
                  {risks.strengthAreas.map((strength, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm text-green-800"
                    >
                      <span className="text-green-600 font-bold mt-0.5">✓</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {risks.risks.length === 0 && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-md text-sm text-green-800 flex items-start gap-2">
                <Lightbulb className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>
                  Excellent! No major risks detected. Your application appears
                  ready for submission.
                </span>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button onClick={analyzeRisks} variant="outline" size="sm">
                Re-analyze
              </Button>
              <Button onClick={handleDismiss} variant="ghost" size="sm">
                Dismiss
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
