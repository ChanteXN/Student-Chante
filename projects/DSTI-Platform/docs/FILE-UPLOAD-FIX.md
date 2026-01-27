# File Upload Fix Summary

## Problem
Production file uploads failing with `EROFS: read-only file system` error.

## Root Cause
Code was trying to save files to local filesystem (`/var/task/public/uploads/`), which is read-only in Vercel's serverless environment.

## Solution Implemented
Migrated from local filesystem storage to **Vercel Blob Storage**.

---

## Changes Made

### 1. Installed Vercel Blob Package
```bash
npm install @vercel/blob
```

### 2. Updated Evidence Upload Route
**File:** `app/api/projects/[id]/evidence/route.ts`

**Changed:**
- Removed: `fs/promises` (writeFile, mkdir, unlink)
- Added: `@vercel/blob` (put, del)
- Upload logic now uses `await put(filename, file)` instead of filesystem writes
- Delete logic now uses `await del(url)` instead of filesystem unlink

### 3. Database Schema
**No changes needed** - `filePath` field already stores strings, now contains full URLs instead of local paths.

**Before:** `/uploads/evidence/1234_file.pdf`  
**After:** `https://xxxxx.blob.vercel-storage.com/evidence/project-id/1234_file.pdf`

### 4. Frontend
**No changes needed** - Already uses `file.filePath` to open files. Works with both local paths and URLs.

---

## Setup Required

### For Local Development
Add to `.env`:
```env
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxx
```

### For Production (Vercel)
1. Go to Vercel Dashboard → Storage → Create Blob
2. Token is auto-generated and injected as environment variable
3. Redeploy application

---

## Testing Checklist

- [ ] Local file upload works with Blob token
- [ ] Production file upload works (no more EROFS errors)
- [ ] Files are accessible via public URLs
- [ ] File deletion removes from Blob storage
- [ ] File metadata correctly saved to database

---

## Benefits

✅ Works in production (no filesystem issues)  
✅ Automatic CDN distribution  
✅ No server storage management  
✅ Files accessible via direct URLs  
✅ Scales automatically  

---

## Migration Notes

**Existing uploaded files:**
- Old files with local paths (`/uploads/...`) will be broken
- Users need to re-upload evidence files
- Or run migration script to copy existing files to Blob

**Going forward:**
- All new uploads go to Blob storage
- Files work in both local and production environments
- No more read-only filesystem errors

---

**Status:** ✅ Implementation Complete  
**Next:** Configure Blob storage in Vercel dashboard
