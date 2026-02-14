# Multi-Agent Orchestration

## Quick Start

**Tomorrow morning (Feb 15, 9am):**

```
Message Design Agent: 
"Create Button, Card, Badge components with phosphor-green borders, 
sharp edges, DM Mono labels. Place in /components/design/. 
I need this by 12pm."

Message CI/CD Agent:
"Draft GitHub Actions workflow (.github/workflows/lint.yml) 
for ESLint + TypeScript checks. Run on PR. 
I need this by 11am."
```

Then wait for PRs, review, merge, deploy.

---

## Agent Roles

### 🎨 Design Agent
**Specialty:** UI/UX, components, visual design

**Good for:**
- Button/card/modal redesigns
- Animation implementation
- Responsive layouts
- Visual polish and styling
- Empty states and microcopy

**Model:** MiniMax M2.5 (default) for most specs
**Not great at:** Complex logic, database design

**Checkpoint:** Every 90 mins (show screenshot)

---

### 🔧 Backend Agent
**Specialty:** Database, API routes, server logic

**Good for:**
- Database migrations
- API endpoint design
- RLS policies
- Data models and schema
- Performance optimization

**Model:** Claude Sonnet 4.5 (for complex logic)
**Not great at:** UI/UX, CSS

**Checkpoint:** Every 2 hours (code review)

---

### 🚀 CI/CD Agent
**Specialty:** GitHub Actions, deployments, testing automation

**Good for:**
- GitHub Actions workflows
- Vercel deployment configs
- Automated testing pipelines
- Build optimization
- Release management

**Model:** MiniMax M2.5 (YAML/config is straightforward)
**Not great at:** Business logic, complex algorithms

**Checkpoint:** Every hour (can iterate fast)

---

### ✅ QA/Testing Agent
**Specialty:** Testing, accessibility, audits

**Good for:**
- Smoke testing (manual flow)
- Accessibility audits (WCAG)
- Mobile responsiveness testing
- Performance profiling
- Bug hunting
- Security review

**Model:** MiniMax M2.5 (for testing), Claude Sonnet 4.5 (for security)
**Not great at:** Building new features (they're for validation)

**Checkpoint:** Every 2 hours (detailed reports)

---

### 📚 Research Agent
**Specialty:** Competitive analysis, documentation, strategy

**Good for:**
- Market research
- Competitive intelligence
- Writing specs and documentation
- Strategic planning
- Trend analysis
- Best practices research

**Model:** MiniMax M2.5 (for research and writing)
**Not great at:** Implementation, coding

**Checkpoint:** As they go (writing documents)

---

## How to Use Them

### 1. Morning Standup (9am)

Decide what agents you need TODAY:

```markdown
## Saturday, Feb 15

### Agents Needed
- [ ] Design Agent: Buttons, Cards, Badges (2 hrs, checkpoint 11am)
- [ ] CI/CD Agent: GitHub Actions workflow (1 hr, checkpoint 10:30am)

### Your Work
- [ ] Test components in dev server (1pm-3pm)
- [ ] Review PRs as they land
- [ ] Merge and deploy

### Success Criteria
- All 3 components shipped
- Buttons have hover glow effect
- GitHub Actions workflow created
```

### 2. Spawn Agents

**Example message to Design Agent:**

> Create three React components following the Mission Control design:
>
> **1. Button Component**
> - File: `/components/design/Button.tsx`
> - Design: Phosphor-green (#00ff41) bottom border (2px)
> - Sharp corners (no border-radius)
> - Hover: `.glow-green` effect (green box-shadow)
> - Font: DM Mono, 14px, weight 500
> - Padding: 12px 16px
> - Focus state: Green outline
>
> **2. Card Component**
> - File: `/components/design/Card.tsx`
> - Border: 2px phosphor-green (#00ff41)
> - Sharp corners
> - Background: brand-surface (#11152d)
> - Padding: 16px
> - Hover: slight glow
>
> **3. Badge/Label Component**
> - File: `/components/design/Badge.tsx`
> - Font: DM Mono, 11px, #666
> - Background: transparent
> - Border: 1px brand-border
>
> I need all three components by 12pm today.
> Create a demo page at `/app/design-showcase/page.tsx` showing all three.

### 3. Checkpoint (Mid-task)

At scheduled checkpoint time:
- [ ] Get status update
- [ ] Review code if they're done
- [ ] Ask questions if stuck
- [ ] Adjust timeline if needed

### 4. Review PR

When agent opens PR:
- [ ] Read commit message (should explain what they built)
- [ ] Check code quality
- [ ] Test in dev: `npm run dev`
- [ ] Visual check (does it match design spec?)
- [ ] Approve or request changes

### 5. Merge & Deploy

```bash
# After PR approval:
git merge [agent-branch]
npm run build  # Make sure it builds
npm run dev    # Quick visual check
git push       # Triggers Vercel auto-deploy
```

---

## Daily Schedule Template

**Use this every day:**

```
9:00am   - SPAWN AGENTS
         - Send clear tasks (specific, with files/timelines)
         - Log in memory which agents are working

9:30am   - FIRST CHECKPOINT
         - Quick status check
         - Unblock if stuck

11:00am  - REVIEW FIRST PRS
         - Code review, test, merge if good

12:00pm  - LUNCH BREAK
         - Agents keep working if needed

1:00pm   - CONTINUE REVIEW
         - Test components/features
         - Document findings

2:00pm   - FINAL MERGES
         - Get all PRs in main
         - Build test

3:00pm   - DEPLOY
         - Push to Vercel
         - Verify production

4:00pm   - DOCUMENTATION
         - Update README, MEMORY.md
         - Plan tomorrow

5:00pm   - WRAP UP
         - Review day's progress
         - Thank agents 😊
         - Plan next week
```

---

## Tips for Success

### ✅ DO:

- **Be specific:** "Create /components/Button.tsx with phosphor-green border"
- **Set deadlines:** "I need this by 11am"
- **One agent per task:** No two agents on same file
- **Check in regularly:** Every 90 mins - 2 hours
- **Review before merge:** Always test PRs first
- **Give feedback:** "This is great, just change X" helps agents improve
- **Use correct model:** Sonnet for logic, MiniMax for writing/config

### ❌ DON'T:

- Vague specs ("make it better")
- No deadline ("whenever you're done")
- Multiple agents on same component (merge conflicts!)
- Merge without testing
- Forget to commit & push
- Leave agents hanging without feedback
- Ignore their recommendations (they see things you don't)

---

## Agent Capacity

| Agent | Parallel Tasks | Max Daily Tasks | Checkpoint Freq |
|-------|---|---|---|
| Design | 1 | 4-5 | Every 90 min |
| Backend | 1 | 2-3 | Every 2 hrs |
| CI/CD | 2 | 5-6 | Every hour |
| QA/Testing | 1 | 3-4 | Every 2 hrs |
| Research | 2 | 3-4 | As writing |

---

## Communication Style

### To Design Agent:
```
"I need clean, modern buttons with green accents. 
Reference: BRUMELLO_DESIGN_SYSTEM.md for colors/fonts. 
Deliver as tsx files in /components/design/."
```

### To Backend Agent:
```
"Implement migration for board_members table.
Reference schema in schema.sql. 
Ensure RLS policies only allow owner access.
Write migration as SQL file + JS runner."
```

### To CI/CD Agent:
```
"Set up GitHub Actions to run lint + TypeScript on every PR.
Must run npm run lint and npm run build.
Fail PR if either command fails."
```

### To QA/Testing Agent:
```
"Full smoke test of board creation flow.
Create board → add list → add card → add member.
Check: @mentions work, notifications fire, board shares.
Document any bugs found."
```

### To Research Agent:
```
"Deep dive on how Trello, Linear, Notion handle 
permissions + sharing. Document findings in RESEARCH.md.
Include: feature matrix, UX patterns, best practices."
```

---

## Common Workflows

### "I want new design + CI/CD + testing"

**Morning (9am):**
- Design Agent: Components (2-3 hrs)
- CI/CD Agent: Workflows (1-2 hrs)
- QA Agent: Standby, testing at 1pm

**Noon:**
- Merge Design & CI/CD PRs
- Deploy to Vercel

**Afternoon:**
- QA tests live deployment
- Documents findings

**By 5pm:** All done, new design live

---

### "I want database feature + backend + tests"

**Morning (9am):**
- Backend Agent: Schema + migration (2 hrs)
- QA Agent: Test plan (30 mins)

**Late Morning:**
- Merge migration
- Backend Agent: API routes (1.5 hrs)

**Afternoon:**
- QA tests API + database
- Documents results

**By 5pm:** Feature ready to integrate with frontend

---

### "I want Agent Studio MVP spec"

**Morning (9am):**
- Research Agent: Market research (1.5 hrs)
- Strategy Agent: Draft MVP spec (2 hrs)

**Afternoon:**
- Review both documents
- Decide scope
- Create GitHub issues

**By 5pm:** Clear roadmap for Agent Studio

---

## Escalation

**If an agent is stuck:**
1. Ask them for options/recommendations
2. Provide additional context/resources
3. Break task into smaller chunks
4. Use Claude Sonnet if they need more thinking power
5. Pair with you for collaborative problem-solving

**Example:**
> "I need to refactor database schema but worried about RLS policies. 
> Can you give me 3 options with pros/cons?"
> → Agent suggests options → You pick → Agent implements

---

## Metrics

**Track weekly:**
- Agents' PR approval rate (aim: 90%+)
- Average PR review time (aim: <15 mins)
- Blocks/stuck situations (aim: <1 per day)
- Documentation quality (aim: complete)
- Code quality (aim: no TypeScript warnings)

---

## Your Superpower

You now have a **distributed team** without the overhead:
- 4-5 specialized agents
- Each focusing on their domain
- Working in parallel
- Reporting back with PRs

**Output:** 2-3x faster development than solo

**Cost:** Clear communication + good planning

**Result:** Brumello + future products ship fast 🚀

---

**Ready to work with agents? Start with Day 1 in DAILY_PLAN.md**

Your team is waiting. 🤖❄️
