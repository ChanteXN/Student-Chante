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

### Week 1 (Jan 13-17)  Day 2 Complete
- [x] **Day 1**: Repo setup + Next.js baseline
- [x] **Day 2**: Data model v1 + migrations + seed
  - [x] Comprehensive Prisma schema (12 models, 3 enums)
  - [x] Database migrations generated
  - [x] Seed script with demo data (4 users, 1 org, 1 project)
- [ ] Day 3: Auth + RBAC
- [ ] Day 4: Public website
- [ ] Day 5: Eligibility screener

##  Security

- RBAC (Role-Based Access Control)
- Secure file uploads
- Audit logging
- SQL injection prevention via Prisma

##  License

Proprietary - DSTI Government Project

##  Developer

Developed as part of DSTI MVP Sprint (Jan 2026)
