// Readiness Score Calculation for R&D Tax Incentive Applications
// Analyzes project completeness, evidence quality, and content quality

export interface ReadinessFix {
  id: string;
  severity: "critical" | "warning" | "info";
  category: "completeness" | "evidence" | "quality";
  title: string;
  description: string;
  section?: string; // Section to navigate to
  points: number; // Potential points to gain
}

export interface ReadinessResult {
  totalScore: number; // 0-100
  breakdown: {
    completeness: number; // out of 40
    evidence: number; // out of 30
    quality: number; // out of 30
  };
  fixes: ReadinessFix[];
  lastCalculated: Date;
}

interface ProjectSection {
  sectionKey: string;
  sectionData: Record<string, unknown>;
  isComplete: boolean;
}

interface EvidenceFile {
  category: string;
}

interface ProjectData {
  title?: string | null;
  sector?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  location?: string | null;
  sections: ProjectSection[];
  evidenceFiles: EvidenceFile[];
}

const REQUIRED_SECTIONS = ["basics", "uncertainty", "methodology", "team", "expenditure"];
const REQUIRED_EVIDENCE = ["RD_PLAN", "TIMESHEETS", "EXPERIMENTS"];

export function calculateReadinessScore(project: ProjectData): ReadinessResult {
  const fixes: ReadinessFix[] = [];
  let completenessScore = 0;
  let evidenceScore = 0;
  let qualityScore = 0;

  // ============================================================================
  // 1. COMPLETENESS SCORE (40 points max)
  // ============================================================================

  const completedSections = REQUIRED_SECTIONS.filter((key) => {
    const section = project.sections.find((s) => s.sectionKey === key);
    return section && Object.keys(section.sectionData).length > 0;
  });

  // 8 points per section
  completenessScore = (completedSections.length / REQUIRED_SECTIONS.length) * 40;

  // Identify missing sections
  REQUIRED_SECTIONS.forEach((key) => {
    const section = project.sections.find((s) => s.sectionKey === key);
    if (!section || Object.keys(section.sectionData).length === 0) {
      fixes.push({
        id: `missing-section-${key}`,
        severity: "critical",
        category: "completeness",
        title: `Complete ${getSectionName(key)} section`,
        description: `This required section is empty. Complete it to improve your application.`,
        section: key,
        points: 8,
      });
    }
  });

  // ============================================================================
  // 2. EVIDENCE SCORE (30 points max)
  // ============================================================================

  const uploadedCategories = new Set(project.evidenceFiles.map((f) => f.category));
  const requiredUploaded = REQUIRED_EVIDENCE.filter((cat) => uploadedCategories.has(cat));

  // 10 points per required category
  evidenceScore = (requiredUploaded.length / REQUIRED_EVIDENCE.length) * 30;

  // Identify missing evidence
  REQUIRED_EVIDENCE.forEach((category) => {
    if (!uploadedCategories.has(category)) {
      fixes.push({
        id: `missing-evidence-${category}`,
        severity: "critical",
        category: "evidence",
        title: `Upload ${getCategoryName(category)}`,
        description: `This evidence category is required for application approval.`,
        points: 10,
      });
    }
  });

  // Bonus for additional evidence categories
  const optionalCategories = ["LITERATURE_SEARCH", "OUTPUTS", "FINANCIAL_RECORDS"];
  const optionalUploaded = optionalCategories.filter((cat) => uploadedCategories.has(cat));
  
  if (optionalUploaded.length > 0 && evidenceScore === 30) {
    // Add up to 5 bonus points
    const bonus = Math.min(5, optionalUploaded.length * 2);
    evidenceScore = Math.min(30, evidenceScore + bonus);
  }

  // ============================================================================
  // 3. QUALITY HEURISTICS (30 points max)
  // ============================================================================

  // Check 1: Project title is meaningful (not empty, > 10 chars)
  if (project.title && project.title.length >= 10) {
    qualityScore += 5;
  } else {
    fixes.push({
      id: "weak-title",
      severity: "warning",
      category: "quality",
      title: "Improve project title",
      description: "Use a descriptive title that clearly explains your R&D project.",
      section: "basics",
      points: 5,
    });
  }

  // Check 2: Uncertainty section has substantial content
  const uncertaintySection = project.sections.find((s) => s.sectionKey === "uncertainty");
  const uncertaintyText = uncertaintySection?.sectionData?.uncertainty as string | undefined;
  
  if (uncertaintyText && uncertaintyText.length >= 100) {
    qualityScore += 5;
  } else if (uncertaintySection) {
    fixes.push({
      id: "weak-uncertainty",
      severity: "warning",
      category: "quality",
      title: "Strengthen uncertainty description",
      description: "Provide a detailed explanation of the technical uncertainty (minimum 100 characters).",
      section: "uncertainty",
      points: 5,
    });
  }

  // Check 3: Methodology section describes experiments
  const methodologySection = project.sections.find((s) => s.sectionKey === "methodology");
  const methodologyText = methodologySection?.sectionData?.methodology as string | undefined;
  
  if (methodologyText && methodologyText.length >= 100) {
    qualityScore += 5;
  } else if (methodologySection) {
    fixes.push({
      id: "weak-methodology",
      severity: "warning",
      category: "quality",
      title: "Detail your R&D methodology",
      description: "Describe the systematic approach and experiments planned (minimum 100 characters).",
      section: "methodology",
      points: 5,
    });
  }

  // Check 4: Team section has multiple team members
  const teamSection = project.sections.find((s) => s.sectionKey === "team");
  const teamData = teamSection?.sectionData?.team;
  
  if (Array.isArray(teamData) && teamData.length >= 2) {
    qualityScore += 5;
  } else if (teamSection) {
    fixes.push({
      id: "incomplete-team",
      severity: "info",
      category: "quality",
      title: "Add team members",
      description: "Include at least 2 team members with their roles and responsibilities.",
      section: "team",
      points: 5,
    });
  }

  // Check 5: Project has defined timeline
  if (project.startDate && project.endDate) {
    qualityScore += 5;
  } else {
    fixes.push({
      id: "missing-timeline",
      severity: "info",
      category: "quality",
      title: "Set project timeline",
      description: "Specify start and end dates for your R&D project.",
      section: "basics",
      points: 5,
    });
  }

  // Check 6: Expenditure section has detail
  const expenditureSection = project.sections.find((s) => s.sectionKey === "expenditure");
  const expenditureData = expenditureSection?.sectionData;
  
  if (expenditureData && Object.keys(expenditureData).length >= 3) {
    qualityScore += 5;
  } else if (expenditureSection) {
    fixes.push({
      id: "incomplete-expenditure",
      severity: "info",
      category: "quality",
      title: "Detail expenditure categories",
      description: "Provide breakdown of R&D costs across multiple categories.",
      section: "expenditure",
      points: 5,
    });
  }

  // ============================================================================
  // CALCULATE TOTAL SCORE
  // ============================================================================

  const totalScore = Math.round(completenessScore + evidenceScore + qualityScore);

  // Sort fixes by severity and points
  const severityOrder = { critical: 0, warning: 1, info: 2 };
  fixes.sort((a, b) => {
    if (a.severity !== b.severity) {
      return severityOrder[a.severity] - severityOrder[b.severity];
    }
    return b.points - a.points;
  });

  return {
    totalScore: Math.min(100, totalScore),
    breakdown: {
      completeness: Math.round(completenessScore),
      evidence: Math.round(evidenceScore),
      quality: Math.round(qualityScore),
    },
    fixes,
    lastCalculated: new Date(),
  };
}

function getSectionName(key: string): string {
  const names: Record<string, string> = {
    basics: "Project Basics",
    uncertainty: "R&D Uncertainty",
    methodology: "Methodology",
    team: "Team & Roles",
    expenditure: "Expenditure",
  };
  return names[key] || key;
}

function getCategoryName(category: string): string {
  const names: Record<string, string> = {
    RD_PLAN: "R&D Plan",
    LITERATURE_SEARCH: "Literature Search",
    TIMESHEETS: "Timesheets",
    EXPERIMENTS: "Experiment Documentation",
    OUTPUTS: "Project Outputs",
    FINANCIAL_RECORDS: "Financial Records",
    OTHER: "Other Documents",
  };
  return names[category] || category;
}
