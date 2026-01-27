import { NextRequest, NextResponse } from "next/server";
import { mockAskResponse } from "@/lib/ai/mock-responses";
import { auth } from "@/lib/auth";

// Using mock responses for testing (OpenAI billing not yet configured)
const USE_MOCK = true;

export async function POST(request: NextRequest) {
  try {
    // Get session
    const session = await auth();
    
    // Parse request body
    const body = await request.json();
    const { query, projectId } = body;

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

    // Use mock responses for UI testing
    if (USE_MOCK) {
      const response = mockAskResponse(query);
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

    // Real AI implementation (commented out until billing configured)
    // const { generateAIResponse } = await import("@/lib/ai/chat");
    // const response = await generateAIResponse(query, session?.user?.id, projectId);
    // return NextResponse.json({
    //   answer: response.answer,
    //   sources: response.sources.map((source) => ({
    //     title: source.documentTitle,
    //     type: source.documentType,
    //     similarity: Math.round(source.similarity * 100),
    //     excerpt: source.content.substring(0, 200) + "...",
    //   })),
    // });

    return NextResponse.json({
      error: "AI features require OpenAI billing setup"
    }, { status: 503 });

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
