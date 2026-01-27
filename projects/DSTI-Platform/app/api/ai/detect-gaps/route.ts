import { NextRequest, NextResponse } from "next/server";
import { detectMissingEvidence } from "@/lib/ai/chat";
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
    const { projectDescription } = body;

    // Validate input
    if (!projectDescription || typeof projectDescription !== "string" || projectDescription.trim().length === 0) {
      return NextResponse.json(
        { error: "Project description is required" },
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

    // Detect missing evidence
    const missingItems = await detectMissingEvidence(projectDescription);

    return NextResponse.json({
      missingItems,
      count: missingItems.length,
    });

  } catch (error) {
    console.error("Error in /api/ai/detect-gaps:", error);

    return NextResponse.json(
      { 
        error: "Failed to detect missing evidence",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
