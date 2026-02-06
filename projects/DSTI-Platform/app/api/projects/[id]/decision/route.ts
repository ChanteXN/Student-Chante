import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Fetch decision for a project (applicant view)
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

    // Verify access to project
    const project = (await prisma.project.findUnique({
      where: { id: resolvedParams.id },
      include: {
        organisation: {
          select: {
            name: true,
            memberships: {
              where: { userId: session.user.id, isActive: true },
            },
          },
        },
        decision: {
          select: {
            id: true,
            outcome: true,
            reasoning: true,
            conditions: true,
            decidedBy: true,
            decidedAt: true,
          },
        },
      },
    })) as any;

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Check access: must be project owner or admin
    const isOwner = project.organisation.memberships.length > 0;
    const isAdmin = session.user.role === "ADMIN";

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    return NextResponse.json({
      project: {
        id: project.id,
        title: project.title,
        caseReference: project.caseReference,
        status: project.status,
        organisation: {
          name: project.organisation.name,
        },
      },
      decision: project.decision,
    });
  } catch (error) {
    console.error("Error fetching decision:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
