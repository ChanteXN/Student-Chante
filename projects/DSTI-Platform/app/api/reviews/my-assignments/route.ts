import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/reviews/my-assignments
 * Get all review assignments for the current user
 */
export async function GET(_req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only reviewers and admins can view their assignments
    if (session.user.role !== "REVIEWER" && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only reviewers can view assignments" },
        { status: 403 }
      );
    }

    const assignments = await prisma.reviewerAssignment.findMany({
      where: {
        reviewerId: session.user.id,
      },
      include: {
        project: {
          include: {
            organisation: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: [
        { completedAt: "asc" }, // Pending reviews first (null completedAt)
        { assignedAt: "desc" }, // Then by most recent assignment
      ],
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
