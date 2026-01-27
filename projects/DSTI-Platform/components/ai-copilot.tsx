"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, X, AlertCircle, CheckCircle, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

interface AICoPilotProps {
  sectionKey: string;
  content: string;
  onApply?: (improvedText: string) => void;
  className?: string;
}

interface AISuggestion {
  originalText: string;
  improvedText?: string;
  suggestions?: string[];
  sources?: Array<{
    title: string;
    type: string;
    excerpt: string;
  }>;
}

export function AICoPilot({ sectionKey, content, onApply, className }: AICoPilotProps) {
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<AISuggestion | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleGetSuggestions = async () => {
    if (!content || content.trim().length < 10) {
      setError("Please add some content first (at least 10 characters)");
      return;
    }

    setLoading(true);
    setError(null);
    setSuggestion(null);
    setIsExpanded(true);

    try {
      const res = await fetch("/api/ai/improve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: content,
          sectionKey,
          context: `R&D application ${sectionKey} section`,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to get AI suggestions");
      }

      const data = await res.json();
      setSuggestion(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (suggestion?.improvedText && onApply) {
      onApply(suggestion.improvedText);
      setSuggestion(null);
      setIsExpanded(false);
    }
  };

  const handleDismiss = () => {
    setSuggestion(null);
    setIsExpanded(false);
    setError(null);
  };

  if (!isExpanded && !suggestion) {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleGetSuggestions}
        disabled={loading || !content || content.trim().length < 10}
        className={cn("gap-2", className)}
      >
        <Sparkles className="h-4 w-4" />
        {loading ? "Analyzing..." : "Improve with AI"}
      </Button>
    );
  }

  return (
    <Card className={cn("border-blue-200 bg-blue-50/50", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-base">AI Co-Pilot</CardTitle>
              <CardDescription>Suggestions to strengthen your application</CardDescription>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {loading && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Analyzing your content...</span>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-900">Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {suggestion && (
          <div className="space-y-4">
            {/* Main Suggestions */}
            {suggestion.improvedText && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <h4 className="text-sm font-semibold text-gray-900">Suggested Improvements</h4>
                </div>
                <div className="p-3 bg-white border border-gray-200 rounded-lg">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{suggestion.improvedText}</p>
                </div>
                {onApply && (
                  <Button
                    type="button"
                    onClick={handleApply}
                    size="sm"
                    className="w-full"
                  >
                    Apply These Improvements
                  </Button>
                )}
              </div>
            )}

            {/* Bullet Point Suggestions */}
            {suggestion.suggestions && suggestion.suggestions.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-600" />
                  <h4 className="text-sm font-semibold text-gray-900">Recommendations</h4>
                </div>
                <ul className="space-y-2">
                  {suggestion.suggestions.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-blue-600 mt-1">•</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Sources */}
            {suggestion.sources && suggestion.sources.length > 0 && (
              <div className="pt-2 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-2">Based on DSTI guidelines:</p>
                <div className="space-y-1">
                  {suggestion.sources.map((source, index) => (
                    <div key={index} className="text-xs text-gray-600">
                      <span className="font-medium">{source.title}</span>
                      <span className="text-gray-400"> • {source.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGetSuggestions}
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-3 w-3" />
                    Re-analyze
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
              >
                Dismiss
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
