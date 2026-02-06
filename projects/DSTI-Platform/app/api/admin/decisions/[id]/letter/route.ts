import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateDecisionLetter } from "@/lib/pdf/decision-letter";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const resolvedParams = await params;

    // Check if user is admin
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Fetch project with decision
    const project = await prisma.project.findUnique({
      where: { id: resolvedParams.id },
      include: {
        decision: true,
        organisation: {
          select: {
            name: true,
            registrationNo: true,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (!project.decision) {
      return NextResponse.json(
        { error: "No decision found for this project" },
        { status: 404 }
      );
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

    // Return PDF as download
    return new NextResponse(Buffer.from(pdfBytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="decision-letter-${project.caseReference || project.id}.pdf"`,
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
