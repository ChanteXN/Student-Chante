import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Generate case reference number (format: DSTI-2026-XXXXX)
function generateCaseReference(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(10000 + Math.random() * 90000);
  return `DSTI-${year}-${random}`;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Fetch project with all required data
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        sections: true,
        evidenceFiles: true,
        organisation: true,
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Validation: Check if project is in DRAFT status
    if (project.status !== "DRAFT") {
      return NextResponse.json(
        { error: "Only draft projects can be submitted" },
        { status: 400 }
      );
    }

    // Validation: Check if all required sections are complete
    const requiredSections = ["basics", "uncertainty", "methodology", "team", "expenditure"];
    
    // Check if sections exist and have data (not just isComplete flag)
    const missingSections = requiredSections.filter(key => {
      const section = project.sections.find(s => s.sectionKey === key);
      if (!section) return true; // Section doesn't exist
      
      // Check if section has data
      const hasData = section.sectionData && 
        typeof section.sectionData === 'object' && 
        Object.keys(section.sectionData).length > 0;
      
      return !hasData;
    });

    if (missingSections.length > 0) {
      return NextResponse.json(
        {
          error: "Application incomplete",
          message: `Please complete all required sections: ${missingSections.join(", ")}`,
          missingSections,
        },
        { status: 400 }
      );
    }

    // Validation: Check if required evidence is uploaded
    const requiredEvidenceCategories = ["RD_PLAN", "TIMESHEETS", "EXPERIMENTS"];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const uploadedCategories = new Set(project.evidenceFiles.map((f: any) => f.category));
    const missingEvidence = requiredEvidenceCategories.filter(
      cat => !uploadedCategories.has(cat as never)
    );

    if (missingEvidence.length > 0) {
      return NextResponse.json(
        {
          error: "Required evidence missing",
          message: `Please upload evidence for: ${missingEvidence.join(", ")}`,
          missingEvidence,
        },
        { status: 400 }
      );
    }

    // Generate case reference number
    const caseReference = generateCaseReference();
    const submittedAt = new Date();

    // Update project status to SUBMITTED
    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        status: "SUBMITTED",
        submittedAt,
        caseReference,
      } as never, // Type assertion for new field
    });

    // Create timeline entry for submission
    await prisma.projectStatusHistory.create({
      data: {
        projectId: id,
        status: "SUBMITTED",
        notes: "Application submitted for review",
        createdBy: session.user.email || "Unknown user",
      },
    });

    // Log audit event
    await prisma.auditEvent.create({
      data: {
        action: "PROJECT_SUBMITTED",
        entityType: "project",
        entityId: id,
        metadata: {
          projectId: id,
          caseReference,
          submittedAt: submittedAt.toISOString(),
        },
      },
    });

    return NextResponse.json({
      success: true,
      caseReference,
      submittedAt,
      project: updatedProject,
    });
  } catch (error) {
    console.error("Error submitting project:", error);
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    );
  }
}
