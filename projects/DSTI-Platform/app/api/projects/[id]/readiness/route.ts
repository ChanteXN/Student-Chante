import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateReadinessScore } from "@/lib/readiness-score";

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

    // Fetch project with sections and evidence
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        sections: true,
        evidenceFiles: true,
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Calculate readiness score
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = calculateReadinessScore(project as any);

    // Update project with new readiness score
    await prisma.project.update({
      where: { id },
      data: {
        readinessScore: result.totalScore,
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error calculating readiness score:", error);
    return NextResponse.json(
      { error: "Failed to calculate readiness score" },
      { status: 500 }
    );
  }
}
