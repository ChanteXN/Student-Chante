# Quick Start Guide

## Running the Application Locally

### Option 1: Without Database (UI Only)

```bash
npm install
npm run dev
```

Visit: http://localhost:3000

### Option 2: With PostgreSQL (Full Stack)

1. **Start PostgreSQL** (using Docker):
```bash
docker-compose up -d
```

2. **Set up environment**:
```bash
# Copy the example env file
cp .env.example .env

# The default DATABASE_URL should work with Docker Compose
```

3. **Run database migrations**:
```bash
npx prisma migrate dev
```

4. **Generate Prisma Client**:
```bash
npx prisma generate
```

5. **Start the application**:
```bash
npm run dev
```

Visit: http://localhost:3000

## Available Routes

| Route | Description | Status |
|-------|-------------|--------|
| `/` | Public landing page |  Live |
| `/portal` | Applicant dashboard |  Live |
| `/admin` | DSTI admin dashboard |  Live |
| `/eligibility` | Eligibility screener |  Day 5 |

## Development Commands

```bash
# Development
npm run dev              # Start dev server

# Building
npm run build            # Build for production
npm start                # Start production server

# Quality Checks
npm run lint             # Run ESLint
npm run typecheck        # TypeScript validation

# Database
npx prisma studio        # Open Prisma Studio (DB GUI)
npx prisma migrate dev   # Create & apply migration
npx prisma generate      # Generate Prisma Client
```

## Troubleshooting

### Port 3000 already in use
```bash
# Kill the process using port 3000
npx kill-port 3000
```

### Database connection issues
```bash
# Check if PostgreSQL is running
docker-compose ps

# Restart PostgreSQL
docker-compose restart postgres

# View logs
docker-compose logs postgres
```

### Prisma Client not found
```bash
npx prisma generate
```

## Project Structure Quick Reference

```
app/                    # Next.js App Router pages
  (public)/            # Public pages (no auth)
  (portal)/            # Applicant portal (auth required)
  (admin)/             # Admin backoffice (admin role)

components/            # React components
  ui/                  # shadcn/ui components
  layout/              # Layout components (Sidebar, TopBar, etc.)

lib/                   # Utility functions
  prisma.ts           # Database client
  utils.ts            # Helper functions

prisma/                # Database
  schema.prisma       # Database schema
```

## What's Next?

**Day 2** (Wednesday, Jan 14): Data Model v1 + Seed Data
- Complete Prisma schema with all models
- Create migrations
- Seed demo data
- Test database operations

---

 Check [README.md](../README.md) or review [DAY-1-SUMMARY.md](./DAY-1-SUMMARY.md)
