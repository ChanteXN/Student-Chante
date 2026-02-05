import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title");

    if (!title) {
      return NextResponse.json(
        { error: "Document title is required" },
        { status: 400 }
      );
    }

    // Find the document by title
    const document = await prisma.knowledgeDocument.findFirst({
      where: {
        title: {
          equals: title,
          mode: 'insensitive',
        },
      },
      include: {
        chunks: {
          orderBy: {
            chunkIndex: 'asc',
          },
        },
      },
    });

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    // Combine all chunks to reconstruct the full document
    const fullContent = document.chunks
      .map((chunk) => chunk.content)
      .join("\n\n");

    return NextResponse.json({
      id: document.id,
      title: document.title,
      type: document.type,
      content: fullContent,
      chunkCount: document.chunks.length,
    });

  } catch (error) {
    console.error("Error fetching document:", error);
    return NextResponse.json(
      { error: "Failed to fetch document" },
      { status: 500 }
    );
  }
}
