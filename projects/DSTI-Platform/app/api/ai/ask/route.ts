import { NextRequest, NextResponse } from "next/server";
import { generateAIResponse } from "@/lib/ai/chat";
import { auth } from "@/lib/auth";

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

    // Check OpenAI API key
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "your-openai-api-key-here") {
      return NextResponse.json(
        { 
          error: "AI service not configured",
          message: "OpenAI API key is not set. Please contact support."
        },
        { status: 503 }
      );
    }

    // Generate response
    const response = await generateAIResponse(
      query,
      session?.user?.id,
      projectId
    );

    return NextResponse.json({
      answer: response.answer,
      sources: response.sources.map((source) => ({
        title: source.documentTitle,
        type: source.documentType,
        similarity: Math.round(source.similarity * 100),
        excerpt: source.content.substring(0, 200) + "...",
      })),
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
