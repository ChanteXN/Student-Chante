import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admin can create info requests
    if (session.user.role !== "ADMIN" && session.user.role !== "REVIEWER") {
      return NextResponse.json(
        { error: "Only admins and reviewers can create information requests" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { projectId, subject, message } = body;

    if (!projectId || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Create the request
    const request = await prisma.reviewRequest.create({
      data: {
        projectId,
        subject,
        message,
        requestedBy: session.user.id,
        status: "PENDING",
      },
    });

    // Update project status to PENDING_INFO if it's not already
    if (project.status !== "PENDING_INFO") {
      await prisma.project.update({
        where: { id: projectId },
        data: { status: "PENDING_INFO" },
      });

      // Add status history entry
      await prisma.projectStatusHistory.create({
        data: {
          projectId,
          status: "PENDING_INFO",
          notes: `Information requested: ${subject}`,
          createdBy: session.user.id,
        },
      });
    }

    // Create audit event
    await prisma.auditEvent.create({
      data: {
        userId: session.user.id,
        action: "INFO_REQUEST_CREATED",
        entityType: "review_request",
        entityId: request.id,
        metadata: {
          projectId,
          subject,
        },
      },
    });

    return NextResponse.json({
      success: true,
      request,
    });
  } catch (error) {
    console.error("Error creating info request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
