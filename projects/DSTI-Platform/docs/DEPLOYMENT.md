# DSTI Platform - Vercel Deployment Guide

**Date:** January 16, 2026  
**Version:** 1.0 (Day 5)

## Overview

This guide walks you through deploying the DSTI R&D Tax Incentive Platform to Vercel with PostgreSQL database and Resend email service.

## Prerequisites

- GitHub account (code already pushed to repository)
- Vercel account (free tier works)
- Resend account (free tier: 3,000 emails/month)
- Domain name (optional - Vercel provides free subdomain)

---

## Part 1: Database Setup (Choose One Option)

### Option A: Neon PostgreSQL (Recommended - Better Free Tier)

**Why Neon:**
- ✅ 0.5 GB storage free (vs Vercel 256 MB)
- ✅ Always-on compute (no cold starts)
- ✅ Built-in connection pooling
- ✅ Generous free tier

**Steps:**

1. **Create Neon Account**
   - Go to https://neon.tech
   - Sign up with GitHub
   - Create new project: `dsti-platform-prod`

2. **Get Connection String**
   - Copy the connection string from dashboard
   - Format: `postgresql://user:password@ep-name.region.neon.tech/dbname?sslmode=require`
   - Save this - you'll need it for Vercel

3. **Keep Dashboard Open** - You'll run migrations later

### Option B: Vercel Postgres

**Steps:**

1. **Create Database**
   - Go to Vercel dashboard → Storage → Create Database
   - Select PostgreSQL
   - Choose region (closest to your users)
   - Name: `dsti-platform-db`

2. **Get Connection String**
   - After creation, copy `POSTGRES_PRISMA_URL`
   - Save for later

---

## Part 2: Email Service Setup (Resend)

**Why Resend:**
- ✅ 3,000 emails/month free
- ✅ 100 emails/day free
- ✅ Built for transactional emails
- ✅ Simple API, great DX

**Steps:**

1. **Create Resend Account**
   - Go to https://resend.com
   - Sign up with email
   - Verify email address

2. **Get API Key**
   - Dashboard → API Keys → Create API Key
   - Name: `DSTI Platform Production`
   - Permissions: `Sending access`
   - Copy the key (starts with `re_`)
   - **Save this key - you can only view it once!**

3. **Configure Domain (Optional but Recommended)**
   
   **Option 1: Use Your Domain**
   - Dashboard → Domains → Add Domain
   - Enter your domain: `yourdomain.com`
   - Add DNS records as shown (MX, TXT, CNAME)
   - Verify domain
   - Emails will send from: `noreply@yourdomain.com`

   **Option 2: Use Resend Subdomain (For Testing)**
   - No setup needed
   - Emails send from: `onboarding@resend.dev`
   - May go to spam
   - **Good for testing, use real domain for production**

4. **Test Email (Optional)**
   ```bash
   curl -X POST https://api.resend.com/emails \
     -H "Authorization: Bearer YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "from": "noreply@yourdomain.com",
       "to": "your-email@example.com",
       "subject": "Test Email",
       "html": "<p>Email works!</p>"
     }'
   ```

---

## Part 3: Vercel Deployment

### Step 1: Connect GitHub Repository

1. **Go to Vercel**
   - Visit https://vercel.com
   - Sign in with GitHub
   - Click "Add New" → "Project"

2. **Import Repository**
   - Search for: `BikoToday-Work/Student-Chante`
   - Select the repository
   - Root Directory: `projects/DSTI-Platform`
   - Framework Preset: Next.js (auto-detected)
   - Click "Import"

### Step 2: Configure Environment Variables

Before deploying, add these environment variables:

1. **Click "Configure Project"**

2. **Add Environment Variables:**

   ```env
   # Database (from Neon or Vercel Postgres)
   DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
   
   # NextAuth
   NEXTAUTH_URL=https://your-app.vercel.app
   NEXTAUTH_SECRET=generate-this-below
   
   # Email (from Resend)
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   EMAIL_FROM=DSTI Platform <noreply@yourdomain.com>
   ```

3. **Generate NEXTAUTH_SECRET:**
   ```bash
   # Run this in your terminal
   openssl rand -base64 32
   ```
   Copy the output and paste as `NEXTAUTH_SECRET`

4. **Set for All Environments:**
   - Check boxes: Production, Preview, Development
   - This ensures consistency across deployments

### Step 3: Deploy

1. **Click "Deploy"**
   - Vercel will build and deploy your app
   - Takes 2-3 minutes
   - Watch build logs for errors

2. **Get Deployment URL**
   - After successful deployment: `https://your-app.vercel.app`
   - Update `NEXTAUTH_URL` if different
   - Go to Settings → Environment Variables → Edit `NEXTAUTH_URL`
   - Redeploy (Settings → Redeploy)

---

## Part 4: Database Migration

**IMPORTANT:** Run migrations on production database

### Option 1: Using Vercel CLI (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Link Project:**
   ```bash
   cd projects/DSTI-Platform
   vercel link
   # Select your team and project
   ```

4. **Pull Environment Variables:**
   ```bash
   vercel env pull .env.production
   ```

5. **Run Migrations:**
   ```bash
   npx prisma migrate deploy
   ```

6. **Seed Database (Optional):**
   ```bash
   npx prisma db seed
   ```

### Option 2: Using Direct Connection

1. **Update Local .env:**
   ```env
   DATABASE_URL="your-production-postgres-url"
   ```

2. **Run Migrations:**
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```

3. **Restore Local .env:**
   ```env
   DATABASE_URL="file:./dev.db"
   ```

---

## Part 5: Post-Deployment Verification

### Test Checklist

1. **Landing Page:**
   - Visit `https://your-app.vercel.app`
   - Check hero section loads
   - Test hamburger menu on mobile
   - Click "Check Eligibility"

2. **Eligibility Screener:**
   - Complete 7 questions
   - Submit and check results
   - Click "Start Application"

3. **Registration:**
   - Fill in name, email, organization
   - Submit form
   - Check for success animation

4. **Email (Magic Link):**
   - Go to login page
   - Enter email address
   - Check email inbox (might be in spam first time)
   - Click magic link
   - Should redirect to `/portal`

5. **Authentication:**
   - Verify logged in (check session)
   - Test sign out
   - Try accessing `/portal` without login (should redirect)

6. **Public Routes:**
   - `/` - Landing page ✓
   - `/eligibility` - Screener ✓
   - `/register` - Registration ✓
   - `/how-it-works` - Timeline ✓
   - `/guidelines` - Knowledge base ✓
   - `/login` - Login page ✓

7. **Protected Routes:**
   - `/portal` - Should redirect to login if not authenticated
   - After login, should access successfully

### Common Issues & Fixes

#### Issue: "Database connection error"
**Fix:**
- Check `DATABASE_URL` in Vercel environment variables
- Ensure connection string includes `?sslmode=require` for Neon
- Verify database is active (Neon might suspend after inactivity)

#### Issue: "Magic link not sent"
**Fix:**
- Check `RESEND_API_KEY` is correct
- Verify `EMAIL_FROM` domain is verified in Resend
- Check Resend dashboard → Emails → See delivery logs
- Check spam folder

#### Issue: "NEXTAUTH_URL mismatch"
**Fix:**
- Update `NEXTAUTH_URL` to match your actual Vercel URL
- No trailing slash: `https://app.vercel.app` ✓
- With trailing slash: `https://app.vercel.app/` ✗

#### Issue: "Build failed - Prisma generate"
**Fix:**
- Ensure `prisma generate` runs in build command
- Vercel should auto-detect this
- Check `package.json` has `postinstall` script:
  ```json
  "postinstall": "prisma generate"
  ```

#### Issue: "Public routes redirect to login"
**Fix:**
- Check `auth.config.ts` has all public routes listed
- Should include: `/`, `/login`, `/register`, `/eligibility`, `/how-it-works`, `/guidelines`

---

## Part 6: Domain Setup (Optional)

### Add Custom Domain

1. **Go to Vercel Dashboard**
   - Project Settings → Domains

2. **Add Domain:**
   - Enter your domain: `app.yourdomain.com`
   - Follow DNS instructions

3. **Update Environment Variables:**
   - `NEXTAUTH_URL`: `https://app.yourdomain.com`
   - Redeploy

4. **Update Resend Email:**
   - Verify domain in Resend
   - Update `EMAIL_FROM` in Vercel env vars

---

## Part 7: Monitoring & Maintenance

### Vercel Analytics (Optional)

1. **Enable Analytics:**
   - Project Dashboard → Analytics → Enable
   - Track page views, load times

2. **Enable Speed Insights:**
   - Install package:
     ```bash
     npm install @vercel/speed-insights
     ```
   - Add to `app/layout.tsx`:
     ```tsx
     import { SpeedInsights } from '@vercel/speed-insights/next';
     export default function RootLayout() {
       return (
         <html>
           <body>
             {children}
             <SpeedInsights />
           </body>
         </html>
       );
     }
     ```

### Database Monitoring

**Neon:**
- Dashboard → Metrics
- Monitor connections, query performance
- Set up alerts for high usage

**Vercel Postgres:**
- Storage tab → Database → Metrics
- Track storage, queries

### Email Monitoring

**Resend:**
- Dashboard → Emails
- View delivery status
- Check bounce rate
- Monitor API usage (free tier: 3,000/month)

---

## Part 8: Rollback Plan

### If Deployment Fails

1. **Check Build Logs:**
   - Vercel Dashboard → Deployments → Failed Build
   - Read error messages

2. **Rollback to Previous Version:**
   - Deployments → Select working deployment
   - Click "Promote to Production"

3. **Fix Locally:**
   - Fix issue in code
   - Test locally: `npm run build`
   - Commit and push
   - Vercel auto-deploys

### Database Rollback

**CRITICAL:** Prisma migrations are one-way

**Before Major Changes:**
```bash
# Backup production database
pg_dump DATABASE_URL > backup-$(date +%F).sql

# Or use Neon/Vercel backups (available in dashboard)
```

---

## Part 9: Environment-Specific Configurations

### Development Environment

```env
DATABASE_URL="postgresql://localhost:5432/dsti_platform_dev"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="dev-secret-not-secure"
RESEND_API_KEY="re_test_xxxxx"  # Use test mode
EMAIL_FROM="Dev <dev@localhost>"
```

### Production Environment (Vercel)

```env
DATABASE_URL="postgresql://prod-connection-string"
NEXTAUTH_URL="https://your-app.vercel.app"
NEXTAUTH_SECRET="secure-random-32-byte-string"
RESEND_API_KEY="re_prod_xxxxx"
EMAIL_FROM="DSTI Platform <noreply@yourdomain.com>"
```

---

## Quick Reference

### Essential Commands

```bash
# Local development
npm run dev

# Build test
npm run build
npm run start

# Database
npx prisma generate        # Generate Prisma client
npx prisma migrate dev     # Run migrations (dev)
npx prisma migrate deploy  # Run migrations (prod)
npx prisma db seed         # Seed database
npx prisma studio          # Open database browser

# Vercel CLI
vercel                     # Deploy to preview
vercel --prod              # Deploy to production
vercel env pull            # Download env vars
vercel logs                # View production logs
```

### Important URLs

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Neon Dashboard:** https://console.neon.tech
- **Resend Dashboard:** https://resend.com/overview
- **NextAuth Docs:** https://authjs.dev
- **Prisma Docs:** https://www.prisma.io/docs

---

## Cost Breakdown (Free Tier)

| Service | Free Tier | Cost After Limit |
|---------|-----------|------------------|
| **Vercel** | 100 GB bandwidth/month<br>6,000 build minutes/month | $20/month Pro plan |
| **Neon PostgreSQL** | 0.5 GB storage<br>Always-on compute<br>1 project | $19/month with more storage |
| **Resend** | 3,000 emails/month<br>100 emails/day | $20/month for 50,000 emails |
| **Domain (optional)** | N/A | ~$12/year (varies by TLD) |

**Total Free Tier:** Perfect for MVP and initial users  
**Estimated Month 2+ Costs:** $0-20 depending on usage

---

## Next Steps After Deployment

1. **Test End-to-End Flow**
   - Register new user
   - Complete eligibility screening
   - Test magic link login
   - Access portal

2. **Set Up Monitoring**
   - Enable Vercel Analytics
   - Configure Sentry (error tracking)
   - Set up uptime monitoring (UptimeRobot)

3. **Security Hardening**
   - Enable CORS properly
   - Set up rate limiting (Vercel KV + middleware)
   - Add CSP headers
   - Review auth configuration

4. **Performance Optimization**
   - Add Redis caching (Vercel KV)
   - Optimize images (next/image)
   - Enable ISR for public pages
   - Set up CDN for assets

5. **Documentation**
   - Update README with production URL
   - Document environment variables
   - Create user guide
   - Write API documentation

---

## Support & Troubleshooting

**Build Issues:**
- Check Vercel build logs
- Test locally: `npm run build`
- Ensure Node version matches (check `.nvmrc` or `package.json`)

**Database Issues:**
- Test connection locally with production URL
- Check Prisma schema matches database
- Run `npx prisma migrate status`

**Email Issues:**
- Check Resend delivery logs
- Verify domain DNS records
- Test with personal email first
- Check spam folder

**Auth Issues:**
- Verify `NEXTAUTH_URL` matches deployment URL
- Check `NEXTAUTH_SECRET` is set
- Ensure email provider works
- Test magic link generation

---

## Deployment Checklist

Before going live:

- [ ] Database created (Neon or Vercel Postgres)
- [ ] Resend account created and API key obtained
- [ ] Domain verified in Resend (if using custom domain)
- [ ] GitHub repository pushed with latest code
- [ ] Vercel project created and linked
- [ ] Environment variables configured
- [ ] `NEXTAUTH_SECRET` generated and set
- [ ] Database migrations run
- [ ] Database seeded (optional demo users)
- [ ] Test deployment successful
- [ ] Landing page loads correctly
- [ ] Eligibility screener works
- [ ] Registration creates users
- [ ] Magic link emails send and work
- [ ] Login redirects to portal
- [ ] Public routes accessible
- [ ] Protected routes require auth
- [ ] Mobile responsive on all pages
- [ ] No console errors
- [ ] Analytics enabled (optional)

---

## Day 5 Status: Deployment Complete ✅

**Deployed Services:**
- ✅ Next.js app on Vercel
- ✅ PostgreSQL database (Neon/Vercel)
- ✅ Resend email service
- ✅ Magic link authentication
- ✅ All Day 5 features live

**Production URL:** `https://your-app.vercel.app`

**What's Working:**
- Landing page with mobile navigation
- Eligibility screener (7 questions, scoring, outcomes)
- User registration (with organization creation)
- Magic link authentication
- Portal access (authenticated users)
- Public pages (how-it-works, guidelines)

**Ready for User Testing!** 🚀
