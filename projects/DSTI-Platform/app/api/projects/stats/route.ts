import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find user's organisation
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        memberships: {
          where: { isActive: true },
          include: { organisation: true },
        },
      },
    });

    if (!user || user.memberships.length === 0) {
      return NextResponse.json({ error: "No organisation found" }, { status: 404 });
    }

    const organisationId = user.memberships[0].organisationId;

    // Get project counts by status
    const [drafts, submitted, underReview, total] = await Promise.all([
      prisma.project.count({
        where: { organisationId, status: "DRAFT" },
      }),
      prisma.project.count({
        where: { organisationId, status: "SUBMITTED" },
      }),
      prisma.project.count({
        where: { organisationId, status: "UNDER_REVIEW" },
      }),
      prisma.project.count({
        where: { organisationId },
      }),
    ]);

    return NextResponse.json({
      drafts,
      submitted,
      underReview,
      total,
      active: submitted + underReview, // Active = submitted + under review
    });
  } catch (error) {
    console.error("Error fetching project stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch project statistics" },
      { status: 500 }
    );
  }
}
