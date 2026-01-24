# DSTI R&D Tax Incentive Platform - User Stories

**Project**: DSTI R&D Tax Incentive Application Management System  
**Document Version**: 1.0  
**Date**: January 22, 2026  
**Status**: Week 2, Day 6

---

## Table of Contents

1. [User Personas](#user-personas)
2. [Applicant User Stories](#applicant-user-stories)
3. [Consultant User Stories](#consultant-user-stories)
4. [Reviewer User Stories](#reviewer-user-stories)
5. [Administrator User Stories](#administrator-user-stories)
6. [Story Prioritization](#story-prioritization)
7. [Acceptance Criteria Templates](#acceptance-criteria-templates)

---

## User Personas

### Persona 1: Sarah - R&D Manager (Applicant)

**Background:**
- 35 years old, R&D Manager at a mid-sized manufacturing company
- Engineering degree, 10 years experience
- First time applying for R&D tax incentive
- Tech-savvy but not a developer
- Works on desktop (office) and occasionally tablet (meetings)

**Goals:**
- Submit a complete, high-quality application on first try
- Understand exactly what information is required
- Track application status without calling DSTI
- Avoid hiring expensive consultants

**Pain Points:**
- Overwhelmed by 50-page PDF guidelines
- Uncertain if their activities qualify as R&D
- Worried about missing required information
- Frustrated by long processing times (6 months)

**Quote:** *"I just want to know if we're eligible and what evidence I need to provide. The current process feels like a black box."*

---

### Persona 2: Thabo - DSTI Consultant (Screener)

**Background:**
- 42 years old, Senior Consultant at DSTI
- Master's in Engineering, 15 years in R&D evaluation
- Screens 150-200 applications per year
- Works primarily on desktop in office
- Comfortable with technology but frustrated by inefficient tools

**Goals:**
- Quickly assess application completeness and eligibility
- Minimize time spent on administrative tasks
- Provide clear feedback to applicants
- Manage workload efficiently (30+ applications in queue)

**Pain Points:**
- Manual data entry from PDF/Word documents (3 hours per application)
- Hunting for evidence files in email attachments
- Inconsistent application formats
- Difficult to track which applications need follow-up

**Quote:** *"I spend more time copying data into spreadsheets than actually evaluating the R&D merits. I need better tools."*

---

### Persona 3: Dr. Naledi - Senior Reviewer (Technical Expert)

**Background:**
- 50 years old, PhD in Biochemistry, 20 years industry + government experience
- Reviews 80-100 applications per year across multiple sectors
- Works on desktop and laptop (sometimes from home)
- Methodical, detail-oriented, values thoroughness

**Goals:**
- Make evidence-based recommendations (Approve/Reject)
- Ensure consistency in decision-making
- Collaborate with other reviewers on complex cases
- Maintain high quality standards

**Pain Points:**
- Difficult to compare evidence across applications
- No structured review template (subjective evaluations)
- Context switching between applications (hard to remember details)
- Limited visibility into consultant's initial screening notes

**Quote:** *"I need to see all the evidence in one place and understand the consultant's assessment before I start my review."*

---

### Persona 4: Lindiwe - DSTI Administrator (Manager)

**Background:**
- 45 years old, Director of R&D Incentives Division
- MBA, 18 years in government program management
- Oversees team of 8 consultants and 5 reviewers
- Works on desktop and mobile (checking dashboards on the go)

**Goals:**
- Monitor application pipeline and identify bottlenecks
- Ensure processing time targets are met (reduce from 6 months to 3)
- Generate reports for executive leadership
- Improve team efficiency and applicant satisfaction

**Pain Points:**
- No real-time visibility into application status
- Manual reporting (pulling data from multiple spreadsheets)
- Difficult to balance workload across team
- Limited data for strategic decision-making

**Quote:** *"I need a dashboard that shows me where applications are stuck and which staff members need support."*

---

## Applicant User Stories

### Epic 1: Pre-Application Assessment

**US-APP-001: Check Eligibility**
- **As a** potential applicant
- **I want to** answer a series of questions about my R&D activities
- **So that** I can determine if I'm likely eligible for the tax incentive before investing time in a full application

**Acceptance Criteria:**
- Given I'm on the eligibility screener page
- When I answer questions about my activities (systematic, uncertain outcome, new knowledge)
- Then I receive a result: "Likely Eligible", "Uncertain - Contact DSTI", or "Not Eligible"
- And I see an explanation of why I received that result
- And I see recommended next steps

**Priority:** High (Week 5)

---

**US-APP-002: Browse Guidelines and Examples**
- **As a** potential applicant
- **I want to** read FAQs and see examples of eligible vs. ineligible activities
- **So that** I can better understand what qualifies as R&D

**Acceptance Criteria:**
- Given I'm on the knowledge hub page
- When I browse topics (e.g., "What is R&D uncertainty?")
- Then I see clear explanations with industry-specific examples
- And I can search for keywords
- And I can download PDF resources

**Priority:** Medium (Week 5)

---

### Epic 2: Registration and Authentication

**US-APP-003: Register for an Account**
- **As a** first-time user
- **I want to** register using my email address
- **So that** I can create an account and start an application

**Acceptance Criteria:**
- Given I'm on the registration page
- When I enter my email address and click "Register"
- Then I receive an email with a magic link
- When I click the magic link
- Then my account is created
- And an organisation is created for me (with placeholder name)
- And I'm redirected to the portal dashboard

**Status:** ✅ Implemented (Week 2, Day 6)

---

**US-APP-004: Log In to Existing Account**
- **As a** returning user
- **I want to** log in using my email address
- **So that** I can access my existing applications

**Acceptance Criteria:**
- Given I'm on the login page
- When I enter my email and click "Send Magic Link"
- Then I receive an email within 30 seconds
- When I click the magic link
- Then I'm authenticated and redirected to the portal dashboard
- And my session persists for 12 hours

**Status:** ✅ Implemented (Week 2, Day 6)

---

### Epic 3: Application Creation

**US-APP-005: Start a New Application**
- **As an** applicant
- **I want to** create a new R&D project application
- **So that** I can apply for the tax incentive

**Acceptance Criteria:**
- Given I'm logged in to the portal
- When I click "New Application" button on the dashboard
- Then a new project is created in DRAFT status
- And I'm redirected to the project builder wizard (Step 1)
- And I see a progress indicator showing 5 steps

**Status:** ✅ Implemented (Week 2, Day 6)

---

**US-APP-006: Fill Out Project Basics (Step 1)**
- **As an** applicant
- **I want to** provide basic information about my R&D project
- **So that** DSTI can understand the context

**Acceptance Criteria:**
- Given I'm on Step 1 of the wizard
- When I fill in: Project Title, Sector (dropdown), Start Date, End Date, Location
- Then the data is auto-saved every 30 seconds
- And I see a "Saved" indicator
- When I click "Next"
- Then I'm taken to Step 2
- And Step 1 is marked as complete on the progress indicator

**Status:** ✅ Implemented (Week 2, Day 6)

---

**US-APP-007: Describe R&D Uncertainty (Step 2)**
- **As an** applicant
- **I want to** describe the uncertainty in my R&D activities and my objectives
- **So that** DSTI can assess if my activities meet the Section 11D definition

**Acceptance Criteria:**
- Given I'm on Step 2 of the wizard
- When I fill in: R&D Uncertainty Description (textarea), Objectives (textarea)
- Then I see inline help text explaining what "uncertainty" means
- And the data is auto-saved every 30 seconds
- When I click "Next"
- Then I'm taken to Step 3

**Status:** ✅ Implemented (Week 2, Day 6)

---

**US-APP-008: Describe Methodology (Step 3)**
- **As an** applicant
- **I want to** describe my research approach, innovation, and challenges overcome
- **So that** DSTI can evaluate the scientific/technological merit

**Acceptance Criteria:**
- Given I'm on Step 3 of the wizard
- When I fill in: Research Approach, Innovation Description, Challenges Overcome
- Then the data is auto-saved every 30 seconds
- When I click "Next"
- Then I'm taken to Step 4

**Status:** ⏳ Planned (Week 2, Day 7)

---

**US-APP-009: Provide Team Information (Step 4)**
- **As an** applicant
- **I want to** describe my R&D team and their qualifications
- **So that** DSTI can assess if I have the capacity to execute the project

**Acceptance Criteria:**
- Given I'm on Step 4 of the wizard
- When I fill in: Team Size, Key Personnel, Relevant Qualifications
- Then the data is auto-saved every 30 seconds
- When I click "Next"
- Then I'm taken to Step 5

**Status:** ⏳ Planned (Week 2, Day 7)

---

**US-APP-010: Provide Budget and Expenditure (Step 5)**
- **As an** applicant
- **I want to** provide details about my R&D budget and expenditure timeline
- **So that** DSTI can understand the financial scope

**Acceptance Criteria:**
- Given I'm on Step 5 of the wizard
- When I fill in: Total Budget, R&D Costs Breakdown, Timeline
- Then the data is auto-saved every 30 seconds
- When I click "Review"
- Then I'm shown a summary of all 5 steps for review

**Status:** ⏳ Planned (Week 2, Day 7)

---

### Epic 4: Evidence Management

**US-APP-011: Upload Evidence Files**
- **As an** applicant
- **I want to** upload supporting documents (financial, technical, team)
- **So that** DSTI can verify my claims

**Acceptance Criteria:**
- Given I'm on the Evidence Vault page
- When I drag and drop files or click "Upload"
- Then I can select multiple files (PDF, DOCX, XLSX, JPG, PNG)
- And files are uploaded with progress bar
- And files are categorized (Financial, Technical, Team, Other)
- And I can change the category
- And I see file metadata (name, size, upload date)
- And I can delete files before submission

**Priority:** High (Week 3)

---

**US-APP-012: View and Download Uploaded Files**
- **As an** applicant
- **I want to** preview and download my uploaded evidence files
- **So that** I can verify I uploaded the correct documents

**Acceptance Criteria:**
- Given I have uploaded evidence files
- When I click on a file name
- Then I see a preview (PDF inline viewer)
- Or I can download the file
- And I see when it was uploaded

**Priority:** Medium (Week 3)

---

### Epic 5: Application Submission

**US-APP-013: Review Application Before Submission**
- **As an** applicant
- **I want to** see a summary of my entire application
- **So that** I can ensure everything is complete before submitting

**Acceptance Criteria:**
- Given I've completed all 5 wizard steps and uploaded evidence
- When I click "Review" on Step 5
- Then I see a summary page showing:
  - All form data from Steps 1-5
  - List of uploaded evidence files
  - Readiness score (e.g., 85%)
  - Validation warnings (if any)
- And I can click "Edit" to go back to any step
- And I see a "Submit Application" button

**Priority:** High (Week 3)

---

**US-APP-014: View Readiness Score**
- **As an** applicant
- **I want to** see a score indicating how ready my application is
- **So that** I can improve it before submitting

**Acceptance Criteria:**
- Given I'm on the review page
- When the system calculates my readiness score
- Then I see a percentage (0-100%)
- And I see a breakdown:
  - Completeness: 40% (all fields filled)
  - Quality: 30% (R&D description quality)
  - Evidence: 20% (sufficient files uploaded)
  - Coherence: 10% (consistency across sections)
- And I see recommendations to improve the score
- Example: "Upload financial documents to increase score by 15%"

**Priority:** Medium (Week 3)

---

**US-APP-015: Submit Application**
- **As an** applicant
- **I want to** formally submit my application to DSTI
- **So that** it can be reviewed

**Acceptance Criteria:**
- Given I'm on the review page and my readiness score is ≥70%
- When I click "Submit Application"
- Then I see a confirmation modal: "Are you sure? You cannot edit after submission."
- When I confirm
- Then the application status changes from DRAFT to SUBMITTED
- And the submission timestamp is recorded
- And I receive a confirmation email
- And I'm redirected to the application status page

**Priority:** High (Week 3)

---

### Epic 6: Draft Management

**US-APP-016: Save Application as Draft**
- **As an** applicant
- **I want to** save my application without submitting
- **So that** I can complete it later

**Acceptance Criteria:**
- Given I'm filling out the wizard
- When data is auto-saved (every 30 seconds)
- Then the application remains in DRAFT status
- And I can close the browser and come back later
- And my data persists

**Status:** ✅ Implemented (Week 2, Day 6)

---

**US-APP-017: View List of Draft Applications**
- **As an** applicant
- **I want to** see all my draft applications on the dashboard
- **So that** I can continue working on them

**Acceptance Criteria:**
- Given I have created draft applications
- When I'm on the portal dashboard
- Then I see a list of draft projects with:
  - Project title
  - Sector
  - Progress percentage (e.g., "60% complete")
  - Last modified date
  - "Continue" button
  - "Delete" button

**Status:** ⏳ Planned (Week 2, Day 9)

---

**US-APP-018: Resume Editing a Draft Application**
- **As an** applicant
- **I want to** click on a draft application to continue editing
- **So that** I don't have to start over

**Acceptance Criteria:**
- Given I have a draft application
- When I click "Continue" on the dashboard
- Then I'm redirected to the wizard at the last completed step
- And all my previously saved data is pre-filled
- And I can continue filling out remaining steps

**Status:** ⏳ Planned (Week 2, Day 9)

---

**US-APP-019: Delete a Draft Application**
- **As an** applicant
- **I want to** delete a draft application I no longer need
- **So that** my dashboard stays organized

**Acceptance Criteria:**
- Given I have a draft application
- When I click "Delete"
- Then I see a confirmation modal: "Are you sure? This cannot be undone."
- When I confirm
- Then the project and all its data are deleted
- And the project is removed from my dashboard

**Status:** ⏳ Planned (Week 2, Day 9)

---

### Epic 7: Application Tracking

**US-APP-020: View Application Status**
- **As an** applicant
- **I want to** see the current status of my submitted application
- **So that** I know where it is in the review process

**Acceptance Criteria:**
- Given I have submitted an application
- When I view the application details page
- Then I see the status: SUBMITTED, UNDER_REVIEW, PENDING_INFO, APPROVED, or REJECTED
- And I see status history with timestamps:
  - Submitted: Jan 15, 2026
  - Screening Completed: Jan 18, 2026
  - Review Started: Jan 20, 2026
- And I see the assigned reviewer's name (if applicable)

**Priority:** High (Week 4)

---

**US-APP-021: Respond to Information Requests**
- **As an** applicant
- **I want to** receive notifications when DSTI requests additional information
- **So that** I can provide it promptly

**Acceptance Criteria:**
- Given a reviewer has requested additional information
- When I check my email
- Then I receive a notification with:
  - What information is needed
  - A link to respond
  - Deadline for response (14 days)
- When I click the link
- Then I'm taken to a response form
- And I can upload additional evidence files
- And I can provide text explanation
- When I submit
- Then the reviewer is notified
- And the application status changes to UNDER_REVIEW

**Priority:** High (Week 4)

---

**US-APP-022: Receive Decision Notification**
- **As an** applicant
- **I want to** be notified when a decision is made on my application
- **So that** I know the outcome

**Acceptance Criteria:**
- Given a decision has been made (APPROVED or REJECTED)
- When I check my email
- Then I receive a notification with:
  - Decision (Approved/Rejected)
  - Link to download decision letter (PDF)
  - Next steps
- When I log in to the portal
- Then I see the updated status
- And I can download the decision letter

**Priority:** High (Week 4)

---

### Epic 8: AI-Assisted Application

**US-APP-023: Get AI Suggestions for R&D Uncertainty Description**
- **As an** applicant
- **I want to** receive intelligent suggestions to improve my R&D uncertainty description
- **So that** I can better articulate how my activities meet Section 11D criteria

**Acceptance Criteria:**
- Given I'm on Step 2 (R&D Uncertainty)
- When I type my uncertainty description
- And I click "Get AI Suggestions" button
- Then the AI analyzes my text
- And I see suggestions:
  - "Your description is strong on technical uncertainty but could better explain why the outcome was uncertain."
  - "Consider adding specific details about failed experiments or unexpected results."
- And I can accept or ignore suggestions
- And the AI usage count is tracked (max 10 per application)

**Priority:** Medium (Week 3)

---

**US-APP-024: See Examples of Good Descriptions**
- **As an** applicant
- **I want to** see examples of well-written R&D uncertainty descriptions
- **So that** I can model my own description after them

**Acceptance Criteria:**
- Given I'm on Step 2 (R&D Uncertainty)
- When I click "View Examples"
- Then I see 3-5 examples from different sectors:
  - Manufacturing: Machine learning for predictive maintenance
  - ICT: Novel encryption algorithm
  - Agriculture: Drought-resistant crop variety
- And each example has annotations explaining why it's good

**Priority:** Low (Week 3)

---

## Consultant User Stories

### Epic 9: Application Screening

**US-CON-001: View Application Queue**
- **As a** DSTI consultant
- **I want to** see a list of applications awaiting screening
- **So that** I can prioritize my workload

**Acceptance Criteria:**
- Given I'm logged in as a consultant
- When I navigate to the "Screening Queue" page
- Then I see a list of submitted applications sorted by submission date (oldest first)
- And each row shows: Applicant name, Project title, Sector, Submission date, Status
- And I can filter by sector
- And I can sort by date or applicant name
- And I see a count: "35 applications in queue"

**Priority:** High (Week 4)

---

**US-CON-002: Screen an Application for Completeness**
- **As a** DSTI consultant
- **I want to** review an application using a standardized checklist
- **So that** I can quickly assess if it's ready for detailed review

**Acceptance Criteria:**
- Given I'm viewing an application
- When I click "Screen Application"
- Then I see a checklist:
  - [ ] Organisation details complete?
  - [ ] Project description clear and specific?
  - [ ] R&D uncertainty clearly described?
  - [ ] Evidence files attached?
  - [ ] Activities meet Section 11D definition?
- When I check all boxes
- Then I can select an action:
  - Assign to Reviewer
  - Request Additional Information
  - Reject (with reason)
- And I can add internal notes (visible only to DSTI staff)

**Priority:** High (Week 4)

---

**US-CON-003: Assign Application to Reviewer**
- **As a** DSTI consultant
- **I want to** assign a screened application to a specific reviewer
- **So that** it can undergo detailed technical review

**Acceptance Criteria:**
- Given I've completed screening and the application is complete
- When I select "Assign to Reviewer"
- Then I see a dropdown list of reviewers with their current workload (e.g., "Dr. Naledi - 12 applications")
- When I select a reviewer and click "Assign"
- Then the application status changes to UNDER_REVIEW
- And the reviewer receives an email notification
- And I see a confirmation: "Assigned to Dr. Naledi"

**Priority:** High (Week 4)

---

**US-CON-004: Request Additional Information from Applicant**
- **As a** DSTI consultant
- **I want to** request missing information from the applicant
- **So that** the application can be completed before review

**Acceptance Criteria:**
- Given I'm screening an application and find it incomplete
- When I select "Request Information"
- Then I see a form with:
  - Template options (e.g., "Missing financial documents", "Unclear R&D uncertainty")
  - Free-text field to specify what's needed
  - Deadline field (default: 14 days)
- When I submit
- Then the application status changes to PENDING_INFO
- And the applicant receives an email with the request
- And a reminder email is sent 3 days before the deadline

**Priority:** High (Week 4)

---

**US-CON-005: Reject Application with Reason**
- **As a** DSTI consultant
- **I want to** reject an application that doesn't meet basic eligibility criteria
- **So that** we don't waste reviewer time on ineligible applications

**Acceptance Criteria:**
- Given I'm screening an application that is clearly ineligible
- When I select "Reject"
- Then I see a form with:
  - Rejection reason dropdown (e.g., "Activities not R&D", "Outside DSTI mandate")
  - Free-text field to explain
- When I submit
- Then the application status changes to REJECTED
- And a rejection letter is generated
- And the applicant is notified via email

**Priority:** Medium (Week 4)

---

**US-CON-006: Add Internal Notes**
- **As a** DSTI consultant
- **I want to** add notes about an application that are only visible to DSTI staff
- **So that** I can share context with reviewers

**Acceptance Criteria:**
- Given I'm viewing an application
- When I add a note in the "Internal Notes" section
- Then the note is saved with my name and timestamp
- And the note is visible to all DSTI staff (consultants, reviewers, admins)
- And the note is NOT visible to the applicant

**Priority:** Medium (Week 4)

---

### Epic 10: Workload Management

**US-CON-007: View My Screening Statistics**
- **As a** DSTI consultant
- **I want to** see how many applications I've screened this month
- **So that** I can track my productivity

**Acceptance Criteria:**
- Given I'm logged in as a consultant
- When I view my profile/dashboard
- Then I see statistics:
  - Applications screened this month: 42
  - Average screening time: 25 minutes
  - Applications assigned to review: 35
  - Applications pending info: 5
  - Applications rejected: 2

**Priority:** Low (Week 5)

---

## Reviewer User Stories

### Epic 11: Application Review

**US-REV-001: View My Assigned Applications**
- **As a** reviewer
- **I want to** see a list of applications assigned to me
- **So that** I can plan my review schedule

**Acceptance Criteria:**
- Given I'm logged in as a reviewer
- When I navigate to "My Reviews" page
- Then I see applications assigned to me with:
  - Project title
  - Applicant name
  - Sector
  - Date assigned
  - Priority (if flagged)
  - Days in review (e.g., "5 days")
- And I can sort by date assigned or sector
- And I can filter by sector

**Priority:** High (Week 4)

---

**US-REV-002: Review Application Details**
- **As a** reviewer
- **I want to** view all application information in one place
- **So that** I can conduct a thorough evaluation

**Acceptance Criteria:**
- Given I'm viewing an assigned application
- When I open the application details page
- Then I see all information from 5 wizard steps:
  - Project Basics
  - R&D Uncertainty
  - Methodology & Innovation
  - Team & Expertise
  - Budget & Expenditure
- And I see the consultant's screening notes
- And I see a list of evidence files with categories
- And I can click on evidence files to preview (PDF inline viewer)

**Priority:** High (Week 4)

---

**US-REV-003: Preview and Download Evidence Files**
- **As a** reviewer
- **I want to** view evidence files without downloading them
- **So that** I can quickly assess relevance

**Acceptance Criteria:**
- Given I'm viewing an application's evidence files
- When I click on a PDF file
- Then I see an inline preview (in-browser PDF viewer)
- When I click on a DOCX/XLSX file
- Then I have the option to download
- And I can download all evidence as a ZIP file

**Priority:** High (Week 4)

---

**US-REV-004: Complete Structured Review Form**
- **As a** reviewer
- **I want to** fill out a standardized review form
- **So that** my evaluation is consistent and comprehensive

**Acceptance Criteria:**
- Given I'm reviewing an application
- When I click "Complete Review Form"
- Then I see structured questions:
  - Does the project meet the Section 11D definition of R&D? (Yes/No/Uncertain)
  - Is the uncertainty clearly described? (Rating: 1-5)
  - Is the innovation significant? (Rating: 1-5)
  - Are team qualifications adequate? (Yes/No/Partial)
  - Are financials reasonable and well-documented? (Yes/No/Needs Clarification)
  - Free-text field: "Review Notes"
- When I complete the form
- Then my responses are saved
- And I can save as draft and return later

**Priority:** High (Week 4)

---

**US-REV-005: Make a Recommendation**
- **As a** reviewer
- **I want to** recommend approval, rejection, or request for more information
- **So that** a final decision can be made

**Acceptance Criteria:**
- Given I've completed the review form
- When I select my recommendation:
  - Approve (ready for final approval)
  - Reject (does not meet criteria)
  - Request Additional Information (specify what's needed)
- And I provide justification (required)
- When I click "Submit Recommendation"
- Then the recommendation is recorded
- And the application moves to the next stage based on my recommendation

**Priority:** High (Week 4)

---

**US-REV-006: Request Additional Information**
- **As a** reviewer
- **I want to** request specific clarifications or evidence from the applicant
- **So that** I can make an informed decision

**Acceptance Criteria:**
- Given I'm reviewing an application and need more information
- When I select "Request Additional Information"
- Then I see a form to specify:
  - What information/evidence is needed (free text)
  - Deadline (default: 14 days)
- When I submit
- Then the application status changes to PENDING_INFO
- And the applicant receives an email
- And I'm notified when the applicant responds

**Priority:** High (Week 4)

---

**US-REV-007: Escalate Complex Cases**
- **As a** reviewer
- **I want to** escalate an application to a senior reviewer or committee
- **So that** complex or borderline cases get additional scrutiny

**Acceptance Criteria:**
- Given I'm reviewing a complex application
- When I click "Escalate"
- Then I see a form to:
  - Select escalation reason (e.g., "Borderline eligibility", "Large budget", "Novel technology")
  - Provide context
- When I submit
- Then the application is flagged for senior review
- And the senior reviewer is notified

**Priority:** Low (Week 5)

---

### Epic 12: Collaboration

**US-REV-008: View Consultant's Screening Notes**
- **As a** reviewer
- **I want to** see the consultant's initial screening notes
- **So that** I understand their assessment and any concerns

**Acceptance Criteria:**
- Given I'm viewing an assigned application
- When I open the application details
- Then I see a section "Consultant Screening Notes" with:
  - Consultant's name
  - Screening date
  - Screening checklist results
  - Internal notes
- And I can add my own notes in response

**Priority:** Medium (Week 4)

---

## Administrator User Stories

### Epic 13: User Management

**US-ADM-001: Create New User Account**
- **As an** administrator
- **I want to** manually create user accounts for DSTI staff
- **So that** they can access the system with appropriate roles

**Acceptance Criteria:**
- Given I'm logged in as an admin
- When I navigate to "User Management"
- And I click "Create User"
- Then I see a form with:
  - Email (required)
  - Name (required)
  - Role (dropdown: Consultant, Reviewer, Admin)
  - Organisation (if Applicant)
- When I submit
- Then the user account is created
- And the user receives a welcome email with magic link to set up their account

**Priority:** Medium (Week 5)

---

**US-ADM-002: Assign Roles to Users**
- **As an** administrator
- **I want to** assign or change user roles
- **So that** users have appropriate permissions

**Acceptance Criteria:**
- Given I'm viewing a user's profile
- When I click "Edit Roles"
- Then I see checkboxes for: Applicant, Consultant, Reviewer, Admin
- When I select/deselect roles and save
- Then the user's permissions are updated immediately
- And the user is notified of the change

**Priority:** Medium (Week 5)

---

**US-ADM-003: Deactivate User Account**
- **As an** administrator
- **I want to** deactivate a user account (e.g., staff member leaves DSTI)
- **So that** they can no longer access the system

**Acceptance Criteria:**
- Given I'm viewing a user's profile
- When I click "Deactivate Account"
- And I confirm
- Then the user's account is marked as inactive
- And they cannot log in
- And their existing sessions are invalidated
- But their historical data (reviews, notes) remains in the system

**Priority:** Low (Week 5)

---

### Epic 14: Organisation Management

**US-ADM-004: View All Organisations**
- **As an** administrator
- **I want to** see a list of all registered organisations
- **So that** I can manage organisation data

**Acceptance Criteria:**
- Given I'm logged in as an admin
- When I navigate to "Organisations"
- Then I see a searchable list with:
  - Organisation name
  - Registration number
  - Sector
  - Number of applications
  - Number of members
- And I can search by name or registration number
- And I can click on an organisation to view details

**Priority:** Low (Week 5)

---

**US-ADM-005: Edit Organisation Details**
- **As an** administrator
- **I want to** update organisation information
- **So that** errors can be corrected

**Acceptance Criteria:**
- Given I'm viewing an organisation's profile
- When I click "Edit"
- Then I can update:
  - Organisation name
  - Registration number
  - Sector
  - Address
- When I save
- Then the changes are applied
- And an audit log entry is created

**Priority:** Low (Week 5)

---

**US-ADM-006: Merge Duplicate Organisations**
- **As an** administrator
- **I want to** merge duplicate organisation records
- **So that** data is consistent and users aren't confused

**Acceptance Criteria:**
- Given I've identified two duplicate organisations (e.g., "Acme Ltd" and "Acme Limited")
- When I select "Merge Organisations"
- And I choose which one to keep
- Then all projects and memberships from the duplicate are transferred to the kept organisation
- And the duplicate organisation is archived (not deleted, for audit trail)

**Priority:** Low (Week 5+)

---

### Epic 15: System Configuration

**US-ADM-007: Configure Email Templates**
- **As an** administrator
- **I want to** edit email notification templates
- **So that** communication with applicants is clear and professional

**Acceptance Criteria:**
- Given I'm in the "System Configuration" section
- When I navigate to "Email Templates"
- Then I see a list of templates:
  - Welcome email
  - Magic link email
  - Application submitted confirmation
  - Information request
  - Decision notification (approval)
  - Decision notification (rejection)
- When I click "Edit" on a template
- Then I can modify subject line and body text
- And I can use variables like {{applicantName}}, {{projectTitle}}
- When I save
- Then future emails use the updated template

**Priority:** Low (Week 5+)

---

**US-ADM-008: View System Audit Logs**
- **As an** administrator
- **I want to** view all user actions in the system
- **So that** I can investigate issues or ensure compliance

**Acceptance Criteria:**
- Given I'm in the "Audit Logs" section
- When I view the logs
- Then I see entries with:
  - Timestamp
  - User (email and role)
  - Action (e.g., "Created project", "Updated application", "Deleted file")
  - Resource (e.g., "Project ID: 123")
  - IP address
- And I can filter by:
  - Date range
  - User
  - Action type
- And I can export logs as CSV

**Priority:** Medium (Week 5)

---

### Epic 16: Reporting and Analytics

**US-ADM-009: View Dashboard with Key Metrics**
- **As an** administrator
- **I want to** see real-time statistics on the dashboard
- **So that** I can monitor program performance

**Acceptance Criteria:**
- Given I'm on the admin dashboard
- Then I see:
  - Total applications (current year)
  - Applications by status (pie chart: Draft, Submitted, Under Review, Approved, Rejected)
  - Applications by sector (bar chart)
  - Average processing time (trend line over months)
  - Reviewer workload distribution (who has how many reviews)
  - Recent activity feed (last 10 actions)
- And the data refreshes automatically every 5 minutes

**Priority:** High (Week 5)

---

**US-ADM-010: Generate Custom Reports**
- **As an** administrator
- **I want to** generate reports for executive leadership
- **So that** I can demonstrate program impact

**Acceptance Criteria:**
- Given I'm in the "Reports" section
- When I select report type:
  - Monthly summary (applications received, processed, approved)
  - Sector analysis (approval rates by sector)
  - Processing time analysis (bottlenecks, trends)
  - Reviewer performance (number reviewed, average time)
- And I select date range
- When I click "Generate Report"
- Then I see the report on screen
- And I can export as PDF or CSV

**Priority:** Medium (Week 5)

---

**US-ADM-011: Identify Bottlenecks**
- **As an** administrator
- **I want to** see which applications are taking longest to process
- **So that** I can intervene and unblock them

**Acceptance Criteria:**
- Given I'm viewing the applications list
- When I sort by "Days in Current Status"
- Then I see applications that have been in the same status for longest
- And I can see:
  - Application details
  - Who it's assigned to (if applicable)
  - Last action taken
- And I can reassign or escalate

**Priority:** Medium (Week 5)

---

## Story Prioritization

### MoSCoW Method

**Must Have (Launch Blockers):**
- Authentication and user management (basic)
- Project wizard (all 5 steps)
- Evidence upload
- Application submission
- Consultant screening interface
- Reviewer interface with recommendation workflow
- Decision notification to applicants

**Should Have (Launch Week 1-2):**
- Form validation with Zod
- Draft management (resume, delete)
- AI co-pilot for R&D descriptions
- Readiness score
- Email notifications for status changes
- Admin dashboard with basic metrics

**Could Have (Post-Launch Enhancements):**
- Advanced filtering and search
- Bulk operations (e.g., bulk assign to reviewer)
- Mobile app
- Real-time collaboration (multiple reviewers on one application)
- Advanced analytics and custom reports

**Won't Have (Future Roadmap):**
- Integration with SARS e-filing
- Multi-year project tracking
- Public data portal
- Third-party API for consultants

---

## Acceptance Criteria Templates

### Template 1: CRUD Operations
```
Given [user role] is authenticated
When [action: create/read/update/delete] [resource]
Then [expected outcome]
And [system state change]
And [notification/feedback to user]
```

### Template 2: Workflow Actions
```
Given [precondition: application status, user role]
When [user performs action]
Then [status changes to X]
And [notification sent to Y]
And [audit log records action]
```

### Template 3: Validation
```
Given [user is filling out form]
When [user enters invalid data]
Then [error message displayed]
And [user cannot proceed to next step]
And [suggestion provided to fix error]
```

### Template 4: Permissions
```
Given [user with role X]
When [user attempts to access resource Y]
Then [if authorized: access granted]
Or [if not authorized: 403 error with explanation]
```

---

**END OF USER STORIES DOCUMENT**

**Total User Stories**: 60  
**Epics**: 16  
**Status**:
- ✅ Implemented: 7 stories (12%)
- 🔄 In Progress: 3 stories (5%)
- ⏳ Planned: 50 stories (83%)

**Next Action**: Review with stakeholders and prioritize for Week 3 sprint planning.
