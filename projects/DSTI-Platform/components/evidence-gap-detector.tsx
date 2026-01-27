"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Lightbulb, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface EvidenceGap {
  category: string;
  severity: "high" | "medium" | "low";
  suggestion: string;
}

interface DetectedGaps {
  gaps: EvidenceGap[];
  recommendations: string[];
}

interface EvidenceGapDetectorProps {
  projectId: string;
  uploadedCategories: string[];
  className?: string;
}

export function EvidenceGapDetector({
  projectId,
  uploadedCategories,
  className,
}: EvidenceGapDetectorProps) {
  const [loading, setLoading] = useState(false);
  const [gaps, setGaps] = useState<DetectedGaps | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const analyzeGaps = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/detect-gaps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          uploadedCategories,
          context: "evidence_completeness",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze evidence gaps");
      }

      const data = await response.json();
      setGaps(data);
      setIsExpanded(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze");
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    setIsExpanded(false);
    setGaps(null);
    setError(null);
  };

  const getSeverityColor = (severity: "high" | "medium" | "low") => {
    switch (severity) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
    }
  };

  if (!isExpanded) {
    return (
      <Button
        onClick={analyzeGaps}
        disabled={loading}
        variant="outline"
        className={cn("w-full md:w-auto", className)}
      >
        <Sparkles className="h-4 w-4 mr-2" />
        {loading ? "Analyzing Evidence..." : "Detect Evidence Gaps"}
      </Button>
    );
  }

  return (
    <Card className={cn("border-purple-200 bg-purple-50/50", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <CardTitle className="text-lg">Evidence Gap Analysis</CardTitle>
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
          AI-powered analysis of missing or incomplete evidence
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-800">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {gaps && (
          <>
            {/* Detected Gaps */}
            {gaps.gaps.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Missing or Incomplete Evidence ({gaps.gaps.length})
                </h4>
                <div className="space-y-2">
                  {gaps.gaps.map((gap, index) => (
                    <div
                      key={index}
                      className="p-3 bg-white border rounded-md space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{gap.category}</span>
                        <Badge variant={getSeverityColor(gap.severity)}>
                          {gap.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{gap.suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {gaps.recommendations.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Recommendations
                </h4>
                <ul className="space-y-2">
                  {gaps.recommendations.map((rec, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {gaps.gaps.length === 0 && gaps.recommendations.length === 0 && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-md text-sm text-green-800 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>
                  Great! Your evidence portfolio appears complete for an R&D
                  application.
                </span>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button onClick={analyzeGaps} variant="outline" size="sm">
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
