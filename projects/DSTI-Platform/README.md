# DSTI R&D Tax Incentive Platform MVP

Modern, secure, audit-ready R&D Tax Incentive application platform for the Department of Science, Technology and Innovation (DSTI).

##  Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js (planned)
- **AI**: RAG-based compliance co-pilot (planned)
- **Deployment**: Vercel

##  Project Structure

```
├── app/
│   ├── (public)/        # Public-facing pages
│   ├── (portal)/        # Applicant portal
│   ├── (admin)/         # DSTI backoffice
│   └── layout.tsx       # Root layout
├── components/
│   ├── ui/              # shadcn/ui components
│   └── layout/          # Shared layout components
├── lib/
│   ├── prisma.ts        # Database client
│   └── utils.ts         # Utility functions
└── prisma/
    └── schema.prisma    # Database schema

```

##  Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 14+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd DSTI-Platform
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

Edit `.env` with your database credentials.

4. Run database migrations
```bash
npx prisma migrate dev
```

5. Start the development server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

##  Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run db:push` - Push schema to database
- `npm run db:seed` - Seed database with demo data
- `npm run db:reset` - Reset database and reseed
- `npx prisma studio` - Open database browser

##  Sprint Progress

### Week 1 (Jan 13-17) ✅ Day 5 Complete
- [x] **Day 1**: Repo setup + Next.js baseline
- [x] **Day 2**: Data model v1 + migrations + seed
  - [x] Comprehensive Prisma schema (12 models, 3 enums)
  - [x] Database migrations generated
  - [x] Seed script with demo data (4 users, 1 org, 1 project)
- [x] **Day 3**: Auth + RBAC
  - [x] NextAuth.js 5.0 with magic link email authentication
  - [x] Role-Based Access Control (ADMIN, REVIEWER, APPLICANT, CONSULTANT)
  - [x] JWT sessions with Edge Runtime middleware
  - [x] 12-hour session expiration with 1-hour refresh
  - [x] Sign out functionality
  - [x] Fixed JWT token role passing for middleware
- [x] **Day 4**: Public website v1 + IA
  - [x] Premium landing page with hero, features, stats
  - [x] "How It Works" visual timeline (5 steps)
  - [x] "Guidelines Hub" searchable knowledge base
  - [x] 6 comprehensive guideline articles with full content
  - [x] Clickable cards with modal detail view
  - [x] Real-time search across titles, descriptions, categories, tags
  - [x] Consistent navigation and footer across public pages
  - [x] shadcn/ui components (Input, Badge) installed
  - [x] Mobile responsive design
- [x] **Day 5**: Eligibility screener + registration system
  - [x] 7-question eligibility screener with weighted scoring
  - [x] 3-tier outcome system (eligible 80%+, borderline 60-79%, not eligible <60%)
  - [x] Visual results with score progress bar and checklist
  - [x] Complete registration system (page + API + database)
  - [x] Organization creation during signup (optional)
  - [x] User flow optimization (eligibility → register → login → portal)
  - [x] Middleware fix for public routes (/register, /eligibility, etc.)
  - [x] Full mobile responsiveness with hamburger menu
  - [x] Login page success banner after registration
  - [x] Hydration error fixes (Input and Button components)

### Day 5 Deliverables Summary

**Problem Identified:**
- Platform had login but no registration system - critical gap preventing new users from creating accounts

**Pages Created:**
- `/eligibility` - Public eligibility screener with 7 weighted questions
- `/register` - User registration page with name, email, organization fields

**API Endpoints:**
- `POST /api/auth/register` - Create new APPLICANT users with optional organization

**Features Implemented:**
- Multi-step eligibility form with Yes/No/Unsure options
- Smart scoring: required criteria + percentage-based outcome tiers
- Contextual next steps based on qualification result
- User registration with duplicate email detection (409 response)
- Auto-create Organization + Membership when org name provided
- Success animation with auto-redirect to login
- Login page shows success banner after registration (query param detection)
- Middleware whitelist for public routes (fixed redirect loop)

**Mobile Responsiveness:**
- Landing page hamburger menu (Menu/X icon toggle)
- Responsive hero section (text scales, buttons stack on mobile)
- Eligibility page mobile optimization (stacked buttons, responsive cards)
- Registration page mobile layout (full width, centered container)
- Tested on 320px to 1920px screen widths

**User Flow:**
Landing → Check Eligibility → See Results → Start Application → Register → Login → Magic Link → Portal

**Technical:**
- Weighted scoring algorithm with required question validation
- Client-side form validation + server-side validation
- TypeScript type safety throughout
- suppressHydrationWarning for browser extension compatibility
- Email lowercase normalization for consistency

**Documentation:**
- Comprehensive Day 5 summary (`docs/DAY-5-SUMMARY.md`)
- Testing checklist with all scenarios validated
- Phase 2 enhancement roadmap

**Next Steps (Day 6-7):**
- Project Builder Wizard with 5 steps
- Autosave and resume functionality
- React Hook Form + Zod validation
- Progress indicator UI



##  Security

- RBAC (Role-Based Access Control)
- Secure file uploads
- Audit logging
- SQL injection prevention via Prisma

##  License

Proprietary - DSTI Government Project

##  Developer

Developed as part of DSTI MVP Sprint (Jan 2026)
