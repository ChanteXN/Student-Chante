import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Fetch all progress reports for a project
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
    const project = await prisma.project.findUnique({
      where: { id: resolvedParams.id },
      include: {
        organisation: {
          include: {
            memberships: {
              where: { userId: session.user.id, isActive: true },
            },
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Check access: must be project owner, admin, or reviewer
    const isOwner = project.organisation.memberships.length > 0;
    const isAdmin = session.user.role === "ADMIN";
    const isReviewer = session.user.role === "REVIEWER";

    if (!isOwner && !isAdmin && !isReviewer) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const reports = await prisma.progressReport.findMany({
      where: { projectId: resolvedParams.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      reports,
    });
  } catch (error) {
    console.error("Error fetching progress reports:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Submit a new progress report
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const body = await req.json();

    // Validate required fields
    const { reportingPeriod, outcomes, milestones, staffing, learnings, expenditure, challenges } = body;
    
    if (!reportingPeriod || !outcomes || !milestones) {
      return NextResponse.json(
        { error: "Missing required fields: reportingPeriod, outcomes, milestones" },
        { status: 400 }
      );
    }

    // Verify project exists and user has access
    const project = await prisma.project.findUnique({
      where: { id: resolvedParams.id },
      include: {
        organisation: {
          include: {
            memberships: {
              where: { userId: session.user.id, isActive: true },
            },
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Check access: must be project owner
    const isOwner = project.organisation.memberships.length > 0;
    if (!isOwner && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Only project owners can submit progress reports" }, { status: 403 });
    }

    // Verify project is approved
    if (project.status !== "APPROVED") {
      return NextResponse.json(
        { error: "Progress reports can only be submitted for approved projects" },
        { status: 400 }
      );
    }

    // Create progress report
    const report = await prisma.progressReport.create({
      data: {
        projectId: resolvedParams.id,
        reportingPeriod,
        outcomes,
        milestones,
        staffing,
        learnings,
        ...(expenditure && { expenditure }),
        ...(challenges && { challenges }),
        submittedBy: session.user.id,
        submittedAt: new Date(),
        status: "SUBMITTED",
      } as any,
    });

    // Log audit event
    await prisma.auditEvent.create({
      data: {
        userId: session.user.id,
        action: "PROGRESS_REPORT_SUBMITTED",
        entityType: "PROJECT",
        entityId: resolvedParams.id,
        metadata: {
          reportId: report.id,
          reportingPeriod,
        },
      },
    });

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (error) {
    console.error("Error creating progress report:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
