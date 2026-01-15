# Day 4: Public Website v1 - QA Checklist

##  Pre-Commit Checklist

### Code Quality
- [x] No TypeScript errors (`npm run typecheck`)
- [x] No ESLint errors (`npm run lint`)
- [x] No console.log statements left in production code
- [x] All imports resolved successfully
- [x] All components properly typed

### Landing Page (`/`)
- [x] Page loads without errors
- [x] Hero section displays correctly
- [x] 4 feature cards render with icons
- [x] Stats section shows 3 metrics
- [x] Navigation links work (How It Works, Guidelines, Sign In)
- [x] CTAs link to correct pages
- [x] Footer displays with all links
- [x] Responsive on mobile (single column)
- [x] Responsive on tablet (2 columns)
- [x] Responsive on desktop (4 columns for features)
- [x] Gradient backgrounds render properly
- [x] Icons display correctly (lucide-react)

### How It Works Page (`/how-it-works`)
- [x] Page loads without errors
- [x] 5 timeline steps render correctly
- [x] Each step has icon, number, title, description
- [x] Color-coded icon circles display
- [x] CTA section at bottom works
- [x] Header navigation consistent with landing page
- [x] Footer consistent with landing page
- [x] Responsive layout (stacks on mobile)
- [x] Links to /eligibility and /portal work

### Guidelines Hub Page (`/guidelines`)
- [x] Page loads without errors
- [x] Search input renders without hydration warnings
- [x] 6 guideline cards display correctly
- [x] Each card shows: icon, category, title, description, tags, date
- [x] Result count displays correctly (showing X of 6 results)
- [x] Category badges render with proper styling
- [x] Tag badges render with proper styling
- [x] Icons display correctly for each guideline

### Search Functionality
- [x] Typing in search input filters results in real-time
- [x] Search works for title matches
- [x] Search works for description matches
- [x] Search works for category matches
- [x] Search works for tag matches
- [x] Case-insensitive search
- [x] Result count updates dynamically
- [x] Empty search shows all 6 guidelines
- [x] No results shows "No guidelines found" message
- [x] AI Assistant CTA displays in no results state

### Modal Functionality
- [x] Clicking guideline card opens modal
- [x] Modal displays with backdrop overlay
- [x] Modal shows correct guideline content
- [x] Modal header shows icon, title, category badge
- [x] Close button (X) works
- [x] Clicking backdrop closes modal
- [x] Clicking inside modal content doesn't close modal
- [x] Modal content is scrollable
- [x] Markdown content renders with proper styling
- [x] Tags display in modal footer
- [x] Last updated date shows in modal footer
- [x] Modal is responsive on mobile
- [x] Modal max-height prevents overflow off screen

### Content Accuracy
- [x] All 6 guideline titles correct
- [x] All guideline descriptions accurate
- [x] Full content renders without errors
- [x] Markdown formatting displays correctly (headings, lists, bold)
- [x] No broken HTML tags in rendered content
- [x] All category names correct
- [x] All tags relevant to content
- [x] Last updated dates present and reasonable

### Navigation & Links
- [x] Header "DSTI R&D Platform" links to `/`
- [x] "How It Works" nav link goes to `/how-it-works`
- [x] "Guidelines" nav link goes to `/guidelines`
- [x] "Sign In" button goes to `/login`
- [x] "Check Eligibility" CTA goes to `/eligibility`
- [x] "Start Application" CTA goes to `/portal`
- [x] Footer links work (Home, How It Works, Guidelines, etc.)
- [x] All external links (email) formatted correctly

### Responsive Design
#### Mobile (320px - 767px)
- [x] Single column layout
- [x] Text readable without horizontal scroll
- [x] Cards stack vertically
- [x] Modal fits screen with padding
- [x] Search input full width
- [x] Navigation menu accessible
- [x] Footer stacks vertically

#### Tablet (768px - 1023px)
- [x] 2-column grid for guideline cards
- [x] Timeline steps readable
- [x] Landing page features display well
- [x] Modal size appropriate

#### Desktop (1024px+)
- [x] 4-column feature grid on landing
- [x] 2-column guideline grid
- [x] Max-width container (7xl) enforced
- [x] Modal centered and sized appropriately
- [x] Horizontal padding consistent

### Performance
- [x] Page loads in under 3 seconds
- [x] Search response feels instant (<100ms)
- [x] Modal opens/closes smoothly
- [x] No layout shift on page load
- [x] Images/icons load quickly
- [x] No unnecessary re-renders

### Browser Compatibility
- [x] Chrome/Edge (tested)
- [x] Firefox (visual check)
- [x] Safari (visual check)
- [x] Mobile Chrome (responsive test)
- [x] Mobile Safari (responsive test)

### Accessibility
- [x] Semantic HTML elements used
- [x] Buttons have proper type attributes
- [x] Links have descriptive text
- [x] Color contrast meets WCAG AA
- [x] Focus states visible on interactive elements
- [x] Keyboard navigation works (Tab, Enter, Esc)
- [x] No missing alt text warnings (icons decorative)

### Error States
- [x] Search with no results shows empty state
- [x] No JavaScript errors in console
- [x] No 404 errors for resources
- [x] No broken image links
- [x] No CORS errors

### Edge Cases
- [x] Very long search query doesn't break UI
- [x] Rapid typing in search performs well
- [x] Opening/closing modal multiple times works
- [x] Switching between guidelines in modal works
- [x] Modal scrolls properly with long content
- [x] Footer stays at bottom on short pages

##  Deployment Checklist (Future)

### Pre-Deployment
- [ ] All environment variables set
- [ ] Database migrations applied
- [ ] Build completes successfully (`npm run build`)
- [ ] Production build tested locally (`npm run start`)
- [ ] No hardcoded localhost URLs
- [ ] Analytics configured (if applicable)

### Post-Deployment
- [ ] Production URL accessible
- [ ] All pages load correctly
- [ ] Search works in production
- [ ] Modal works in production
- [ ] No console errors in production
- [ ] Mobile responsive in production
- [ ] SSL certificate valid
- [ ] DNS configured correctly

##  Manual Test Script

### Test 1: Landing Page Journey
1. Visit http://localhost:3000
2. Verify hero section visible
3. Scroll to features - verify 4 cards
4. Scroll to stats - verify 3 metrics
5. Click "How It Works" nav link
6. Verify timeline page loads
7. Click browser back button
8. Click "Guidelines" nav link
9. Verify guidelines page loads

### Test 2: Search Functionality
1. Go to http://localhost:3000/guidelines
2. Type "eligibility" in search
3. Verify results filtered (should show 2-3 guidelines)
4. Clear search
5. Type "expenditure"
6. Verify results filtered (should show 1-2 guidelines)
7. Type "xyz123" (no results)
8. Verify "No guidelines found" message
9. Clear search
10. Verify all 6 guidelines return

### Test 3: Modal Interaction
1. Go to http://localhost:3000/guidelines
2. Click first guideline card
3. Verify modal opens with correct content
4. Scroll modal content
5. Click X button - verify closes
6. Click second guideline card
7. Verify different content displays
8. Click backdrop (outside modal)
9. Verify modal closes
10. Click third guideline
11. Verify modal reopens with new content

### Test 4: Responsive Testing
1. Open Chrome DevTools
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select "iPhone 12 Pro"
4. Test landing page - verify single column
5. Test how-it-works - verify stacked timeline
6. Test guidelines - verify stacked cards
7. Open modal - verify fits screen
8. Select "iPad Air"
9. Test guidelines - verify 2-column grid
10. Select "Desktop 1920x1080"
11. Verify all pages look good at large screen

### Test 5: Navigation Flow
1. Start at http://localhost:3000
2. Click "Check Eligibility" button
3. Verify navigates to /eligibility (may not exist yet)
4. Go back to home
5. Click "Start Application"
6. Verify navigates to /portal
7. Sign in as demo user
8. Verify portal accessible
9. Click "DSTI R&D Platform" logo
10. Verify returns to landing page

##  Sign-Off

**Tested By:** _________________  
**Date:** January 15, 2026  
**Status:** ✅ PASS / ❌ FAIL  
**Notes:** _________________

---

##  Known Issues (If Any)

_Document any issues found during testing that are acceptable for MVP:_

1. None currently - all tests passing

---

##  Regression Testing (Future Updates)

When making changes to Day 4 pages, re-run this checklist to ensure:
- Search still works
- Modal still opens/closes
- Navigation still functional
- Responsive design maintained
- No new console errors introduced
