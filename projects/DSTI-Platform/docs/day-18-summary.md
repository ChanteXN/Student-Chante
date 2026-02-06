# Day 18: Decision Capture & Compliance Workflow

**Sprint Day:** 18 of 20  
**Status:**  Completed

## Overview
Implemented complete decision capture workflow for admin final decisions on reviewed projects, PDF decision letter generation, and full post-approval compliance tracking system including progress report submission and review.

## Features Implemented

### 1. Decision Model & Database Schema
- **Decision Model** with fields:
  - `outcome`: APPROVED or DECLINED
  - `reasoning`: Detailed explanation
  - `conditions`: Approval conditions/requirements
  - `decidedBy`: Admin who made decision
  - `decidedAt`: Timestamp
- **ProgressReport Schema Updates**:
  - Added `reviewedBy`, `reviewedAt`, `feedback` fields
  - Added `REQUIRES_CHANGES` status to enable iterative review
  - Existing fields: `outcomes`, `milestones`, `staffing`, `learnings`, `expenditure`, `challenges`

### 2. Admin Decision Capture
**Route:** `/admin/decisions/[id]`

**Features:**
- View all reviewer recommendations and scores
- See project details and case reference
- Input decision reasoning (required)
- Add approval conditions (for approvals only)
- Choose outcome: Approve or Decline
- Transaction-safe decision submission
- Project status update (UNDER_REVIEW → APPROVED/DECLINED)
- Real-time validation

**Files:**
- `app/admin/decisions/[id]/page.tsx` - Decision capture UI
- `app/api/admin/decisions/[id]/route.ts` - Decision POST endpoint

### 3. PDF Decision Letter Generation
**Library:** pdf-lib v1.17.1

**Features:**
- Professional letterhead with logo
- Case reference and project details
- Decision outcome with reasoning
- Approval conditions (when applicable)
- Authorized signatory signature
- Multi-page support with automatic page breaks
- Proper text wrapping handling newlines

**Implementation:**
- `lib/pdf/decision-letter.ts` - PDF generation logic
- `wrapText()` function - Handles line breaks and text wrapping
- `checkNewPage()` helper - Manages page boundaries
- Fixed text overlapping by processing newlines correctly

**Download Endpoints:**
- `app/api/admin/decisions/[id]/letter/route.ts` - Admin download
- `app/api/projects/[id]/decision/letter/route.ts` - Applicant download

### 4. Admin Decisions List
**Route:** `/admin/decisions`

**Features:**
- View all projects requiring decisions
- Filter by: All, Pending, Approved, Declined
- Stats cards showing counts
- Decision outcome badges
- Quick navigation to decision screen
- Auto-refresh on window focus
- Manual refresh button
- Real-time updates after decision submission

**Files:**
- `app/admin/decisions/page.tsx` - Decisions list UI
- `app/api/admin/projects/route.ts` - Enhanced with decision data

### 5. Applicant Decision View
**Route:** `/portal/projects/[id]/decision`

**Features:**
- View final decision outcome
- Read decision reasoning
- See approval conditions (if approved)
- Download PDF decision letter
- Different guidance for approved vs declined
- Access control (project owner only)

**Files:**
- `app/(portal)/portal/projects/[id]/decision/page.tsx` - Decision view UI
- `app/api/projects/[id]/decision/route.ts` - Decision fetch endpoint

### 6. Compliance Dashboard
**Route:** `/portal/projects/[id]/compliance`

**Features:**
- View approval conditions
- Submit progress reports with 7 fields:
  - Reporting Period
  - Outcomes Achieved
  - Milestones Reached
  - Staffing Updates
  - Key Learnings
  - Expenditure (optional)
  - Challenges (optional)
- View submitted reports history
- See review status (Submitted, Accepted, Requires Changes)
- View admin feedback when changes requested
- Compliance tips section
- Enhanced success messaging

**Files:**
- `app/(portal)/portal/projects/[id]/compliance/page.tsx` - Compliance UI
- `app/api/projects/[id]/progress-reports/route.ts` - Report submission API

### 7. Admin Progress Report Review
**Route:** `/admin/progress-reports/[id]`

**Features:**
- View complete progress report details
- See project and applicant information
- Review all 7 report fields
- Two action options:
  - **Accept Report** - Mark as ACCEPTED
  - **Request Changes** - Set to REQUIRES_CHANGES with feedback
- Feedback textarea (required for changes)
- Review history display
- Reviewer information tracking

**Files:**
- `app/admin/progress-reports/[id]/page.tsx` - Review page UI
- `app/api/admin/progress-reports/[id]/route.ts` - Review API (GET/PUT)

### 8. Admin Progress Reports List
**Route:** `/admin/progress-reports`

**Features:**
- View all submitted progress reports
- Filter by status
- Search by project/organisation
- Status badges
- Review button for each report
- View project link
- Organisation and submission details

**Files:**
- `app/admin/progress-reports/page.tsx` - Reports list UI
- `app/api/admin/progress-reports/route.ts` - Fetch all reports

### 9. Navigation Enhancements
**Projects List Updates:**
- Added "Decision" button (red) for APPROVED/DECLINED projects
- Added "Compliance" button (green) for APPROVED projects only
- Added APPROVED and DECLINED filter buttons
- Maintained existing View and Edit buttons

**Admin Sidebar:**
- Added "Decisions" navigation link

## Technical Implementation

### Database Changes
```prisma
model Decision {
  id            String          @id @default(cuid())
  projectId     String          @unique
  outcome       DecisionOutcome
  reasoning     String
  conditions    String?
  decidedBy     String
  decidedAt     DateTime        @default(now())
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt
  project       Project         @relation(...)
}

enum DecisionOutcome {
  APPROVED
  DECLINED
}

model ProgressReport {
  // ... existing fields ...
  reviewedBy    String?         // Admin who reviewed
  reviewedAt    DateTime?       // When reviewed
  feedback      String?         // Admin feedback/comments
}

enum ProgressReportStatus {
  DRAFT
  SUBMITTED
  UNDER_REVIEW
  REQUIRES_CHANGES  // NEW
  ACCEPTED
}
```

### API Endpoints Created
1. `POST /api/admin/decisions/[id]` - Submit decision
2. `GET /api/admin/decisions/[id]/letter` - Download admin letter
3. `GET /api/projects/[id]/decision` - Fetch decision for applicant
4. `GET /api/projects/[id]/decision/letter` - Download applicant letter
5. `GET /api/projects/[id]/progress-reports` - Fetch reports for project
6. `POST /api/projects/[id]/progress-reports` - Submit progress report
7. `GET /api/admin/progress-reports` - Fetch all reports (admin)
8. `GET /api/admin/progress-reports/[id]` - Fetch single report
9. `PUT /api/admin/progress-reports/[id]` - Review report (accept/request changes)

### Dependencies Added
```json
{
  "pdf-lib": "^1.17.1"
}
```

## Bug Fixes

### PDF Text Overlapping
**Problem:** Text with newlines rendered on same line  
**Solution:** Modified `wrapText()` to split by `/\r?\n/` and process paragraphs separately

### Decisions Page Not Updating
**Problem:** Metrics showed stale data after decision submission  
**Solution:** Added decision relation to API, visibility listeners, and manual refresh button

### TypeScript Errors
**Problem:** Multiple unused `@ts-expect-error` directives  
**Solution:** Removed unused directives, regenerated Prisma client, added proper type casts

### Missing Component
**Problem:** Separator component not found  
**Solution:** Replaced `<Separator />` with `<hr className="my-4" />`

### Hydration Error
**Problem:** div inside p tag in CardDescription  
**Solution:** Changed CardDescription to div with same styling

### Field Name Mismatches
**Problem:** API returning different field names than UI expected  
**Solution:** Updated interfaces and display code to match actual schema (title, organisation.name, etc.)

## Complete Workflow

### For Admins:
1. Navigate to Decisions → See projects requiring decision
2. Click project → View reviewer recommendations
3. Enter reasoning and conditions → Submit decision
4. Decision recorded → PDF letter generated
5. Navigate to Progress Reports → See submitted reports
6. Click Review → View full report details
7. Accept or Request Changes → Status updated

### For Applicants:
1. Project approved → Notification
2. Navigate to Decision → View decision and reasoning
3. Download PDF letter
4. Navigate to Compliance → View approval conditions
5. Submit progress reports → Fill 7 fields
6. View submission status → See if accepted or changes needed
7. If changes requested → View feedback and resubmit

## Testing Completed
-  Decision submission (approve/decline)
-  PDF letter generation and download
-  Decision view for applicants
-  Progress report submission
-  Progress report review workflow
-  Status transitions
-  Navigation buttons
-  Filter functionality
-  Auto-refresh on decisions page
-  Field validation
-  Success/error messaging

## Files Modified
- `app/(portal)/portal/projects/page.tsx` - Added decision/compliance buttons
- `app/admin/layout.tsx` - Added decisions nav link
- `app/admin/progress-reports/page.tsx` - Updated fields and review button
- `app/admin/projects/[id]/page.tsx` - Minor updates
- `app/api/admin/progress-reports/route.ts` - Fixed field names
- `app/api/admin/projects/route.ts` - Added decision relation
- `prisma/schema.prisma` - Added Decision model, updated ProgressReport
- `package.json` - Added pdf-lib dependency

## Files Created (14 new files)
1. `app/(portal)/portal/projects/[id]/compliance/page.tsx`
2. `app/(portal)/portal/projects/[id]/decision/page.tsx`
3. `app/admin/decisions/page.tsx`
4. `app/admin/decisions/[id]/page.tsx`
5. `app/admin/progress-reports/[id]/page.tsx`
6. `app/api/admin/decisions/[id]/route.ts`
7. `app/api/admin/decisions/[id]/letter/route.ts`
8. `app/api/admin/progress-reports/[id]/route.ts`
9. `app/api/admin/projects/[id]/route.ts`
10. `app/api/projects/[id]/decision/route.ts`
11. `app/api/projects/[id]/decision/letter/route.ts`
12. `app/api/projects/[id]/progress-reports/route.ts`
13. `components/ui/alert.tsx`
14. `lib/pdf/decision-letter.ts`

## Code Statistics
- **Total Files Changed:** 23
- **Lines Added:** 3,388
- **New Components:** 7 pages, 9 API routes, 1 PDF utility
- **Database Models:** 1 new (Decision), 1 updated (ProgressReport)

## Git Commit
**Hash:** 318a4c5  
**Branch:** development  
**Message:** feat(day-18): implement complete decision capture and compliance workflow

## Known Limitations
- AuditLog model not yet implemented (TODO comments added)
- Progress report resubmission after changes requested not yet tested
- Email notifications not implemented
- No analytics/reporting on compliance rates

## Next Steps (Day 19)
- QA testing of complete application
- Security audit
- Performance optimization
- User acceptance testing
- Bug fixes and refinements

## Dependencies for Other Features
- Email system (for decision notifications)
- AuditLog model (for comprehensive tracking)
- Analytics dashboard (for compliance metrics)

---

**Day 18 Status:**  Complete and deployed to development branch
