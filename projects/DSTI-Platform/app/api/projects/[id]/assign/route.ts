import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/projects/[id]/assign
 * Assign a reviewer to a project
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admin can assign reviewers
    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admins can assign reviewers" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const { reviewerId } = await req.json();

    if (!reviewerId) {
      return NextResponse.json(
        { error: "Reviewer ID is required" },
        { status: 400 }
      );
    }

    // Verify project exists
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Verify reviewer exists and has appropriate role
    const reviewer = await prisma.user.findUnique({
      where: { id: reviewerId },
    });

    if (!reviewer) {
      return NextResponse.json({ error: "Reviewer not found" }, { status: 404 });
    }

    if (reviewer.role !== "REVIEWER" && reviewer.role !== "ADMIN") {
      return NextResponse.json(
        { error: "User is not a reviewer" },
        { status: 400 }
      );
    }

    // Update project status to UNDER_REVIEW if not already
    if (project.status === "SUBMITTED") {
      await prisma.project.update({
        where: { id },
        data: { status: "UNDER_REVIEW" },
      });
    }

    // Create or update assignment
    const assignment = await prisma.reviewerAssignment.upsert({
      where: {
        projectId_reviewerId: {
          projectId: id,
          reviewerId: reviewerId,
        },
      },
      update: {
        // If already assigned, just update timestamp
        assignedAt: new Date(),
      },
      create: {
        projectId: id,
        reviewerId: reviewerId,
      },
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      assignment,
      message: `Successfully assigned ${reviewer.name} to review this project`,
    });
  } catch (error) {
    console.error("Error assigning reviewer:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/projects/[id]/assign
 * Get current reviewer assignments for a project
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admin and reviewers can view assignments
    if (session.user.role !== "ADMIN" && session.user.role !== "REVIEWER") {
      return NextResponse.json(
        { error: "Only admins and reviewers can view assignments" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const assignments = await prisma.reviewerAssignment.findMany({
      where: {
        projectId: id,
      },
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        assignedAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      assignments,
    });
  } catch (error) {
    console.error("Error fetching assignments:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
