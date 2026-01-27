import { NextRequest, NextResponse } from "next/server";
import { mockDetectGapsResponse } from "@/lib/ai/mock-responses";
import { auth } from "@/lib/auth";
import { scanResponseForViolations, sanitizeResponse } from "@/lib/ai/guardrails";

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
    const { projectDescription, sections } = body;

    // Validate input
    if (!projectDescription && !sections) {
      return NextResponse.json(
        { error: "Project description or sections required" },
        { status: 400 }
      );
    }

    // Use mock responses for UI testing
    if (USE_MOCK) {
      let response = mockDetectGapsResponse(sections || { description: projectDescription });
      
      // GUARDRAIL: Scan all gap messages for violations
      if (response.gaps) {
        response.gaps = response.gaps.map(gap => {
          const violationCheck = scanResponseForViolations(gap.recommendation);
          if (violationCheck.hasViolation) {
            console.log(`[GUARDRAIL] Gap recommendation violations:`, violationCheck.violations);
            gap.recommendation = sanitizeResponse(gap.recommendation);
          }
          return gap;
        });
      }
      
      return NextResponse.json(response);
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
    // const { detectMissingEvidence } = await import("@/lib/ai/chat");
    // const missingItems = await detectMissingEvidence(projectDescription);
    // return NextResponse.json({
    //   missingItems,
    //   count: missingItems.length,
    // });

    return NextResponse.json({
      error: "AI features require OpenAI billing setup"
    }, { status: 503 });

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
