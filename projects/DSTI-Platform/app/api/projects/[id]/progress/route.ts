import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/projects/[id]/progress - Get all progress reports for a project
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: projectId } = await params;

    // Verify project exists and user has access
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        organisation: {
          include: {
            memberships: {
              where: { userId: session.user.id },
            },
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Check access: user is member of org OR is admin/reviewer
    const hasAccess =
      project.organisation.memberships.length > 0 ||
      session.user.role === "ADMIN" ||
      session.user.role === "REVIEWER";

    if (!hasAccess) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch all progress reports for this project
    const reports = await prisma.progressReport.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ reports });
  } catch (error) {
    console.error("Error fetching progress reports:", error);
    return NextResponse.json(
      { error: "Failed to fetch progress reports" },
      { status: 500 }
    );
  }
}

// POST /api/projects/[id]/progress - Create new progress report
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: projectId } = await params;

    // Verify project exists and user has access
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        organisation: {
          include: {
            memberships: {
              where: { userId: session.user.id },
            },
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Only members of the organization can create reports
    if (project.organisation.memberships.length === 0) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Only approved projects can have progress reports
    if (project.status !== "APPROVED") {
      return NextResponse.json(
        { error: "Only approved projects can submit progress reports" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const {
      reportingPeriod,
      outcomes,
      milestones,
      staffing,
      learnings,
      dueDate,
      status = "SUBMITTED",
    } = body;

    // Validate required fields
    if (!reportingPeriod || !outcomes || !milestones || !staffing || !learnings) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Create progress report
    const report = await prisma.progressReport.create({
      data: {
        projectId,
        reportingPeriod,
        outcomes,
        milestones,
        staffing,
        learnings,
        dueDate: dueDate ? new Date(dueDate) : null,
        status,
        submittedAt: status === "SUBMITTED" ? new Date() : null,
      },
    });

    return NextResponse.json({ report }, { status: 201 });
  } catch (error) {
    console.error("Error creating progress report:", error);
    return NextResponse.json(
      { error: "Failed to create progress report" },
      { status: 500 }
    );
  }
}
