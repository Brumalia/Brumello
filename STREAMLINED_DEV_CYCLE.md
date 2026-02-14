# Streamlined Development Cycle

## Current Pain Points
1. Manual testing takes time
2. No automated checks catch bugs early
3. Database migrations are risky & manual
4. UI changes require manual verification
5. No clear progression from task → shipped

---

## Proposed Streamlined Cycle

### **Phase 1: Task Definition** (15-30 min)
```
Idea → Discussion → Document in issue → Acceptance criteria
```
- Create GitHub issue with:
  - What (feature/bug)
  - Why (user value)
  - How to verify (test cases)

### **Phase 2: Build** (Variable)
```
Create branch → Implement → Self-review → Push
```
- Branch naming: `feat/thing` or `fix/thing`
- Commit early and often
- Push to trigger CI

### **Phase 3: Verify (Automated)** (2-5 min)
```
CI runs → ESLint ✓ → TypeScript ✓ → Build ✓ → Preview URL ready
```
- GitHub Actions checks
- ESLint for code quality
- TypeScript for type safety
- Build verification
- Vercel generates preview URL

### **Phase 4: Manual QA** (10-20 min)
```
Test preview URL → Verify feature works → Approve/request changes
```
- You test on preview URL (not production)
- Use checklist from issue
- Approve or request changes

### **Phase 5: Deploy** (Automatic)
```
Merge to main → Deploy to production → Post-deploy tests
```
- GitHub Actions merges automatically after approval
- Vercel deploys to production
- Smoke tests verify critical flows

### **Phase 6: Monitor** (5 min)
```
Check for errors → Check critical features → Mark done
```
- Quick check that nothing broke
- Mark issue as shipped
- Move to next task

---

## Total Cycle Time

| Step | Time | Automated? |
|------|------|-----------|
| Task Definition | 20 min | 🟢 Manual (once) |
| Build | Varies | 🔴 Manual |
| CI Checks | 2-5 min | 🟢 Automatic |
| QA on Preview | 10-20 min | 🔴 Manual |
| Deploy | <1 min | 🟢 Automatic |
| Monitor | 5 min | 🔴 Manual |
| **TOTAL** | **37 min + dev time** | 50% automated |

**Goal:** Reduce manual testing + deployment overhead from 30% to 10% of dev time

---

## Brumello as CI/CD Test Case

### Why Brumello First?
- ✅ Already deployed and live
- ✅ Has real features to test
- ✅ Good complexity (not too simple, not overwhelming)
- ✅ Can test full cycle on real product

### Implementation Plan

**Week 1: GitHub Actions**
```yaml
On: push/PR
- ESLint check (5 min)
- TypeScript compile (3 min)
- Build Next.js (5 min)
Pass = can merge, Fail = request changes
```

**Week 2: Vercel Preview + Deployment**
```
PR created → Vercel builds preview URL
QA tests on preview
Merge → Auto-deploys production
```

**Week 3: Smoke Tests**
```
After production deploy:
- Can login? ✓
- Can create board? ✓
- Can add card? ✓
- Settings modal opens? ✓
```

**Week 4: Database Migration Safety**
```
CI checks:
- RLS policies valid? ✓
- No infinite recursion? ✓
- Migrations have rollback? ✓
```

---

## Brumello UI/UX Makeover

When you're "nearly finished", schedule 1-2 weeks for polish:

### Quick Wins (High Impact, Low Effort)
- [ ] Dark mode toggle
- [ ] Improved card previews (show labels, due date, progress)
- [ ] Better empty states (illustrations, guidance)
- [ ] Animation polish (smooth transitions)
- [ ] Mobile responsiveness
- [ ] Better color contrast

### Medium Effort
- [ ] Redesign settings modal
- [ ] Improve drag-drop UX
- [ ] Better loading states
- [ ] Toast notifications for actions
- [ ] Keyboard shortcuts (Cmd+B for new board)
- [ ] Board/list templates

### Design Resources
- [ ] TailwindUI for component inspiration
- [ ] Framer Motion for animations
- [ ] Shadcn/ui for polished components
- [ ] Figma for design mockups

---

## Development Tools Setup

### GitHub
```
✓ Issue templates (feature/bug)
✓ Pull request template (checklist)
✓ Branch protection rules
✓ Require passing CI to merge
✓ Require review before merge (optional for solo)
```

### Actions Needed
```yaml
# .github/workflows/ci.yml
- Lint code
- Type check
- Build
- Report results

# .github/workflows/post-deploy.yml
- Run smoke tests
- Alert on failures
```

### Monitoring
```
✓ Sentry for error tracking
✓ Vercel analytics
✓ GitHub Actions dashboard
✓ Slack notifications (optional)
```

---

## Metrics to Track

After setup, measure:
- **Time to merge:** Target <30 min from PR → merged
- **Deploy frequency:** How many ships per week?
- **Defect rate:** Bugs reaching production
- **CI pass rate:** Should be >95%
- **Review cycle time:** How fast you QA PRs

---

## Implementation Order

1. **Week 1:** GitHub Actions (ESLint + TypeScript)
2. **Week 2:** Vercel Preview deployments
3. **Week 3:** Deploy to production + smoke tests
4. **Week 4:** Database migration safety checks
5. **Ongoing:** Monitor metrics, iterate on process

**Total setup time:** 4-6 hours spread over a month

---

## Tools Needed

### Free/Already Have
- ✅ GitHub
- ✅ Vercel
- ✅ Supabase
- ✅ Node.js

### To Add
- [ ] ESLint config (already in Brumello)
- [ ] GitHub Actions workflows (~2 hours to write)
- [ ] Smoke test script (~1 hour)
- [ ] Optional: Sentry (~30 min setup)

### Optional Paid
- 💰 Sentry (error tracking) - $29/mo
- 💰 GitHub Copilot (faster dev) - $10/mo

---

## Success Criteria

When this is working:
- ✅ CI catches all major bugs before production
- ✅ You can deploy 2-3 times per day confidently
- ✅ Zero broken deployments in a week
- ✅ Time from PR → production < 15 min
- ✅ Can focus on features, not firefighting

