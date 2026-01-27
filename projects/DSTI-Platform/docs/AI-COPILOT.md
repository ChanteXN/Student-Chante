# AI Co-Pilot System - R&D Tax Incentive Platform

## Overview

The AI Co-Pilot is a Retrieval-Augmented Generation (RAG) system that helps applicants navigate the R&D Tax Incentive programme (Section 11D). It provides **compliance guidance only** - not tax advice.

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                  User Interface                      │
│  (Portal Dashboard, Project Builder, Chat Widget)   │
└─────────────────┬───────────────────────────────────┘
                  │
                  │ API Requests
                  ▼
┌─────────────────────────────────────────────────────┐
│                 API Endpoints                        │
│  /api/ai/ask         - Answer questions              │
│  /api/ai/improve     - Improve application text      │
│  /api/ai/detect-gaps - Find missing evidence         │
└─────────────────┬───────────────────────────────────┘
                  │
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│              RAG Pipeline                            │
│                                                       │
│  1. Query Embedding  (OpenAI text-embedding-3-small) │
│  2. Vector Search    (Cosine similarity)             │
│  3. Context Retrieval (Top-K relevant chunks)        │
│  4. LLM Generation   (GPT-4o-mini with guardrails)   │
└─────────────────┬───────────────────────────────────┘
                  │
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│            Knowledge Base (PostgreSQL)               │
│                                                       │
│  - KnowledgeDocument (PDFs, articles, FAQs)          │
│  - DocumentChunk (2000 char chunks with overlap)     │
│  - Embeddings (1536-dim vectors as JSON)             │
│  - AIConversation (Query history and tracking)       │
└─────────────────────────────────────────────────────┘
```

## Components

### 1. Document Ingestion (`lib/ai/ingestion.ts`)

Processes guideline documents and converts them into searchable chunks:

- **PDF Ingestion**: Extract text from PDF files using `pdf-parse`
- **Text Chunking**: Split documents into ~500-token chunks with 50-token overlap
- **Embedding Generation**: Create vector embeddings using OpenAI
- **Database Storage**: Save chunks and embeddings to PostgreSQL

### 2. Text Processing (`lib/ai/text-chunker.ts`)

Intelligent text chunking that:
- Preserves paragraph and sentence boundaries
- Maintains context with overlapping chunks
- Extracts metadata (page numbers, sections)
- Handles various document formats

### 3. Semantic Retrieval (`lib/ai/retrieval.ts`)

Finds relevant information using:
- **Semantic Search**: Vector similarity (cosine distance)
- **Keyword Search**: Fallback for exact matches
- **Hybrid Search**: Combines both approaches
- **Filtering**: By document type, similarity threshold

### 4. AI Response Generation (`lib/ai/chat.ts`)

Generates responses with strict guardrails:

**What it CAN do:**
✅ Explain programme rules and requirements
✅ Clarify R&D definitions and eligibility
✅ Describe documentation needs
✅ Provide application guidance
✅ Suggest quality improvements

**What it CANNOT do:**
❌ Provide tax advice or calculate savings
❌ Guarantee approval outcomes
❌ Suggest tax minimization strategies
❌ Give legal advice
❌ Help with fraudulent activities

### 5. API Endpoints

#### POST `/api/ai/ask`
Ask questions about the R&D Tax Incentive programme.

**Request:**
```json
{
  "query": "What qualifies as R&D under Section 11D?",
  "projectId": "optional-project-id"
}
```

**Response:**
```json
{
  "answer": "According to Section 11D, R&D must involve...",
  "sources": [
    {
      "title": "R&D Tax Incentive Overview",
      "type": "GUIDELINE_PDF",
      "similarity": 92,
      "excerpt": "The Research and Development..."
    }
  ]
}
```

#### POST `/api/ai/improve`
Improve application text quality.

**Request:**
```json
{
  "text": "We want to make a better product",
  "context": "research objectives"
}
```

**Response:**
```json
{
  "originalText": "We want to make a better product",
  "improvedText": "Our research objectives are to develop..."
}
```

#### POST `/api/ai/detect-gaps`
Detect missing evidence in project description.

**Request:**
```json
{
  "projectDescription": "We are developing a new solar panel..."
}
```

**Response:**
```json
{
  "missingItems": [
    "Literature review on current solar panel efficiency",
    "Patent search results",
    "Detailed methodology for testing",
    "Technical team qualifications"
  ],
  "count": 4
}
```

## Setup

### 1. Install Dependencies

```bash
npm install openai pdf-parse --legacy-peer-deps
```

### 2. Configure Environment

Add to `.env`:
```env
OPENAI_API_KEY=sk-your-actual-api-key-here
```

### 3. Update Database Schema

```bash
npm run db:push
```

This adds the following tables:
- `knowledge_documents`
- `document_chunks`
- `ai_conversations`

### 4. Ingest Knowledge Base

```bash
npm run ai:ingest
```

This will:
1. Load sample R&D Tax Incentive content
2. Chunk the documents
3. Generate embeddings
4. Store in database

Expected output:
```
🚀 Starting Knowledge Base Ingestion

✅ OpenAI API key configured
📥 Ingesting sample knowledge base content...

Processing: R&D Tax Incentive Overview - Section 11D
✅ Success! Created 87 chunks

Processing: Common R&D Scenarios - What Qualifies
✅ Success! Created 45 chunks

Processing: Application Readiness Checklist
✅ Success! Created 62 chunks

📊 INGESTION SUMMARY
✅ Successful: 3
📦 Total chunks: 194

🎉 KNOWLEDGE BASE READY!
```

### 5. Test the System

```bash
npm run ai:test
```

This runs comprehensive tests:
- Semantic retrieval
- AI responses to sample questions
- Text improvement
- Missing evidence detection
- Guardrail validation

## Usage in Application

### In React Components

```typescript
import { useState } from "react";

export function AIChatWidget() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const askQuestion = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();
      setResponse(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask about R&D Tax Incentive..."
      />
      <button onClick={askQuestion} disabled={loading}>
        {loading ? "Thinking..." : "Ask"}
      </button>

      {response && (
        <div>
          <p>{response.answer}</p>
          <h4>Sources:</h4>
          <ul>
            {response.sources.map((source: any, i: number) => (
              <li key={i}>{source.title} ({source.similarity}% match)</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

## Knowledge Base Content

### Current Content (Sample)

1. **R&D Tax Incentive Overview - Section 11D**
   - Programme objectives
   - Eligibility requirements
   - Application process
   - Qualifying expenditure
   - Documentation requirements

2. **Common R&D Scenarios**
   - Manufacturing examples
   - Software development
   - Agricultural research
   - Pharmaceutical development
   - Energy sector innovations

3. **Application Readiness Checklist**
   - Company information
   - Project description
   - Team and budget
   - Documentation
   - Compliance

### Adding New Content

#### From PDF:
```typescript
import { ingestPDF } from "@/lib/ai/ingestion";

await ingestPDF(
  "/path/to/document.pdf",
  "Document Title",
  "GUIDELINE_PDF",
  "https://source-url.com"
);
```

#### From Text:
```typescript
import { ingestText } from "@/lib/ai/ingestion";

await ingestText(
  "Article Title",
  "Article content goes here...",
  "HELP_ARTICLE",
  "https://source-url.com"
);
```

## System Prompts and Guardrails

### Main System Prompt

The AI is instructed to:
- Provide compliance guidance only
- Base answers on knowledge base content only
- Never give tax advice or guarantees
- Cite sources for all answers
- Suggest contacting DSTI when uncertain

### Disallowed Patterns

Queries are blocked if they match:
- Tax savings calculations
- Approval guarantees
- Tax minimization strategies
- Fraudulent activities
- Legal advice requests

### Refusal Messages

When blocked, users receive clear explanations:
- Why the request cannot be fulfilled
- What the AI can help with instead
- Who to contact for that type of help

## Performance Considerations

### Embedding Generation
- Uses OpenAI `text-embedding-3-small` (1536 dimensions)
- Batch processing: 20 chunks at a time
- Rate limiting: Built into OpenAI SDK

### Database Storage
- Embeddings stored as JSON strings
- Indexed by document ID and chunk index
- Cosine similarity calculated in application layer

### Response Times
- Query embedding: ~200ms
- Vector search: ~100ms (194 chunks)
- LLM generation: ~2-5s
- **Total**: ~3-6 seconds per query

### Optimization Opportunities (Phase 2)
- Move to pgvector extension for faster similarity search
- Cache common queries
- Implement streaming responses
- Add response quality ratings

## Costs (OpenAI)

### Embedding Generation
- Model: `text-embedding-3-small`
- Cost: $0.00002 per 1K tokens
- Knowledge base (194 chunks): ~$0.01

### Response Generation
- Model: `gpt-4o-mini`
- Input: $0.150 per 1M tokens
- Output: $0.600 per 1M tokens
- Average query cost: ~$0.001

### Monthly Estimates
- 1,000 queries/month: ~$1
- 10,000 queries/month: ~$10
- Very affordable for MVP scale

## Monitoring and Logging

### Conversation Tracking
```typescript
// Uncomment in lib/ai/chat.ts to enable
await prisma.aIConversation.create({
  data: {
    userId,
    projectId,
    query,
    response: answer,
    context: { sources },
  },
});
```

### Metrics to Track
- Query response time
- Source relevance (similarity scores)
- User satisfaction (thumbs up/down)
- Most common questions
- Guardrail trigger frequency

## Troubleshooting

### "OpenAI API key not set"
Add your key to `.env`:
```env
OPENAI_API_KEY=sk-...
```

### "Knowledge base is empty"
Run ingestion script:
```bash
npm run ai:ingest
```

### "No relevant chunks found"
- Check similarity threshold (default 0.7)
- Verify knowledge base has related content
- Try lowering threshold in retrieval options

### Slow responses
- Check OpenAI API status
- Reduce `topK` parameter (default 5)
- Consider caching common queries

## Next Steps (Day 12-13)

1. **Create UI Components**
   - Chat widget for portal
   - Inline help buttons in wizard
   - Evidence gap indicators
   - Text improvement modal

2. **Integration Points**
   - Project Builder: Inline suggestions
   - Evidence Vault: Missing item detection
   - Readiness Score: AI-powered analysis
   - Preview: Quality check

3. **Enhanced Features**
   - Multi-turn conversations
   - Context awareness (current project)
   - Personalized suggestions
   - Learning from feedback

## Resources

- [OpenAI Embeddings Guide](https://platform.openai.com/docs/guides/embeddings)
- [RAG Best Practices](https://www.pinecone.io/learn/retrieval-augmented-generation/)
- [Prompt Engineering](https://platform.openai.com/docs/guides/prompt-engineering)

---

**Day 11 Complete** ✅
- Vector database configured
- Document ingestion pipeline built
- RAG retrieval system implemented
- API endpoints created
- Knowledge base populated
- Testing framework ready

**Next**: Day 12 - AI Co-Pilot UI Integration
