# DSTI Platform - System Architecture (Day 1)

## High-Level Architecture

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

### Public Website Flow
```
User → Landing Page → Check Eligibility → Eligibility Screener
                    → Browse Guidelines → Knowledge Hub
                    → Start Application → Login/Register
```

### Applicant Portal Flow
```
Login → Dashboard → Create Project → Project Builder Wizard
                                   ↓
                     Step 1: Project Basics
                     Step 2: R&D Uncertainty
                     Step 3: Methodology
                     Step 4: Team
                     Step 5: Expenditure
                                   ↓
                     Evidence Vault → Upload Documents
                                   ↓
                     Readiness Score → Review Suggestions
                                   ↓
                     Generate Pack → Submit Application
                                   ↓
                     Track Progress → Respond to Requests
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

## Technology Stack (Day 1)

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.4
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React

### Backend (Future)
- **API**: Next.js API Routes
- **Auth**: NextAuth.js (planned)
- **Validation**: Zod (planned)

### Database
- **Database**: PostgreSQL 16
- **ORM**: Prisma
- **Migrations**: Prisma Migrate
- **Local Dev**: Docker Compose

### DevOps
- **Version Control**: Git + GitHub
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel (planned)
- **Container**: Docker

## Security Architecture (Planned)

```
┌─────────────────────────────────────────┐
│         Security Layers                 │
├─────────────────────────────────────────┤
│  1. Authentication (NextAuth)           │
│     • Email magic link / OTP            │
│     • Session management                │
├─────────────────────────────────────────┤
│  2. Authorization (RBAC)                │
│     • Applicant Role                    │
│     • Consultant Role                   │
│     • Reviewer Role                     │
│     • Admin Role                        │
├─────────────────────────────────────────┤
│  3. Data Protection                     │
│     • Encrypted file storage            │
│     • SQL injection prevention (Prisma) │
│     • XSS protection                    │
├─────────────────────────────────────────┤
│  4. Audit & Compliance                  │
│     • Activity logging                  │
│     • Change tracking                   │
│     • Audit trail                       │
└─────────────────────────────────────────┘
```

## Data Model (Day 2 - Preview)

```
User ──┬── Membership ── Organisation
       │
       └── ProjectOwnership ── Project ──┬── ProjectSection
                                         ├── EvidenceFile
                                         ├── StatusHistory
                                         └── ReviewerAssignment
                                                   │
                                                   ├── ReviewerNote
                                                   └── Decision
```

## Deployment Architecture (Planned)

```
┌─────────────────────────────────────────────────────┐
│                    Vercel Edge                      │
│  ┌────────────────────────────────────────────┐   │
│  │  Next.js Application (Server Components)   │   │
│  │  • API Routes                               │   │
│  │  • Server Actions                           │   │
│  └────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
                      │
         ┌────────────┴────────────┐
         ↓                         ↓
┌─────────────────┐       ┌─────────────────┐
│  PostgreSQL     │       │  S3 / Supabase  │
│  (Managed)      │       │  Object Storage │
└─────────────────┘       └─────────────────┘
```

## Current Implementation Status

###  Implemented (Day 1)
- Next.js application structure
- Route groups (public, portal, admin)
- Tailwind CSS styling system
- shadcn/ui component library
- Prisma ORM setup
- Docker Compose for PostgreSQL
- GitHub Actions CI pipeline
- Deployment configuration

###  Next Steps (Day 2-5)
- Database schema definition
- Authentication system
- RBAC middleware
- Public website pages
- Eligibility screener

###  Future Weeks
- Project Builder Wizard (Week 2)
- AI Co-Pilot (Week 3)
- Review workflows (Week 4)

---

**Architecture Status**: Foundation Complete
**Next Review**: Day 5 (End of Week 1)
