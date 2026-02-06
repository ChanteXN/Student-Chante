# Day 19: QA, Security & Accessibility Testing

**Date:** February 6, 2026  
**Sprint Day:** 19 of 20  
**Goal:** Stable, secure, demo-ready system

## Testing Checklist

### 1. Authentication & Session Management
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Session persistence across page refreshes
- [ ] Session timeout handling
- [ ] Logout functionality
- [ ] Protected route redirects
- [ ] Email verification (if implemented)
- [ ] Password reset flow (if implemented)

### 2. Role-Based Access Control (RBAC)
- [ ] Applicant cannot access admin routes (`/admin/*`)
- [ ] Applicant cannot access reviewer routes
- [ ] Admin can access all sections
- [ ] Reviewer can only access assigned projects
- [ ] API endpoints check user roles
- [ ] Data isolation (users only see their data)
- [ ] Organisation membership verification
- [ ] Unauthorised access returns 403/401

### 3. File Upload & Evidence Vault
- [ ] Upload single file successfully
- [ ] Upload multiple files
- [ ] File type validation (only allowed types)
- [ ] File size limit enforcement
- [ ] Download uploaded file
- [ ] Delete file
- [ ] File persistence across sessions
- [ ] Preview images/PDFs
- [ ] Evidence categorisation works
- [ ] Storage quota handling

### 4. Project Wizard & Autosave
- [ ] Create new project
- [ ] All wizard steps load correctly
- [ ] Form validation on each step
- [ ] Autosave triggers (test timing)
- [ ] Resume from saved state
- [ ] Navigation between steps
- [ ] Progress indicator updates
- [ ] Required field validation
- [ ] Data persists after browser refresh
- [ ] Multiple projects per organisation

### 5. Application Readiness Score
- [ ] Score calculates correctly
- [ ] Score updates on data change
- [ ] Missing items identified
- [ ] Fix suggestions displayed
- [ ] Threshold indicators work

### 6. Application Submission
- [ ] Submit complete application
- [ ] Cannot submit incomplete application
- [ ] Status changes to SUBMITTED
- [ ] Application locked after submission
- [ ] Case reference generated
- [ ] Timeline entry created
- [ ] Confirmation displayed

### 7. Review & Assignment Workflow
- [ ] Admin can assign reviewers
- [ ] Reviewer sees assigned projects only
- [ ] Reviewer can add scores
- [ ] Reviewer can add notes
- [ ] Reviewer can upload attachments
- [ ] Reviewer can submit recommendation
- [ ] Status updates correctly
- [ ] Timeline tracks changes

### 8. Request for Information
- [ ] Admin can send request
- [ ] Applicant receives notification
- [ ] Applicant can respond
- [ ] Applicant can upload additional docs
- [ ] Admin sees response
- [ ] Status transitions correctly

### 9. Decision Capture & Letters
- [ ] Admin can view reviewer recommendations
- [ ] Admin can enter decision reasoning
- [ ] Admin can add approval conditions
- [ ] Decision saves correctly
- [ ] PDF letter generates properly
- [ ] Letter downloads successfully
- [ ] Applicant can view decision
- [ ] Applicant can download letter
- [ ] Status changes to APPROVED/DECLINED

### 10. Compliance & Progress Reports
- [ ] Approved projects show compliance button
- [ ] Applicant can view approval conditions
- [ ] Applicant can submit progress report
- [ ] All 7 fields save correctly
- [ ] Report appears in history
- [ ] Admin sees submitted reports
- [ ] Admin can review reports
- [ ] Admin can accept report
- [ ] Admin can request changes with feedback
- [ ] Applicant sees review feedback
- [ ] Status transitions work

### 11. AI Co-Pilot (if implemented)
- [ ] AI panel loads in wizard
- [ ] Questions return relevant answers
- [ ] Responses are grounded in guidelines
- [ ] No tax advice given
- [ ] No numeric savings calculated
- [ ] Response time acceptable
- [ ] Error handling for API failures
- [ ] Rate limiting works

### 12. Security Audit

#### Authentication Security
- [ ] Passwords hashed (bcrypt/argon2)
- [ ] Session tokens secure
- [ ] HTTPS enforced in production
- [ ] Secure cookie settings (httpOnly, secure, sameSite)
- [ ] No session fixation vulnerabilities

#### Input Validation
- [ ] All form inputs validated server-side
- [ ] SQL injection prevention (Prisma ORM)
- [ ] XSS prevention (React escaping + sanitization)
- [ ] File upload validation (type, size, content)
- [ ] No command injection in file names

#### API Security
- [ ] All API routes check authentication
- [ ] All API routes check authorization
- [ ] Rate limiting on sensitive endpoints
- [ ] CSRF protection enabled
- [ ] No sensitive data in URLs
- [ ] Proper error messages (no stack traces)

#### Data Protection
- [ ] Sensitive data encrypted at rest
- [ ] Database connection secured
- [ ] No hardcoded credentials
- [ ] Environment variables used correctly
- [ ] No PII in logs
- [ ] Secure file storage permissions

#### Dependencies
- [ ] Run `npm audit` - check vulnerabilities
- [ ] Update critical dependencies
- [ ] Review third-party packages
- [ ] No known CVEs in dependencies

### 13. Error Handling & User Experience

#### Loading States
- [ ] Skeleton loaders for slow operations
- [ ] Spinners for button actions
- [ ] Progress indicators for uploads
- [ ] Disabled states during processing
- [ ] Timeout handling

#### Error States
- [ ] Network error handling
- [ ] API error messages displayed
- [ ] Form validation errors clear
- [ ] 404 pages styled
- [ ] 500 error page exists
- [ ] Error boundaries catch React errors
- [ ] Toast notifications for user actions

#### Empty States
- [ ] Empty project list message
- [ ] No evidence uploaded state
- [ ] No assigned reviews message
- [ ] No progress reports message
- [ ] Clear CTAs in empty states

### 14. Accessibility (WCAG 2.1 AA)

#### Keyboard Navigation
- [ ] All interactive elements reachable via Tab
- [ ] Focus indicators visible
- [ ] Escape key closes modals
- [ ] Arrow keys work in lists/menus
- [ ] Skip to main content link

#### Screen Reader
- [ ] Form labels properly associated
- [ ] ARIA labels on icon buttons
- [ ] ARIA live regions for dynamic content
- [ ] Heading hierarchy correct (h1, h2, h3)
- [ ] Alt text on images
- [ ] Table headers defined

#### Visual Accessibility
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Text resizable to 200%
- [ ] No information by color alone
- [ ] Focus visible on all elements
- [ ] Sufficient target sizes (44x44px min)

#### Forms
- [ ] Required fields indicated
- [ ] Error messages clear and specific
- [ ] Success messages announced
- [ ] Field descriptions provided

### 15. Cross-Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### 16. Performance

#### Page Load
- [ ] Initial load under 3 seconds
- [ ] Time to Interactive under 5 seconds
- [ ] Lighthouse score > 80
- [ ] Core Web Vitals passing

#### Runtime Performance
- [ ] No memory leaks
- [ ] Smooth scrolling
- [ ] Fast form interactions
- [ ] Quick page transitions
- [ ] Optimised images

#### Database
- [ ] Queries optimised
- [ ] Proper indexes on foreign keys
- [ ] N+1 query problems resolved
- [ ] Connection pooling configured

### 17. Data Integrity
- [ ] Projects cannot be deleted while submitted
- [ ] Evidence files linked correctly
- [ ] Timeline entries immutable
- [ ] Audit logs complete
- [ ] No orphaned records
- [ ] Foreign key constraints enforced

### 18. Mobile Responsiveness
- [ ] All pages work on mobile (375px width)
- [ ] Touch targets appropriate size
- [ ] Forms usable on mobile
- [ ] Tables scroll/stack properly
- [ ] Modals work on small screens
- [ ] Navigation accessible on mobile

## Critical Bugs Found
_Document any critical issues discovered during testing_

### Bug #1: [Title]
- **Severity:** Critical/High/Medium/Low
- **Location:** [File/Component]
- **Description:** [What's wrong]
- **Steps to Reproduce:**
- **Expected Behavior:**
- **Actual Behavior:**
- **Fix Status:** [ ] Fixed / [ ] In Progress / [ ] Deferred

---

## Security Findings
_Document security vulnerabilities_

### Finding #1: [Title]
- **Severity:** Critical/High/Medium/Low
- **Category:** [Auth/Input/API/Data]
- **Description:**
- **Risk:**
- **Remediation:**
- **Status:** [ ] Fixed / [ ] Mitigated / [ ] Accepted

---

## Accessibility Issues
_Document accessibility problems_

### Issue #1: [Title]
- **WCAG Level:** A/AA/AAA
- **Criterion:** [e.g., 1.4.3 Contrast]
- **Impact:**
- **Remediation:**
- **Status:** [ ] Fixed / [ ] In Progress

---

## Performance Optimization Opportunities
_Document performance improvements made_

1. **[Optimization]**: [Description and impact]
2. **[Optimization]**: [Description and impact]

---

## Deferred Issues (For Phase 2)
_Non-critical issues to address post-MVP_

1. [Issue description and rationale for deferring]
2. [Issue description and rationale for deferring]

---

## Testing Summary

**Testing Period:** Feb 6, 2026  
**Tester:** [Your name]  
**Total Test Cases:** [X]  
**Passed:** [X]  
**Failed:** [X]  
**Deferred:** [X]  

**Critical Bugs Fixed:** [X]  
**Security Issues Fixed:** [X]  
**Accessibility Improvements:** [X]  

**Demo Readiness:** [ ] Ready / [ ] Not Ready  
**Deployment Readiness:** [ ] Ready / [ ] Not Ready

---

## Sign-Off

- [ ] All critical bugs resolved
- [ ] Security audit complete
- [ ] Accessibility baseline met
- [ ] Error handling improved
- [ ] Loading states implemented
- [ ] Cross-browser tested
- [ ] Mobile responsive verified
- [ ] Performance acceptable
- [ ] Ready for Day 20 (final deploy)

**QA Lead:** _________________  
**Date:** February 6, 2026
