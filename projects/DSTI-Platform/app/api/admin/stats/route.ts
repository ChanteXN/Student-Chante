import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admin and reviewers can view stats
    if (session.user.role !== "ADMIN" && session.user.role !== "REVIEWER") {
      return NextResponse.json(
        { error: "Only admins and reviewers can view statistics" },
        { status: 403 }
      );
    }

    // Get counts for each status (excluding DRAFT)
    const [submitted, underReview, pendingInfo, approved, declined, total] =
      await Promise.all([
        prisma.project.count({ where: { status: "SUBMITTED" } }),
        prisma.project.count({ where: { status: "UNDER_REVIEW" } }),
        prisma.project.count({ where: { status: "PENDING_INFO" } }),
        prisma.project.count({ where: { status: "APPROVED" } }),
        prisma.project.count({ where: { status: "DECLINED" } }),
        prisma.project.count({ where: { status: { not: "DRAFT" } } }),
      ]);

    return NextResponse.json({
      success: true,
      stats: {
        submitted,
        underReview,
        pendingInfo,
        approved,
        declined,
        total,
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
