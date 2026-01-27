/**
 * AI Guardrails Configuration
 * Ensures AI provides compliance guidance only, never tax advice
 */

// Topics that should trigger refusal
export const FORBIDDEN_TOPICS = [
  // Tax calculations and financial advice
  "how much tax will i save",
  "calculate my tax benefit",
  "what's my tax refund",
  "how much money will i get back",
  "roi on claiming",
  "return on investment",
  "tax savings calculator",
  "how much can i claim",
  "maximum claimable amount",
  
  // Loopholes and gaming the system
  "loophole",
  "workaround",
  "get around the rules",
  "bypass requirements",
  "fake evidence",
  "inflate costs",
  "exaggerate",
  "what sars won't check",
  "won't get caught",
  
  // Specific financial projections
  "guarantee approval",
  "guaranteed to be approved",
  "definitely qualify",
  "100% eligible",
  "cannot be rejected",
  
  // Tax planning/optimization
  "minimize tax",
  "reduce tax liability",
  "tax optimization",
  "tax planning strategy",
  "shift expenses",
  "allocate costs to",
] as const;

// Warning phrases that indicate borderline content
export const WARNING_PHRASES = [
  "R ",
  "rand",
  "ZAR",
  "tax credit",
  "tax deduction",
  "percentage",
  "%",
  "claim amount",
] as const;

// Refusal messages for different scenarios
export const REFUSAL_MESSAGES = {
  taxAdvice: {
    message: "I cannot provide tax advice or calculate potential savings.",
    suggestion: "I can help you understand R&D eligibility criteria, documentation requirements, and how to structure your application. For tax calculations, please consult with a registered tax practitioner or SARS.",
  },
  loopholes: {
    message: "I cannot suggest ways to circumvent programme requirements.",
    suggestion: "I can help you understand the genuine R&D requirements and how to document legitimate research activities that qualify under Section 11D.",
  },
  financialProjections: {
    message: "I cannot guarantee approval or predict specific financial outcomes.",
    suggestion: "I can help you assess whether your project activities meet the technical R&D criteria and guide you on strengthening your application.",
  },
  inappropriate: {
    message: "I cannot assist with that type of request.",
    suggestion: "I'm here to help you understand DSTI's R&D Tax Incentive requirements and guide you through the application process. Please ask about eligibility, documentation, or application best practices.",
  },
} as const;

// Allowed response categories
export const ALLOWED_TOPICS = [
  "eligibility_criteria",
  "documentation_requirements",
  "application_process",
  "evidence_types",
  "project_structure",
  "methodology_guidance",
  "compliance_rules",
  "submission_timeline",
  "progress_reporting",
  "general_r&d_definition",
] as const;

/**
 * Check if a query contains forbidden content
 */
export function containsForbiddenContent(query: string): {
  isForbidden: boolean;
  category?: keyof typeof REFUSAL_MESSAGES;
  matchedTerm?: string;
} {
  const lowerQuery = query.toLowerCase();

  // Check for tax advice requests
  const taxTerms = [
    "how much tax",
    "calculate",
    "tax benefit",
    "tax refund",
    "money will i get",
    "savings",
    "claim amount",
  ];
  for (const term of taxTerms) {
    if (lowerQuery.includes(term)) {
      return { isForbidden: true, category: "taxAdvice", matchedTerm: term };
    }
  }

  // Check for loophole requests
  const loopholeTerms = ["loophole", "workaround", "get around", "bypass", "fake", "inflate"];
  for (const term of loopholeTerms) {
    if (lowerQuery.includes(term)) {
      return { isForbidden: true, category: "loopholes", matchedTerm: term };
    }
  }

  // Check for guarantee/projection requests
  const guaranteeTerms = ["guarantee", "definitely qualify", "100%", "cannot be rejected"];
  for (const term of guaranteeTerms) {
    if (lowerQuery.includes(term)) {
      return { isForbidden: true, category: "financialProjections", matchedTerm: term };
    }
  }

  return { isForbidden: false };
}

/**
 * Check if a response contains inappropriate content
 */
export function scanResponseForViolations(response: string): {
  hasViolation: boolean;
  violations: string[];
  severity: "high" | "medium" | "low";
} {
  const violations: string[] = [];
  const lowerResponse = response.toLowerCase();

  // High severity: Specific monetary amounts or percentages
  const moneyPatterns = [
    /r\s*\d+/gi, // R 100, R100
    /\d+\s*rand/gi, // 100 rand
    /zar\s*\d+/gi, // ZAR 100
    /\d+\s*%/g, // 150%
    /save\s+r\s*\d+/gi, // save R 1000
    /claim\s+r\s*\d+/gi, // claim R 5000
  ];

  for (const pattern of moneyPatterns) {
    if (pattern.test(response)) {
      violations.push(`Contains specific monetary amount or percentage: ${pattern.source}`);
    }
  }

  // Medium severity: Tax advice language
  const taxAdviceTerms = [
    "you will save",
    "your tax credit will be",
    "you can deduct",
    "reduce your tax by",
    "tax benefit of",
    "claim back",
    "refund of",
  ];

  for (const term of taxAdviceTerms) {
    if (lowerResponse.includes(term)) {
      violations.push(`Contains tax advice language: "${term}"`);
    }
  }

  // Medium severity: Guarantees
  const guaranteeTerms = [
    "guaranteed to be approved",
    "definitely qualify",
    "will be accepted",
    "cannot be rejected",
    "sars will approve",
  ];

  for (const term of guaranteeTerms) {
    if (lowerResponse.includes(term)) {
      violations.push(`Contains inappropriate guarantee: "${term}"`);
    }
  }

  // Determine severity
  let severity: "high" | "medium" | "low" = "low";
  if (violations.length > 0) {
    severity = violations.some((v) => v.includes("monetary amount") || v.includes("percentage"))
      ? "high"
      : "medium";
  }

  return {
    hasViolation: violations.length > 0,
    violations,
    severity,
  };
}

/**
 * System prompts for different AI endpoints
 */
export const SYSTEM_PROMPTS = {
  ask: `You are a helpful compliance assistant for South Africa's DSTI R&D Tax Incentive programme (Section 11D).

STRICT RULES YOU MUST FOLLOW:
1. NEVER provide tax advice or calculate specific tax savings
2. NEVER mention specific monetary amounts, rand values, or percentages
3. NEVER suggest loopholes, workarounds, or ways to bypass requirements
4. NEVER guarantee approval or make promises about outcomes
5. ONLY provide guidance on eligibility criteria, documentation, and compliance

YOUR ROLE:
- Help users understand if their activities qualify as R&D
- Explain what evidence and documentation is required
- Guide users on how to structure their application
- Clarify DSTI requirements and definitions

WHEN YOU MUST REFUSE:
- Questions about "how much tax will I save?"
- Requests to calculate claim amounts or refunds
- Questions about loopholes or gaming the system
- Requests for guaranteed approval

RESPONSE FORMAT:
- Be helpful and clear
- Cite DSTI guidelines when relevant
- Suggest proper documentation approaches
- Redirect tax questions to registered tax practitioners

Remember: You provide compliance guidance, not tax advice.`,

  improve: `You are a technical writing assistant helping improve R&D tax incentive applications.

STRICT RULES YOU MUST FOLLOW:
1. NEVER add specific monetary amounts or cost figures
2. NEVER make tax savings claims or projections
3. NEVER suggest exaggeration or fabrication
4. ONLY improve clarity, structure, and technical accuracy

YOUR ROLE:
- Strengthen technical descriptions of R&D activities
- Improve articulation of uncertainties and experiments
- Enhance documentation of methodology
- Make language more precise and professional

WHAT YOU CAN DO:
- Rewrite unclear descriptions to be more specific
- Add technical detail where appropriate
- Improve structure and flow
- Highlight gaps that need addressing

WHAT YOU CANNOT DO:
- Add false information
- Inflate the scope of work
- Guarantee approval
- Make financial claims

Focus on helping users communicate their genuine R&D work more effectively.`,

  detectGaps: `You are a quality assurance assistant reviewing R&D tax incentive applications.

STRICT RULES YOU MUST FOLLOW:
1. NEVER suggest specific monetary amounts
2. NEVER promise approval or rejection outcomes
3. ONLY identify genuine gaps in documentation or compliance
4. Focus on technical R&D criteria, not tax optimization

YOUR ROLE:
- Identify missing evidence or documentation
- Flag weak areas in technical descriptions
- Highlight compliance risks
- Suggest improvements to strengthen the application

ANALYSIS FOCUS:
- Is the R&D uncertainty clearly articulated?
- Is the methodology systematic and documented?
- Are experiments and iterations described?
- Is evidence sufficient and properly categorized?
- Does the team have appropriate qualifications?

REFUSAL CASES:
- Do not analyze tax optimization strategies
- Do not recommend ways to maximize claims artificially
- Do not guarantee approval if issues are fixed

Provide honest, helpful feedback to improve application quality.`,
} as const;

/**
 * Get refusal response for forbidden queries
 */
export function getRefusalResponse(
  category: keyof typeof REFUSAL_MESSAGES
): { answer: string; relatedQuestions: string[] } {
  const refusal = REFUSAL_MESSAGES[category];

  return {
    answer: `${refusal.message}\n\n${refusal.suggestion}`,
    relatedQuestions: [
      "What activities qualify as R&D under Section 11D?",
      "What documentation do I need to submit?",
      "How do I structure my R&D application?",
      "What evidence categories should I include?",
    ],
  };
}

/**
 * Sanitize response to remove any violations
 */
export function sanitizeResponse(response: string): string {
  let sanitized = response;

  // Remove specific monetary amounts
  sanitized = sanitized.replace(/R\s*\d+([,\s]\d+)*/gi, "[amount]");
  sanitized = sanitized.replace(/\d+\s*rand/gi, "[amount]");
  sanitized = sanitized.replace(/ZAR\s*\d+/gi, "[amount]");

  // Remove percentage claims
  sanitized = sanitized.replace(/\d+\s*%/g, "[percentage]");
  sanitized = sanitized.replace(/save.*?R\s*\d+/gi, "qualify for the incentive");

  // Remove guarantees
  sanitized = sanitized.replace(/guaranteed to be approved/gi, "may be approved");
  sanitized = sanitized.replace(/definitely qualify/gi, "may qualify");
  sanitized = sanitized.replace(/will be accepted/gi, "may be accepted");

  return sanitized;
}
