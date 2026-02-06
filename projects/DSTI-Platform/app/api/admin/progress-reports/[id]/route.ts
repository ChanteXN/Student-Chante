import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/admin/progress-reports/[id]
 * Fetch a single progress report for admin review
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const report = await prisma.progressReport.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            id: true,
            caseReference: true,
            title: true,
            organisation: {
              select: {
                name: true,
                memberships: {
                  select: {
                    user: {
                      select: {
                        name: true,
                        email: true,
                      },
                    },
                  },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    if (!report) {
      return NextResponse.json(
        { error: "Progress report not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(report);
  } catch (error) {
    console.error("Error fetching progress report:", error);
    return NextResponse.json(
      { error: "Failed to fetch progress report" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/progress-reports/[id]
 * Admin review action: Accept or Request Changes
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    const { id } = await params;

    const body = await req.json();
    const { action, feedback } = body;

    // Validate action
    if (!["accept", "request_changes"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action. Must be 'accept' or 'request_changes'" },
        { status: 400 }
      );
    }

    // If requesting changes, feedback is required
    if (action === "request_changes" && !feedback) {
      return NextResponse.json(
        { error: "Feedback is required when requesting changes" },
        { status: 400 }
      );
    }

    // Fetch the report
    const report = await prisma.progressReport.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            id: true,
            caseReference: true,
            title: true,
          },
        },
      },
    });

    if (!report) {
      return NextResponse.json(
        { error: "Progress report not found" },
        { status: 404 }
      );
    }

    // Determine new status
    const newStatus =
      action === "accept" ? "ACCEPTED" : "REQUIRES_CHANGES";

    // Update the report
    const updatedReport = await prisma.progressReport.update({
      where: { id },
      data: {
        status: newStatus as "SUBMITTED" | "ACCEPTED" | "REQUIRES_CHANGES",
        reviewedBy: session.user.email,
        reviewedAt: new Date(),
        feedback: feedback || null,
      },
    });

    // TODO: Create audit log when AuditLog model is available

    return NextResponse.json({
      message:
        action === "accept"
          ? "Progress report accepted successfully"
          : "Changes requested successfully",
      report: updatedReport,
    });
  } catch (error) {
    console.error("Error reviewing progress report:", error);
    return NextResponse.json(
      { error: "Failed to review progress report" },
      { status: 500 }
    );
  }
}
