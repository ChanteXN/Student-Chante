"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, Sparkles, BookOpen } from "lucide-react";

interface AIResponse {
  answer: string;
  confidence: number | "high" | "medium" | "low"; // Can be number (0-1) or string
  sources: Array<{
    title: string;
    type: string;
    excerpt: string;
    similarity?: number;
  }>;
  suggestions?: string[];
}

export default function AIAssistantPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAsk = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch("/api/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) {
        throw new Error("Failed to get AI response");
      }

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const exampleQuestions = [
    "Does my software development project qualify for the R&D tax incentive?",
    "What documentation do I need for my application?",
    "How is the incentive amount calculated?",
    "What are common mistakes in R&D applications?",
  ];

  const handleExampleClick = (example: string) => {
    setQuery(example);
  };

  const confidenceColor = {
    high: "text-green-600 bg-green-50",
    medium: "text-yellow-600 bg-yellow-50",
    low: "text-gray-600 bg-gray-50",
  };

  // Convert numeric confidence to label
  const getConfidenceLabel = (confidence: number | "high" | "medium" | "low"): "high" | "medium" | "low" => {
    if (typeof confidence === "string") return confidence;
    if (confidence >= 0.8) return "high";
    if (confidence >= 0.5) return "medium";
    return "low";
  };

  return (
    <div className="container mx-auto py-8 max-w-5xl">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold">AI Assistant</h1>
        </div>
        <p className="text-gray-600">
          Ask questions about the R&D Tax Incentive (Section 11D) and get instant answers based on DSTI guidelines.
        </p>
      </div>

      {/* Query Input */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Ask a Question</CardTitle>
          <CardDescription>
            Get guidance on eligibility, documentation, costs, and application requirements.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              placeholder="E.g., Does my project qualify for the R&D tax incentive?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <Button
              onClick={handleAsk}
              disabled={loading || !query.trim()}
              className="w-full sm:w-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Thinking...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Ask AI Assistant
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Example Questions */}
      {!response && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Example Questions</CardTitle>
            <CardDescription>Click any question to try it out</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {exampleQuestions.map((example, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="justify-start text-left h-auto py-3 px-4"
                  onClick={() => handleExampleClick(example)}
                >
                  {example}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* AI Response */}
      {response && (
        <div className="space-y-6">
          {/* Main Answer */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle>Answer</CardTitle>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    confidenceColor[getConfidenceLabel(response.confidence)]
                  }`}
                >
                  {getConfidenceLabel(response.confidence).toUpperCase()} CONFIDENCE
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap">{response.answer}</div>
              </div>
            </CardContent>
          </Card>

          {/* Sources */}
          {response.sources && response.sources.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <CardTitle>Sources</CardTitle>
                </div>
                <CardDescription>
                  Information based on these guideline documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {response.sources.map((source, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-sm">{source.title}</h4>
                        <span className="text-xs text-gray-500 px-2 py-1 bg-white rounded">
                          {source.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{source.excerpt}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Suggestions */}
          {response.suggestions && response.suggestions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Next Steps</CardTitle>
                <CardDescription>Recommended actions based on your question</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {response.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span className="text-sm">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Ask Another Question */}
          <Button
            variant="outline"
            onClick={() => {
              setResponse(null);
              setQuery("");
            }}
            className="w-full"
          >
            Ask Another Question
          </Button>
        </div>
      )}
    </div>
  );
}
