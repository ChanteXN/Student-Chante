# Day 13: AI Guardrails + Safe Output Rules

**Date:** January 27, 2026  
**Sprint:** Week 3, Day 13  
**Status:** ✅ Complete  
**Commit:** `5b28d87`

---

## 🎯 Objectives

Build comprehensive AI safety guardrails to ensure the system provides compliance guidance only - never tax advice, no monetary calculations, no loopholes, and maintains strict professional boundaries appropriate for government deployment.

---

## 📦 Deliverables

### 1. Core Guardrails System (`lib/ai/guardrails.ts`)

**400+ lines of comprehensive safety infrastructure:**

#### Forbidden Topics Detection
- Array of banned query patterns (tax calculations, loopholes, guarantees)
- Categories: `taxAdvice`, `loopholes`, `financialProjections`, `inappropriate`
- Pre-query filtering before AI processing

#### Content Scanning Functions
```typescript
containsForbiddenContent(query: string): {
  isForbidden: boolean;
  category?: keyof typeof REFUSAL_MESSAGES;
  matchedTerm?: string;
}

scanResponseForViolations(response: string): {
  hasViolation: boolean;
  violations: string[];
  severity: "high" | "medium" | "low";
}

sanitizeResponse(response: string): string
// Removes R amounts, percentages, guarantees
```

#### System Prompts
Specialized strict instructions for each AI endpoint:
- **ask:** Compliance guidance only, never tax advice
- **improve:** Text quality improvements only, no advice
- **detectGaps:** Technical R&D criteria focus only

#### Professional Refusal Messages
Categorized refusals with helpful alternative suggestions:
- Tax Advice → "Consult registered tax practitioner"
- Loopholes → "Focus on legitimate compliance"
- Financial Projections → "Consult financial advisor"
- Inappropriate → Generic professional refusal

### 2. API Integration

**All three AI endpoints enhanced with guardrails:**

#### `/api/ai/ask/route.ts`
- Pre-query filtering (blocks forbidden questions)
- Post-response scanning (catches violations in outputs)
- Automatic sanitization if violations detected
- Logging: `[GUARDRAIL] Blocked...` for audit trail
- Bug fix: Changed `confidence: 1.0` → `confidence: "high"` for consistency

#### `/api/ai/improve/route.ts`
- Scans all improved text for violations
- Sanitizes responses with problematic content
- Tracks violations in logs

#### `/api/ai/detect-gaps/route.ts`
- Scans each gap recommendation individually
- Sanitizes gap messages separately
- Returns clean recommendations only

### 3. Testing Infrastructure

**Guardrails Test Page (`app/(portal)/portal/guardrails-test/page.tsx`)**

250+ line test interface with:
- Safe query examples (should work normally)
- Forbidden query examples (should be blocked)
- Custom query textarea for ad-hoc testing
- Real-time result display with visual feedback
- Color-coded results: green (allowed), purple (blocked), red (error)
- Active rules summary showing what's protected
- Route: `/portal/guardrails-test`

### 4. Bug Fixes

**AI Assistant Confidence Type Error:**
- **Issue:** `response.confidence.toUpperCase is not a function`
- **Root Cause:** API returned `confidence: 1.0` (number), but mocks return `confidence: "high"` (string)
- **Solution:** Updated API to return consistent string format
- **Files Modified:** `app/(portal)/portal/ai-assistant/page.tsx`, `app/api/ai/ask/route.ts`
- **Status:** ✅ Resolved, all TypeScript errors cleared

### 5. Enhanced AI Co-Pilot Coverage

**Extended "Improve with AI" to 5 additional wizard fields:**
- R&D Objectives (Step 2)
- Innovation Description (Step 3)
- Challenges Overcome (Step 3)
- Experiments Planned/Conducted (Step 3)
- Key Personnel (Step 4)

**Coverage: 9 out of 11 textarea fields** now have AI assistance throughout the wizard.

---

## 🔒 How Guardrails Work

### Two-Layer Protection

#### Layer 1: Pre-Query Filtering
```typescript
const forbiddenCheck = containsForbiddenContent(query);
if (forbiddenCheck.isForbidden) {
  return getRefusalResponse(forbiddenCheck.category);
}
```
**Blocks inappropriate questions before AI processing.**

#### Layer 2: Post-Response Scanning
```typescript
const violationCheck = scanResponseForViolations(response.answer);
if (violationCheck.hasViolation) {
  response.answer = sanitizeResponse(response.answer);
}
```
**Catches and cleans any violations in AI outputs.**

### Sanitization Examples
- `R 50,000` → `[amount]`
- `25%` → `[percentage]`
- `"guaranteed approval"` → removed
- `"will definitely be approved"` → removed

---

## 🧪 Testing Results

**Test Scenarios Verified:**

✅ **Safe Queries (Work Normally)**
- "What evidence do I need for R&D claims?"
- "How do I structure my R&D report?"
- "What are the eligibility criteria?"

✅ **Forbidden Queries (Blocked with Professional Refusals)**
- "How much tax will I save?" → Tax advice refusal
- "What loopholes can I use?" → Loophole refusal
- "Will my application be approved?" → Guarantee refusal

✅ **Content Sanitization**
- Monetary amounts removed from responses
- Percentages sanitized
- Guarantee language stripped

---

## 📂 Files Created

```
lib/ai/guardrails.ts (NEW - 400+ lines)
app/(portal)/portal/guardrails-test/page.tsx (NEW - 250+ lines)
```

## 📝 Files Modified

```
app/api/ai/ask/route.ts
app/api/ai/improve/route.ts
app/api/ai/detect-gaps/route.ts
app/(portal)/portal/ai-assistant/page.tsx
app/(portal)/portal/projects/new/page.tsx
```

---

## 🎓 Why This Matters

### Legal Compliance
- AI cannot provide unauthorized tax advice
- Only registered tax practitioners can advise on tax matters
- Government agency must maintain professional boundaries

### Government Credibility
- DSTI can demonstrate proper controls to oversight bodies
- Professional refusals redirect users to appropriate channels
- Audit trail tracks all guardrail triggers

### User Trust
- Clear boundaries between compliance guidance and tax advice
- Professional, helpful responses that acknowledge limitations
- No false expectations or guarantees

### Demo Confidence
- Stakeholders can see safety measures in action
- Test page proves system has proper controls
- Ready for government deployment evaluation

---

## 🚀 Impact

The AI system now operates with **government-grade safety controls**, ensuring:

- ❌ **NO** tax calculations or savings predictions
- ❌ **NO** loophole suggestions or workarounds
- ❌ **NO** approval guarantees or false expectations
- ✅ **YES** to compliance guidance and process clarification
- ✅ **YES** to technical R&D criteria explanation
- ✅ **YES** to application quality improvements

This completes the **AI Intelligence Layer (Days 11-13)** and proves the system is safe for government deployment.

---

## 📊 Sprint Progress

**Completed:**
- ✅ Days 1-10: Full MVP Core Functionality
- ✅ Day 11: AI RAG System with Mock Responses
- ✅ Day 12: AI Co-Pilot UI Panel Embedded in Application
- ✅ **Day 13: AI Guardrails + Safe Output Rules** ← YOU ARE HERE

**Next Up:**
- ⏳ Day 14: Request Inbox (Applicant ↔ Admin Workflow)
- ⏳ Day 15: Progress Reporting v1
- ⏳ Days 16-18: Backoffice Features
- ⏳ Day 19: QA + Security + Accessibility Pass
- ⏳ Day 20: Final Deploy + Demo + Handover

**Days Remaining:** 7 days until final delivery (Feb 7, 2026)

---

## 🔍 Technical Highlights

### Forbidden Topics Array (Sample)
```typescript
export const FORBIDDEN_TOPICS = [
  "how much tax will i save",
  "calculate my tax benefit",
  "what percentage will i get back",
  "loophole", "workaround", "exploit",
  "guarantee approval", "will definitely be approved",
  "tax optimization", "minimize tax liability"
  // ... 30+ patterns total
]
```

### Refusal Response Format
```typescript
{
  answer: "I cannot provide tax advice or calculate potential savings...",
  sources: [
    {
      title: "Professional Guidance",
      content: "For tax advice, please consult with a registered tax practitioner..."
    }
  ],
  confidence: "high",
  suggestions: [
    "What documentation is required for R&D tax incentive claims?",
    "How do I demonstrate technical uncertainty in my application?"
  ],
  guardrailTriggered: true
}
```

---

## 🎉 Day 13 Complete!

AI system is now **safe, compliant, and ready for government deployment evaluation**.

**Next Step:** Day 14 - Request Inbox (Admin ↔ Applicant communication workflow)
