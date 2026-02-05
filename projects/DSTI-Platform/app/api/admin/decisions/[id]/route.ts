import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DecisionOutcome, ProjectStatus } from "@prisma/client";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const resolvedParams = await params;

    // Check if user is admin
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { outcome, reasoning, conditions } = body;

    // Validate input
    if (!outcome || !["APPROVED", "DECLINED"].includes(outcome)) {
      return NextResponse.json(
        { error: "Invalid outcome. Must be APPROVED or DECLINED" },
        { status: 400 }
      );
    }

    if (!reasoning || reasoning.trim().length === 0) {
      return NextResponse.json(
        { error: "Reasoning is required" },
        { status: 400 }
      );
    }

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: resolvedParams.id },
      include: {
        decision: true,
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Check if decision already exists
    if (project.decision) {
      return NextResponse.json(
        { error: "Decision already recorded for this project" },
        { status: 409 }
      );
    }

    // Determine new status based on outcome
    const newStatus: ProjectStatus =
      outcome === "APPROVED" ? ProjectStatus.APPROVED : ProjectStatus.DECLINED;

    // Create decision and update project status in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the decision
      const decision = await tx.decision.create({
        data: {
          projectId: resolvedParams.id,
          outcome: outcome as DecisionOutcome,
          reasoning: reasoning.trim(),
          conditions: conditions?.trim() || null,
          decidedBy: session.user.id,
        },
      });

      // Update project status
      await tx.project.update({
        where: { id: resolvedParams.id },
        data: { status: newStatus },
      });

      // Add status history entry
      await tx.projectStatusHistory.create({
        data: {
          projectId: resolvedParams.id,
          status: newStatus,
          notes: `Decision: ${outcome} - ${reasoning.substring(0, 200)}`,
          createdBy: session.user.id,
        },
      });

      // Create audit event
      await tx.auditEvent.create({
        data: {
          userId: session.user.id,
          action: `DECISION_${outcome}`,
          entityType: "project",
          entityId: resolvedParams.id,
          metadata: {
            projectId: resolvedParams.id,
            outcome,
            hasConditions: !!conditions,
          },
        },
      });

      return decision;
    });

    return NextResponse.json({
      success: true,
      decision: result,
      message: "Decision recorded successfully",
    });
  } catch (error) {
    console.error("Error submitting decision:", error);
    return NextResponse.json(
      { error: "Failed to submit decision" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const resolvedParams = await params;

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const decision = await prisma.decision.findUnique({
      where: { projectId: resolvedParams.id },
      include: {
        project: {
          select: {
            title: true,
            caseReference: true,
          },
        },
      },
    });

    if (!decision) {
      return NextResponse.json({ error: "Decision not found" }, { status: 404 });
    }

    return NextResponse.json(decision);
  } catch (error) {
    console.error("Error fetching decision:", error);
    return NextResponse.json(
      { error: "Failed to fetch decision" },
      { status: 500 }
    );
  }
}
