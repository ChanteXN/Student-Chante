/**
 * Text chunking utilities for RAG system
 * Splits documents into optimal chunks for embedding and retrieval
 */

export interface TextChunk {
  content: string;
  chunkIndex: number;
  metadata?: Record<string, unknown>;
}

export interface ChunkingOptions {
  chunkSize?: number; // Target size in characters
  chunkOverlap?: number; // Overlap between chunks
  preserveSentences?: boolean; // Try to keep sentences intact
  preserveParagraphs?: boolean; // Try to keep paragraphs intact
}

const DEFAULT_OPTIONS: Required<ChunkingOptions> = {
  chunkSize: 2000, // ~500 tokens
  chunkOverlap: 200, // ~50 tokens overlap
  preserveSentences: true,
  preserveParagraphs: true,
};

/**
 * Split text into chunks with overlap
 */
export function chunkText(
  text: string,
  options: ChunkingOptions = {}
): TextChunk[] {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const chunks: TextChunk[] = [];

  // Clean and normalize text
  const cleanedText = text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (cleanedText.length === 0) {
    return chunks;
  }

  // If text is smaller than chunk size, return as single chunk
  if (cleanedText.length <= opts.chunkSize) {
    chunks.push({
      content: cleanedText,
      chunkIndex: 0,
    });
    return chunks;
  }

  // Split by paragraphs if requested
  if (opts.preserveParagraphs) {
    return chunkByParagraphs(cleanedText, opts);
  }

  // Split by sentences if requested
  if (opts.preserveSentences) {
    return chunkBySentences(cleanedText, opts);
  }

  // Simple character-based chunking
  return chunkByCharacters(cleanedText, opts);
}

function chunkByParagraphs(
  text: string,
  opts: Required<ChunkingOptions>
): TextChunk[] {
  const chunks: TextChunk[] = [];
  const paragraphs = text.split(/\n\n+/);

  let currentChunk = "";
  let chunkIndex = 0;

  for (const para of paragraphs) {
    const testChunk = currentChunk
      ? `${currentChunk}\n\n${para}`
      : para;

    if (testChunk.length <= opts.chunkSize) {
      currentChunk = testChunk;
    } else {
      // Save current chunk if not empty
      if (currentChunk) {
        chunks.push({
          content: currentChunk.trim(),
          chunkIndex: chunkIndex++,
        });

        // Add overlap from end of previous chunk
        const overlapText = getOverlapText(currentChunk, opts.chunkOverlap);
        currentChunk = overlapText ? `${overlapText}\n\n${para}` : para;
      } else {
        // Paragraph too long, split by sentences
        const sentenceChunks = chunkBySentences(para, opts);
        sentenceChunks.forEach((chunk) => {
          chunks.push({
            ...chunk,
            chunkIndex: chunkIndex++,
          });
        });
        currentChunk = "";
      }
    }
  }

  // Add remaining chunk
  if (currentChunk) {
    chunks.push({
      content: currentChunk.trim(),
      chunkIndex: chunkIndex,
    });
  }

  return chunks;
}

function chunkBySentences(
  text: string,
  opts: Required<ChunkingOptions>
): TextChunk[] {
  const chunks: TextChunk[] = [];
  
  // Split by sentence boundaries
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];

  let currentChunk = "";
  let chunkIndex = 0;

  for (const sentence of sentences) {
    const testChunk = currentChunk
      ? `${currentChunk} ${sentence}`.trim()
      : sentence.trim();

    if (testChunk.length <= opts.chunkSize) {
      currentChunk = testChunk;
    } else {
      // Save current chunk if not empty
      if (currentChunk) {
        chunks.push({
          content: currentChunk.trim(),
          chunkIndex: chunkIndex++,
        });

        // Add overlap from end of previous chunk
        const overlapText = getOverlapText(currentChunk, opts.chunkOverlap);
        currentChunk = overlapText
          ? `${overlapText} ${sentence}`.trim()
          : sentence.trim();
      } else {
        // Single sentence too long, split by characters
        const charChunks = chunkByCharacters(sentence, opts);
        charChunks.forEach((chunk) => {
          chunks.push({
            ...chunk,
            chunkIndex: chunkIndex++,
          });
        });
        currentChunk = "";
      }
    }
  }

  // Add remaining chunk
  if (currentChunk) {
    chunks.push({
      content: currentChunk.trim(),
      chunkIndex: chunkIndex,
    });
  }

  return chunks;
}

function chunkByCharacters(
  text: string,
  opts: Required<ChunkingOptions>
): TextChunk[] {
  const chunks: TextChunk[] = [];
  let chunkIndex = 0;
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + opts.chunkSize, text.length);
    const chunk = text.slice(start, end);

    chunks.push({
      content: chunk.trim(),
      chunkIndex: chunkIndex++,
    });

    start = end - opts.chunkOverlap;
    if (start >= text.length) break;
  }

  return chunks;
}

function getOverlapText(text: string, overlapSize: number): string {
  if (text.length <= overlapSize) {
    return text;
  }

  // Try to overlap at sentence boundary
  const endPart = text.slice(-overlapSize * 2);
  const lastSentence = endPart.match(/[.!?]\s+(.+)$/);

  if (lastSentence && lastSentence[1]) {
    return lastSentence[1].trim();
  }

  // Fallback to character overlap
  return text.slice(-overlapSize).trim();
}

/**
 * Extract metadata from text (page numbers, sections, etc.)
 */
export function extractMetadata(
  text: string,
  chunkIndex: number
): Record<string, string | number> {
  const metadata: Record<string, string | number> = {
    chunkIndex,
    characterCount: text.length,
    wordCount: text.split(/\s+/).length,
  };

  // Try to extract page numbers
  const pageMatch = text.match(/page\s+(\d+)/i);
  if (pageMatch) {
    metadata.pageNumber = parseInt(pageMatch[1], 10);
  }

  // Try to extract section headers
  const sectionMatch = text.match(/^#{1,6}\s+(.+)$/m) || text.match(/^(.+)\n[=-]+$/m);
  if (sectionMatch) {
    metadata.section = sectionMatch[1].trim();
  }

  return metadata;
}
