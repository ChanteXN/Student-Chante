import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateDecisionLetter } from "@/lib/pdf/decision-letter";

// GET - Download decision letter (applicant view)
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;

    // Fetch project with decision and organization
    const project = await prisma.project.findUnique({
      where: { id: resolvedParams.id },
      include: {
        organisation: {
          select: {
            name: true,
            registrationNo: true,
            memberships: {
              where: { userId: session.user.id, isActive: true },
            },
          },
        },
        decision: true,
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Check access
    const isOwner = project.organisation.memberships.length > 0;
    const isAdmin = session.user.role === "ADMIN";

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    if (!project.decision) {
      return NextResponse.json({ error: "No decision found for this project" }, { status: 404 });
    }

    // Generate PDF
    const pdfBytes = await generateDecisionLetter({
      outcome: project.decision.outcome,
      projectTitle: project.title,
      caseReference: project.caseReference || "N/A",
      organisationName: project.organisation.name,
      registrationNo: project.organisation.registrationNo,
      reasoning: project.decision.reasoning,
      conditions: project.decision.conditions,
      decidedAt: project.decision.decidedAt,
    });

    return new NextResponse(Buffer.from(pdfBytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Decision-Letter-${project.caseReference || project.id}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error generating decision letter:", error);
    return NextResponse.json(
      { error: "Failed to generate decision letter" },
      { status: 500 }
    );
  }
}
