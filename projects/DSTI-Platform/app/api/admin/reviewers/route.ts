import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/admin/reviewers
 * Get list of all users with REVIEWER or ADMIN role for assignment dropdown
 */
export async function GET(_req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admin can access reviewer list
    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admins can access reviewer list" },
        { status: 403 }
      );
    }

    // Get all reviewers and admins
    const reviewers = await prisma.user.findMany({
      where: {
        role: {
          in: ["REVIEWER", "ADMIN"],
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      reviewers,
    });
  } catch (error) {
    console.error("Error fetching reviewers:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
