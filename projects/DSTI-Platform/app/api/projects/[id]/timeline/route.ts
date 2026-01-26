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

    const { id } = await params;

    // Fetch project to verify it exists and user has access
    const project = await prisma.project.findUnique({
      where: { id },
      select: { id: true, organisationId: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Fetch timeline history ordered by creation date (most recent first)
    const timeline = await prisma.projectStatusHistory.findMany({
      where: { projectId: id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        status: true,
        notes: true,
        createdBy: true,
        createdAt: true,
      },
    });

    return NextResponse.json(timeline);
  } catch (error) {
    console.error("Error fetching timeline:", error);
    return NextResponse.json(
      { error: "Failed to fetch timeline" },
      { status: 500 }
    );
  }
}
