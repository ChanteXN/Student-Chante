import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { renderToStream } from "@react-pdf/renderer";
import { ApplicationPackPDF } from "@/components/application-pack-pdf";
import React from "react";

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

    // Fetch project with all data
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        sections: true,
        evidenceFiles: true,
        organisation: true,
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Only allow downloading submitted projects
    if (project.status === "DRAFT") {
      return NextResponse.json(
        { error: "Cannot download draft applications" },
        { status: 400 }
      );
    }

    // Parse section data (handle JSON string or object)
    const sectionsWithParsedData = project.sections.map(section => ({
      ...section,
      sectionData:
        typeof section.sectionData === "string"
          ? JSON.parse(section.sectionData)
          : section.sectionData,
    }));

    // Prepare project data for PDF (with type assertion for caseReference)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const projectAny = project as any;
    const projectData = {
      ...project,
      caseReference: projectAny.caseReference || undefined,
      submittedAt: project.submittedAt?.toISOString() || undefined,
      sections: sectionsWithParsedData,
      startDate: project.startDate?.toISOString() || null,
      endDate: project.endDate?.toISOString() || null,
    };

    // Generate PDF using React.createElement to avoid JSX
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfElement = React.createElement(ApplicationPackPDF, { project: projectData } as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const stream = await renderToStream(pdfElement as any);

    // Set response headers for PDF download
    const caseRef = projectAny.caseReference || project.id;
    const filename = `DSTI-Application-${caseRef}.pdf`;
    
    return new NextResponse(stream as unknown as ReadableStream, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
