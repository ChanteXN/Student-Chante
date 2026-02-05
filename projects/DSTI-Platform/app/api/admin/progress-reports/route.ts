import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/admin/progress-reports - Get all progress reports (admin only)
export async function GET(_req: NextRequest) {
  try {
    const session = await auth();
    
    // Only admins and reviewers can access
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "REVIEWER")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all progress reports with project and organization details
    const reports = await prisma.progressReport.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        reportingPeriod: true,
        outcomes: true,
        milestones: true,
        staffing: true,
        learnings: true,
        expenditure: true,
        challenges: true,
        dueDate: true,
        submittedAt: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        projectId: true,
      },
    });

    // Fetch project details separately to include organization info
    const reportsWithDetails = await Promise.all(
      reports.map(async (report: { projectId: string; [key: string]: unknown }) => {
        const project = await prisma.project.findUnique({
          where: { id: report.projectId },
          select: {
            id: true,
            title: true,
            caseReference: true,
            status: true,
            organisation: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        });

        return {
          ...report,
          project,
        };
      })
    );

    return NextResponse.json({ reports: reportsWithDetails });
  } catch (error) {
    console.error("Error fetching admin progress reports:", error);
    return NextResponse.json(
      { error: "Failed to fetch progress reports" },
      { status: 500 }
    );
  }
}
