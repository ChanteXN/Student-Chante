import { NextRequest, NextResponse } from "next/server";
import { mockDetectGapsResponse } from "@/lib/ai/mock-responses";
import { auth } from "@/lib/auth";
import { scanResponseForViolations, sanitizeResponse } from "@/lib/ai/guardrails";
import { prisma } from "@/lib/prisma";

// Using mock responses for testing (OpenAI billing not yet configured)
const USE_MOCK = false;

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
    const { projectId, uploadedCategories, context, sections, projectDescription } = body;

    // Use mock responses for UI testing
    if (USE_MOCK) {
      const response = mockDetectGapsResponse(sections || { description: projectDescription });
      
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

    // Handle different contexts
    if (context === "evidence_completeness") {
      // Evidence Gap Detection
      const { analyzeEvidenceGaps } = await import("@/lib/ai/chat");
      const result = await analyzeEvidenceGaps(uploadedCategories || []);
      
      // Apply guardrails
      result.gaps = result.gaps.map(gap => {
        const violationCheck = scanResponseForViolations(gap.suggestion);
        if (violationCheck.hasViolation) {
          gap.suggestion = sanitizeResponse(gap.suggestion);
        }
        return gap;
      });
      
      return NextResponse.json(result);
      
    } else if (context === "submission_risk_analysis") {
      // Risk Analysis
      if (!projectId) {
        return NextResponse.json(
          { error: "Project ID required for risk analysis" },
          { status: 400 }
        );
      }

      // Fetch project data
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: {
          sections: true,
          evidenceFiles: true,
        },
      });

      if (!project) {
        return NextResponse.json(
          { error: "Project not found" },
          { status: 404 }
        );
      }

      // Extract section data
      const uncertaintySection = project.sections.find(s => s.sectionKey === 'uncertainty');
      const methodologySection = project.sections.find(s => s.sectionKey === 'methodology');
      const teamSection = project.sections.find(s => s.sectionKey === 'team');
      const expenditureSection = project.sections.find(s => s.sectionKey === 'expenditure');

      const projectData = {
        title: project.title,
        uncertainty: (uncertaintySection?.sectionData as any)?.uncertainty as string,
        methodology: (methodologySection?.sectionData as any)?.researchApproach as string,
        team: (teamSection?.sectionData as any)?.keyPersonnel as string,
        budget: (expenditureSection?.sectionData as any)?.totalBudget as string,
        evidenceCount: project.evidenceFiles?.length || 0,
      };

      const { analyzeSubmissionRisks } = await import("@/lib/ai/chat");
      const result = await analyzeSubmissionRisks(projectData);
      
      // Apply guardrails
      result.risks = result.risks.map(risk => {
        const issueCheck = scanResponseForViolations(risk.issue);
        const recCheck = scanResponseForViolations(risk.recommendation);
        
        if (issueCheck.hasViolation) {
          risk.issue = sanitizeResponse(risk.issue);
        }
        if (recCheck.hasViolation) {
          risk.recommendation = sanitizeResponse(risk.recommendation);
        }
        return risk;
      });
      
      return NextResponse.json(result);
      
    } else {
      // Generic gap detection (fallback)
      const { detectMissingEvidence } = await import("@/lib/ai/chat");
      const missingItems = await detectMissingEvidence(projectDescription || "");
      
      const gaps = missingItems.map((item, index) => {
        const violationCheck = scanResponseForViolations(item);
        const sanitizedItem = violationCheck.hasViolation ? sanitizeResponse(item) : item;
        
        return {
          id: `gap-${index + 1}`,
          severity: 'medium',
          message: sanitizedItem,
          recommendation: sanitizedItem,
        };
      });
      
      return NextResponse.json({
        gaps,
        count: gaps.length,
      });
    }

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
