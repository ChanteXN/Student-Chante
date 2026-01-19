import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title } = body;

    // Get user's organisation membership
    const membership = await prisma.membership.findFirst({
      where: {
        userId: session.user.id,
        isActive: true,
      },
      include: {
        organisation: true,
      },
    });

    // If user has no organisation, create a default personal one
    let organisationId: string;
    if (!membership) {
      const userEmail = session.user.email || "user";
      const orgName = `${userEmail.split("@")[0]}'s Organisation`;
      
      const newOrg = await prisma.organisation.create({
        data: {
          name: orgName,
          registrationNo: `TEMP-${Date.now()}`,
          sector: "Other",
          address: "To be updated",
        },
      });

      // Create membership
      await prisma.membership.create({
        data: {
          userId: session.user.id,
          organisationId: newOrg.id,
          role: "ADMIN",
          isActive: true,
        },
      });

      organisationId = newOrg.id;
    } else {
      organisationId = membership.organisationId;
    }

    // Create project
    const project = await prisma.project.create({
      data: {
        title: title || "Untitled Project",
        organisationId,
        status: "DRAFT",
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's organisation memberships
    const memberships = await prisma.membership.findMany({
      where: {
        userId: session.user.id,
        isActive: true,
      },
      select: {
        organisationId: true,
      },
    });

    const orgIds = memberships.map((m) => m.organisationId);

    // Get all projects for user's organisations
    const projects = await prisma.project.findMany({
      where: {
        organisationId: {
          in: orgIds,
        },
      },
      include: {
        organisation: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
