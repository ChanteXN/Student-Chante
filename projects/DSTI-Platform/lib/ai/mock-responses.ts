/**
 * Mock AI responses for UI testing
 * Use these instead of real OpenAI calls when billing is not set up
 */

export interface MockAIResponse {
  answer: string;
  confidence: "high" | "medium" | "low";
  sources: Array<{
    title: string;
    type: string;
    excerpt: string;
  }>;
  suggestions?: string[];
}

/**
 * Mock response for /api/ai/ask
 */
export function mockAskResponse(query: string): MockAIResponse {
  const lowerQuery = query.toLowerCase();

  // R&D eligibility questions
  if (lowerQuery.includes("qualify") || lowerQuery.includes("eligible")) {
    return {
      answer: `Based on Section 11D of the Income Tax Act, your R&D activities may qualify if they meet these criteria:

1. **Systematic Investigation**: Your project must involve systematic, investigative, and experimental activities.

2. **Scientific or Technological Uncertainty**: You must be attempting to resolve scientific or technological uncertainty that cannot be easily resolved by a competent professional.

3. **New Knowledge**: The activities should aim to achieve technological advancement or create new knowledge.

4. **Experimental Nature**: The work should involve experimentation, testing, and analysis.

Common qualifying activities include:
- Developing new products, processes, or services
- Significantly improving existing products or processes
- Overcoming technical challenges with uncertain outcomes
- Conducting experiments to test hypotheses

Activities that typically DON'T qualify:
- Routine testing or quality control
- Cosmetic modifications
- Social sciences or market research
- Management studies`,
      confidence: "high",
      sources: [
        {
          title: "R&D Tax Incentive Overview - Section 11D",
          type: "HELP_ARTICLE",
          excerpt: "Section 11D of the Income Tax Act provides for a pre-approval incentive scheme for R&D activities..."
        },
        {
          title: "Common R&D Scenarios - What Qualifies",
          type: "EXAMPLE",
          excerpt: "Software Development: Creating new algorithms, developing novel architectures, or solving complex technical problems qualifies..."
        }
      ],
      suggestions: [
        "Document the technical uncertainties you faced",
        "Record all experiments and their outcomes",
        "Keep detailed project logs and technical notes"
      ]
    };
  }

  // Documentation questions
  if (lowerQuery.includes("document") || lowerQuery.includes("evidence")) {
    return {
      answer: `For a strong R&D tax incentive application, you should provide:

**Required Documentation:**
1. **Project Description**: Detailed explanation of the R&D activities
2. **Technical Uncertainty**: Clear description of the unknowns you faced
3. **Systematic Approach**: Documentation of your methodology
4. **Financial Records**: Costs directly attributable to R&D
5. **Personnel Records**: Time sheets showing R&D effort

**Supporting Evidence:**
- Lab notebooks or technical journals
- Experiment results and test reports
- Design documents and specifications
- Meeting notes discussing technical challenges
- Code repositories with commit histories (for software)
- Prototypes and test results
- Expert opinions or peer reviews

**Best Practices:**
- Keep contemporaneous records (document as you go)
- Use clear, technical language
- Explain WHY you did something, not just what
- Show the iterative nature of your work
- Link costs directly to R&D activities`,
      confidence: "high",
      sources: [
        {
          title: "Application Readiness Checklist",
          type: "FAQ",
          excerpt: "Evidence requirements include detailed project descriptions, financial records, technical documentation..."
        }
      ],
      suggestions: [
        "Create a project timeline showing R&D phases",
        "Organize evidence by work package or phase",
        "Prepare a glossary for technical terms"
      ]
    };
  }

  // Budget/cost questions
  if (lowerQuery.includes("cost") || lowerQuery.includes("budget") || lowerQuery.includes("incentive amount")) {
    return {
      answer: `The R&D tax incentive under Section 11D provides:

**Incentive Rate:**
- 150% deduction on qualifying R&D expenditure
- This means for every R1 spent on qualifying R&D, you can deduct R1.50

**Qualifying Costs:**
1. **Salaries & Wages**: Staff directly engaged in R&D
2. **Materials**: Consumables used in R&D
3. **Overheads**: Directly attributable costs (pro-rated)
4. **Equipment**: Depreciation on R&D equipment
5. **Contractors**: Third-party R&D services

**Important Notes:**
- Pre-approval is required before claiming
- Only incremental costs qualify (not business-as-usual)
- Capital expenditure has special treatment
- Must maintain detailed cost records

**Example Calculation:**
If you spent R1,000,000 on qualifying R&D:
- Normal deduction: R1,000,000
- With Section 11D: R1,500,000
- Additional tax benefit: R500,000 × tax rate`,
      confidence: "medium",
      sources: [
        {
          title: "R&D Tax Incentive Overview - Section 11D",
          type: "HELP_ARTICLE",
          excerpt: "The incentive allows for a 150% deduction on qualifying R&D expenditure..."
        }
      ],
      suggestions: [
        "Separate R&D costs from normal business costs",
        "Use timesheets to track staff R&D effort",
        "Keep supplier invoices and payment records"
      ]
    };
  }

  // Default response
  return {
    answer: `I can help you with questions about:

- R&D eligibility and qualifying activities
- Documentation and evidence requirements
- Application process and timelines
- Cost calculations and qualifying expenditure
- Technical uncertainty and innovation
- Common mistakes and best practices

Please ask a specific question about the R&D Tax Incentive (Section 11D) and I'll provide detailed guidance based on DSTI guidelines.

Example questions:
- "Does my software development project qualify?"
- "What documentation do I need for my application?"
- "How is the incentive amount calculated?"`,
    confidence: "low",
    sources: [],
    suggestions: [
      "Review the R&D eligibility criteria",
      "Check the application readiness checklist",
      "Explore common R&D scenarios"
    ]
  };
}

/**
 * Mock response for /api/ai/improve
 */
export function mockImproveResponse(sectionKey: string, content: string): MockAIResponse {
  const improvements: Record<string, string> = {
    uncertainty: `Your uncertainty section could be strengthened by:

**Add Specificity:**
- Be more specific about WHAT was unknown at the start
- Explain WHY existing solutions didn't work
- Describe the gap in current knowledge or technology

**Show Progression:**
- What did you know initially?
- What did you discover through R&D?
- How did the uncertainty evolve?

**Technical Depth:**
- Use precise technical terminology
- Reference industry standards or benchmarks
- Cite failed approaches or limitations

**Recommended Structure:**
1. State of prior knowledge/technology
2. Specific unknowns or challenges
3. Why uncertainty existed (not routine)
4. How R&D addressed the uncertainty`,

    methodology: `Your methodology section would benefit from:

**Systematic Approach:**
- Outline the hypothesis-test-analyze cycle
- Show iterative refinement of approaches
- Document decision points and pivots

**Evidence of Experimentation:**
- Describe specific experiments or tests
- Explain variables controlled/measured
- Show comparison of alternatives
- Document failed attempts (shows genuine R&D)

**Risk Management:**
- Identify technical risks upfront
- Show contingency planning
- Explain risk mitigation strategies

**Link to Outcomes:**
- Connect methods to results achieved
- Show cause-effect relationships
- Demonstrate learning from failures`,

    team: `Strengthen your team and budget section:

**Team Expertise:**
- Highlight relevant qualifications and experience
- Show why team was capable of conducting R&D
- Clarify roles and responsibilities
- Mention external collaborators or advisors

**Budget Justification:**
- Link costs directly to R&D activities
- Explain why each cost category was necessary
- Show budget allocation by phase or work package
- Separate R&D from BAU (business-as-usual) costs

**Resource Planning:**
- Show how resources matched R&D needs
- Explain equipment/facility requirements
- Justify staffing levels and timeline`,
  };

  const improvement = improvements[sectionKey] || `Review your ${sectionKey} section for:
- Clarity and technical precision
- Evidence and supporting documentation
- Logical flow and structure
- Compliance with DSTI requirements`;

  return {
    answer: improvement,
    confidence: "medium",
    sources: [
      {
        title: "Application Best Practices",
        type: "HELP_ARTICLE",
        excerpt: "Strong applications demonstrate clear technical uncertainty, systematic methodology, and comprehensive evidence..."
      }
    ],
    suggestions: [
      `Add more technical detail to ${sectionKey}`,
      "Include specific examples and metrics",
      "Cross-reference with supporting evidence"
    ]
  };
}

/**
 * Mock response for /api/ai/detect-gaps
 */
export function mockDetectGapsResponse(sections: Record<string, unknown>): {
  gaps: Array<{
    section: string;
    severity: "high" | "medium" | "low";
    issue: string;
    recommendation: string;
  }>;
} {
  const gaps = [];

  // Check uncertainty section
  if (!sections.uncertainty || JSON.stringify(sections.uncertainty).length < 200) {
    gaps.push({
      section: "uncertainty",
      severity: "high" as const,
      issue: "Uncertainty section is too brief or missing",
      recommendation: "Provide detailed explanation of the technical uncertainties, including what was unknown and why existing solutions were inadequate."
    });
  }

  // Check methodology
  if (!sections.methodology || JSON.stringify(sections.methodology).length < 200) {
    gaps.push({
      section: "methodology",
      severity: "high" as const,
      issue: "Methodology section lacks detail",
      recommendation: "Describe your systematic approach, experiments conducted, and how you addressed the uncertainties. Include failed attempts to show genuine R&D."
    });
  }

  // Check team
  if (!sections.team || !sections.budget) {
    gaps.push({
      section: "team",
      severity: "medium" as const,
      issue: "Team or budget information incomplete",
      recommendation: "Provide team member qualifications, roles, and detailed budget breakdown linking costs to specific R&D activities."
    });
  }

  // Check evidence
  if (!sections.evidence || (sections.evidence as any[]).length < 3) {
    gaps.push({
      section: "evidence",
      severity: "high" as const,
      issue: "Insufficient supporting evidence",
      recommendation: "Upload experimental results, technical documentation, design specifications, and financial records. Aim for at least one document per major claim."
    });
  }

  // Add general recommendations if application is too short
  const totalContent = JSON.stringify(sections);
  if (totalContent.length < 1000) {
    gaps.push({
      section: "general",
      severity: "medium" as const,
      issue: "Application lacks sufficient detail overall",
      recommendation: "Expand all sections with specific technical details, examples, and evidence. Strong applications typically span 10-15 pages when printed."
    });
  }

  return { gaps };
}
