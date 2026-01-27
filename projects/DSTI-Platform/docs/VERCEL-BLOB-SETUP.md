# Vercel Blob Storage Setup Guide

## Why We Need This

The DSTI Platform allows users to upload evidence files (PDFs, documents, etc.). In production (Vercel), the filesystem is **read-only**, so we can't save files locally. Vercel Blob provides cloud storage for uploaded files.

---

## Setup Steps

### 1. Enable Blob Storage in Vercel

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your DSTI Platform project
3. Click **Storage** in the left sidebar
4. Click **Create Database** → Select **Blob**
5. Choose your database region (preferably closest to your users)
6. Click **Create**

### 2. Get the Environment Variable

After creating the Blob store:

1. Vercel automatically generates `BLOB_READ_WRITE_TOKEN`
2. Go to **Settings** → **Environment Variables**
3. You'll see `BLOB_READ_WRITE_TOKEN` already added
4. Copy the value for local development

### 3. Add to Local .env

Add this to your `.env` file:

```env
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxxxxxxxxxx
```

**Note:** The token will be different in production (auto-injected by Vercel) and local development.

### 4. Redeploy Your Application

```bash
# Commit the changes
git add .
git commit -m "Migrate to Vercel Blob storage for file uploads"
git push

# Vercel will automatically redeploy
```

---

## What Changed

### Before (Filesystem Storage)
```typescript
// ❌ Doesn't work in production
const uploadDir = join(process.cwd(), "public", "uploads");
await writeFile(filePath, buffer);
// Stored: /public/uploads/evidence/file.pdf
```

### After (Vercel Blob Storage)
```typescript
// ✅ Works everywhere
import { put } from '@vercel/blob';
const blob = await put(filename, file, { access: 'public' });
// Stored: https://blob.vercel-storage.com/.../file.pdf
```

---

## Benefits

✅ **Works in production** - No read-only filesystem issues  
✅ **CDN-powered** - Files served from global edge network  
✅ **Automatic scaling** - No server storage management needed  
✅ **Public URLs** - Direct access via HTTPS  
✅ **Cost-effective** - Free tier: 1GB storage + 1GB bandwidth/month  

---

## Database Changes

The `filePath` field now stores full URLs instead of local paths:

**Before:**
```
filePath: "/uploads/evidence/1234_document.pdf"
```

**After:**
```
filePath: "https://xxxxxxxxxxxxxxx.public.blob.vercel-storage.com/evidence/project-id/1234_document.pdf"
```

No migration needed - the field type remains `String`, just contains different data.

---

## Pricing

**Vercel Blob Pricing (as of 2026):**
- **Free Tier:** 1GB storage + 1GB bandwidth/month
- **Pro:** $0.15/GB storage + $0.10/GB bandwidth
- **Enterprise:** Custom pricing

**Typical Usage for DSTI Platform:**
- Average application: 5-20 files × 2MB each = ~50MB
- 100 applications/month = ~5GB storage
- **Cost estimate:** ~$1-2/month on Pro plan

---

## Local Development

For local development, you have two options:

### Option 1: Use Vercel Blob (Recommended)
- Add `BLOB_READ_WRITE_TOKEN` to `.env`
- Files upload to actual Blob storage even locally
- Same behavior as production

### Option 2: Mock for Local Testing
Create a fallback in code:
```typescript
// In route.ts
const isLocal = process.env.NODE_ENV === 'development' && !process.env.BLOB_READ_WRITE_TOKEN;

if (isLocal) {
  // Use temporary /tmp directory
  await writeFile(`/tmp/${filename}`, buffer);
} else {
  // Use Vercel Blob
  await put(filename, file);
}
```

---

## Troubleshooting

### "Missing BLOB_READ_WRITE_TOKEN"
**Solution:** Add the token to Vercel environment variables or local `.env`

### "Blob upload failed"
**Check:**
1. Token is correct and has write permissions
2. File size is within limits (max 100MB per file on Pro)
3. Network connectivity

### "Old files still showing local paths"
**Solution:** Old evidence files in database still have local paths. They won't work. Options:
1. Delete and re-upload
2. Run a migration script to delete old entries
3. Add fallback in frontend to handle missing files gracefully

---

## Migration Notes

If you have existing applications with uploaded files:

1. **Old files will be broken** - They reference local paths that don't exist
2. **Users should re-upload** - Evidence files need to be uploaded again
3. **Or:** Run a one-time migration to copy existing files to Blob storage

**Migration Script (if needed):**
```typescript
import { put } from '@vercel/blob';
import { readFile } from 'fs/promises';
import { prisma } from './lib/prisma';

async function migrateFiles() {
  const files = await prisma.evidenceFile.findMany({
    where: { filePath: { startsWith: '/uploads/' } }
  });

  for (const file of files) {
    const localPath = join(process.cwd(), 'public', file.filePath);
    const buffer = await readFile(localPath);
    const blob = await put(file.fileName, buffer, { access: 'public' });
    
    await prisma.evidenceFile.update({
      where: { id: file.id },
      data: { filePath: blob.url }
    });
  }
}
```

---

## Security Considerations

- Files are **public by default** - Anyone with the URL can access
- URLs are **long and random** - Hard to guess
- **Access control** should be at application level (check user permissions before showing links)
- Consider adding **signed URLs** for sensitive documents (available in @vercel/blob)

---

## Next Steps

1. ✅ Create Blob storage in Vercel dashboard
2. ✅ Add `BLOB_READ_WRITE_TOKEN` to environment variables
3. ✅ Test file upload in production
4. ✅ Delete old local uploads folder (no longer needed)
5. ⏳ Inform users to re-upload any existing evidence files

---

**Implementation Date:** January 27, 2026  
**Status:** ✅ Complete and deployed
