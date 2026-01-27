import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admin and reviewers can view all projects
    if (session.user.role !== "ADMIN" && session.user.role !== "REVIEWER") {
      return NextResponse.json(
        { error: "Only admins and reviewers can view all projects" },
        { status: 403 }
      );
    }

    // Only show projects that have been submitted (not DRAFT)
    const projects = await prisma.project.findMany({
      where: {
        status: {
          not: "DRAFT", // Exclude draft projects - they're private to applicants
        },
      },
      include: {
        organisation: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { submittedAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      projects,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
