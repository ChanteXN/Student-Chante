"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, FileText, BookOpen, AlertCircle, CheckCircle, Clock, X, Menu, Building2, ArrowRight } from "lucide-react";
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
  icon: React.ComponentType<{ className?: string }>;
}

export default function GuidelinesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGuideline, setSelectedGuideline] = useState<Guideline | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                DSTI R&D Platform
              </span>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Home
              </Link>
              <a href="/how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                How It Works
              </a>
              <a href="/guidelines" className="text-blue-600 font-semibold">
                Guidelines
              </a>
              <a href="/login" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Sign In
              </a>
              <a href="/register" className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold">
                Register
              </a>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              suppressHydrationWarning
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <Link
                href="/"
                className="px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <a
                href="/how-it-works"
                className="px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </a>
              <a
                href="/guidelines"
                className="px-4 py-2 text-blue-600 font-semibold bg-blue-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Guidelines
              </a>
              <a
                href="/login"
                className="px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </a>
              <a
                href="/register"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all text-center font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                Register
              </a>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full font-medium mb-4 shadow-sm text-sm">
            <BookOpen className="w-4 h-4" />
            <span>Comprehensive Knowledge Base</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Guidelines Hub
            </span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Searchable knowledge base to help you understand R&D Tax Incentive requirements, 
            best practices, and compliance standards.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-600 transition-colors" />
            <Input
              type="text"
              placeholder="Search guidelines, topics, or keywords..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-6 text-lg rounded-xl shadow-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              suppressHydrationWarning
            />
          </div>
          {searchQuery && (
            <p className="mt-3 text-sm text-gray-600 font-medium">
              {filteredGuidelines.length} result{filteredGuidelines.length !== 1 ? 's' : ''} found for &quot;{searchQuery}&quot;
            </p>
          )}
        </div>

        {/* Guidelines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredGuidelines.map((guide) => (
            <Card 
              key={guide.id} 
              className="hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer border-2 border-gray-100 hover:border-blue-200"
              onClick={() => setSelectedGuideline(guide)}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center shadow-md">
                      <guide.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">{guide.category}</Badge>
                  </div>
                </div>
                <CardTitle className="text-xl font-bold">{guide.title}</CardTitle>
                <CardDescription className="text-base leading-relaxed">{guide.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {guide.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs bg-gray-100 hover:bg-gray-200 transition-colors">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {guide.lastUpdated}
                  </p>
                  <p className="text-sm text-blue-600 font-semibold flex items-center gap-1">
                    Read more
                    <ArrowRight className="w-4 h-4" />
                  </p>
                </div>
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
        <div className="mt-20 relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-3xl shadow-2xl p-12 sm:p-16 text-white overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px]"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-20"></div>
          
          <div className="relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm text-white rounded-full font-medium mb-4 text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>AI-Powered Assistance</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Need Help Understanding the Guidelines?
            </h2>
            <p className="text-base sm:text-lg text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Our AI Co-Pilot can answer your questions and guide you through the application process.
            </p>
            <a
              href="/register"
              className="group inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all text-base font-semibold shadow-xl hover:shadow-2xl hover:scale-105 duration-300"
            >
              Start Your Application
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>

      {/* Modal for Full Guideline Content */}
      {selectedGuideline && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200" onClick={() => setSelectedGuideline(null)}>
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border-2 border-gray-100 animate-in slide-in-from-bottom-4 duration-300" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                  <selectedGuideline.icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">{selectedGuideline.title}</h2>
                  <Badge variant="outline" className="mt-2 bg-white/20 border-white/30 text-white backdrop-blur-sm">{selectedGuideline.category}</Badge>
                </div>
              </div>
              <button 
                onClick={() => setSelectedGuideline(null)}
                className="p-2 hover:bg-white/20 rounded-xl transition-colors backdrop-blur-sm"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
            <div className="px-8 py-6 overflow-y-auto max-h-[calc(90vh-140px)]">
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
              <div className="mt-8 pt-6 border-t-2 border-gray-200 flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {selectedGuideline.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-blue-100 text-blue-700">{tag}</Badge>
                  ))}
                </div>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {selectedGuideline.lastUpdated}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">DSTI R&D Platform</h3>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Modern, secure, audit-ready application system for South Africa&apos;s R&D Tax Incentive Programme.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-lg">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Home</Link></li>
                <li><a href="/how-it-works" className="hover:text-white transition-colors hover:translate-x-1 inline-block">How It Works</a></li>
                <li><a href="/guidelines" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Guidelines</a></li>
                <li><a href="/eligibility" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Check Eligibility</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-lg">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/login" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Sign In</a></li>
                <li><a href="mailto:support@dsti.gov.za" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Contact Support</a></li>
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
