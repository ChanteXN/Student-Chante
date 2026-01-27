import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { requestId, response } = body;

    if (!requestId || !response) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get the request
    const request = await prisma.reviewRequest.findUnique({
      where: { id: requestId },
      include: { project: true },
    });

    if (!request) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    // Verify user has access to this project (is member of the organization)
    const membership = await prisma.membership.findFirst({
      where: {
        userId: session.user.id,
        organisationId: request.project.organisationId,
      },
    });

    if (!membership && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "You don't have access to this project" },
        { status: 403 }
      );
    }

    // Update the request
    const updatedRequest = await prisma.reviewRequest.update({
      where: { id: requestId },
      data: {
        response,
        respondedAt: new Date(),
        respondedBy: session.user.id,
        status: "RESPONDED",
      },
    });

    // Update project status back to UNDER_REVIEW
    await prisma.project.update({
      where: { id: request.projectId },
      data: { status: "UNDER_REVIEW" },
    });

    // Add status history entry
    await prisma.projectStatusHistory.create({
      data: {
        projectId: request.projectId,
        status: "UNDER_REVIEW",
        notes: `Response provided to: ${request.subject}`,
        createdBy: session.user.id,
      },
    });

    // Create audit event
    await prisma.auditEvent.create({
      data: {
        userId: session.user.id,
        action: "INFO_REQUEST_RESPONDED",
        entityType: "review_request",
        entityId: requestId,
        metadata: {
          projectId: request.projectId,
          subject: request.subject,
        },
      },
    });

    return NextResponse.json({
      success: true,
      request: updatedRequest,
    });
  } catch (error) {
    console.error("Error responding to request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
