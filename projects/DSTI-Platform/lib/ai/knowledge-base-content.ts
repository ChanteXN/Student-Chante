/**
 * Sample R&D Tax Incentive Knowledge Base Content
 * This content will be ingested into the system for the AI Co-Pilot
 */

export const sampleKnowledgeBase = [
  {
    title: "R&D Tax Incentive Overview - Section 11D",
    type: "HELP_ARTICLE" as const,
    content: `
# R&D Tax Incentive Programme (Section 11D)

## Programme Overview

The Research and Development (R&D) Tax Incentive is a government programme administered by the Department of Science, Technology and Innovation (DSTI) in terms of Section 11D of the Income Tax Act (No. 58 of 1962).

The incentive allows companies conducting R&D activities in South Africa to claim a tax deduction of 150% of their qualifying R&D expenditure. This represents a significant boost to companies investing in innovation.

## Objectives

The programme aims to:
- Stimulate private sector investment in R&D
- Encourage innovation and technological advancement
- Build South Africa's knowledge economy
- Support job creation in high-skill sectors
- Enhance global competitiveness

## Eligibility Requirements

### Who Can Apply?

Any South African company (registered in terms of the Companies Act) that:
1. Conducts R&D activities in South Africa
2. Incurs qualifying R&D expenditure
3. Is registered as a taxpayer with SARS
4. Has a valid tax clearance certificate

### What Qualifies as R&D?

According to Section 11D, R&D must involve:

**Systematic Investigation or Experimentation**
- Activities must be systematic and planned, not ad-hoc
- Must follow a structured methodology
- Documentation of the approach is essential

**Technical or Scientific Uncertainty**
- There must be uncertainty about the outcome or method
- The solution cannot be readily available or obvious
- Requires experimentation to resolve the uncertainty

**New Knowledge or Innovation**
- Aims to discover new knowledge
- Develops new products, processes, or services
- Significantly improves existing ones

**Not Routine Work**
- Excludes routine testing, quality control, market research
- Excludes production activities and standard engineering
- Excludes social sciences and humanities research

## Application Process

### Step 1: Pre-Approval (Required)

Before incurring R&D expenditure, companies must:
1. Submit a detailed R&D proposal to DSTI
2. Describe the technical uncertainty and methodology
3. Provide evidence of systematic approach
4. Wait for DSTI approval before proceeding

**Important:** Expenditure incurred before approval is NOT eligible for the incentive.

### Step 2: Conduct R&D

Once approved, companies must:
- Follow the approved R&D plan
- Maintain detailed records and documentation
- Track time spent by R&D personnel
- Document experiments, tests, and outcomes
- Keep all financial records

### Step 3: Annual Reporting

During the R&D period, companies must:
- Submit annual progress reports to DSTI
- Report on milestones achieved
- Document any deviations from the plan
- Provide evidence of continued R&D activity

### Step 4: Claim Tax Deduction

After approval confirmation, companies:
1. Submit tax returns to SARS
2. Claim 150% deduction of qualifying expenditure
3. Include DSTI approval reference number
4. Be prepared for SARS audit if required

## Qualifying Expenditure

### What Costs Qualify?

**Personnel Costs (Salary/Wages)**
- Salaries of employees directly involved in R&D
- Time must be properly logged and documented
- Only time spent on R&D activities qualifies
- Overheads and administrative costs are excluded

**Consumables**
- Materials used directly in R&D experiments
- Chemicals, reagents, test samples
- Prototyping materials
- Must be directly consumed in R&D process

**Depreciation**
- Equipment used exclusively for R&D (>70% usage)
- Calculated per SARS depreciation rules
- Must maintain usage logs

**Intellectual Property Costs**
- Patent filing costs (if directly related to R&D)
- IP searches and prior art reviews
- Legal costs for protecting R&D outcomes

### What Costs DO NOT Qualify?

❌ Capital expenditure (buildings, land)
❌ General overheads (rent, utilities)
❌ Marketing and sales costs
❌ Administrative costs
❌ Production and manufacturing costs
❌ Social science or humanities research
❌ Routine testing and quality control
❌ Software for general business use

## Documentation Requirements

### Essential Documents

1. **R&D Plan**
   - Clear research objectives
   - Description of technical uncertainty
   - Proposed methodology
   - Expected outcomes
   - Timeline and budget

2. **Technical Documentation**
   - Literature reviews
   - Patent searches
   - Experimental protocols
   - Test results and data
   - Failure analysis
   - Technical reports

3. **Personnel Records**
   - Time sheets for R&D staff
   - Job descriptions
   - Qualifications of key personnel
   - Role definitions

4. **Financial Records**
   - Invoices for consumables
   - Equipment purchase records
   - Salary records with R&D allocation
   - Accounting separation of R&D costs

5. **Progress Reports**
   - Quarterly or annual updates
   - Milestone achievement evidence
   - Deviation explanations
   - Outcomes documentation

## Common Pitfalls to Avoid

### Application Mistakes

❌ **Claiming before approval** - Must get pre-approval first
❌ **Incomplete technical description** - Insufficient detail on uncertainty
❌ **Missing methodology** - No clear experimental approach
❌ **Routine work** - Claiming non-R&D activities
❌ **Poor record-keeping** - Inadequate documentation

### Technical Mistakes

❌ **No genuine uncertainty** - Problem is readily solvable
❌ **Non-systematic approach** - Ad-hoc experimentation
❌ **Production activities** - Scaling up is not R&D
❌ **Software development** - Most software work doesn't qualify
❌ **Market research** - Not technical/scientific

### Financial Mistakes

❌ **Including non-qualifying costs** - Overheads, admin
❌ **Inadequate cost allocation** - Not separating R&D time
❌ **Missing invoices** - No supporting documentation
❌ **Retrospective claims** - Claiming before approval date

## Tips for Success

### Strong Applications Include:

✅ **Clear problem statement** - What specific uncertainty exists?
✅ **Technical depth** - Detailed scientific/technical explanation
✅ **Systematic methodology** - Clear experimental approach
✅ **Evidence of uncertainty** - Literature reviews, patent searches
✅ **Qualified personnel** - Team has relevant expertise
✅ **Detailed budget** - Realistic cost breakdown
✅ **Milestone plan** - Clear deliverables and timeline

### During R&D:

✅ **Maintain lab notebooks** - Document all experiments
✅ **Log time diligently** - Accurate personnel time tracking
✅ **Keep all records** - Financial and technical
✅ **Report regularly** - Keep DSTI informed of progress
✅ **Document failures** - Negative results are valuable
✅ **Seek guidance** - Contact DSTI with questions

## Contact and Support

For assistance with applications:
- **Email:** rdtax@dsti.gov.za
- **Website:** www.dsti.gov.za/rdtax
- **Phone:** +27 12 843 6300

For technical queries, submit through the online portal.

## Recent Changes (2024)

The R&D Tax Incentive was amended effective 1 January 2024:
- Pre-approval is now mandatory for all applications
- Enhanced documentation requirements
- Stricter definitions of qualifying R&D
- New reporting obligations

Companies must comply with the updated requirements to access the incentive.
`,
  },
  {
    title: "Common R&D Scenarios - What Qualifies",
    type: "EXAMPLE" as const,
    content: `
# Common R&D Scenarios: Does It Qualify?

## Manufacturing Sector

### ✅ QUALIFIES: Novel Alloy Development

**Scenario:** A company is developing a new aluminium alloy with improved strength-to-weight ratio for aerospace applications.

**Why it qualifies:**
- Technical uncertainty exists (alloy composition is unknown)
- Systematic experimentation required (testing different compositions)
- Novel outcome (new alloy not currently available)
- Documented methodology (metallurgical testing protocols)

**Qualifying costs:**
- Metallurgist salaries (R&D time only)
- Test materials and samples
- Lab equipment depreciation
- Analytical testing costs

### ❌ DOES NOT QUALIFY: Standard Production Optimization

**Scenario:** A company is improving production efficiency by adjusting machine settings to reduce waste.

**Why it doesn't qualify:**
- No technical uncertainty (methods are well-known)
- Routine optimization (standard engineering)
- No new knowledge created
- Production activity, not research

## Software Development

### ✅ QUALIFIES: Novel Algorithm Development

**Scenario:** Developing a new machine learning algorithm for real-time fraud detection with specific mathematical innovations.

**Why it qualifies:**
- Technical uncertainty (algorithm performance unknown)
- Novel mathematical approach (not using existing ML libraries)
- Systematic methodology (iterative testing and refinement)
- Documented experimentation (test results, comparisons)

**Qualifying costs:**
- Data scientist salaries (algorithm development time)
- Computing resources for testing
- Test data acquisition

### ❌ DOES NOT QUALIFY: Standard Web App Development

**Scenario:** Building a customer portal using React and Node.js with standard features.

**Why it doesn't qualify:**
- No technical uncertainty (established technologies)
- Using existing frameworks and libraries
- Standard software engineering (not research)
- No novel technical contribution

## Agricultural Sector

### ✅ QUALIFIES: Drought-Resistant Crop Development

**Scenario:** Developing a drought-resistant maize variety through genetic modification and field trials.

**Why it qualifies:**
- Scientific uncertainty (genetic outcomes unknown)
- Systematic experimentation (controlled trials)
- Novel biological innovation
- Technical documentation (genetic analysis, field data)

**Qualifying costs:**
- Geneticist and agronomist salaries
- Lab consumables (reagents, seeds)
- Field trial costs
- Genetic sequencing costs

### ❌ DOES NOT QUALIFY: Crop Yield Trials

**Scenario:** Testing different fertilizer combinations to optimize maize yield using known products.

**Why it doesn't qualify:**
- No scientific uncertainty (fertilizer effects are known)
- Routine agricultural testing
- No new knowledge creation
- Standard farm management practice

## Pharmaceutical Sector

### ✅ QUALIFIES: New Drug Formulation Development

**Scenario:** Developing a novel drug delivery system for an existing active ingredient to improve bioavailability.

**Why it qualifies:**
- Technical uncertainty (formulation stability unknown)
- Systematic experimentation (stability testing, trials)
- Novel pharmaceutical innovation
- Rigorous documentation (protocols, clinical data)

**Qualifying costs:**
- Pharmacist and chemist salaries
- Lab materials and compounds
- Clinical trial costs (if exploratory)
- Analytical equipment depreciation

### ❌ DOES NOT QUALIFY: Generic Drug Manufacturing

**Scenario:** Manufacturing a generic version of an off-patent drug using known formulations.

**Why it doesn't qualify:**
- No uncertainty (formulation is known)
- Production activity, not research
- Following established methods
- No new knowledge created

## Energy Sector

### ✅ QUALIFIES: Novel Solar Panel Technology

**Scenario:** Developing a new type of solar cell using perovskite materials to improve efficiency beyond current limits.

**Why it qualifies:**
- Technical uncertainty (material stability issues)
- Novel materials science
- Systematic experimentation (cell fabrication and testing)
- Pushing beyond current technology

**Qualifying costs:**
- Materials scientist salaries
- Specialized materials (perovskites, substrates)
- Testing equipment depreciation
- Characterization costs

### ❌ DOES NOT QUALIFY: Solar Farm Installation

**Scenario:** Installing commercial solar panels at a new site using standard equipment and methods.

**Why it doesn't qualify:**
- No technical uncertainty
- Standard engineering installation
- Using existing technology
- Construction/production activity

## Key Differentiators

### What Makes R&D Qualify?

1. **Genuine Uncertainty** - The outcome or method is unknown
2. **Systematic Approach** - Follows scientific/engineering method
3. **Novel Contribution** - Creates new knowledge or technology
4. **Technical/Scientific** - Based on hard sciences or engineering
5. **Documented Process** - Clear methodology and records

### Red Flags (Usually Not R&D)

❌ "Improving our existing product"
❌ "Market research for new customers"
❌ "Training staff on new software"
❌ "Scaling up production"
❌ "Routine quality testing"
❌ "Fixing bugs in software"
❌ "Optimizing business processes"
❌ "Copying competitor's technology"

## Still Unsure?

Ask these questions:
1. Is there a technical/scientific problem we don't know how to solve?
2. Do we need to conduct experiments to find the solution?
3. Will we create new technical knowledge?
4. Are we following a systematic research methodology?
5. Can we document the uncertainty and our approach?

If you answered YES to all five, your project likely qualifies for the R&D Tax Incentive.

For specific guidance on your project, contact DSTI at rdtax@dsti.gov.za
`,
  },
  {
    title: "Application Readiness Checklist",
    type: "FAQ" as const,
    content: `
# R&D Tax Incentive Application Readiness Checklist

Use this checklist before submitting your application to ensure completeness.

## Section 1: Company Information

- [ ] Company registered in South Africa
- [ ] Valid CIPC registration number
- [ ] Tax reference number available
- [ ] Tax clearance certificate (valid)
- [ ] Authorized signatory identified
- [ ] Company director information complete
- [ ] Contact details verified

## Section 2: Project Description

### Technical Uncertainty

- [ ] Specific technical/scientific problem clearly described
- [ ] Explanation of why solution is not readily available
- [ ] Evidence that uncertainty is genuine (literature review, patent search)
- [ ] Description of current state of technology/knowledge
- [ ] Clear statement of what is unknown

### Research Objectives

- [ ] Specific, measurable objectives stated
- [ ] Technical targets defined
- [ ] Expected outcomes described
- [ ] Innovation clearly explained
- [ ] Alignment with R&D definition confirmed

### Methodology

- [ ] Systematic approach described
- [ ] Experimental protocols outlined
- [ ] Testing procedures specified
- [ ] Data collection methods explained
- [ ] Analysis approach defined
- [ ] Milestones and timeline included

## Section 3: Team and Expertise

- [ ] Key personnel identified
- [ ] Qualifications documented
- [ ] Relevant experience demonstrated
- [ ] Roles and responsibilities defined
- [ ] Time allocation specified
- [ ] Team composition appropriate for project

## Section 4: Budget and Expenditure

### Personnel Costs

- [ ] Salary costs calculated
- [ ] R&D time percentages estimated
- [ ] Job descriptions available
- [ ] Time-tracking system in place

### Consumables

- [ ] List of required materials
- [ ] Cost estimates obtained
- [ ] Supplier quotes available
- [ ] Justification for each item

### Equipment

- [ ] Equipment list prepared
- [ ] R&D usage percentage estimated (>70%)
- [ ] Depreciation calculated
- [ ] Usage log system planned

### Other Costs

- [ ] IP costs identified
- [ ] Third-party costs specified
- [ ] Cost allocation method defined
- [ ] Total budget realistic

## Section 5: Documentation and Evidence

### Supporting Evidence

- [ ] Literature review completed
- [ ] Patent search conducted
- [ ] Prior art analysis done
- [ ] Technical feasibility assessed
- [ ] Market need demonstrated (if relevant)

### Documentation Plan

- [ ] Lab notebook system established
- [ ] Time-sheet templates prepared
- [ ] Financial tracking system ready
- [ ] Data management plan created
- [ ] Reporting schedule defined

## Section 6: Compliance and Risk

### Regulatory Compliance

- [ ] Ethical approvals obtained (if needed)
- [ ] Safety protocols in place
- [ ] Environmental compliance confirmed
- [ ] IP ownership clarified
- [ ] Collaboration agreements signed (if applicable)

### Risk Assessment

- [ ] Technical risks identified
- [ ] Mitigation strategies planned
- [ ] Contingency plans prepared
- [ ] Resource constraints addressed

## Section 7: Expected Outcomes

- [ ] Technical deliverables defined
- [ ] Knowledge outputs specified
- [ ] IP strategy outlined
- [ ] Commercialization potential assessed
- [ ] Benefit to South Africa described

## Section 8: Progress Reporting

- [ ] Reporting frequency agreed
- [ ] Milestone definitions clear
- [ ] KPIs established
- [ ] Communication plan in place

## Common Missing Elements

Applications are often rejected for missing:

1. **Insufficient technical detail**
   - Vague problem statements
   - No clear uncertainty
   - Lacking scientific/technical depth

2. **Poor methodology**
   - No systematic approach
   - Missing experimental protocols
   - Inadequate testing plan

3. **Weak evidence**
   - No literature review
   - No patent search
   - No proof of uncertainty

4. **Incomplete budget**
   - Vague cost estimates
   - Missing justifications
   - Including non-qualifying costs

5. **Inadequate team**
   - Missing key skills
   - Insufficient expertise
   - No relevant experience

## Before Submission

### Final Review

- [ ] All sections complete
- [ ] Technical accuracy verified
- [ ] Costs validated
- [ ] Supporting documents attached
- [ ] Authorized signatory approval obtained
- [ ] Contact information verified

### Quality Check

- [ ] Language clear and professional
- [ ] Technical terms explained
- [ ] No ambiguity or contradictions
- [ ] Formatting consistent
- [ ] References included where needed

### Submission

- [ ] Online portal account created
- [ ] All documents in correct format
- [ ] File sizes within limits
- [ ] Confirmation email received
- [ ] Application reference number noted

## After Submission

- [ ] Track application status
- [ ] Respond promptly to queries
- [ ] Provide additional information if requested
- [ ] Maintain documentation system
- [ ] Begin R&D record-keeping

## Need Help?

If you're missing items on this checklist:

1. **Technical uncertainty unclear?**
   - Conduct thorough literature review
   - Consult with technical experts
   - Review R&D definition criteria

2. **Methodology incomplete?**
   - Develop detailed experimental protocols
   - Define clear testing procedures
   - Create project timeline

3. **Budget uncertain?**
   - Obtain supplier quotes
   - Calculate personnel costs
   - Review qualifying expenditure guidelines

4. **Documentation lacking?**
   - Implement lab notebook system
   - Set up time-tracking
   - Create filing system

**Contact DSTI:** rdtax@dsti.gov.za for application support

## Readiness Score

Count your checkmarks:

- **90-100%** - Ready to submit
- **75-89%** - Minor gaps to address
- **50-74%** - Significant work needed
- **<50%** - Not ready, requires substantial preparation

Take time to complete all items before submitting. A complete, well-prepared application has a much higher chance of approval.
`,
  },
];
