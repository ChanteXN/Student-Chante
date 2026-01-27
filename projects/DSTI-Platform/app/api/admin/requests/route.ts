import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admin and reviewers can access
    if (session.user.role !== "ADMIN" && session.user.role !== "REVIEWER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get all requests with project and organization details
    const requests = await prisma.reviewRequest.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            caseReference: true,
            organisation: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      requests,
    });
  } catch (error) {
    console.error("Error fetching admin requests:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
