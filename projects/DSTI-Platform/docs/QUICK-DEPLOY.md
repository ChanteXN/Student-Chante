# 🚀 Quick Deployment Guide

Follow these steps to deploy your DSTI Platform to Vercel in ~15 minutes.

## Prerequisites
- [ ] Vercel account (free): https://vercel.com
- [ ] Resend account (free): https://resend.com
- [ ] 15 minutes

---

## Step 1: Database (5 min)

### Option A: Neon (Recommended)
1. Go to https://neon.tech → Sign up with GitHub
2. Create project: `dsti-platform-prod`
3. Copy connection string (starts with `postgresql://`)

### Option B: Vercel Postgres
1. Vercel Dashboard → Storage → Create Database → PostgreSQL
2. Copy `POSTGRES_PRISMA_URL`

---

## Step 2: Email Service (3 min)

1. Go to https://resend.com → Sign up
2. Dashboard → API Keys → Create API Key
3. Name: `DSTI Platform`
4. Copy the key (starts with `re_`)

---

## Step 3: Deploy to Vercel (5 min)

1. **Import Project:**
   - Go to https://vercel.com → Add New → Project
   - Import `BikoToday-Work/Student-Chante`
   - Root: `projects/DSTI-Platform`

2. **Add Environment Variables:**
   ```env
   DATABASE_URL=<paste-from-neon-or-vercel-postgres>
   NEXTAUTH_URL=https://your-app.vercel.app
   NEXTAUTH_SECRET=<run: openssl rand -base64 32>
   RESEND_API_KEY=<paste-from-resend>
   EMAIL_FROM=DSTI Platform <noreply@yourdomain.com>
   ```

3. **Deploy:** Click "Deploy" → Wait 2-3 minutes

---

## Step 4: Run Database Migrations (2 min)

Option 1: Local (Easiest)
```bash
# Create .env.production
DATABASE_URL="<your-production-postgres-url>"

# Run migrations
npx prisma migrate deploy

# Seed demo users (optional)
npx prisma db seed
```

Option 2: Vercel CLI
```bash
npm install -g vercel
vercel login
vercel link
vercel env pull .env.production
npx prisma migrate deploy
```

---

## Step 5: Test (5 min)

Visit your app: `https://your-app.vercel.app`

- [ ] Landing page loads
- [ ] Click "Check Eligibility" → complete screener
- [ ] Click "Register" → create account
- [ ] Check email for magic link
- [ ] Click magic link → access portal

**🎉 Done! Your app is live!**

---

## Troubleshooting

**Email not sending?**
- Check Resend dashboard → Emails → See logs
- Verify `EMAIL_FROM` domain
- Check spam folder

**Database connection error?**
- Verify `DATABASE_URL` in Vercel env vars
- Check database is active (Neon dashboard)
- Ensure `?sslmode=require` in connection string

**Auth not working?**
- Update `NEXTAUTH_URL` to match actual Vercel URL
- Generate new `NEXTAUTH_SECRET`: `openssl rand -base64 32`
- Redeploy after changing env vars

---

## Next Steps

- [ ] Add custom domain (Vercel Settings → Domains)
- [ ] Verify domain in Resend (for better email delivery)
- [ ] Enable Vercel Analytics
- [ ] Set up monitoring (Sentry, UptimeRobot)

Full documentation: [DEPLOYMENT.md](./DEPLOYMENT.md)
