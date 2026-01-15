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

### Week 1 (Jan 13-17) ✅ Day 4 Complete
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
- [ ] **Day 5**: Eligibility screener v1 + deployment

### Day 4 Deliverables Summary

**Pages Created:**
- `/` - Enhanced landing page with hero section, 4 feature cards, stats section, CTA
- `/how-it-works` - 5-step visual timeline explaining application process
- `/guidelines` - Searchable knowledge base with 6 full guideline articles

**Guidelines Content:**
1. Section 11D R&D Tax Incentive Overview
2. Defining R&D Activities (uncertainty, investigation, advancement)
3. Eligible Expenditure Categories (staff, consumables, depreciation)
4. Evidence Requirements & Best Practices
5. Application Process & Timeline
6. Common Rejection Reasons & How to Avoid Them

**Features Implemented:**
- Real-time search filtering (title, description, category, tags)
- Clickable guideline cards open full content in modal
- Modal with markdown rendering, badges, close functionality
- Result count display
- Responsive layout with Tailwind CSS
- Consistent header/footer navigation
- Icon system (lucide-react)

**Technical:**
- Client-side state management with useState
- suppressHydrationWarning to handle browser extension interference
- TypeScript type safety throughout
- shadcn/ui component integration

**Next Steps (Day 5):**
- Build eligibility screener form
- Implement qualification decision logic
- Display outcome with next steps CTA
- Deploy v1 and verify mobile responsiveness



##  Security

- RBAC (Role-Based Access Control)
- Secure file uploads
- Audit logging
- SQL injection prevention via Prisma

##  License

Proprietary - DSTI Government Project

##  Developer

Developed as part of DSTI MVP Sprint (Jan 2026)
