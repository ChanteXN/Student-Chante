import { NextRequest, NextResponse } from "next/server";
import { improveApplicationText } from "@/lib/ai/chat";
import { auth } from "@/lib/auth";

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
    const { text, context } = body;

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

    // Check OpenAI API key
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "your-openai-api-key-here") {
      return NextResponse.json(
        { 
          error: "AI service not configured",
          message: "OpenAI API key is not set."
        },
        { status: 503 }
      );
    }

    // Improve text
    const improvedText = await improveApplicationText(text, context || "application section");

    return NextResponse.json({
      originalText: text,
      improvedText,
    });

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
