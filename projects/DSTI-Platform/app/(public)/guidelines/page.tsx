"use client";

import { useState } from "react";
import { Search, FileText, BookOpen, AlertCircle, CheckCircle, Clock, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Guideline {
  id: number;
  title: string;
  category: string;
  description: string;
  fullContent: string;
  tags: string[];
  lastUpdated: string;
  icon: any;
}

export default function GuidelinesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGuideline, setSelectedGuideline] = useState<Guideline | null>(null);

  const guidelines: Guideline[] = [
    {
      id: 1,
      title: "Section 11D R&D Tax Incentive Overview",
      category: "Getting Started",
      description: "Comprehensive overview of the R&D Tax Incentive programme, eligibility criteria, and benefits.",
      fullContent: `# Section 11D R&D Tax Incentive Overview

## What is the R&D Tax Incentive?

The Section 11D R&D Tax Incentive is a government programme designed to encourage innovation and research & development activities in South Africa. Companies that conduct qualifying R&D can claim a 150% tax deduction on eligible expenditure.

## Eligibility Criteria

To qualify for the incentive, your project must:
- Address a scientific or technological uncertainty
- Involve systematic investigation or experimentation
- Seek to achieve technological advancement
- Be conducted within South Africa

## Key Benefits

- **150% tax deduction** on qualifying R&D expenditure
- **Improved cash flow** through reduced tax liability
- **Competitive advantage** through innovation
- **Recognition** as an innovative company

## Application Process

1. Check eligibility using our online screener
2. Complete the project builder wizard
3. Upload supporting evidence
4. Submit your application to DSTI
5. Undergo review and assessment
6. Receive decision and certificate`,
      tags: ["Eligibility", "Overview", "Benefits"],
      lastUpdated: "January 2026",
      icon: BookOpen,
    },
    {
      id: 2,
      title: "Defining R&D Activities",
      category: "Core Concepts",
      description: "What qualifies as R&D under Section 11D: uncertainty, experimentation, and systematic investigation.",
      fullContent: `# Defining R&D Activities

## Core Requirements

For an activity to qualify as R&D under Section 11D, it must meet ALL three criteria:

### 1. Scientific or Technological Uncertainty
The project must seek to resolve an uncertainty that cannot be readily resolved by a competent professional in the field using existing knowledge.

**Examples:**
- Developing a new algorithm with unknown performance characteristics
- Creating a novel material with untested properties
- Designing a system where scalability is uncertain

### 2. Systematic Investigation
The work must follow a structured, documented approach with clear hypotheses and testing methodologies.

**Requirements:**
- Written R&D plan with objectives
- Documented methodology
- Recorded experiments and results
- Analysis of findings

### 3. Technological Advancement
The project must aim to achieve an advance in science or technology, not just apply existing methods.

**Qualifies:**
- Creating new algorithms or processes
- Developing novel technical solutions
- Overcoming technical limitations

**Does NOT Qualify:**
- Routine testing or quality control
- Market research or business analysis
- Aesthetic improvements without technical innovation`,
      tags: ["R&D Definition", "Eligibility", "Technical"],
      lastUpdated: "December 2025",
      icon: FileText,
    },
    {
      id: 3,
      title: "Eligible Expenditure Categories",
      category: "Financial",
      description: "Detailed breakdown of qualifying costs: salaries, consumables, depreciation, and overheads.",
      fullContent: `# Eligible Expenditure Categories

## 1. Staff Costs (Primary Category)

**Fully Qualifying:**
- Salaries of employees directly conducting R&D
- Employer contributions (pension, medical aid, UIF)
- Performance bonuses related to R&D work

**Requirements:**
- Detailed timesheets showing R&D hours
- Clear job descriptions linking roles to R&D
- Allocation methodology for shared staff

## 2. Consumables and Materials

**Qualifying Items:**
- Laboratory materials and reagents
- Prototype materials
- Software licenses used in R&D
- Cloud computing costs for R&D activities

**Documentation Required:**
- Invoices and proof of payment
- Clear link to specific R&D projects

## 3. Depreciation of Equipment

**Qualifying Assets:**
- Specialized R&D equipment
- Testing apparatus
- Computer hardware used exclusively for R&D

**Calculation:**
- Pro-rata depreciation based on R&D usage
- Must follow SARS depreciation schedules

## 4. Overhead Allocation (Limited)

**Allowable Overheads:**
- Utilities (electricity, water) - capped at 10%
- Facility costs - pro-rata to R&D space
- General consumables - reasonable allocation

**NOT Allowed:**
- Marketing or sales costs
- General administrative expenses
- Legal fees unrelated to R&D`,
      tags: ["Expenditure", "Finance", "Claims"],
      lastUpdated: "January 2026",
      icon: CheckCircle,
    },
    {
      id: 4,
      title: "Evidence Requirements & Best Practices",
      category: "Compliance",
      description: "Required documentation: R&D plans, timesheets, experiment logs, literature reviews, and audit trails.",
      fullContent: `# Evidence Requirements & Best Practices

## Critical Documents (Must Have)

### 1. R&D Project Plan
- Clear statement of uncertainty
- Research objectives and hypotheses
- Proposed methodology
- Expected outcomes
- Budget allocation

### 2. Timesheets
- Daily or weekly logs
- Specific R&D activities described
- Signed by employees and managers
- Consistent with payroll records

### 3. Literature Review / Patent Search
- Evidence of baseline knowledge assessment
- Citations of prior art or research
- Demonstration of novelty

### 4. Experiment Logs
- Detailed records of tests conducted
- Results and observations
- Analysis and conclusions
- Dated and signed

### 5. Meeting Minutes
- Technical discussions
- Design decisions
- Problem-solving sessions

## Supporting Evidence (Strongly Recommended)

- Code repositories with commit history
- CAD drawings or technical specifications
- Prototypes or test results
- Photos or videos of experiments
- External expert opinions

## Common Mistakes to Avoid

❌ Retrospective documentation
❌ Generic timesheets without detail
❌ No clear link between evidence and R&D claims
❌ Missing signatures or dates
❌ Incomplete experiment records`,
      tags: ["Evidence", "Documentation", "Audit"],
      lastUpdated: "November 2025",
      icon: AlertCircle,
    },
    {
      id: 5,
      title: "Application Process & Timeline",
      category: "Process",
      description: "Step-by-step guide: submission deadlines, review process, decision timelines, and progress reporting.",
      fullContent: `# Application Process & Timeline

## Submission Windows

**Annual Cycle:**
- Applications open: January 1st
- Submission deadline: March 31st (for previous tax year)
- Late submissions accepted until June 30th (with justification)

## Review Timeline

### Phase 1: Initial Screening (2-4 weeks)
- Completeness check
- Eligibility assessment
- Request for clarification if needed

### Phase 2: Technical Review (4-8 weeks)
- Detailed assessment by technical reviewers
- Evaluation against R&D criteria
- Review of supporting evidence

### Phase 3: Financial Verification (2-4 weeks)
- Expenditure validation
- Cross-check with SARS records
- Calculation of qualifying amounts

### Phase 4: Adjudication & Decision (2 weeks)
- Final review by adjudication committee
- Approval or decline decision
- Issuance of certificate and letter

**Total Timeline: 10-18 weeks from submission to decision**

## Progress Reporting Requirements

**Approved Projects Must Submit:**
- **Quarterly Updates** (optional but recommended)
- **Annual Progress Report** (mandatory)
- **Final Project Report** upon completion

**Report Contents:**
- Milestones achieved
- Technical outcomes
- Expenditure summary
- Challenges encountered
- Learnings and next steps`,
      tags: ["Process", "Timeline", "Submission"],
      lastUpdated: "January 2026",
      icon: Clock,
    },
    {
      id: 6,
      title: "Common Rejection Reasons & How to Avoid Them",
      category: "Tips & Tricks",
      description: "Learn from past applications: weak uncertainty statements, insufficient evidence, and scope creep.",
      fullContent: `# Common Rejection Reasons & How to Avoid Them

## Top 5 Rejection Reasons

### 1. Weak Uncertainty Statement (35% of rejections)

**Problem:**
- Generic descriptions of "improving" or "optimizing"
- No clear technical challenge described
- Uncertainty easily resolved by competent professional

**Solution:**
✅ Clearly articulate what is unknown
✅ Explain why existing solutions don't work
✅ Describe specific technical barriers

### 2. Insufficient Evidence (28% of rejections)

**Problem:**
- Missing timesheets or vague entries
- No experiment logs or test results
- Lack of contemporaneous documentation

**Solution:**
✅ Maintain detailed, dated records throughout
✅ Document failures and iterations
✅ Keep all technical communications

### 3. Scope Creep (18% of rejections)

**Problem:**
- Including routine development work
- Claiming non-R&D activities (design, marketing)
- Over-allocation of staff time

**Solution:**
✅ Clearly separate R&D from BAU work
✅ Conservative timesheet estimates
✅ Focus only on novel/uncertain work

### 4. Incomplete Financial Records (12% of rejections)

**Problem:**
- Missing invoices or proof of payment
- Unexplained cost allocations
- Inconsistencies with tax returns

**Solution:**
✅ Complete audit trail for all costs
✅ Document allocation methodologies
✅ Reconcile with financial statements

### 5. Late or Incomplete Submission (7% of rejections)

**Problem:**
- Missing required sections
- Deadline missed without justification
- Incomplete responses to queries

**Solution:**
✅ Use our readiness score feature
✅ Submit with buffer before deadline
✅ Respond promptly to DSTI requests

## Pro Tips

 **Start documentation early** - Don't wait until application time
 **Use our AI Co-Pilot** - Get real-time feedback on your application
 **Review successful examples** - Learn from approved applications
 **Engage early** - Contact DSTI if unsure about eligibility`,
      tags: ["Rejections", "Best Practices", "Tips"],
      lastUpdated: "December 2025",
      icon: AlertCircle,
    },
  ];

  const filteredGuidelines = guidelines.filter(
    (guide) =>
      guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <a href="/" className="text-2xl font-bold text-blue-600">
              DSTI R&D Platform
            </a>
            <nav className="flex gap-6">
              <a href="/" className="text-gray-600 hover:text-blue-600 transition">
                Home
              </a>
              <a href="/how-it-works" className="text-gray-600 hover:text-blue-600 transition">
                How It Works
              </a>
              <a href="/guidelines" className="text-blue-600 font-semibold">
                Guidelines
              </a>
              <a href="/login" className="text-gray-600 hover:text-blue-600 transition">
                Sign In
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Guidelines Hub
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Searchable knowledge base to help you understand R&D Tax Incentive requirements, 
            best practices, and compliance standards.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search guidelines, topics, or keywords..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-6 text-lg rounded-xl shadow-lg border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              suppressHydrationWarning
            />
          </div>
          {searchQuery && (
            <p className="mt-3 text-sm text-gray-600">
              {filteredGuidelines.length} result{filteredGuidelines.length !== 1 ? 's' : ''} found for "{searchQuery}"
            </p>
          )}
        </div>

        {/* Guidelines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredGuidelines.map((guide) => (
            <Card 
              key={guide.id} 
              className="hover:shadow-xl transition cursor-pointer"
              onClick={() => setSelectedGuideline(guide)}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <guide.icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <Badge variant="outline">{guide.category}</Badge>
                  </div>
                </div>
                <CardTitle className="text-xl">{guide.title}</CardTitle>
                <CardDescription className="text-base">{guide.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-3">
                  {guide.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-gray-500">Last updated: {guide.lastUpdated}</p>
                <p className="text-sm text-blue-600 mt-2 font-medium">Click to read more →</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredGuidelines.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No guidelines found</h3>
            <p className="text-gray-500">Try adjusting your search terms</p>
          </div>
        )}

        {/* AI Assistant CTA */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Need Help Understanding the Guidelines?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Our AI Co-Pilot can answer your questions and guide you through the application process.
          </p>
          <a
            href="/portal"
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition text-lg font-semibold shadow-lg"
          >
            Start Your Application
          </a>
        </div>
      </div>

      {/* Modal for Full Guideline Content */}
      {selectedGuideline && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedGuideline(null)}>
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b px-8 py-6 flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <selectedGuideline.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedGuideline.title}</h2>
                  <Badge variant="outline" className="mt-2">{selectedGuideline.category}</Badge>
                </div>
              </div>
              <button 
                onClick={() => setSelectedGuideline(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="px-8 py-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="prose prose-blue max-w-none">
                <div dangerouslySetInnerHTML={{ 
                  __html: selectedGuideline.fullContent
                    .replace(/^# /gm, '<h1 class="text-3xl font-bold mb-4 text-gray-900">')
                    .replace(/<\/h1>/g, '</h1>')
                    .replace(/^## /gm, '<h2 class="text-2xl font-bold mt-8 mb-3 text-gray-900">')
                    .replace(/<\/h2>/g, '</h2>')
                    .replace(/^### /gm, '<h3 class="text-xl font-bold mt-6 mb-2 text-gray-900">')
                    .replace(/<\/h3>/g, '</h3>')
                    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
                    .replace(/^- /gm, '<li class="ml-4 text-gray-700">')
                    .replace(/<\/li>/g, '</li>')
                    .replace(/✅ /g, '<span class="text-green-600">✅ </span>')
                    .replace(/❌ /g, '<span class="text-red-600">❌ </span>')
                    .replace(/💡 /g, '<span class="text-yellow-600">💡 </span>')
                    .replace(/\n\n/g, '</p><p class="mb-4 text-gray-700">')
                    .replace(/^([^<])/gm, '<p class="mb-4 text-gray-700">$1')
                    .replace(/([^>])$/gm, '$1</p>')
                }} />
              </div>
              <div className="mt-8 pt-6 border-t flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {selectedGuideline.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
                <p className="text-sm text-gray-500">Last updated: {selectedGuideline.lastUpdated}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">DSTI R&D Platform</h3>
              <p className="text-gray-400">
                Modern, secure, audit-ready application system for South Africa's R&D Tax Incentive Programme.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/" className="hover:text-white transition">Home</a></li>
                <li><a href="/how-it-works" className="hover:text-white transition">How It Works</a></li>
                <li><a href="/guidelines" className="hover:text-white transition">Guidelines</a></li>
                <li><a href="/eligibility" className="hover:text-white transition">Check Eligibility</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/login" className="hover:text-white transition">Sign In</a></li>
                <li><a href="mailto:support@dsti.gov.za" className="hover:text-white transition">Contact Support</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 Department of Science, Technology and Innovation. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
