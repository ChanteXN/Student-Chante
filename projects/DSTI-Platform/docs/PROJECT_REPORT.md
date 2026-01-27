# DSTI R&D Tax Incentive Application Platform
## Project Report

**Project Name**: DSTI R&D Tax Incentive Application Management System  
**Client**: Department of Science, Technology and Innovation (DSTI), South Africa  
**Developer**: Chante (BikoToday)  
**Report Date**: January 22, 2026  
**Project Status**: Week 2, Day 6 - In Development  

---

## Executive Summary

The DSTI R&D Tax Incentive Application Platform is a comprehensive digital solution designed to modernize and streamline the research and development tax incentive application process for the South African Department of Science, Technology and Innovation. This platform addresses critical inefficiencies in the current paper-based and fragmented application system by providing an integrated, user-friendly, and intelligent digital experience for applicants, consultants, reviewers, and administrators.

The system is built using modern web technologies (Next.js 15, TypeScript, PostgreSQL) and implements industry best practices for security, scalability, and user experience. As of Week 2, Day 6, the platform has successfully implemented core authentication, project management, and the initial phases of the multi-step application wizard.

**Key Achievements:**
- Passwordless authentication system with magic link email verification
- Smart auto-save functionality preventing data loss
- Multi-step project builder wizard (2 of 5 steps complete)
- RESTful API architecture for scalability
- Production-ready database schema with validated relationships

**Projected Completion**: Day 20 (Feb 2026)  
**Technology Stack**: Next.js 15, TypeScript, PostgreSQL, Prisma ORM, NextAuth.js, Tailwind CSS

---

## Table of Contents

1. [Problem Statement](#1-problem-statement)
2. [Proposed Solution](#2-proposed-solution)
3. [Project Purpose and Objectives](#3-project-purpose-and-objectives)
4. [Current Process Analysis](#4-current-process-analysis)
5. [Functional Requirements](#5-functional-requirements)
6. [Non-Functional Requirements](#6-non-functional-requirements)
7. [System Architecture](#7-system-architecture)
8. [Features and Capabilities](#8-features-and-capabilities)
9. [Implementation Progress](#9-implementation-progress)
10. [Planned Features](#10-planned-features)
11. [Technical Stack](#11-technical-stack)
12. [Database Design](#12-database-design)
13. [Security and Compliance](#13-security-and-compliance)
14. [Testing Strategy](#14-testing-strategy)
15. [Deployment Architecture](#15-deployment-architecture)
16. [Project Timeline](#16-project-timeline)
17. [Risks and Mitigation](#17-risks-and-mitigation)
18. [Success Metrics](#18-success-metrics)
19. [Conclusion](#19-conclusion)
20. [Appendices](#20-appendices)

---

## 1. Problem Statement

### 1.1 Background

The Department of Science, Technology and Innovation (DSTI) administers South Africa's R&D Tax Incentive program, which provides tax deductions to companies conducting eligible research and development activities. The current application process faces several critical challenges:

**Current Challenges:**

1. **Paper-Based Process**: Applications are submitted via physical documents or unstructured email attachments, leading to:
   - High administrative overhead for processing
   - Increased risk of document loss or misplacement
   - Difficulty in tracking application status
   - Extended processing times (average 4-6 months)

2. **Information Asymmetry**: Applicants lack guidance on:
   - Eligibility criteria interpretation
   - Required evidence and documentation
   - Application completeness assessment
   - Real-time status updates

3. **Manual Review Burden**: DSTI consultants and reviewers must:
   - Manually triage hundreds of applications annually
   - Request missing information via email chains
   - Maintain separate tracking spreadsheets
   - Recreate context for each review session

4. **Quality and Compliance Issues**:
   - Incomplete applications (estimated 40% require additional information)
   - Inconsistent information formatting
   - Lack of standardized evidence categorization
   - Difficulty in ensuring alignment with R&D definition (Section 11D of ITA)

5. **Limited Analytics**: No centralized system for:
   - Application trends by sector
   - Approval rate analysis
   - Processing time metrics
   - Resource allocation optimization

### 1.2 Impact Assessment

**Stakeholder Impact:**

- **Applicants (Companies)**: Frustrated by opaque process, long wait times, and uncertainty
- **DSTI Consultants**: Overwhelmed with administrative tasks rather than value-added screening
- **Reviewers**: Inefficient review workflows with context-switching overhead
- **DSTI Management**: Limited visibility into program performance and bottlenecks
- **South African Economy**: Delayed tax incentive decisions impact R&D investment planning

**Quantifiable Problems:**
- Average application processing time: 4-6 months
- Incomplete application rate: ~40%
- Average information request rounds: 2-3 per application
- Manual data entry time per application: 3-4 hours
- Applicant satisfaction score: Low (estimated 5.5/10)

### 1.3 Problem Statement Summary

*"Organizations seeking to claim R&D tax incentives through DSTI face a fragmented, opaque, and time-consuming application process characterized by paper-based submissions, lack of real-time guidance, extended processing times, and limited visibility into application status. This inefficiency burdens both applicants and DSTI staff, delaying economic benefits and hindering South Africa's innovation ecosystem."*

---

## 2. Proposed Solution

### 2.1 Solution Overview

The DSTI R&D Tax Incentive Application Platform is an integrated, cloud-based web application that digitizes and streamlines the entire application lifecycle—from initial eligibility screening through final decision communication. The platform provides role-specific interfaces for applicants, consultants, reviewers, and administrators, with intelligent features to guide users, validate information, and automate routine tasks.

### 2.2 Solution Components

**1. Applicant Portal**
- Self-service registration with email verification
- Interactive eligibility screener (pre-application)
- Multi-step project builder wizard with progressive disclosure
- Smart auto-save to prevent data loss
- Evidence vault for document upload and categorization
- AI-powered R&D description assistant
- Real-time readiness score and improvement suggestions
- Application status tracking and notifications

**2. Consultant Interface**
- Application queue with intelligent triaging
- Bulk screening capabilities
- Standardized screening criteria checklists
- Internal note-taking and collaboration
- Information request templates
- Screening decision workflow

**3. Reviewer Workspace**
- Assigned application review queue
- Detailed project information viewer
- Evidence download and review tools
- Review note management
- Recommendation workflow (Approve/Reject/Request Info)
- Audit trail of all review activities

**4. Admin Backoffice**
- User and role management
- Organisation management
- System configuration
- Reporting and analytics dashboard
- Audit log viewer
- Email template management
- Decision letter generation

**5. Public Website**
- Program information and guidelines
- Eligibility checker
- Knowledge hub with FAQs and examples
- Contact information
- Download resources (forms, guides)

### 2.3 Key Differentiators

**Intelligent Features:**
- **AI Co-Pilot**: Assists applicants in writing R&D uncertainty descriptions that meet Section 11D requirements
- **Smart Validation**: Real-time field validation against DSTI criteria
- **Readiness Score**: Algorithm-based assessment of application completeness and quality
- **Auto-Categorization**: Evidence files automatically tagged by type (financial, technical, etc.)

**User Experience:**
- **Progressive Disclosure**: Complex wizard broken into digestible steps
- **Contextual Help**: Inline guidance and examples throughout forms
- **Mobile-Responsive**: Accessible from any device
- **Accessibility**: WCAG 2.1 AA compliant

**Operational Efficiency:**
- **30-Second Auto-Save**: Prevents data loss with intelligent change detection
- **Parallel Review**: Multiple reviewers can work on different sections simultaneously
- **Automated Notifications**: Email alerts for status changes and action requirements
- **Centralized Evidence**: No more hunting through email attachments

### 2.4 Expected Outcomes

**For Applicants:**
- Reduce application preparation time by 50% (from 8 hours to 4 hours)
- Increase first-time completion rate from 60% to 85%
- Receive real-time status updates instead of email inquiries
- Access application history for multi-year projects

**For DSTI Staff:**
- Reduce manual data entry time by 90% (from 3 hours to 20 minutes per application)
- Decrease information request rounds from 2-3 to 1 or less
- Enable evidence review without email attachment downloads
- Generate decision letters automatically

**For DSTI Organization:**
- Reduce average processing time from 4-6 months to 2-3 months
- Gain real-time analytics on application pipeline
- Improve audit compliance with comprehensive activity logs
- Scale to handle 2x application volume without additional staff

**Economic Impact:**
- Faster R&D tax credit decisions enable companies to plan investments sooner
- Lower barrier to entry encourages more SMEs to apply
- Improved transparency builds trust in government digital services

---

## 3. Project Purpose and Objectives

### 3.1 Purpose Statement

The purpose of the DSTI R&D Tax Incentive Application Platform is to **modernize the R&D tax incentive application process through digital transformation**, creating an efficient, transparent, and user-centric system that serves the needs of South African companies seeking R&D tax relief while empowering DSTI staff to deliver faster, higher-quality decisions.

### 3.2 Strategic Objectives

**Objective 1: Digitize Application Process**
- Eliminate paper-based submissions
- Create structured data capture forms aligned with Section 11D requirements
- Implement secure document upload and storage
- Target: 100% digital application submission by Month 6

**Objective 2: Enhance User Experience**
- Provide intuitive, guided application workflows
- Implement contextual help and validation
- Enable real-time status visibility
- Target: User satisfaction score ≥ 8.5/10

**Objective 3: Improve Operational Efficiency**
- Reduce manual data entry and administrative tasks
- Automate routine processes (notifications, triaging, letter generation)
- Enable parallel review workflows
- Target: 50% reduction in processing time

**Objective 4: Increase Application Quality**
- Implement validation rules and smart checks
- Provide AI-assisted content generation
- Calculate readiness scores before submission
- Target: Reduce incomplete applications from 40% to 10%

**Objective 5: Enable Data-Driven Decision Making**
- Centralize application data for analytics
- Provide real-time dashboards for management
- Track key performance metrics
- Target: Monthly executive reports with actionable insights

**Objective 6: Ensure Security and Compliance**
- Implement role-based access control (RBAC)
- Maintain comprehensive audit trails
- Encrypt sensitive data (PII, financial information)
- Target: Pass security audit and POPIA compliance review

### 3.3 Success Criteria

The project will be considered successful when:

1.  **Functional Completeness**: All core features (application submission, review, decision) operational
2.  **User Adoption**: ≥80% of new applications submitted via platform within 3 months of launch
3.  **Performance**: Average page load time <2 seconds, 99.5% uptime
4.  **Quality**: <5% bug rate in production, NPS score ≥40
5.  **Efficiency**: 50% reduction in average processing time demonstrated over 6 months
6.  **Security**: Zero data breaches, successful penetration testing

---

## 4. Current Process Analysis

### 4.1 Existing Workflow

**Phase 1: Pre-Application (Current State)**
```
Company Considers R&D Tax Incentive
          ↓
Visits DSTI Website (https://www.dsti.gov.za/rdtax/)
          ↓
Downloads PDF Guidelines
          ↓
Determines Eligibility (Self-Assessment)
          ↓
Prepares Documentation (Unstructured)
```

**Issues:**
- No interactive eligibility checker
- Static PDF guidelines (last updated 2024)
- No templates or examples provided
- Uncertainty about required evidence

**Phase 2: Application Submission (Current State)**
```
Company Completes Application Form (PDF/Word)
          ↓
Gathers Evidence Documents
          ↓
Emails Application to rdtax@dsti.gov.za OR Uploads to Online Portal
          ↓
Receives Email Acknowledgment (Manual)
```

**Issues:**
- Multiple submission channels (email, online portal)
- Inconsistent document naming and formatting
- No validation at submission time
- Email system creates silos (one staff member's inbox)

**Phase 3: Initial Screening (Current State)**
```
DSTI Consultant Receives Application
          ↓
Manually Reviews for Completeness
          ↓
Checks Against Eligibility Criteria
          ↓
IF Complete → Forward to Reviewer
IF Incomplete → Email Request for Information
```

**Issues:**
- Consultant must download all attachments to review
- No standardized checklist (subjective screening)
- Information requests create email chains
- No tracking of how long applications sit in inbox

**Phase 4: Detailed Review (Current State)**
```
Reviewer Receives Application Folder
          ↓
Reads Project Description and Evidence
          ↓
Evaluates Against Section 11D Definition
          ↓
Makes Recommendation (Approve/Reject/Query)
          ↓
Writes Review Notes in Separate Document
```

**Issues:**
- Reviewer must recreate context each time they open the file
- No structured review template
- Notes stored separately (Word/Excel) rather than attached to application
- Difficult to track which evidence files support which claims

**Phase 5: Decision and Communication (Current State)**
```
Senior Reviewer/Manager Makes Final Decision
          ↓
Decision Letter Drafted (Manual)
          ↓
Letter Approved and Signed
          ↓
PDF Emailed to Applicant
          ↓
Application Status Updated in Spreadsheet
```

**Issues:**
- Manual letter drafting (copy-paste from templates)
- Signature delays (physical or digital signing process)
- Applicants not notified of decision until letter sent
- Spreadsheet tracking disconnected from actual files

### 4.2 Pain Points Mapped

| Stakeholder | Pain Point | Impact | Frequency |
|-------------|-----------|--------|-----------|
| Applicant | Unclear eligibility criteria | Wasted effort on ineligible applications | High |
| Applicant | No guidance on R&D uncertainty definition | Low-quality applications | High |
| Applicant | Lack of status visibility | Frustration, repeated inquiries | Daily |
| Applicant | Information requests via email | Disrupts workflow, hard to track | 40% of apps |
| Consultant | Manual data entry into systems | Time waste (3 hrs per app) | Every app |
| Consultant | Hunting for evidence in email threads | Inefficiency | Every app |
| Consultant | Inconsistent application formats | Additional normalization work | Every app |
| Reviewer | Context switching between applications | Lost time regaining context | Every session |
| Reviewer | Missing evidence not flagged early | Delays discovered late | 25% of apps |
| Reviewer | No collaboration with other reviewers | Duplicate work, inconsistency | Medium |
| Admin | No real-time reporting | Blind to bottlenecks | Weekly |
| Admin | Audit trail reconstruction | Compliance risk | Ad-hoc |

### 4.3 Process Metrics (Baseline)

| Metric | Current Value | Data Source |
|--------|--------------|-------------|
| Average Application Processing Time | 4-6 months | DSTI internal estimate |
| Incomplete Application Rate | ~40% | DSTI historical data |
| Average Information Request Rounds | 2-3 | Email analysis |
| Manual Data Entry Time per Application | 3-4 hours | Consultant interview |
| Applicant Status Inquiry Emails per Application | 2-5 | Email volume analysis |
| Applications Received Annually | ~600 | DSTI website statistics |
| Time to First Response (Acknowledgment) | 3-7 days | Email analysis |
| Reviewer Utilization Rate | ~60% | Process observation |

---

## 5. Functional Requirements

Functional requirements define what the system must do—the features, capabilities, and behaviors expected by users.

### 5.1 User Management

**FR-UM-001: User Registration**
- System SHALL allow users to register with email address
- System SHALL send magic link for email verification
- System SHALL create user account upon first successful login
- System SHALL auto-create organisation for first-time users

**FR-UM-002: User Authentication**
- System SHALL support passwordless authentication via magic link
- System SHALL create JWT session tokens with 12-hour expiry
- System SHALL refresh sessions every 1 hour during active use
- System SHALL support secure logout functionality

**FR-UM-003: Role Management**
- System SHALL support four user roles: Applicant, Consultant, Reviewer, Admin
- System SHALL allow admins to assign roles to users
- System SHALL enforce role-based access control on all routes and APIs
- System SHALL support multiple roles per user (e.g., Consultant + Reviewer)

**FR-UM-004: Profile Management**
- System SHALL allow users to update profile information (name, contact)
- System SHALL display user's organisation(s) and role(s)
- System SHALL allow users to switch between organisations (if multiple memberships)

### 5.2 Organisation Management

**FR-ORG-001: Organisation Creation**
- System SHALL allow admins to create organisations manually
- System SHALL auto-create organisation for new applicants with placeholder data
- System SHALL require: organisation name, registration number, sector, address

**FR-ORG-002: Organisation Membership**
- System SHALL support multiple users per organisation
- System SHALL support multiple organisations per user
- System SHALL track membership status (active/inactive)
- System SHALL assign role per membership (Admin, Member)

**FR-ORG-003: Organisation Profile**
- System SHALL display organisation details (name, sector, projects)
- System SHALL allow organisation admins to update organisation information
- System SHALL show list of members with their roles

### 5.3 Project/Application Management

**FR-PROJ-001: Project Creation**
- System SHALL allow applicants to create new R&D project applications
- System SHALL assign unique project ID
- System SHALL set initial status to DRAFT
- System SHALL associate project with user's organisation

**FR-PROJ-002: Multi-Step Wizard**
- System SHALL provide 5-step project builder wizard:
  - Step 1: Project Basics (title, sector, dates, location)
  - Step 2: R&D Uncertainty (uncertainty description, objectives)
  - Step 3: Methodology & Innovation (research approach, challenges)
  - Step 4: Team & Expertise (team size, qualifications)
  - Step 5: Budget & Expenditure (R&D costs, timeline)
- System SHALL display progress indicator showing current step
- System SHALL allow navigation between steps
- System SHALL save data at each step

**FR-PROJ-003: Auto-Save**
- System SHALL auto-save form data every 30 seconds when changes detected
- System SHALL display save status (Saving.../Saved/Idle)
- System SHALL prevent saving empty fields
- System SHALL compare data with last saved state to avoid duplicate writes

**FR-PROJ-004: Draft Management**
- System SHALL allow users to save applications as drafts
- System SHALL allow users to resume editing draft applications
- System SHALL display list of draft applications on dashboard
- System SHALL show last modified timestamp for each draft

**FR-PROJ-005: Application Submission**
- System SHALL validate all required fields before submission
- System SHALL calculate readiness score (0-100%)
- System SHALL display validation errors and warnings
- System SHALL require user confirmation before submission
- System SHALL change status from DRAFT to SUBMITTED upon submission
- System SHALL timestamp submission (submittedAt)

**FR-PROJ-006: Evidence Management** (Planned)
- System SHALL provide evidence vault for document uploads
- System SHALL support multiple file formats (PDF, DOCX, XLSX, JPG, PNG)
- System SHALL categorize evidence by type (financial, technical, team, etc.)
- System SHALL display file metadata (name, size, upload date)
- System SHALL allow file deletion before submission
- System SHALL scan uploaded files for viruses

**FR-PROJ-007: Project History**
- System SHALL track all status changes with timestamps
- System SHALL maintain audit trail of edits (who, what, when)
- System SHALL allow users to view submission history

### 5.4 Screening and Review Workflows

**FR-REV-001: Application Queue** (Planned)
- System SHALL display queue of submitted applications for consultants
- System SHALL sort by submission date (oldest first)
- System SHALL show application metadata (title, sector, date, applicant)
- System SHALL indicate applications awaiting screening vs. in review

**FR-REV-002: Consultant Screening** (Planned)
- System SHALL provide standardized screening checklist
- System SHALL allow consultant to request additional information
- System SHALL allow consultant to assign to reviewer
- System SHALL allow consultant to reject application with reason

**FR-REV-003: Reviewer Assignment** (Planned)
- System SHALL allow consultant to assign applications to specific reviewers
- System SHALL support multiple reviewers per application (if complex)
- System SHALL notify assigned reviewer via email
- System SHALL track reviewer workload

**FR-REV-004: Detailed Review** (Planned)
- System SHALL display full application details to assigned reviewer
- System SHALL provide evidence viewer (inline PDF/document preview)
- System SHALL allow reviewer to add private notes
- System SHALL provide structured review form (aligned with Section 11D)
- System SHALL allow reviewer to recommend: Approve, Reject, Request Info

**FR-REV-005: Information Requests** (Planned)
- System SHALL allow reviewer to request specific information from applicant
- System SHALL notify applicant via email with details
- System SHALL change application status to PENDING_INFO
- System SHALL track response deadline
- System SHALL notify reviewer when applicant responds

**FR-REV-006: Decision Making** (Planned)
- System SHALL require senior reviewer/admin approval for final decision
- System SHALL generate decision letter (Approval or Rejection)
- System SHALL allow customization of letter content
- System SHALL send decision letter to applicant via email
- System SHALL update application status to APPROVED or REJECTED

### 5.5 AI Co-Pilot Features (Planned)

**FR-AI-001: R&D Uncertainty Assistant**
- System SHALL provide AI-powered suggestions for R&D uncertainty descriptions
- System SHALL check description against Section 11D criteria
- System SHALL highlight potential gaps or improvements
- System SHALL provide examples of good uncertainty descriptions

**FR-AI-002: Readiness Score**
- System SHALL calculate application readiness score (0-100%)
- System SHALL base score on: completeness, quality, evidence sufficiency
- System SHALL display score breakdown by section
- System SHALL provide actionable recommendations to improve score

### 5.6 Reporting and Analytics (Planned)

**FR-RPT-001: Dashboard Metrics**
- System SHALL display real-time application statistics on dashboard
- System SHALL show: total applications, by status, by sector
- System SHALL display average processing time
- System SHALL show reviewer workload distribution

**FR-RPT-002: Sector Analysis**
- System SHALL generate reports on applications by industrial sector
- System SHALL compare approval rates by sector
- System SHALL show trends over time (monthly, yearly)

**FR-RPT-003: Audit Logs**
- System SHALL maintain audit log of all user actions
- System SHALL record: user, action, timestamp, IP address, affected record
- System SHALL allow admins to search and filter audit logs
- System SHALL export audit logs for compliance purposes

### 5.7 Public Website Features (Planned)

**FR-PUB-001: Eligibility Screener**
- System SHALL provide interactive eligibility questionnaire
- System SHALL evaluate responses against DSTI eligibility criteria
- System SHALL display eligibility result (Likely Eligible, Uncertain, Not Eligible)
- System SHALL provide explanation and guidance

**FR-PUB-002: Knowledge Hub**
- System SHALL display FAQs about R&D tax incentive
- System SHALL provide examples of eligible vs. ineligible activities
- System SHALL display contact information for DSTI support

---

## 6. Non-Functional Requirements

Non-functional requirements define how the system performs its functions—quality attributes, constraints, and technical specifications.

### 6.1 Performance Requirements

**NFR-PERF-001: Response Time**
- System SHALL load pages in <2 seconds (median) on standard broadband (10 Mbps)
- System SHALL respond to API requests in <500ms (90th percentile)
- System SHALL display auto-save confirmation within 1 second of save operation

**NFR-PERF-002: Throughput**
- System SHALL support 100 concurrent users without performance degradation
- System SHALL support 500 concurrent users with proportional infrastructure scaling
- System SHALL process file uploads of up to 50MB in <30 seconds

**NFR-PERF-003: Scalability**
- System SHALL scale horizontally to handle 2x user load within 10 minutes (auto-scaling)
- System SHALL support database connection pooling to handle traffic spikes
- System SHALL use CDN for static assets to reduce server load

### 6.2 Reliability and Availability

**NFR-REL-001: Uptime**
- System SHALL maintain 99.5% uptime (excluding planned maintenance)
- System SHALL schedule maintenance during low-usage windows (weekends, after hours)
- System SHALL notify users 48 hours before planned maintenance

**NFR-REL-002: Data Durability**
- System SHALL backup database daily with 30-day retention
- System SHALL replicate database to secondary region for disaster recovery
- System SHALL support point-in-time recovery (PITR) for accidental data loss

**NFR-REL-003: Error Handling**
- System SHALL display user-friendly error messages (not technical stack traces)
- System SHALL log all errors to centralized logging service
- System SHALL alert development team for critical errors (500-level HTTP responses)

### 6.3 Security Requirements

**NFR-SEC-001: Authentication**
- System SHALL enforce email verification for all users
- System SHALL use cryptographically secure JWT tokens
- System SHALL expire sessions after 12 hours of inactivity
- System SHALL invalidate sessions on logout
- System SHALL prevent session fixation and hijacking attacks

**NFR-SEC-002: Authorization**
- System SHALL enforce role-based access control (RBAC) on all routes
- System SHALL prevent horizontal privilege escalation (users accessing other users' data)
- System SHALL prevent vertical privilege escalation (users accessing admin features)
- System SHALL validate user permissions on every API request

**NFR-SEC-003: Data Protection**
- System SHALL encrypt data in transit using TLS 1.3
- System SHALL encrypt sensitive data at rest (PII, financial information)
- System SHALL use parameterized queries to prevent SQL injection
- System SHALL sanitize user inputs to prevent XSS attacks
- System SHALL implement CSRF protection on all forms

**NFR-SEC-004: File Upload Security**
- System SHALL validate file types against whitelist (PDF, DOCX, XLSX, JPG, PNG)
- System SHALL scan uploaded files for malware
- System SHALL limit file size to 50MB per file
- System SHALL store files with random generated names (prevent path traversal)

**NFR-SEC-005: Audit and Compliance**
- System SHALL log all user actions (create, update, delete, view)
- System SHALL make audit logs immutable (append-only)
- System SHALL retain audit logs for 7 years (POPIA compliance)
- System SHALL support audit log export for regulatory review

### 6.4 Usability Requirements

**NFR-USE-001: User Interface**
- System SHALL provide responsive design (desktop, tablet, mobile)
- System SHALL follow consistent design system (colors, typography, spacing)
- System SHALL use clear, plain-language labels and instructions
- System SHALL minimize clicks required to complete tasks (3-click rule for common actions)

**NFR-USE-002: Accessibility**
- System SHALL comply with WCAG 2.1 Level AA standards
- System SHALL support keyboard navigation for all interactive elements
- System SHALL provide alt text for images
- System SHALL use sufficient color contrast (4.5:1 for normal text)
- System SHALL support screen readers

**NFR-USE-003: Help and Documentation**
- System SHALL provide contextual help tooltips throughout forms
- System SHALL link to detailed guidelines on DSTI website
- System SHALL provide FAQ section
- System SHALL display examples of well-written R&D descriptions

**NFR-USE-004: Error Messages**
- System SHALL display specific, actionable error messages (not generic "Error occurred")
- System SHALL indicate which field(s) caused validation errors
- System SHALL suggest corrections for common mistakes

### 6.5 Compatibility Requirements

**NFR-COMP-001: Browser Support**
- System SHALL support latest 2 versions of Chrome, Firefox, Safari, Edge
- System SHALL display browser compatibility warning for unsupported browsers
- System SHALL use progressive enhancement (core features work without JavaScript)

**NFR-COMP-002: Device Support**
- System SHALL support desktop (1920x1080 and higher)
- System SHALL support tablets (iPad, Android tablets 768px width)
- System SHALL support mobile phones (iPhone, Android 375px width)

**NFR-COMP-003: Network Conditions**
- System SHALL function on slow networks (3G, 1 Mbps)
- System SHALL provide feedback during slow operations (loading indicators)
- System SHALL cache static assets for offline viewing (service worker - optional)

### 6.6 Maintainability Requirements

**NFR-MAINT-001: Code Quality**
- System SHALL use TypeScript for type safety
- System SHALL enforce ESLint rules (no-explicit-any, no-unused-vars)
- System SHALL maintain >80% code coverage with automated tests
- System SHALL use consistent code formatting (Prettier)

**NFR-MAINT-002: Documentation**
- System SHALL maintain up-to-date technical documentation (architecture, API specs)
- System SHALL document all API endpoints (OpenAPI/Swagger)
- System SHALL provide developer onboarding guide (setup instructions)
- System SHALL use JSDoc comments for complex functions

**NFR-MAINT-003: Monitoring**
- System SHALL log application errors and warnings
- System SHALL monitor performance metrics (response time, throughput)
- System SHALL track user actions for analytics (anonymized)
- System SHALL alert on critical issues (downtime, high error rate)

### 6.7 Compliance Requirements

**NFR-COMP-001: POPIA Compliance**
- System SHALL comply with Protection of Personal Information Act (POPIA)
- System SHALL collect only necessary personal information
- System SHALL allow users to request data export
- System SHALL allow users to request account deletion
- System SHALL obtain consent for data processing (privacy policy acceptance)

**NFR-COMP-002: Government Standards**
- System SHALL follow South African government digital service standards
- System SHALL use HTTPS for all connections
- System SHALL comply with National Cybersecurity Policy Framework

---

## 7. System Architecture

### 7.1 Architecture Overview

The DSTI platform follows a **modern three-tier architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│  (Next.js 15 App Router, React Server/Client Components)   │
│  • Public Website  • Applicant Portal  • Admin Backoffice  │
└─────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                      API / LOGIC LAYER                       │
│         (Next.js API Routes, NextAuth.js, Prisma)           │
│  • Authentication  • Business Logic  • Validation           │
└─────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                       DATA LAYER                             │
│    PostgreSQL (Neon) + S3-Compatible Storage (Planned)      │
│  • Users  • Organisations  • Projects  • Evidence Files     │
└─────────────────────────────────────────────────────────────┘
```

### 7.2 Architectural Patterns

**1. Route-Based Organization (Next.js App Router)**
- `(public)/` - Unauthenticated pages (landing, login, eligibility)
- `(portal)/` - Applicant-facing authenticated pages
- `(admin)/` - DSTI staff backoffice
- `/api/` - RESTful API endpoints

**2. Server Components First**
- Default to React Server Components for data fetching
- Use Client Components only for interactivity (forms, modals)
- Reduces JavaScript bundle size sent to browser

**3. API-First Design**
- All business logic in API routes (not directly in components)
- Enables future mobile app or third-party integrations
- Facilitates testing and validation

**4. Prisma ORM for Type-Safe Database Access**
- Generated TypeScript types from schema
- Prevents runtime type errors
- Supports complex relationships and queries

**5. JWT Session Management**
- Stateless sessions (no server-side session store)
- Enables horizontal scaling
- 12-hour expiry with 1-hour refresh

### 7.3 Component Architecture

**Reusable UI Components** (shadcn/ui):
- Button, Input, Textarea, Select, Card, Progress, Toast
- Ensures consistency across pages
- Built on Radix UI primitives (accessible by default)

**Custom Business Components**:
- `ProjectWizard` - Multi-step form container with progress tracking
- `Sidebar` - Navigation with role-based menu items
- `TopBar` - User profile and notifications
- `EvidenceUploader` - Drag-drop file upload with preview (planned)

**Layout Patterns**:
- `(portal)/layout.tsx` - Wraps all portal pages with SessionProvider and sidebar
- `(admin)/layout.tsx` - Admin-specific sidebar and navigation
- `(public)/layout.tsx` - Simple header/footer for public pages

### 7.4 Data Flow

**Application Submission Flow:**
```
User Input (Client) 
    → useEffect debounce (30s) 
    → fetch() to API Route 
    → API validates session 
    → Prisma ORM 
    → PostgreSQL UPDATE 
    → Response to client 
    → Toast notification ("Saved")
```

**Authentication Flow:**
```
User enters email 
    → POST /api/auth/signin 
    → NextAuth generates token 
    → Resend sends email with magic link 
    → User clicks link 
    → NextAuth verifies token 
    → Create/update User in DB 
    → Auto-create Organisation if first login 
    → Set JWT session cookie 
    → Redirect to /portal
```

---

## 8. Features and Capabilities

### 8.1 Implemented Features (Week 2, Day 6)

#### 8.1.1 User Authentication
**Status**: ✅ Fully Functional

**Capabilities:**
- Passwordless authentication via magic link
- Email verification using Resend API
- JWT session management (12-hour expiry)
- Automatic user registration on first login
- Automatic organisation creation for new users
- Secure logout functionality
- Session persistence across browser sessions

**Technical Implementation:**
- NextAuth.js v5 with custom Resend provider
- Middleware for route protection
- SessionProvider wrapper for client components

**User Experience:**
- Clean login/register page
- Email sent within seconds
- One-click magic link authentication
- Automatic redirect to portal dashboard

#### 8.1.2 Project Builder Wizard
**Status**: ✅ Partially Complete (2 of 5 steps)

**Implemented Steps:**

**Step 1: Project Basics**
- Fields: Title (text), Sector (select), Start Date, End Date, Location
- Validation: Required fields, date range validation
- Auto-save: Every 30 seconds with change detection

**Step 2: R&D Uncertainty**
- Fields: Uncertainty Description (textarea), Objectives (textarea)
- Guidance: Inline help text explaining Section 11D requirements
- Auto-save: Smart detection (prevents empty/duplicate saves)

**Capabilities:**
- Progress indicator showing completion percentage
- Step navigation (Previous/Next buttons)
- Clickable step indicators with completion badges
- Manual save button with status feedback ("Saving..."/"Saved")
- Review button (placeholder for submission workflow)

**Technical Implementation:**
- Reusable `ProjectWizard` component
- Smart auto-save algorithm:
  - Debounce to 30 seconds
  - Compare with last saved data (JSON.stringify)
  - Filter out empty fields
  - Display visual feedback (saving/saved/idle)
- Data persisted to ProjectSection table (JSON storage)
- Upsert pattern prevents duplicate sections

#### 8.1.3 API Infrastructure
**Status**: ✅ Fully Functional

**Implemented Endpoints:**

**POST /api/projects**
- Creates new project in DRAFT status
- Associates with user's organisation
- Auto-creates organisation if user has none
- Returns project ID

**GET /api/projects**
- Lists all projects for user's organisation
- Filters by user's membership
- Returns project metadata (title, status, dates)

**GET /api/projects/[id]**
- Fetches single project with all sections
- Includes organisation details
- Returns 404 if project not found or unauthorized

**PATCH /api/projects/[id]**
- Updates project-level fields (title, sector, dates)
- Upserts project sections (basics, uncertainty, etc.)
- Validates user ownership via session
- Returns updated project

**Technical Details:**
- Next.js 15 async params pattern: `{ params: Promise<{ id: string }> }`
- Session validation on all routes
- Error handling with try-catch
- Prisma ORM for database operations

#### 8.1.4 Database Schema
**Status**: ✅ Production-Ready

**Implemented Models:**
- User (id, email, name, emailVerified, image)
- Organisation (id, name, registrationNo, sector, address)
- Membership (userId, organisationId, role, isActive)
- Project (id, organisationId, title, sector, dates, status, readinessScore)
- ProjectSection (id, projectId, sectionKey, sectionData, isComplete)

**Relationships:**
- User ↔ Organisation (many-to-many via Membership)
- Organisation → Project (one-to-many)
- Project → ProjectSection (one-to-many)

**Data Integrity:**
- Foreign key constraints
- Cascade deletes
- Unique constraints (userId+organisationId, projectId+sectionKey)
- Timestamps (createdAt, updatedAt)

### 8.2 Features Under Development (Week 2, Day 7-9)

#### 8.2.1 Remaining Wizard Steps (Day 7)
- Step 3: Methodology & Innovation
- Step 4: Team & Expertise
- Step 5: Budget & Expenditure

#### 8.2.2 Form Validation (Day 8)
- Zod schemas for each wizard step
- Real-time field validation
- Error message display
- Prevent navigation to next step if errors

#### 8.2.3 Draft Management (Day 9)
- Resume editing existing projects
- Draft projects list on dashboard
- Show progress percentage per project
- Delete draft functionality

---

## 9. Implementation Progress

### 9.1 Sprint Timeline

**Week 1 (Foundation)**
- Days 1-2: Project setup, Next.js structure, Tailwind CSS, shadcn/ui
- Days 3-4: Database schema design, Prisma setup, migrations
- Day 5: Week 1 review and documentation

**Week 2 (Authentication & Project Builder)**
- Day 6: ✅ **COMPLETED**
  - NextAuth.js setup with Resend
  - Magic link authentication
  - User/organisation auto-creation
  - Project wizard Steps 1-2
  - Smart auto-save implementation
  - API routes (POST/GET/PATCH /api/projects)
  - Production build and deployment
- Day 7:  **IN PROGRESS**
  - Wizard Steps 3-5
  - Complete 5-step wizard flow
- Day 8: ⏳ **PLANNED**
  - Zod validation schemas
  - Error handling and messaging
- Day 9: ⏳ **PLANNED**
  - Draft projects dashboard
  - Resume functionality

**Week 3 (Evidence & AI Features)**
- Days 10-12: Evidence vault, file upload, categorization
- Days 13-14: AI co-pilot for R&D descriptions
- Day 15: Week 3 review

**Week 4 (Review Workflows)**
- Days 16-18: Consultant screening interface
- Days 19-21: Reviewer workflows
- Day 22: Decision-making and letter generation

**Week 5+ (Admin & Launch)**
- Days 23-25: Admin backoffice
- Days 26-28: Public website
- Days 29-30: Testing and bug fixes
- Days 31-35: User acceptance testing (UAT)
- Days 36-45: Production launch and monitoring

### 9.2 Completed Work Summary

**Code Statistics (Week 2, Day 6):**
- Files created: 17
- Lines of code added: 2,122
- Components built: 2 (ProjectWizard, shadcn UI components)
- API endpoints: 4
- Database models: 5
- Commits: 2 (feat + fix)

**Key Achievements:**
1. ✅ End-to-end authentication flow working
2. ✅ Auto-save preventing data loss (tested with 30s debounce)
3. ✅ Smart validation preventing DB pollution
4. ✅ Production deployment successful (no ESLint errors)
5. ✅ Database relationships validated
6. ✅ DSTI requirements alignment confirmed

**Bugs Fixed During Development:**
1. Missing shadcn components (Progress, Label, etc.)
2. TypeScript implicit 'any' errors
3. SessionProvider missing in portal layout
4. Server Action in Client Component error
5. Session not persisting after magic link
6. Foreign key constraint violation (organisation)
7. Next.js 15 async params requirement
8. Duplicate function declaration
9. Continuous DB writes (auto-save optimization)
10. ESLint errors blocking production build

### 9.3 Testing Performed

**Manual Testing:**
- ✅ User registration flow (new email → magic link → login)
- ✅ Existing user login (return user → magic link → login)
- ✅ Project creation (New Application button → wizard loads)
- ✅ Auto-save functionality (type → wait 30s → check DB)
- ✅ Form navigation (Previous/Next buttons)
- ✅ Manual save (click Save → toast notification)
- ✅ Session persistence (close browser → reopen → still logged in)
- ✅ Logout (click Sign Out → redirect to landing page)

**Automated Testing:**
- ✅ ESLint validation (build passes with zero errors)
- ⏳ Unit tests (not yet implemented)
- ⏳ Integration tests (not yet implemented)
- ⏳ E2E tests (not yet implemented)

---

## 10. Planned Features

### 10.1 Week 3: Evidence Management

**Evidence Vault** (Priority: High)
- Drag-and-drop file upload interface
- Multiple file selection support
- File type validation (PDF, DOCX, XLSX, JPG, PNG)
- Virus scanning on upload
- Auto-categorization by evidence type:
  - Financial documents (budgets, invoices)
  - Technical documents (research reports, patents)
  - Team documents (CVs, qualifications)
  - Project documents (project plans, timelines)
- File metadata display (name, size, upload date, uploader)
- Preview/download functionality
- Delete file (before submission only)

**Storage Implementation:**
- AWS S3 or S3-compatible storage (MinIO, Backblaze)
- Presigned URLs for secure file access
- CDN for fast file delivery
- Lifecycle policies (delete files for rejected/archived projects after 7 years)

### 10.2 Week 3: AI Co-Pilot

**R&D Uncertainty Assistant** (Priority: High)
- Analyze user's uncertainty description
- Check alignment with Section 11D definition:
  - "Systematic investigative or systematic experimental activities"
  - "Result is uncertain"
  - "Discovery of non-obvious scientific/technological knowledge"
- Provide suggestions to strengthen description
- Highlight weak or generic statements
- Suggest inclusion of specific technical details

**Implementation:**
- OpenAI GPT-4 or Azure OpenAI integration
- Custom prompt engineering with Section 11D criteria
- Streaming responses for real-time feedback
- Cost controls (rate limiting, prompt optimization)

**Readiness Score Algorithm** (Priority: Medium)
- Calculate score based on:
  - Completeness: All required fields filled (40%)
  - Quality: R&D uncertainty description quality (30%)
  - Evidence: Number and type of evidence files (20%)
  - Coherence: Consistency across sections (10%)
- Display score breakdown
- Provide actionable recommendations ("Upload financial documents to increase score by 15%")

### 10.3 Week 4: Review Workflows

**Consultant Screening Interface**
- Application queue (sortable, filterable)
- Bulk screening (select multiple, mark as screened)
- Standardized checklist:
  - Organisation details complete?
  - Project description clear?
  - R&D uncertainty evident?
  - Evidence files attached?
  - Section 11D criteria met?
- Actions:
  - Assign to reviewer
  - Request information (with template messages)
  - Reject with reason
- Internal notes (visible only to DSTI staff)

**Reviewer Detailed Review**
- Full application viewer (read-only)
- Evidence file viewer (inline PDF preview)
- Structured review form:
  - Does project meet Section 11D definition? (Yes/No/Uncertain)
  - Is uncertainty clearly described? (1-5 rating)
  - Is innovation significant? (1-5 rating)
  - Are team qualifications adequate? (Yes/No/Partial)
  - Are financials reasonable? (Yes/No/Needs Clarification)
- Free-text review notes
- Recommendation: Approve / Reject / Request Additional Information
- Escalate to senior reviewer (if complex case)

**Decision and Communication**
- Senior reviewer approval workflow
- Decision letter generation (auto-populated templates)
- Editable letter content
- Digital signature (DocuSign or similar)
- Email notification to applicant
- Status update to APPROVED or REJECTED

### 10.4 Week 5+: Admin and Reporting

**User Management**
- Create/edit/deactivate users
- Assign roles (Applicant, Consultant, Reviewer, Admin)
- View user activity logs

**Organisation Management**
- Manually create organisations
- Edit organisation details
- Merge duplicate organisations
- View organisation's projects

**System Configuration**
- Email templates for notifications
- Review criteria configuration
- Sector dropdown options
- System maintenance mode

**Reporting Dashboard**
- Applications received (daily, weekly, monthly)
- Applications by status (DRAFT, SUBMITTED, UNDER_REVIEW, etc.)
- Applications by sector (bar chart)
- Approval rate by sector
- Average processing time trend
- Reviewer workload distribution
- Top bottlenecks identification

**Audit Logs**
- View all user actions
- Filter by user, date range, action type
- Export audit logs (CSV, PDF)
- Immutable logging for compliance

### 10.5 Week 5+: Public Website

**Landing Page**
- Hero section with call-to-action
- Program overview and benefits
- Eligibility criteria summary
- Application process steps
- Success stories / testimonials
- Contact information

**Interactive Eligibility Screener**
- Multi-step questionnaire:
  - Is your company registered in South Africa?
  - Do you conduct systematic investigative activities?
  - Is the outcome of your activities uncertain?
  - Are you seeking to discover new knowledge or create innovation?
- Result page: Likely Eligible / Uncertain (consult DSTI) / Not Eligible
- Explanation and next steps

**Knowledge Hub**
- FAQs organized by category
- Definitions (R&D, systematic investigative activities, uncertainty, etc.)
- Examples of eligible activities (by sector)
- Examples of ineligible activities
- Downloadable resources (guideline PDFs, checklist templates)
- Video tutorials (planned)

**Contact and Support**
- Contact form (email to rdtax@dsti.gov.za)
- Phone number and office hours
- Physical address and map
- Live chat support (future enhancement)

---

## 11. Technical Stack

### 11.1 Frontend Technologies

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Next.js** | 15.5.9 | React framework with App Router, server components, API routes |
| **React** | 19.x | UI library for building interactive components |
| **TypeScript** | 5.x | Type-safe JavaScript for reduced runtime errors |
| **Tailwind CSS** | 3.4 | Utility-first CSS framework for rapid styling |
| **shadcn/ui** | Latest | Accessible component library (Radix UI primitives) |
| **Lucide React** | Latest | Icon library (modern, consistent icons) |
| **React Hook Form** | Planned | Form state management and validation |
| **Zod** | Planned | Schema validation for forms |

### 11.2 Backend Technologies

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Next.js API Routes** | 15.5.9 | RESTful API endpoints |
| **NextAuth.js** | 5.x | Authentication library with OAuth providers |
| **Resend** | Latest | Transactional email API (magic links) |
| **Prisma ORM** | 6.19.2 | Type-safe database client and migrations |
| **PostgreSQL** | 16 | Relational database (managed by Neon) |

### 11.3 Infrastructure

| Service | Provider | Purpose |
|---------|----------|---------|
| **Hosting** | Vercel | Serverless deployment, edge network, automatic HTTPS |
| **Database** | Neon | Managed PostgreSQL with connection pooling |
| **Email** | Resend | Transactional email delivery (magic links, notifications) |
| **File Storage** | Planned (S3) | Object storage for evidence files |
| **CDN** | Vercel Edge | Fast content delivery globally |
| **Monitoring** | Planned (Sentry) | Error tracking and performance monitoring |
| **Analytics** | Planned (Vercel Analytics) | User behavior tracking (anonymized) |

### 11.4 Development Tools

| Tool | Purpose |
|------|---------|
| **Git** | Version control |
| **GitHub** | Code repository and collaboration |
| **VS Code** | Primary IDE |
| **ESLint** | Code quality and style enforcement |
| **Prettier** | Code formatting |
| **Husky** | Git hooks (pre-commit linting) - Planned |
| **Jest** | Unit testing framework - Planned |
| **Playwright** | E2E testing - Planned |

### 11.5 Third-Party Integrations (Planned)

| Service | Purpose |
|---------|---------|
| **OpenAI API** | AI co-pilot for R&D descriptions |
| **DocuSign** | Digital signatures for decision letters |
| **Twilio SendGrid** | Backup email service |
| **Google Analytics** | User behavior tracking |
| **Sentry** | Error monitoring and alerting |

---

## 12. Database Design

### 12.1 Entity-Relationship Overview

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│    User     │────────<│  Membership  │>────────│Organisation │
└─────────────┘         └──────────────┘         └─────────────┘
      │                                                  │
      │                                                  │
      │                                                  │
      │                                           ┌──────▼──────┐
      │                                           │   Project   │
      │                                           └──────┬──────┘
      │                                                  │
      │                                           ┌──────▼──────────┐
      │                                           │ ProjectSection  │
      │                                           └─────────────────┘
      │
      │                                           ┌─────────────────┐
      └───────────────────────────────────────────│  Comment (Future)│
                                                  └─────────────────┘
```

### 12.2 Table Definitions

**User Table**
```sql
CREATE TABLE "User" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  emailVerified TIMESTAMP,
  image TEXT,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_user_email ON "User"(email);
```

**Organisation Table**
```sql
CREATE TABLE "Organisation" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  registrationNo VARCHAR(100) NOT NULL,
  sector VARCHAR(100) NOT NULL,
  address TEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_organisation_registrationNo ON "Organisation"(registrationNo);
```

**Membership Table** (Many-to-Many Join)
```sql
CREATE TABLE "Membership" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  organisationId UUID NOT NULL REFERENCES "Organisation"(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL, -- APPLICANT, CONSULTANT, REVIEWER, ADMIN
  isActive BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW(),
  UNIQUE(userId, organisationId)
);

CREATE INDEX idx_membership_userId ON "Membership"(userId);
CREATE INDEX idx_membership_organisationId ON "Membership"(organisationId);
```

**Project Table**
```sql
CREATE TABLE "Project" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisationId UUID NOT NULL REFERENCES "Organisation"(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  sector VARCHAR(100),
  startDate DATE,
  endDate DATE,
  location VARCHAR(255),
  status VARCHAR(50) NOT NULL DEFAULT 'DRAFT', -- DRAFT, SUBMITTED, UNDER_REVIEW, APPROVED, REJECTED
  readinessScore FLOAT,
  submittedAt TIMESTAMP,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_project_organisationId ON "Project"(organisationId);
CREATE INDEX idx_project_status ON "Project"(status);
```

**ProjectSection Table** (Flexible JSON Storage)
```sql
CREATE TABLE "ProjectSection" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  projectId UUID NOT NULL REFERENCES "Project"(id) ON DELETE CASCADE,
  sectionKey VARCHAR(100) NOT NULL, -- 'basics', 'uncertainty', 'methodology', 'team', 'expenditure'
  sectionData JSONB NOT NULL, -- Flexible JSON data for each section
  isComplete BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW(),
  UNIQUE(projectId, sectionKey)
);

CREATE INDEX idx_projectsection_projectId ON "ProjectSection"(projectId);
CREATE INDEX idx_projectsection_sectionKey ON "ProjectSection"(sectionKey);
```

### 12.3 Relationship Rules

**User ↔ Organisation (Many-to-Many via Membership)**
- A user can belong to multiple organisations
- An organisation can have multiple users
- Membership tracks role and active status
- Deleting user cascades to delete memberships
- Deleting organisation cascades to delete memberships

**Organisation → Project (One-to-Many)**
- An organisation can have multiple projects
- A project belongs to one organisation
- Deleting organisation cascades to delete projects

**Project → ProjectSection (One-to-Many)**
- A project can have multiple sections (max 5: basics, uncertainty, methodology, team, expenditure)
- A section belongs to one project
- Unique constraint prevents duplicate section keys per project
- Deleting project cascades to delete sections

### 12.4 Data Integrity Constraints

1. **Foreign Keys**: All relationships enforce referential integrity
2. **Unique Constraints**:
   - User.email (prevent duplicate accounts)
   - Membership (userId, organisationId) - prevent duplicate memberships
   - ProjectSection (projectId, sectionKey) - prevent duplicate sections
3. **Cascade Deletes**:
   - Delete user → delete memberships
   - Delete organisation → delete memberships, projects
   - Delete project → delete sections
4. **Timestamps**: All tables have createdAt and updatedAt for audit trail

### 12.5 Sample Data Flow

**User Registration:**
1. User enters email: "john@acme.com"
2. Magic link sent and verified
3. INSERT INTO User (email: "john@acme.com")
4. INSERT INTO Organisation (name: "john's Organisation", registrationNo: "TEMP-1737553200000")
5. INSERT INTO Membership (userId: new user ID, organisationId: new org ID, role: 'APPLICANT')

**Project Creation:**
1. User clicks "New Application"
2. INSERT INTO Project (organisationId: user's org, title: "Untitled Project", status: 'DRAFT')
3. User fills Step 1 (title, sector, dates)
4. UPSERT INTO ProjectSection (projectId, sectionKey: 'basics', sectionData: {...})
5. User fills Step 2 (uncertainty, objectives)
6. UPSERT INTO ProjectSection (projectId, sectionKey: 'uncertainty', sectionData: {...})

---

## 13. Security and Compliance

### 13.1 Security Measures Implemented

**1. Authentication Security**
- ✅ Magic link authentication (no password storage/leakage risk)
- ✅ Email verification required (prevents unauthorized account creation)
- ✅ JWT tokens with cryptographic signing (prevents token tampering)
- ✅ Session expiry (12 hours max, 1-hour refresh)
- ✅ Secure cookie configuration (httpOnly, secure in production, sameSite: lax)

**2. Authorization (Planned Enhancements)**
- ✅ Session validation on all API routes
- ✅ Middleware protection on portal routes
- ⏳ Role-based access control (RBAC) - partial implementation
- ⏳ Resource ownership validation (users can only access their org's projects)

**3. Data Protection**
- ✅ Prisma parameterized queries (prevents SQL injection)
- ✅ Foreign key constraints (data integrity)
- ✅ Unique constraints (prevents duplicates)
- ✅ TLS 1.3 encryption in transit (Vercel automatic HTTPS)
- ⏳ Input sanitization (XSS prevention) - basic, needs enhancement
- ⏳ CSRF protection (Next.js built-in for Server Actions)
- ⏳ Rate limiting on API routes (prevent DoS)

**4. File Upload Security (Planned)**
- ⏳ File type whitelist validation
- ⏳ File size limits (50MB max)
- ⏳ Virus/malware scanning (ClamAV or cloud service)
- ⏳ Randomized file names (prevent path traversal)
- ⏳ Presigned URLs for downloads (no direct S3 access)

### 13.2 POPIA Compliance (Protection of Personal Information Act)

**Personal Information Collected:**
- User: email, name (optional)
- Organisation: name, registration number, address
- Project: R&D details, team information (future), financial data (future)

**POPIA Requirements:**
1. **Accountability** - DSTI as responsible party
2. **Processing Limitation** - Collect only necessary information for R&D tax incentive processing
3. **Purpose Specification** - Clear privacy policy stating data usage
4. **Further Processing Limitation** - No secondary use without consent
5. **Information Quality** - Allow users to update their information
6. **Openness** - Privacy policy accessible on website
7. **Security Safeguards** - Encryption, access controls, audit logs
8. **Data Subject Participation** - Users can request data export and deletion

**Implementation Status:**
- ✅ Minimal data collection (email, name, project details)
- ⏳ Privacy policy page (to be drafted)
- ⏳ Consent checkbox on registration
- ⏳ Data export functionality (user can download their data)
- ⏳ Data deletion request workflow (admin approval required)
- ⏳ Audit logs for all access to personal information

### 13.3 Audit and Compliance

**Audit Logging Requirements:**
- Who: User ID and email
- What: Action performed (CREATE, READ, UPDATE, DELETE)
- When: Timestamp (ISO 8601 format)
- Where: IP address (optional, for security investigation)
- Resource: Affected entity (project ID, organisation ID)

**Retention Policy:**
- Application data: 7 years (tax compliance requirement)
- Audit logs: 7 years (POPIA requirement)
- Evidence files: 7 years (tax audit requirement)
- Rejected applications: 3 years (appeal window)

**Planned Implementation:**
- Activity logging table (userId, action, resourceType, resourceId, timestamp, ipAddress)
- Immutable logging (append-only, no updates or deletes)
- Daily backup of audit logs to separate storage
- Admin interface to search and export logs

### 13.4 Penetration Testing and Security Review

**Pre-Launch Security Checklist:**
- [ ] Vulnerability scan with OWASP ZAP
- [ ] Dependency vulnerability check (npm audit)
- [ ] SQL injection testing
- [ ] XSS testing (reflected, stored, DOM-based)
- [ ] CSRF testing
- [ ] Authentication bypass testing
- [ ] Authorization privilege escalation testing
- [ ] File upload vulnerability testing
- [ ] Rate limiting testing (DoS prevention)
- [ ] Session hijacking testing

**Third-Party Security Review:**
- Consider hiring external security firm for penetration testing before production launch
- Budget: R50,000 - R100,000 for comprehensive audit

---

## 14. Testing Strategy

### 14.1 Testing Pyramid

```
                    ▲
                   / \
                  /   \
                 /     \
                / E2E   \ (5%)
               /---------\
              /           \
             / Integration \ (15%)
            /---------------\
           /                 \
          /    Unit Tests     \ (80%)
         /---------------------\
```

### 14.2 Unit Testing

**Scope:** Individual functions and components in isolation

**Tools:** Jest, React Testing Library

**Examples:**
- `saveProgress()` function in projects/new/page.tsx
  - Test: Should skip save if no changes
  - Test: Should skip save if all fields empty
  - Test: Should call fetch() with correct payload
  - Test: Should update lastSavedData ref after save
- `calculateReadinessScore()` function (planned)
  - Test: Should return 0 for empty project
  - Test: Should return 40 for complete basics
  - Test: Should return 100 for fully complete project

**Target:** 80% code coverage

### 14.3 Integration Testing

**Scope:** Multiple components and API routes working together

**Tools:** Jest, Supertest (API testing)

**Examples:**
- **Authentication Flow:**
  1. POST /api/auth/signin with email
  2. Extract magic link from email (mock Resend)
  3. GET magic link URL
  4. Assert: User created in DB, session cookie set
  5. GET /portal (protected route)
  6. Assert: Page loads successfully (not redirected to login)

- **Project Creation Flow:**
  1. Authenticate user
  2. POST /api/projects with title
  3. Assert: Project created with DRAFT status
  4. PATCH /api/projects/[id] with Step 1 data
  5. GET /api/projects/[id]
  6. Assert: Step 1 data persisted correctly

**Target:** Critical user flows covered

### 14.4 End-to-End (E2E) Testing

**Scope:** Full user workflows from browser perspective

**Tools:** Playwright, Cypress

**Examples:**
- **Complete Application Submission:**
  1. Open landing page
  2. Click "Start Application"
  3. Enter email, submit
  4. Check email inbox (test email service)
  5. Click magic link
  6. Assert: Redirected to portal dashboard
  7. Click "New Application"
  8. Fill Step 1 form fields
  9. Click Next
  10. Fill Step 2 form fields
  11. Wait 30 seconds (auto-save)
  12. Assert: "Saved" toast appears
  13. Refresh page
  14. Assert: Data persists
  15. Continue through all 5 steps
  16. Click "Review"
  17. Submit application
  18. Assert: Status changed to SUBMITTED

**Target:** 5-10 critical user journeys

### 14.5 Manual Testing (Current Approach)

**Week 2, Day 6 Manual Tests:**
- ✅ User registration (new email)
- ✅ User login (existing email)
- ✅ Auto-save (type text → wait 30s → check DB)
- ✅ Form navigation (Previous/Next buttons)
- ✅ Manual save (click Save → toast notification)
- ✅ Session persistence (close browser → reopen)
- ✅ Logout

**Ongoing Manual Testing:**
- User acceptance testing (UAT) with DSTI staff (Week 5)
- Beta testing with selected companies (Week 6)

### 14.6 Performance Testing

**Load Testing** (Planned)
- Tool: k6, Apache JMeter
- Scenarios:
  - 100 concurrent users creating projects
  - 500 concurrent users browsing dashboard
  - 50 concurrent file uploads (10MB each)
- Targets:
  - Response time <2s for 95th percentile
  - No errors under expected load
  - Database connection pool not exhausted

**Stress Testing** (Planned)
- Gradually increase load to breaking point
- Identify maximum capacity
- Ensure graceful degradation (not catastrophic failure)

---

## 15. Deployment Architecture

### 15.1 Hosting Infrastructure

**Vercel Platform** (Primary Hosting)
- **Serverless Functions**: API routes auto-deployed as serverless functions
- **Edge Network**: Static assets served from 275+ edge locations globally
- **Automatic HTTPS**: SSL certificates via Let's Encrypt
- **Custom Domains**: dsti-platform.vercel.app (staging), app.dsti.gov.za (production - planned)
- **Preview Deployments**: Every Git branch gets unique URL for testing
- **Rollback**: One-click rollback to previous deployment

**Neon PostgreSQL** (Database)
- **Managed PostgreSQL**: Fully managed, serverless database
- **Connection Pooling**: Built-in pooling for serverless functions
- **Branching**: Database branching for safe testing
- **Autoscaling**: Storage and compute scale automatically
- **Backups**: Automated daily backups with point-in-time recovery
- **High Availability**: Multi-region replication (optional)

**Resend** (Email Delivery)
- **Transactional Email API**: Magic links, notifications
- **Deliverability**: High inbox placement rate (99%+)
- **Analytics**: Open rates, click rates, bounce tracking
- **Custom Domain**: emails@dsti.gov.za (production - planned)

### 15.2 Deployment Pipeline

```
Developer Push to GitHub
        ↓
Vercel Detects Change (Webhook)
        ↓
Install Dependencies (npm install)
        ↓
Run ESLint (npm run lint)
        ↓
Build Next.js Application (npm run build)
        ↓
Run Database Migrations (prisma migrate deploy)
        ↓
Deploy to Edge Network
        ↓
Health Check (GET /)
        ↓
Deployment Success / Failure Notification
```

### 15.3 Environment Configuration

**Development** (Local)
- `npm run dev` - Next.js development server
- Local PostgreSQL via Docker (deprecated) OR Neon staging database
- `.env.local` file with development secrets
- Hot module reloading

**Staging** (Vercel Preview)
- Branch: `development`
- URL: `dsti-platform-git-development.vercel.app`
- Neon staging database
- Staging Resend API key (test mode)
- Used for testing before production

**Production** (Vercel Production)
- Branch: `main`
- URL: `dsti-platform.vercel.app` → `app.dsti.gov.za` (custom domain)
- Neon production database
- Production Resend API key
- Monitoring and alerting enabled

### 15.4 Environment Variables

**Required Variables:**
```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# Authentication
NEXTAUTH_URL=https://app.dsti.gov.za
NEXTAUTH_SECRET=<random-32-char-string>

# Email
RESEND_API_KEY=re_xxxxxxxxxxxxxxxx
EMAIL_FROM=noreply@dsti.gov.za

# Optional (Production)
SENTRY_DSN=https://...
OPENAI_API_KEY=sk-...
```

**Security:**
- Environment variables stored in Vercel dashboard (encrypted)
- Never committed to Git
- Different values for staging vs. production

### 15.5 Monitoring and Alerting (Planned)

**Application Monitoring** (Sentry)
- Error tracking and stack traces
- Performance monitoring (slow API routes)
- User session replays (privacy-preserving)
- Alert on error rate spike

**Infrastructure Monitoring** (Vercel Analytics)
- Traffic volume (requests per second)
- Bandwidth usage
- Function execution time
- Cold starts

**Database Monitoring** (Neon Dashboard)
- Query performance (slow queries)
- Connection pool saturation
- Storage usage
- Replication lag (if multi-region)

**Uptime Monitoring** (UptimeRobot or similar)
- Ping homepage every 5 minutes
- Alert on downtime (email, SMS)
- Status page for public transparency

---

## 16. Project Timeline

### 16.1 Milestone Schedule

| Week | Milestone | Status | Deliverables |
|------|-----------|--------|--------------|
| **Week 1** | Foundation | ✅ Complete | Next.js setup, Tailwind CSS, Prisma, database schema |
| **Week 2** | Authentication & Project Builder |  Day 6/9 | NextAuth, wizard Steps 1-5, validation, drafts |
| **Week 3** | Evidence & AI | ⏳ Planned | File upload, AI co-pilot, readiness score |
| **Week 4** | Review Workflows | ⏳ Planned | Consultant screening, reviewer interface, decisions |
| **Week 5** | Admin & Public Website | ⏳ Planned | Admin backoffice, eligibility screener, knowledge hub |
| **Week 6** | Testing & Bug Fixes | ⏳ Planned | Unit tests, E2E tests, bug fixes |
| **Week 7** | UAT with DSTI Staff | ⏳ Planned | User acceptance testing, feedback incorporation |
| **Week 8** | Beta Testing | ⏳ Planned | Limited release to selected companies |
| **Week 9** | Production Launch | ⏳ Planned | Public launch, monitoring, support |

### 16.2 Detailed Sprint Plan (Week 2)

**Day 6** (✅ Completed - January 22, 2026)
- [x] NextAuth.js setup with Resend provider
- [x] Magic link authentication flow
- [x] User registration and organisation auto-creation
- [x] Project wizard component (reusable)
- [x] Step 1: Project Basics (5 fields)
- [x] Step 2: R&D Uncertainty (2 fields)
- [x] Smart auto-save (30s debounce, change detection)
- [x] API routes: POST/GET /api/projects, GET/PATCH /api/projects/[id]
- [x] Production deployment and ESLint fixes

**Day 7** ( In Progress - January 23, 2026)
- [ ] Step 3: Methodology & Innovation (3 fields: research approach, innovation description, challenges overcome)
- [ ] Step 4: Team & Expertise (3 fields: team size, key personnel, qualifications)
- [ ] Step 5: Budget & Expenditure (3 fields: total budget, R&D costs breakdown, timeline)
- [ ] Test complete 5-step wizard flow
- [ ] Commit and deploy

**Day 8** (⏳ Planned - January 24, 2026)
- [ ] Create Zod validation schemas for each step
- [ ] Implement real-time validation on form fields
- [ ] Display error messages below fields
- [ ] Prevent navigation to next step if validation errors
- [ ] Mark steps as complete when validated
- [ ] Update progress indicator with completion badges

**Day 9** (⏳ Planned - January 25, 2026)
- [ ] Create /portal/projects page (draft projects list)
- [ ] Display project cards with title, sector, progress percentage
- [ ] "Continue" button redirects to /portal/projects/[id]/edit
- [ ] "Delete" button with confirmation modal
- [ ] Load existing project data in wizard
- [ ] Resume functionality testing
- [ ] Week 2 review and documentation

### 16.3 Critical Path

**Blocking Dependencies:**
1. Wizard Steps 3-5 (Day 7) **blocks** → Validation (Day 8)
2. Validation (Day 8) **blocks** → Draft projects list (Day 9)
3. Week 2 complete **blocks** → Week 3 Evidence upload (needs project data to attach files to)
4. Evidence upload **blocks** → AI co-pilot (needs content to analyze)
5. AI co-pilot **blocks** → Readiness score (depends on AI evaluation)

**Parallel Workstreams (Week 3+):**
- Evidence management (frontend) can proceed in parallel with AI co-pilot backend
- Public website can be built in parallel with review workflows
- Admin backoffice can be built in parallel with reviewer interface

---

## 17. Risks and Mitigation

### 17.1 Technical Risks

**Risk 1: Email Deliverability Issues**
- **Probability:** Medium
- **Impact:** High (users can't log in)
- **Mitigation:**
  - Use reputable email service (Resend)
  - Implement custom domain (emails@dsti.gov.za) for better reputation
  - Add SPF, DKIM, DMARC records
  - Fallback: Allow admin to manually send magic links
  - Monitoring: Alert if bounce rate exceeds 5%

**Risk 2: Database Performance Degradation**
- **Probability:** Low
- **Impact:** High (slow page loads, timeouts)
- **Mitigation:**
  - Use connection pooling (Neon built-in)
  - Add database indexes on frequently queried fields
  - Monitor slow queries and optimize
  - Scale database compute if needed (Neon autoscaling)
  - Implement query caching (Redis - future enhancement)

**Risk 3: File Upload Failures (Large Files)**
- **Probability:** Medium
- **Impact:** Medium (user frustration)
- **Mitigation:**
  - Set reasonable file size limit (50MB)
  - Implement chunked upload for large files
  - Display progress bar during upload
  - Allow resumable uploads (if connection interrupted)
  - Provide clear error messages with troubleshooting steps

**Risk 4: AI Co-Pilot Cost Overruns**
- **Probability:** Medium
- **Impact:** Medium (budget exceeded)
- **Mitigation:**
  - Set usage limits per user (e.g., 10 AI suggestions per application)
  - Optimize prompts to reduce token usage
  - Cache common AI responses
  - Monitor daily spend and alert if threshold exceeded
  - Consider cheaper models (GPT-3.5) for less complex tasks

**Risk 5: Security Breach (Data Leak)**
- **Probability:** Low
- **Impact:** Critical (legal liability, reputational damage)
- **Mitigation:**
  - Implement all security best practices (see Section 13)
  - Conduct penetration testing before launch
  - Regular security audits (quarterly)
  - Incident response plan documented
  - Cyber insurance policy (recommend to DSTI)

### 17.2 Operational Risks

**Risk 6: Low User Adoption**
- **Probability:** Medium
- **Impact:** High (project failure)
- **Mitigation:**
  - Conduct user research with applicants before launch
  - Provide comprehensive onboarding (video tutorials, guides)
  - Offer live chat or phone support during first 3 months
  - Parallel run: Allow email submissions during transition period
  - Incentivize early adopters (faster processing for digital submissions)

**Risk 7: DSTI Staff Resistance to Change**
- **Probability:** Medium
- **Impact:** High (workflow disruption)
- **Mitigation:**
  - Involve DSTI staff in design process (user stories, feedback sessions)
  - Provide comprehensive training before launch
  - Start with pilot group (5 consultants, 3 reviewers)
  - Gradual rollout: Digital applications for new applicants only at first
  - Assign change champions within DSTI

**Risk 8: Incomplete Applications Still Submitted**
- **Probability:** High
- **Impact:** Low (same problem as before)
- **Mitigation:**
  - Implement readiness score (warn users if score <70%)
  - Block submission if critical fields missing
  - Provide clear guidance on required evidence
  - AI co-pilot improves description quality before submission

### 17.3 Project Management Risks

**Risk 9: Scope Creep**
- **Probability:** High
- **Impact:** Medium (delayed launch)
- **Mitigation:**
  - Strict change control process (change requests require approval)
  - Prioritize features using MoSCoW method (Must, Should, Could, Won't)
  - Defer "nice-to-have" features to post-launch roadmap
  - Weekly sprint reviews to track progress vs. plan

**Risk 10: Developer Unavailability**
- **Probability:** Low
- **Impact:** High (project stalled)
- **Mitigation:**
  - Comprehensive documentation (code comments, architecture docs)
  - Regular commits to GitHub (easy handover)
  - Cross-training: Consider second developer for critical path items
  - Backup plan: Contract external developer if needed

---

## 18. Success Metrics

### 18.1 Key Performance Indicators (KPIs)

**User Adoption Metrics:**
| Metric | Baseline | Target (6 months) | Measurement Method |
|--------|----------|-------------------|-------------------|
| % Digital Applications | 0% | 80% | Count(digital) / Count(total) |
| Active Users | 0 | 500 | Unique logins per month |
| Application Completion Rate | N/A | 85% | Submitted / Started |
| User Satisfaction (NPS) | N/A | 40+ | Post-submission survey |

**Efficiency Metrics:**
| Metric | Baseline | Target (6 months) | Measurement Method |
|--------|----------|-------------------|-------------------|
| Avg. Processing Time | 4-6 months | 2-3 months | Submitted date - Decision date |
| Incomplete Application Rate | 40% | 10% | Flagged for info / Total submitted |
| Info Request Rounds | 2-3 | 1 or less | Count email exchanges |
| Manual Data Entry Time | 3 hrs/app | 0.5 hrs/app | Consultant time tracking |

**Quality Metrics:**
| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Uptime | 99.5% | Uptime monitoring service |
| Page Load Time | <2s median | Vercel Analytics |
| Error Rate | <1% | Sentry error tracking |
| Security Incidents | 0 | Audit logs |

### 18.2 Success Criteria (Launch Readiness)

**Functional Completeness:**
- ✅ All 5 wizard steps operational
- ✅ Evidence upload working
- ✅ Application submission workflow complete
- ✅ Consultant screening interface functional
- ✅ Reviewer interface functional
- ✅ Decision and letter generation working

**Performance:**
- ✅ Page load time <2s (95th percentile)
- ✅ API response time <500ms (90th percentile)
- ✅ Passed load testing (100 concurrent users)

**Security:**
- ✅ Penetration testing passed (zero critical vulnerabilities)
- ✅ POPIA compliance review passed
- ✅ Security audit report approved

**User Acceptance:**
- ✅ UAT completed with DSTI staff (zero blocking issues)
- ✅ Beta testing with 10 companies (feedback incorporated)
- ✅ Training materials created (videos, guides)

**Operational Readiness:**
- ✅ Monitoring and alerting configured
- ✅ Incident response plan documented
- ✅ Support process defined (help desk, ticketing system)
- ✅ Runbook for common issues created

---

## 19. Conclusion

### 19.1 Project Summary

The DSTI R&D Tax Incentive Application Platform represents a significant digital transformation initiative that will modernize how South African companies apply for research and development tax incentives. By replacing the current fragmented, paper-based process with an integrated, intelligent digital system, the platform will deliver substantial benefits to all stakeholders:

**For Applicants:**
- Faster, more transparent application process
- Intelligent guidance reducing errors and rework
- Real-time status visibility
- Improved confidence in application quality

**For DSTI Staff:**
- Dramatic reduction in manual administrative tasks
- Standardized workflows and quality checks
- Better tools for decision-making
- Real-time analytics and reporting

**For South Africa's Economy:**
- Faster R&D investment decisions
- Lower barriers to tax incentive participation
- Improved government service delivery
- Foundation for future digital transformation initiatives

### 19.2 Current Status (Week 2, Day 6)

The project has made strong progress, completing the foundational infrastructure and core authentication/project management features. Key achievements include:

- ✅ Secure, passwordless authentication system
- ✅ Smart auto-save preventing data loss
- ✅ Multi-step wizard framework (2 of 5 steps complete)
- ✅ RESTful API architecture
- ✅ Production-ready database schema
- ✅ Successful deployment to Vercel

The codebase is well-structured, follows industry best practices, and has been validated against official DSTI requirements. All technical foundations are in place to rapidly build out remaining features.

### 19.3 Next Steps (Immediate Priorities)

**Week 2, Day 7-9:**
1. Complete remaining wizard steps (Methodology, Team, Expenditure)
2. Implement Zod validation for all form fields
3. Build draft projects dashboard with resume functionality

**Week 3:**
1. Evidence vault for document uploads
2. AI co-pilot for R&D description assistance
3. Readiness score algorithm

**Week 4:**
1. Consultant screening workflows
2. Reviewer interface and decision-making
3. Automated decision letter generation

### 19.4 Long-Term Vision

Beyond the initial launch, the platform can evolve into a comprehensive innovation management system:

**Phase 2 Enhancements (Post-Launch):**
- Multi-year project tracking (follow-up applications)
- Integration with SARS e-filing system (automatic tax credit processing)
- Advanced analytics and predictive insights
- Mobile app for on-the-go access
- Real-time collaboration (applicant ↔ reviewer messaging)

**Expansion Opportunities:**
- Extend to other DSTI grant programs (e.g., Technology Innovation Agency grants)
- White-label solution for other government departments
- API for third-party tax consultant integrations
- Public data portal (anonymized trends and statistics)

### 19.5 Recommendation

The project is on track for successful delivery within the planned 9-week timeline. The architecture is sound, the technology stack is appropriate, and the alignment with DSTI requirements is confirmed. Key success factors going forward:

1. **Maintain Focus**: Avoid scope creep; deliver core MVP first, iterate later
2. **User-Centric Design**: Continue validating with real users (DSTI staff and applicants)
3. **Quality Over Speed**: Prioritize security, performance, and usability over adding features
4. **Communication**: Regular stakeholder updates on progress and blockers
5. **Risk Management**: Proactively address identified risks, especially email deliverability

With continued execution discipline and stakeholder engagement, the DSTI R&D Tax Incentive Application Platform will deliver transformative value to South Africa's innovation ecosystem.

---

## 20. Appendices

### Appendix A: Glossary

- **R&D (Research and Development)**: Systematic investigative or experimental activities undertaken to discover new knowledge or create innovation
- **Section 11D**: Reference to Income Tax Act section defining R&D for tax incentive purposes
- **DSTI**: Department of Science, Technology and Innovation, South Africa
- **ITA**: Income Tax Act
- **POPIA**: Protection of Personal Information Act (South African data privacy law)
- **JWT**: JSON Web Token (stateless authentication token)
- **ORM**: Object-Relational Mapping (database abstraction layer)
- **RBAC**: Role-Based Access Control (authorization model)
- **NPS**: Net Promoter Score (user satisfaction metric)
- **UAT**: User Acceptance Testing (final validation by end users)

### Appendix B: References

1. DSTI Official Website: https://www.dsti.gov.za/
2. R&D Tax Incentive Portal: https://www.dsti.gov.za/rdtax/
3. R&D Tax Incentive Guidelines (Amended): [PDF available on DSTI website]
4. Income Tax Act Section 11D: [Legal reference]
5. POPIA Act (2013): [Legal reference]
6. Next.js Documentation: https://nextjs.org/docs
7. Prisma Documentation: https://www.prisma.io/docs
8. NextAuth.js Documentation: https://next-auth.js.org/

### Appendix C: Contact Information

**Developer:**
- Name: Chante (BikoToday)
- GitHub: https://github.com/BikoToday-Work/Student-Chante

**Project Repository:**
- GitHub: https://github.com/BikoToday-Work/Student-Chante
- Vercel Deployment: https://dsti-platform.vercel.app

**DSTI Stakeholders:**
- Email: rdtax@dsti.gov.za



