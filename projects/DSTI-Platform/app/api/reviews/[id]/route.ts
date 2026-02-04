import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * PUT /api/reviews/[id]
 * Update reviewer assignment with rubric scores and recommendation
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only reviewers and admins can update reviews
    if (session.user.role !== "REVIEWER" && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only reviewers can update reviews" },
        { status: 403 }
      );
    }

    const {
      section11dScore,
      uncertaintyScore,
      innovationScore,
      budgetScore,
      timelineScore,
      recommendation,
      recommendationNote,
    } = await req.json();

    // Verify assignment exists and belongs to current user
    const assignment = await prisma.reviewerAssignment.findUnique({
      where: { id: params.id },
    });

    if (!assignment) {
      return NextResponse.json(
        { error: "Assignment not found" },
        { status: 404 }
      );
    }

    // Verify the reviewer is the one assigned (or is admin)
    if (assignment.reviewerId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "You can only update your own reviews" },
        { status: 403 }
      );
    }

    // Update the assignment with scores and recommendation
    const updatedAssignment = await prisma.reviewerAssignment.update({
      where: { id: params.id },
      data: {
        section11dScore: section11dScore !== null ? Number(section11dScore) : null,
        uncertaintyScore: uncertaintyScore !== null ? Number(uncertaintyScore) : null,
        innovationScore: innovationScore !== null ? Number(innovationScore) : null,
        budgetScore: budgetScore !== null ? Number(budgetScore) : null,
        timelineScore: timelineScore !== null ? Number(timelineScore) : null,
        recommendation: recommendation || null,
        recommendationNote: recommendationNote || null,
        completedAt: recommendation ? new Date() : null, // Mark as completed when recommendation is set
      },
    });

    return NextResponse.json({
      success: true,
      assignment: updatedAssignment,
      message: "Review updated successfully",
    });
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
