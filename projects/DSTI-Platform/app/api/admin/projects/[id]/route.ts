import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const resolvedParams = await params;

    // Check if user is admin or reviewer
    if (!session?.user || !["ADMIN", "REVIEWER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Fetch project with all related data
    const project = await prisma.project.findUnique({
      where: { id: resolvedParams.id },
      include: {
        organisation: {
          select: {
            name: true,
            registrationNo: true,
            sector: true,
            address: true,
          },
        },
        reviewerAssignments: {
          include: {
            reviewer: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
    
        decision: true,
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}
