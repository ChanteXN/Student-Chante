import { NextRequest, NextResponse } from "next/server";
import { mockImproveResponse } from "@/lib/ai/mock-responses";
import { auth } from "@/lib/auth";

// Using mock responses for testing (OpenAI billing not yet configured)
const USE_MOCK = true;

export async function POST(request: NextRequest) {
  try {
    // Get session
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { text, context, sectionKey } = body;

    // Validate input
    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    if (text.length > 5000) {
      return NextResponse.json(
        { error: "Text too long (max 5000 characters)" },
        { status: 400 }
      );
    }

    // Use mock responses for UI testing
    if (USE_MOCK) {
      const section = sectionKey || context || "general";
      const response = mockImproveResponse(section, text);
      return NextResponse.json({
        originalText: text,
        improvedText: response.answer,
        suggestions: response.suggestions,
        sources: response.sources,
      });
    }

    // Check OpenAI API key (only when not using mocks)
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "your-openai-api-key-here") {
      return NextResponse.json(
        { 
          error: "AI service not configured",
          message: "OpenAI API key is not set."
        },
        { status: 503 }
      );
    }

    // Real AI implementation (commented out until billing configured)
    // const { improveApplicationText } = await import("@/lib/ai/chat");
    // const improvedText = await improveApplicationText(text, context || "application section");
    // return NextResponse.json({
    //   originalText: text,
    //   improvedText,
    // });

    return NextResponse.json({
      error: "AI features require OpenAI billing setup"
    }, { status: 503 });

  } catch (error) {
    console.error("Error in /api/ai/improve:", error);

    return NextResponse.json(
      { 
        error: "Failed to improve text",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
