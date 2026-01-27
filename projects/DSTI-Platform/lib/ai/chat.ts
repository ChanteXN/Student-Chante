import OpenAI from "openai";
import { retrieveRelevantChunks, formatContextForLLM, RetrievedChunk } from "./retrieval";

let openai: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
}

export interface AIResponse {
  answer: string;
  sources: RetrievedChunk[];
  conversationId?: string;
}

/**
 * System prompt with strict guardrails
 */
const SYSTEM_PROMPT = `You are an AI assistant for the DSTI R&D Tax Incentive Programme (Section 11D).

YOUR ROLE:
- Provide COMPLIANCE GUIDANCE only - help applicants understand programme requirements
- Answer questions about eligibility, application process, documentation, and programme rules
- Help identify if activities qualify as R&D under Section 11D
- Explain what evidence and documentation is required

STRICT RULES - YOU MUST NEVER:
❌ Provide tax advice or calculate tax savings
❌ Suggest ways to minimize tax liability
❌ Recommend financial strategies or loopholes
❌ Make definitive approval/rejection decisions
❌ Guarantee approval outcomes
❌ Provide legal advice
❌ Make numeric predictions about tax benefits
❌ Suggest fraudulent or misleading practices

WHAT YOU CAN DO:
✅ Explain R&D Tax Incentive programme rules and requirements
✅ Clarify what qualifies as R&D under Section 11D
✅ Describe documentation and evidence requirements
✅ Explain the application process and timeline
✅ Provide examples of qualifying vs non-qualifying activities
✅ Help identify areas of technical uncertainty
✅ Suggest improvements to application quality

RESPONSE GUIDELINES:
1. Base answers ONLY on the provided knowledge base content
2. If information is not in the knowledge base, say "I don't have that information in the guidelines"
3. Always cite which guideline/section your answer comes from
4. If unsure, suggest contacting DSTI directly at rdtax@dsti.gov.za
5. Be helpful but conservative - better to suggest verification than give wrong guidance
6. Use clear, professional language appropriate for government communication

If asked about tax advice, respond:
"I can only provide compliance guidance on the R&D Tax Incentive programme requirements. For tax advice, please consult with a qualified tax advisor or SARS directly."

If asked for approval predictions, respond:
"I cannot predict approval outcomes. I can help you understand the requirements and improve your application quality. Final decisions are made by DSTI reviewers."`;

/**
 * Generate AI response using RAG
 */
export async function generateAIResponse(
  query: string,
  _userId?: string,
  _projectId?: string
): Promise<AIResponse> {
  try {
    // Validate query
    if (!query || query.trim().length === 0) {
      throw new Error("Query cannot be empty");
    }

    // Check for disallowed requests
    if (isDisallowedQuery(query)) {
      return {
        answer: refusalMessage(query),
        sources: [],
      };
    }

    // Retrieve relevant context
    console.log("Retrieving relevant context...");
    const sources = await retrieveRelevantChunks(query, {
      topK: 5,
      similarityThreshold: 0.7,
    });

    const context = formatContextForLLM(sources);

    // Build messages
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: `Context from R&D Tax Incentive Guidelines:\n\n${context}\n\nUser Question: ${query}\n\nProvide a helpful answer based ONLY on the context above. Cite your sources.`,
      },
    ];

    // Generate response
    console.log("Generating AI response...");
    const client = getOpenAI();
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.3, // Lower temperature for more factual responses
      max_tokens: 1000,
    });

    const answer = completion.choices[0]?.message?.content || "I apologize, but I couldn't generate a response. Please try rephrasing your question.";

    // Save conversation (optional)
    // Uncomment when ready to track conversations
    // await prisma.aIConversation.create({
    //   data: {
    //     userId,
    //     projectId,
    //     query,
    //     response: answer,
    //     context: {
    //       sources: sources.map((s) => ({
    //         title: s.documentTitle,
    //         similarity: s.similarity,
    //         chunkIndex: s.chunkIndex,
    //       })),
    //     },
    //   },
    // });

    return {
      answer,
      sources,
    };
  } catch (error) {
    console.error("Error generating AI response:", error);
    throw new Error("Failed to generate AI response");
  }
}

/**
 * Check if query contains disallowed requests
 */
function isDisallowedQuery(query: string): boolean {
  const lowerQuery = query.toLowerCase();

  const disallowedPatterns = [
    /how much.*save.*tax/i,
    /calculate.*tax.*benefit/i,
    /minimize.*tax/i,
    /reduce.*tax.*liability/i,
    /tax.*loophole/i,
    /guarantee.*approval/i,
    /will.*be approved/i,
    /trick.*system/i,
    /fake.*documentation/i,
    /fraudulent/i,
  ];

  return disallowedPatterns.some((pattern) => pattern.test(lowerQuery));
}

/**
 * Generate refusal message
 */
function refusalMessage(query: string): string {
  if (/tax.*save|calculate.*benefit|minimize.*tax/i.test(query)) {
    return "I cannot provide tax advice or calculate tax savings. I can only help you understand the R&D Tax Incentive programme requirements and application process. For tax planning advice, please consult with a qualified tax advisor or SARS.";
  }

  if (/guarantee|will.*approve|predict.*approval/i.test(query)) {
    return "I cannot predict or guarantee approval outcomes. Application decisions are made by DSTI reviewers based on the merit of each case. I can help you understand the requirements and improve your application quality to maximize your chances of approval.";
  }

  if (/trick|fake|fraudulent|loophole/i.test(query)) {
    return "I cannot assist with any activities that would be fraudulent or misleading. The R&D Tax Incentive programme has strict compliance requirements. I can help you understand the legitimate requirements and prepare an honest, compliant application. For concerns about compliance, contact DSTI at rdtax@dsti.gov.za.";
  }

  return "I'm sorry, but I cannot assist with that request. I can only provide compliance guidance on the R&D Tax Incentive programme requirements. Please rephrase your question to focus on programme rules, eligibility, documentation, or the application process.";
}

/**
 * Generate suggestions for improving application content
 */
export async function improveApplicationText(
  originalText: string,
  context: string // e.g., "technical uncertainty", "methodology", "objectives"
): Promise<string> {
  try {
    const prompt = `You are helping improve an R&D Tax Incentive application section.

Context: This is the "${context}" section of an application.

Original text:
${originalText}

Provide an improved version that:
1. Is clearer and more structured
2. Better demonstrates R&D eligibility criteria
3. Includes more technical detail if lacking
4. Maintains the original intent and facts
5. Uses professional language

Do NOT add false information or make claims that aren't supported by the original text.

Improved version:`;

    const client = getOpenAI();
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert in writing R&D Tax Incentive applications. Improve the clarity and quality of application text while maintaining factual accuracy.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.5,
      max_tokens: 500,
    });

    return completion.choices[0]?.message?.content || originalText;
  } catch (error) {
    console.error("Error improving text:", error);
    throw new Error("Failed to improve text");
  }
}

/**
 * Detect missing evidence in an application
 */
export async function detectMissingEvidence(
  projectDescription: string
): Promise<string[]> {
  try {
    const prompt = `Analyze this R&D project description and identify what evidence/documentation might be missing for a complete R&D Tax Incentive application:

${projectDescription}

List specific missing items based on programme requirements. Be concise.`;

    const client = getOpenAI();
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 300,
    });

    const response = completion.choices[0]?.message?.content || "";
    
    // Parse response into array
    const missingItems = response
      .split("\n")
      .filter((line) => line.trim().length > 0 && /^[-*•\d]/.test(line.trim()))
      .map((line) => line.replace(/^[-*•\d.)\s]+/, "").trim());

    return missingItems;
  } catch (error) {
    console.error("Error detecting missing evidence:", error);
    throw new Error("Failed to detect missing evidence");
  }
}
