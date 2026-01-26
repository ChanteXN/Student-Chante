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
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        organisation: true,
        sections: true,
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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { sectionKey, sectionData, ...projectData } = body;

    console.log("PATCH request for project:", id);
    console.log("Project data to update:", projectData);
    console.log("Section key:", sectionKey);

    // Update project fields
    if (Object.keys(projectData).length > 0) {
      await prisma.project.update({
        where: { id },
        data: projectData,
      });
    }

    // Update section data if provided
    if (sectionKey && sectionData) {
      await prisma.projectSection.upsert({
        where: {
          projectId_sectionKey: {
            projectId: id,
            sectionKey,
          },
        },
        create: {
          projectId: id,
          sectionKey,
          sectionData,
        },
        update: {
          sectionData,
          updatedAt: new Date(),
        },
      });
    }

    // Fetch updated project
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        sections: true,
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Verify project exists and get its status
    const project = await prisma.project.findUnique({
      where: { id },
      select: { status: true, organisationId: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Only allow deletion of draft projects
    if (project.status !== "DRAFT") {
      return NextResponse.json(
        { error: "Only draft projects can be deleted" },
        { status: 403 }
      );
    }

    // Delete project (sections will cascade delete automatically)
    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting project:", error);
    
    // Provide more specific error message
    const errorMessage = error instanceof Error ? error.message : "Failed to delete project";
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
