// Lazy load pdf-parse only when needed to avoid Node.js compatibility issues
type PdfParseFunction = (dataBuffer: Buffer) => Promise<{ text: string; numpages: number }>;
let pdfParse: PdfParseFunction | null = null;
async function getPdfParse() {
  if (!pdfParse) {
    // @ts-expect-error - pdf-parse has export issues with ESM
    pdfParse = (await import("pdf-parse")).default;
  }
  return pdfParse;
}

import { readFile } from "fs/promises";
import { prisma } from "@/lib/prisma";
import { chunkText, extractMetadata } from "@/lib/ai/text-chunker";
import { generateEmbeddings } from "@/lib/ai/embeddings";

export interface IngestionResult {
  documentId: string;
  title: string;
  chunkCount: number;
  success: boolean;
  error?: string;
}

/**
 * Ingest a PDF file into the knowledge base
 */
export async function ingestPDF(
  filePath: string,
  title: string,
  type: "GUIDELINE_PDF" | "HELP_ARTICLE" | "FAQ" | "EXAMPLE" | "POLICY" = "GUIDELINE_PDF",
  sourceUrl?: string
): Promise<IngestionResult> {
  try {
    console.log(`Starting ingestion of: ${title}`);

    // Lazy load pdf-parse to avoid Node.js compatibility issues
    const pdfParser = await getPdfParse();
    if (!pdfParser) {
      throw new Error("Failed to load PDF parser");
    }

    // Read PDF file
    const dataBuffer = await readFile(filePath);
    const pdfData = await pdfParser(dataBuffer);

    const fullText = pdfData.text;
    console.log(`Extracted ${fullText.length} characters from PDF`);

    // Clean text
    const cleanedText = cleanText(fullText);

    // Create document record
    const document = await prisma.knowledgeDocument.create({
      data: {
        title,
        type,
        sourceUrl,
        filePath,
        content: cleanedText,
        metadata: {
          pageCount: pdfData.numpages,
          extractedAt: new Date().toISOString(),
        },
      },
    });

    console.log(`Created document record: ${document.id}`);

    // Chunk the text
    const chunks = chunkText(cleanedText, {
      chunkSize: 2000,
      chunkOverlap: 200,
      preserveParagraphs: true,
      preserveSentences: true,
    });

    console.log(`Split into ${chunks.length} chunks`);

    // Generate embeddings in batches
    const batchSize = 20;

    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize);
      const texts = batch.map((chunk) => chunk.content);

      console.log(
        `Generating embeddings for chunks ${i + 1} to ${i + batch.length}...`
      );

      const embeddings = await generateEmbeddings(texts);

      // Save chunks with embeddings
      await prisma.$transaction(
        batch.map((chunk, batchIndex) => {
          const embedding = embeddings[batchIndex];
          const metadata = extractMetadata(chunk.content, chunk.chunkIndex);

          return prisma.documentChunk.create({
            data: {
              documentId: document.id,
              chunkIndex: chunk.chunkIndex,
              content: chunk.content,
              embedding: JSON.stringify(embedding),
              metadata: metadata as Record<string, string | number>,
            },
          });
        })
      );
    }

    // Update document with chunk count
    await prisma.knowledgeDocument.update({
      where: { id: document.id },
      data: { chunkCount: chunks.length },
    });

    console.log(`✅ Successfully ingested: ${title}`);

    return {
      documentId: document.id,
      title,
      chunkCount: chunks.length,
      success: true,
    };
  } catch (error) {
    console.error(`❌ Error ingesting PDF:`, error);
    return {
      documentId: "",
      title,
      chunkCount: 0,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Ingest plain text content into the knowledge base
 */
export async function ingestText(
  title: string,
  content: string,
  type: "HELP_ARTICLE" | "FAQ" | "EXAMPLE" = "HELP_ARTICLE",
  sourceUrl?: string
): Promise<IngestionResult> {
  try {
    console.log(`Starting ingestion of text: ${title}`);

    const cleanedText = cleanText(content);

    // Create document record
    const document = await prisma.knowledgeDocument.create({
      data: {
        title,
        type,
        sourceUrl,
        content: cleanedText,
        metadata: {
          extractedAt: new Date().toISOString(),
        },
      },
    });

    // Chunk the text
    const chunks = chunkText(cleanedText, {
      chunkSize: 2000,
      chunkOverlap: 200,
      preserveParagraphs: true,
    });

    console.log(`Split into ${chunks.length} chunks`);

    // Generate embeddings in batches
    const batchSize = 20;


    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize);
      const texts = batch.map((chunk) => chunk.content);

      const embeddings = await generateEmbeddings(texts);

      await prisma.$transaction(
        batch.map((chunk, batchIndex) => {
          const embedding = embeddings[batchIndex];
          const metadata = extractMetadata(chunk.content, chunk.chunkIndex);

          return prisma.documentChunk.create({
            data: {
              documentId: document.id,
              chunkIndex: chunk.chunkIndex,
              content: chunk.content,
              embedding: JSON.stringify(embedding),
              metadata: metadata as Record<string, string | number>,
            },
          });
        })
      );
    }

    // Update document with chunk count
    await prisma.knowledgeDocument.update({
      where: { id: document.id },
      data: { chunkCount: chunks.length },
    });

    console.log(`✅ Successfully ingested text: ${title}`);

    return {
      documentId: document.id,
      title,
      chunkCount: chunks.length,
      success: true,
    };
  } catch (error) {
    console.error(`❌ Error ingesting text:`, error);
    return {
      documentId: "",
      title,
      chunkCount: 0,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Clean and normalize text
 */
function cleanText(text: string): string {
  return (
    text
      // Remove excessive whitespace
      .replace(/\s+/g, " ")
      // Remove form feed characters
      .replace(/\f/g, "")
      // Normalize line breaks
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      // Remove excessive line breaks
      .replace(/\n{3,}/g, "\n\n")
      // Trim
      .trim()
  );
}

/**
 * Delete a document and all its chunks
 */
export async function deleteDocument(documentId: string): Promise<boolean> {
  try {
    await prisma.knowledgeDocument.delete({
      where: { id: documentId },
    });
    return true;
  } catch (error) {
    console.error("Error deleting document:", error);
    return false;
  }
}

/**
 * List all documents in the knowledge base
 */
export async function listDocuments() {
  return prisma.knowledgeDocument.findMany({
    select: {
      id: true,
      title: true,
      type: true,
      sourceUrl: true,
      chunkCount: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
