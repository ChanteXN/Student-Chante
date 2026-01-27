import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { put, del } from "@vercel/blob";

// GET - List all evidence files for a project
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

    // Get all evidence files for this project
    const evidenceFiles = await prisma.evidenceFile.findMany({
      where: { projectId: id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(evidenceFiles);
  } catch (error) {
    console.error("Error fetching evidence files:", error);
    return NextResponse.json(
      { error: "Failed to fetch evidence files" },
      { status: 500 }
    );
  }
}

// POST - Upload a new evidence file
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: projectId } = await params;

    // Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const category = formData.get("category") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!category) {
      return NextResponse.json(
        { error: "Invalid or missing category" },
        { status: 400 }
      );
    }

    // Validate category against allowed values
    const validCategories = [
      "RD_PLAN",
      "LITERATURE_SEARCH",
      "TIMESHEETS",
      "EXPERIMENTS",
      "OUTPUTS",
      "FINANCIAL_RECORDS",
      "OTHER",
    ];
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: "Invalid category" },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB for MVP)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size exceeds 10MB limit" },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const uniqueFileName = `evidence/${projectId}/${timestamp}_${sanitizedFileName}`;

    // Upload to Vercel Blob Storage
    const blob = await put(uniqueFileName, file, {
      access: "public",
      addRandomSuffix: false,
    });

    // Store file metadata in database
    const evidenceFile = await prisma.evidenceFile.create({
      data: {
        projectId,
        category: category as never,
        fileName: file.name,
        fileSize: file.size,
        filePath: blob.url, // Store the blob URL instead of local path
        mimeType: file.type,
        uploadedBy: session.user.id,
      },
    });

    return NextResponse.json(evidenceFile, { status: 201 });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}

// DELETE - Delete an evidence file
export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get("fileId");

    if (!fileId) {
      return NextResponse.json(
        { error: "File ID is required" },
        { status: 400 }
      );
    }

    // Get file info before deleting
    const evidenceFile = await prisma.evidenceFile.findUnique({
      where: { id: fileId },
    });

    if (!evidenceFile) {
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      );
    }

    // Delete from Vercel Blob Storage
    try {
      await del(evidenceFile.filePath);
    } catch (error) {
      console.error("Error deleting blob file:", error);
      // Continue with database deletion even if blob deletion fails
    }

    // Delete from database
    await prisma.evidenceFile.delete({
      where: { id: fileId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting evidence file:", error);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
}
