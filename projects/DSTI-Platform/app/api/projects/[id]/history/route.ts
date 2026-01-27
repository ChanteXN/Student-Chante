import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin/reviewer to see full history
    const isAdminOrReviewer = session.user.role === "ADMIN" || session.user.role === "REVIEWER";

    const { id } = await params;

    // Verify project exists and user has access
    const project = await prisma.project.findUnique({
      where: { id },
      select: { id: true, organisationId: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // If not admin/reviewer, verify user owns the project's organization
    if (!isAdminOrReviewer) {
      const userOrg = await prisma.membership.findFirst({
        where: {
          userId: session.user.id,
          organisationId: project.organisationId,
        },
      });

      if (!userOrg) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    // Fetch status history
    const history = await prisma.projectStatusHistory.findMany({
      where: { projectId: id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ history });
  } catch (error) {
    console.error("Error fetching project history:", error);
    return NextResponse.json(
      { error: "Failed to fetch project history" },
      { status: 500 }
    );
  }
}
