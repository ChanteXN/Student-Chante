import { NextRequest, NextResponse } from "next/server";
import { mockAskResponse } from "@/lib/ai/mock-responses";
import { auth } from "@/lib/auth";
import {
  containsForbiddenContent,
  getRefusalResponse,
  scanResponseForViolations,
  sanitizeResponse,
} from "@/lib/ai/guardrails";

// Vercel: Extend max duration for AI requests (requires Pro plan for >10s)
export const maxDuration = 60;

// Using mock responses for testing (OpenAI billing not yet configured)
const USE_MOCK = false;

export async function POST(request: NextRequest) {
  try {
    // Get session
    const _session = await auth();
    
    // Parse request body
    const body = await request.json();
    const { query, projectId: _projectId } = body;

    // Validate query
    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return NextResponse.json(
        { error: "Query is required" },
        { status: 400 }
      );
    }

    if (query.length > 1000) {
      return NextResponse.json(
        { error: "Query too long (max 1000 characters)" },
        { status: 400 }
      );
    }

    // GUARDRAIL: Check for forbidden content in query
    const forbiddenCheck = containsForbiddenContent(query);
    if (forbiddenCheck.isForbidden && forbiddenCheck.category) {
      console.log(`[GUARDRAIL] Blocked forbidden query: "${forbiddenCheck.matchedTerm}" in category ${forbiddenCheck.category}`);
      const refusal = getRefusalResponse(forbiddenCheck.category);
      return NextResponse.json({
        answer: refusal.answer,
        sources: [
          {
            title: "DSTI Compliance Guidelines",
            type: "policy",
            similarity: 100,
            excerpt: "For tax calculations, please consult with a registered tax practitioner.",
          },
        ],
        confidence: "high",
        suggestions: refusal.relatedQuestions,
        guardrailTriggered: true,
      });
    }

    // Use mock responses for UI testing
    if (USE_MOCK) {
      const response = mockAskResponse(query);
      
      // GUARDRAIL: Scan response for violations
      const violationCheck = scanResponseForViolations(response.answer);
      if (violationCheck.hasViolation) {
        console.log(`[GUARDRAIL] Response violations detected:`, violationCheck.violations);
        response.answer = sanitizeResponse(response.answer);
      }
      
      return NextResponse.json({
        answer: response.answer,
        sources: response.sources,
        confidence: response.confidence,
        suggestions: response.suggestions,
      });
    }

    // Check OpenAI API key (only when not using mocks)
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "your-openai-api-key-here") {
      return NextResponse.json(
        { 
          error: "AI service not configured",
          message: "OpenAI API key is not set. Please contact support."
        },
        { status: 503 }
      );
    }

    // Real AI implementation
    const { generateAIResponse } = await import("@/lib/ai/chat");
    const response = await generateAIResponse(query, _session?.user?.id, _projectId);
    
    // GUARDRAIL: Scan response for violations
    const violationCheck = scanResponseForViolations(response.answer);
    const sanitizedAnswer = violationCheck.hasViolation ? sanitizeResponse(response.answer) : response.answer;
    
    if (violationCheck.hasViolation) {
      console.log(`[GUARDRAIL] Response violations detected:`, violationCheck.violations);
    }
    
    // Deduplicate sources by document title (keep highest similarity)
    const uniqueSources = new Map<string, typeof response.sources[0]>();
    for (const source of response.sources) {
      const existing = uniqueSources.get(source.documentTitle);
      if (!existing || source.similarity > existing.similarity) {
        uniqueSources.set(source.documentTitle, source);
      }
    }
    
    return NextResponse.json({
      answer: sanitizedAnswer,
      sources: Array.from(uniqueSources.values()).map((source) => {
        // Extract a more meaningful excerpt (first 150 chars, trim to word boundary)
        let excerpt = source.content.substring(0, 150).trim();
        const lastSpace = excerpt.lastIndexOf(' ');
        if (lastSpace > 100) {
          excerpt = excerpt.substring(0, lastSpace);
        }
        return {
          title: source.documentTitle,
          type: source.documentType,
          similarity: Math.round(source.similarity * 100),
          excerpt: excerpt + "...",
        };
      }),
    });

  } catch (error) {
    console.error("Error in /api/ai/ask:", error);

    return NextResponse.json(
      { 
        error: "Failed to process request",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
