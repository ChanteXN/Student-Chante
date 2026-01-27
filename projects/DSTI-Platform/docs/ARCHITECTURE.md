# DSTI Platform - System Architecture

**Last Updated**: Week 2, Day 6 (January 21, 2026)  
**Status**: Authentication & Project Builder Implemented

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                         │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐        │
│  │   Public    │  │  Applicant  │  │  DSTI Admin  │        │
│  │   Website   │  │   Portal    │  │   Backoffice │        │
│  └─────────────┘  └─────────────┘  └──────────────┘        │
└─────────────────────────────────────────────────────────────┘
                             │
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│                      Next.js 15 App Router                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Route Groups:                                       │  │
│  │  • (public)/    - Landing, eligibility, guidelines   │  │
│  │  • (portal)/    - Project builder, evidence vault    │  │
│  │  • (admin)/     - Screening, review, decisions       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Shared Components:                                  │  │
│  │  • Sidebar      • TopBar      • Breadcrumbs         │  │
│  │  • UI Library (shadcn/ui)     • Tailwind CSS        │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                             │
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                      API / LOGIC LAYER                       │
│                   Next.js API Routes (Future)                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  • Authentication & RBAC                             │  │
│  │  • Project Management APIs                           │  │
│  │  • Evidence Management APIs                          │  │
│  │  • Review & Decision APIs                            │  │
│  │  • AI Co-Pilot Integration                           │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                             │
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                       DATA LAYER                             │
│  ┌──────────────────┐           ┌──────────────────┐       │
│  │  PostgreSQL DB   │           │  S3-Compatible   │       │
│  │  (via Prisma)    │           │  Object Storage  │       │
│  │                  │           │  (MinIO/S3)      │       │
│  │  • Users         │           │                  │       │
│  │  • Organisations │           │  • Evidence      │       │
│  │  • Projects      │           │  • Documents     │       │
│  │  • Reviews       │           │  • Attachments   │       │
│  │  • Audit Logs    │           │                  │       │
│  └──────────────────┘           └──────────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

## Application Flow

### Authentication Flow ( Implemented)
```
New User → Register Page → Enter Email → Verify Email (magic link)
                                              ↓
                         Email Sent → Click Magic Link → Session Created
                                              ↓
                         Organisation Auto-Created → Redirect to Portal

Existing User → Login Page → Enter Email → Magic Link Sent
                                              ↓
                           Click Link → Session Restored → Portal Dashboard
```

**Implementation Details:**
- **Provider**: NextAuth.js v5 with Resend email provider
- **Magic Links**: Passwordless authentication via email
- **Session Strategy**: JWT with 12-hour expiry, 1-hour refresh
- **Auto-Registration**: Users automatically registered on first magic link verification
- **Organisation Creation**: First-time users get auto-created organisation with membership
- **Email Service**: Resend API (`onboarding@resend.dev`)

### Public Website Flow
```
User → Landing Page → Check Eligibility → Eligibility Screener
                    → Browse Guidelines → Knowledge Hub
                    → Start Application → Register/Login (magic link)
```

### Applicant Portal Flow ( Week 2, Day 6 Complete)
```
Login → Dashboard → New Application → Project Builder Wizard
                                   ↓
                     Step 1: Project Basics (✅ Implemented)
                       • Title, Sector, Dates, Location
                       • Auto-save every 30 seconds
                                   ↓
                     Step 2: R&D Uncertainty (✅ Implemented)
                       • R&D Uncertainty Description
                       • Project Objectives
                       • Smart auto-save with change detection
                                   ↓
                     Step 3: Methodology (⏳ Planned Day 7)
                     Step 4: Team (⏳ Planned Day 7)
                     Step 5: Expenditure (⏳ Planned Day 7)
                                   ↓
                     Evidence Vault → Upload Documents (⏳ Week 3)
                                   ↓
                     Readiness Score → Review Suggestions (⏳ Week 3)
                                   ↓
                     Generate Pack → Submit Application (⏳ Week 3)
                                   ↓
                     Track Progress → Respond to Requests (⏳ Week 4)
```

### Admin Backoffice Flow
```
Login → Dashboard → View Applications → Screen & Triage
                                      ↓
                        Assign Reviewer → Review Details
                                      ↓
                        Request Info → Await Response
                                      ↓
                        Complete Review → Make Decision
                                      ↓
                        Generate Letter → Notify Applicant
                                      ↓
                        Audit Log
```

## Technology Stack

### Frontend ( Implemented)
- **Framework**: Next.js 15.5.9 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.4
- **UI Components**: shadcn/ui (Radix UI primitives)
  - Progress, Label, Textarea, Select, Toast, Button, Card, Input
- **Icons**: Lucide React
- **Form Management**: React Hook Form (planned)
- **Validation**: Zod schemas (planned for Day 8)

### Backend ( Partially Implemented)
- **API**: Next.js API Routes
  - `POST /api/auth/signin` (NextAuth - magic link generation)
  - `POST /api/projects` (Create new project)
  - `GET /api/projects` (List user's projects)
  - `GET /api/projects/[id]` (Fetch project with sections)
  - `PATCH /api/projects/[id]` (Update project + upsert sections)
- **Auth**: NextAuth.js v5 with Resend provider ( Implemented)
- **Email Service**: Resend API for magic link delivery ( Implemented)
- **Validation**: Field-level validation (basic) - Zod schemas pending

### Database ( Implemented)
- **Database**: PostgreSQL (Neon managed instance)
- **ORM**: Prisma 6.19.2
- **Migrations**: Prisma Migrate
- **Connection Pooling**: Configured via Neon
- **Schema Status**: Production-ready with validated relationships

### DevOps ( Implemented)
- **Version Control**: Git + GitHub
- **CI/CD**: Vercel automatic deployments (connected to `development` branch)
- **Build**: ESLint validation on push
- **Container**: Docker (local PostgreSQL - deprecated, using Neon now)

## Security Architecture

```
┌─────────────────────────────────────────┐
│         Security Layers                 │
├─────────────────────────────────────────┤
│  1. Authentication ( Implemented)     │
│     • Email magic link (NextAuth.js)    │
│     • JWT session management            │
│     • 12-hour session expiry            │
│     • Passwordless authentication       │
│     • Auto-registration on verification │
├─────────────────────────────────────────┤
│  2. Authorization ( Partial)          │
│     • Session-based route protection    │
│     • Middleware auth checks            │
│     • API route session validation      │
│     Role-based access (⏳ Planned):     │
│       - Applicant Role                  │
│       - Consultant Role                 │
│       - Reviewer Role                   │
│       - Admin Role                      │
├─────────────────────────────────────────┤
│  3. Data Protection ( Implemented)    │
│     • Prisma parameterized queries      │
│     • Foreign key constraints           │
│     • Cascade delete protection         │
│     • Unique constraints (prevent dupes)│
│     Planned:                            │
│       - Encrypted file storage (S3)     │
│       - XSS protection headers          │
├─────────────────────────────────────────┤
│  4. Audit & Compliance (⏳ Planned)     │
│     • Activity logging                  │
│     • Change tracking (timestamps)      │
│     • Audit trail                       │
└─────────────────────────────────────────┘
```

### Current Security Implementation

**Authentication Flow:**
1. User enters email on login/register page
2. NextAuth generates magic link with JWT token
3. Resend sends email with link
4. User clicks link → NextAuth verifies token
5. If valid and new user:
   - Create User record in database
   - Auto-create Organisation with naming: `{email-prefix}'s Organisation`
   - Create Membership record (role: ADMIN, isActive: true)
6. JWT session created and stored in cookie
7. Middleware validates session on protected routes
8. API routes check `session.user.id` before mutations

**Session Management:**
- Strategy: JWT (stateless)
- Max Age: 12 hours
- Update Age: 1 hour (refresh token)
- Cookie: httpOnly, secure (production), sameSite: lax
- Trust Host: Enabled for proper session persistence

## Data Model ( Implemented)

```
User ──┬── Membership ── Organisation ── Project ──┬── ProjectSection
       │         │                                  ├── EvidenceFile (⏳)
       │         │                                  ├── StatusHistory (⏳)
       │         │                                  └── ReviewerAssignment (⏳)
       │         │                                            │
       │         │                                            ├── ReviewerNote (⏳)
       │         │                                            └── Decision (⏳)
       │         │
       │         └── role: APPLICANT | CONSULTANT | REVIEWER | ADMIN
       │             isActive: boolean
       │
       └── createdAt, updatedAt timestamps
```

### Current Schema Details

**User Model:**
- id (UUID), email (unique), name, emailVerified, image
- Relationships: memberships[], comments[]

**Organisation Model:**
- id (UUID), name, registrationNo, sector, address
- createdAt, updatedAt timestamps
- Relationships: projects[], memberships[]
- **Note**: Auto-created for new users with format `{email-prefix}'s Organisation`

**Membership Model (Many-to-Many Join Table):**
- id (UUID), userId, organisationId, role, isActive
- Unique constraint: [userId, organisationId]
- Cascade: Delete membership when user or organisation deleted
- **Current Roles**: APPLICANT (default), CONSULTANT, REVIEWER, ADMIN

**Project Model:**
- id (UUID), organisationId, title, sector, startDate, endDate, location
- status: DRAFT | SUBMITTED | UNDER_REVIEW | APPROVED | REJECTED
- readinessScore (Float, nullable)
- submittedAt (DateTime, nullable)
- Relationships: sections[], evidenceFiles[], statusHistories[]
- Cascade: Delete project when organisation deleted

**ProjectSection Model (JSON Storage):**
- id (UUID), projectId, sectionKey, sectionData (JSON), isComplete
- Unique constraint: [projectId, sectionKey]
- **Current Section Keys**:
  - `basics`: title, sector, startDate, endDate, location
  - `uncertainty`: uncertainty description, objectives
  - `methodology`: (planned Day 7)
  - `team`: (planned Day 7)
  - `expenditure`: (planned Day 7)
- Cascade: Delete section when project deleted
- Upsert pattern prevents duplicate sections

### Database Relationships Validated 
- All foreign keys properly configured
- Cascade deletes protect data integrity
- Unique constraints prevent duplicates
- Indexes on frequently queried fields (userId, organisationId, projectId)
- JSON fields allow flexible section data without schema changes

## Deployment Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Vercel Edge                      │
│  ┌────────────────────────────────────────────┐   │
│  │  Next.js Application (Server Components)   │   │
│  │  • API Routes ( Implemented)             │   │
│  │  • Server Actions ( Planned)             │   │
│  │  • Middleware ( Auth check)              │   │
│  └────────────────────────────────────────────┘   │
│                                                      │
│  Automatic Deployments:                             │
│  • Branch: development → Preview URL                │
│  • ESLint validation on build                       │
│  • Environment variables configured                 │
└─────────────────────────────────────────────────────┘
                      │
         ┌────────────┴────────────┐
         ↓                         ↓
┌─────────────────┐       ┌─────────────────┐
│  PostgreSQL     │       │  S3 / Supabase  │
│  Neon (Managed) │       │  Object Storage │
│   Configured  │       │   Planned     │
└─────────────────┘       └─────────────────┘
```

### Current Deployment Configuration

**Hosting:** Vercel  
**Branch Strategy:**
- `main` → Production (not yet deployed)
- `development` → Preview deployments (active)

**Environment Variables Required:**
- `DATABASE_URL` - Neon PostgreSQL connection string 
- `NEXTAUTH_URL` - Application URL 
- `NEXTAUTH_SECRET` - JWT signing secret 
- `RESEND_API_KEY` - Email service API key 
- `EMAIL_FROM` - Sender email address 

**Build Process:**
1. Push to GitHub
2. Vercel detects changes
3. Install dependencies
4. Run ESLint checks
5. Build Next.js application
6. Deploy to edge network
7. Run Prisma migrations (if configured)

## Current Implementation Status

###  Completed (Week 1-2)

**Week 1 (Foundation):**
- [x] Next.js 15 application structure with App Router
- [x] Route groups (public, portal, admin)
- [x] Tailwind CSS styling system
- [x] shadcn/ui component library (Progress, Label, Textarea, Select, Toast, Button, Card, Input)
- [x] Prisma ORM setup with Neon PostgreSQL
- [x] Database schema with validated relationships
- [x] GitHub repository with CI configuration
- [x] Vercel deployment configuration

**Week 2, Day 6 (Authentication & Project Builder):**
- [x] NextAuth.js v5 implementation with Resend
- [x] Magic link passwordless authentication
- [x] User registration flow (automatic on first login)
- [x] Organisation auto-creation for new users
- [x] SessionProvider integration
- [x] Protected route middleware
- [x] Project Builder Wizard component (reusable)
- [x] Step 1: Project Basics (title, sector, dates, location)
- [x] Step 2: R&D Uncertainty (uncertainty, objectives)
- [x] Smart auto-save system:
  - 30-second debounce timer
  - Change detection (prevents duplicate saves)
  - Empty field filtering (prevents null pollution)
  - Visual feedback (Saving.../Saved)
- [x] API Routes:
  - POST /api/projects (create with org auto-creation)
  - GET /api/projects (list user's projects)
  - GET /api/projects/[id] (fetch with sections)
  - PATCH /api/projects/[id] (update with section upsert)
- [x] Next.js 15 async params pattern compliance
- [x] Production build passing (ESLint validated)

###  In Progress (Week 2, Day 7)
- [ ] Step 3: Methodology & Innovation
- [ ] Step 4: Team & Expertise
- [ ] Step 5: Budget & Expenditure

###  Planned (Week 2, Day 8-9)

**Day 8:**
- [ ] Form validation with Zod schemas
- [ ] Real-time field validation
- [ ] Error messaging and prevention
- [ ] Mark steps as complete

**Day 9:**
- [ ] Resume functionality (load existing drafts)
- [ ] Draft projects dashboard at /portal/projects
- [ ] Project cards with progress indicators
- [ ] Continue/Delete actions

###  Future Weeks

**Week 3:**
- [ ] Evidence vault file upload
- [ ] AI Co-Pilot for R&D descriptions
- [ ] Review and submission workflow
- [ ] Generate application pack

**Week 4:**
- [ ] Consultant assignment interface
- [ ] Reviewer workflows
- [ ] Decision-making interface
- [ ] Audit logging

**Week 5+:**
- [ ] Admin backoffice enhancements
- [ ] Reporting and analytics
- [ ] Email notifications
- [ ] Advanced RBAC

###  Technical Debt
- [ ] Proper organisation onboarding flow (currently auto-creates)
- [ ] Check for existing drafts before creating new project
- [ ] Error boundaries for API failures
- [ ] Loading skeletons for better UX
- [ ] Unit tests for auto-save logic
- [ ] Integration tests for wizard flow
- [ ] S3-compatible storage integration

---

**Architecture Status**: Authentication & Core Project Builder Complete  
**Current Sprint**: Week 2, Day 6 → Day 7  
**Next Milestone**: Complete all 5 wizard steps (Day 7)  
**Next Review**: End of Week 2 (Day 9)

## Key Architectural Decisions

### 1. Magic Link Authentication (Implemented)
**Decision**: Use NextAuth.js with Resend for passwordless authentication  
**Rationale**:
- Eliminates password management complexity
- Better UX for infrequent users (annual applications)
- Industry standard for government/enterprise applications
- Resend provides reliable email delivery

**Trade-offs**:
- Email dependency (users need access to email)
- Slightly longer login flow vs saved passwords
- Email deliverability concerns (spam filters)

### 2. JSON Storage for Project Sections (Implemented)
**Decision**: Use `sectionData JSON` field instead of fixed columns  
**Rationale**:
- Flexibility to add/modify form fields without migrations
- Allows different projects to have different data structures
- Simplifies wizard step implementation
- Upsert pattern with unique constraint prevents duplicates

**Trade-offs**:
- Less type safety at database level
- Requires JSON validation in application layer
- Harder to query specific fields (but not needed for our use case)

### 3. Organisation Auto-Creation (Temporary)
**Decision**: Automatically create organisation on first login  
**Rationale**:
- Unblocks MVP development
- Allows testing full application flow
- Simplifies initial user experience

**Trade-offs**:
- Not suitable for production (needs proper onboarding)
- Creates placeholder data (registrationNo, address)
- Marked as technical debt for Week 5

### 4. 30-Second Auto-Save (Implemented)
**Decision**: Debounce auto-save to 30 seconds with smart validation  
**Rationale**:
- Industry standard for form auto-save (Google Docs, Notion, etc.)
- Balances data safety with server load
- Change detection prevents unnecessary writes
- Empty field filtering prevents DB pollution

**Trade-offs**:
- User could lose up to 30 seconds of work if browser crashes
- More frequent saves = higher DB load
- Less frequent = more data loss risk

### 5. DSTI Requirements Alignment (Validated)
**Decision**: Structure wizard steps around official DSTI R&D Tax Incentive application requirements  
**Rationale**:
- Step 1 (Basics) → Administrative information (company, sector, timeline)
- Step 2 (Uncertainty) → Systematic investigative activities with uncertain outcomes
- Step 3 (Methodology) → Description of activities and innovation aspects
- Step 4 (Team) → Qualifications and expertise
- Step 5 (Expenditure) → R&D costs breakdown

**Validation**: Confirmed against https://www.dsti.gov.za/rdtax/ official guidelines

---

**Document Version**: 2.0  
**Last Updated**: January 22, 2026 (Week 2, Day 6)
