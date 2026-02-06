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
      similarityThreshold: 0.2, // 20% - appropriate for semantic similarity
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

/**
 * Analyze evidence gaps for uploaded documents
 */
export async function analyzeEvidenceGaps(
  uploadedCategories: string[]
): Promise<{
  gaps: Array<{
    category: string;
    severity: "high" | "medium" | "low";
    suggestion: string;
  }>;
  recommendations: string[];
}> {
  try {
    const requiredCategories = [
      "RD_PLAN",
      "LITERATURE_SEARCH",
      "TIMESHEETS",
      "EXPERIMENTS",
      "OUTPUTS",
      "FINANCIAL_RECORDS",
    ];

    const categoryLabels: Record<string, string> = {
      RD_PLAN: "R&D Plan",
      LITERATURE_SEARCH: "Literature Search",
      TIMESHEETS: "Timesheets",
      EXPERIMENTS: "Experiments & Test Results",
      OUTPUTS: "Project Outputs",
      FINANCIAL_RECORDS: "Financial Records",
    };

    const missingCategories = requiredCategories.filter(
      (cat) => !uploadedCategories.includes(cat)
    );

    const prompt = `Analyze this R&D project's evidence documentation status:

Uploaded Evidence Categories: ${uploadedCategories.length > 0 ? uploadedCategories.map(c => categoryLabels[c] || c).join(", ") : "None"}
Missing Categories: ${missingCategories.length > 0 ? missingCategories.map(c => categoryLabels[c]).join(", ") : "None"}

For each missing category, provide:
1. Why it's important for R&D Tax Incentive applications
2. Specific suggestions on what to upload

Format your response as:
CATEGORY_NAME (HIGH/MEDIUM/LOW): Specific suggestion about what to upload

Then provide 2-3 general recommendations.`;

    const client = getOpenAI();
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert in R&D Tax Incentive applications. Provide practical, specific guidance on evidence documentation.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.4,
      max_tokens: 600,
    });

    const response = completion.choices[0]?.message?.content || "";
    const lines = response.split("\n").filter((line) => line.trim());

    const gaps: Array<{
      category: string;
      severity: "high" | "medium" | "low";
      suggestion: string;
    }> = [];
    const recommendations: string[] = [];

    for (const line of lines) {
      const gapMatch = line.match(/^(.+?)\s*\((HIGH|MEDIUM|LOW)\):\s*(.+)$/i);
      if (gapMatch) {
        const severityMap: Record<string, "high" | "medium" | "low"> = {
          high: "high",
          medium: "medium",
          low: "low",
        };
        gaps.push({
          category: gapMatch[1].trim(),
          severity: severityMap[gapMatch[2].toLowerCase()] || "medium",
          suggestion: gapMatch[3].trim(),
        });
      } else if (line.match(/^[-*•\d]/)) {
        const rec = line.replace(/^[-*•\d.)\s]+/, "").trim();
        if (rec.length > 10) recommendations.push(rec);
      }
    }

    // Add critical missing categories if AI didn't catch them
    for (const cat of missingCategories) {
      if (!gaps.some((g) => g.category.includes(categoryLabels[cat]))) {
        const severity: "high" | "medium" | "low" = ["RD_PLAN", "EXPERIMENTS", "FINANCIAL_RECORDS"].includes(cat) ? "high" : "medium";
        gaps.push({
          category: categoryLabels[cat],
          severity,
          suggestion: `Upload ${categoryLabels[cat].toLowerCase()} to demonstrate your R&D activities and qualifying expenditure.`,
        });
      }
    }

    return { gaps, recommendations };
  } catch (error) {
    console.error("Error analyzing evidence gaps:", error);
    throw new Error("Failed to analyze evidence gaps");
  }
}

/**
 * Analyze submission risks for a project
 */
export async function analyzeSubmissionRisks(
  projectData: {
    title?: string;
    uncertainty?: string;
    methodology?: string;
    team?: string;
    budget?: string;
    evidenceCount?: number;
  }
): Promise<{
  risks: Array<{
    category: string;
    severity: "critical" | "high" | "medium" | "low";
    issue: string;
    recommendation: string;
  }>;
  overallAssessment: string;
  strengthAreas: string[];
}> {
  try {
    const prompt = `Analyze this R&D Tax Incentive application for potential approval risks:

Project: ${projectData.title || "Untitled"}
Technical Uncertainty: ${projectData.uncertainty ? "Described (" + projectData.uncertainty.substring(0, 100) + "...)" : "Not provided"}
Methodology: ${projectData.methodology ? "Described (" + projectData.methodology.substring(0, 100) + "...)" : "Not provided"}
Team Information: ${projectData.team ? "Provided" : "Not provided"}
Budget: ${projectData.budget ? "Provided" : "Not provided"}
Evidence Files: ${projectData.evidenceCount || 0} uploaded

Identify:
1. Critical risks that could lead to rejection
2. Areas that need strengthening
3. Compliance concerns
4. Missing information

Format each risk as:
CATEGORY (CRITICAL/HIGH/MEDIUM/LOW): Issue description
RECOMMENDATION: Specific action to address the issue

Then provide:
- Overall assessment (2-3 sentences)
- Strength areas (bullet points)`;

    const client = getOpenAI();
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert R&D Tax Incentive reviewer. Identify risks that could lead to application rejection and provide actionable recommendations.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 800,
    });

    const response = completion.choices[0]?.message?.content || "";
    const lines = response.split("\n").filter((line) => line.trim());

    const risks: Array<{ category: string; severity: "critical" | "high" | "medium" | "low"; issue: string; recommendation: string }> = [];
    const strengthAreas: string[] = [];
    let overallAssessment = "";
    let currentRisk: { category: string; severity: "critical" | "high" | "medium" | "low"; issue: string; recommendation: string } | null = null;

    for (const line of lines) {
      const riskMatch = line.match(/^(.+?)\s*\((CRITICAL|HIGH|MEDIUM|LOW)\):\s*(.+)$/i);
      const recMatch = line.match(/^RECOMMENDATION:\s*(.+)$/i);

      if (riskMatch) {
        if (currentRisk) risks.push(currentRisk);
        currentRisk = {
          category: riskMatch[1].trim(),
          severity: riskMatch[2].toLowerCase() as "critical" | "high" | "medium" | "low",
          issue: riskMatch[3].trim(),
          recommendation: "",
        };
      } else if (recMatch && currentRisk) {
        currentRisk.recommendation = recMatch[1].trim();
      } else if (line.toLowerCase().includes("overall") || line.toLowerCase().includes("assessment")) {
        const assessmentStart = lines.indexOf(line);
        overallAssessment = lines
          .slice(assessmentStart + 1, assessmentStart + 4)
          .join(" ")
          .trim();
      } else if (line.match(/^[-*•✓]/)) {
        const strength = line.replace(/^[-*•✓\d.)\s]+/, "").trim();
        if (strength.length > 10 && !strength.toLowerCase().includes("risk")) {
          strengthAreas.push(strength);
        }
      }
    }

    if (currentRisk) risks.push(currentRisk);

    return {
      risks,
      overallAssessment: overallAssessment || "Application requires review before submission.",
      strengthAreas,
    };
  } catch (error) {
    console.error("Error analyzing submission risks:", error);
    throw new Error("Failed to analyze submission risks");
  }
}
