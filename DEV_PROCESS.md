# Development Process & CI/CD

## Current Workflow

### 1. **TASK** 
- Define feature/bug in conversation
- Document requirements
- Plan implementation

### 2. **BUILD**
- Code locally in `/workspace/Brumello`
- Create/modify components, pages, functions
- Test locally if possible
- Commit with clear messages: `git commit -m "feat: description"`

### 3. **DEPLOY**
- Push to GitHub: `git push`
- Vercel auto-deploys on push (webhook-triggered)
- ~2-5 min deployment time
- Live at https://brumello.vercel.app

### 4. **TEST**
- Manual browser testing
- Check functionality
- Report issues

---

## Current Setup

**Repository:** https://github.com/Brumalia/Brumello

**Deployment:** Vercel (auto)
- Triggers on: `git push` to main
- Builds: Next.js 15 with TypeScript
- Database: Supabase PostgreSQL
- Environment: Production

**Git Branches:**
- `main` - production (deployed live)
- No staging/dev branches yet

---

## Issues with Current Process

1. ❌ **No pre-deployment tests** - pushing broken code goes to production
2. ❌ **No staging environment** - can't test before users see it
3. ❌ **Manual testing only** - time-consuming and error-prone
4. ❌ **No build checks** - TypeScript errors might slip through
5. ❌ **Database migrations manual** - risk of RLS policy issues (like we had)
6. ❌ **No rollback strategy** - if deploy breaks, users are affected

---

## Proposed CI/CD Pipeline

### **GitHub Actions Workflow**

```
CODE PUSH
   ↓
[1] RUN TESTS
   - Linting (ESLint)
   - TypeScript compilation check
   - Unit tests (if any)
   ↓ PASS
[2] BUILD
   - Next.js build
   - Check for warnings
   ↓ SUCCESS
[3] PREVIEW DEPLOY
   - Vercel preview URL
   - Manual QA testing
   ↓ APPROVE
[4] MERGE to main
   ↓
[5] PRODUCTION DEPLOY
   - Live at brumello.vercel.app
   ↓
[6] POST-DEPLOY TESTS
   - Smoke tests
   - Check critical flows
```

### **Stages Breakdown**

| Stage | Trigger | Environment | Tests | Approval |
|-------|---------|-------------|-------|----------|
| **Lint & Build** | PR created | CI Only | ESLint, TSC | Auto (blocks merge if fails) |
| **Preview** | PR ready | Vercel Preview | Manual | Manual (you click "Approve") |
| **Production** | Merge to main | Live | Smoke tests | Auto (after merge) |

---

## What We Can Enable Now

### **Option 1: Lightweight (Minimal Setup)**
- GitHub Actions checks: ESLint, TypeScript compile
- Prevents obviously broken code from deploying
- **Time to implement:** 30 min

### **Option 2: Medium (Recommended)**
- Option 1 + Vercel Preview Deployments
- Every PR gets a test URL before merging
- Manual QA before production
- **Time to implement:** 1 hour

### **Option 3: Full (Enterprise-Ready)**
- Option 2 + Database migration checks
- Smoke tests post-deploy
- Automatic rollback on failure
- **Time to implement:** 3-4 hours

---

## Database Migration Challenges

Current problem: Manual RLS policy updates cause infinite recursion issues.

**Possible solutions:**
1. **Migration versioning** - track schema changes with timestamps
2. **Pre-migration validation** - test policies in CI before deploying
3. **Staging database** - test migrations on copy first
4. **Rollback plan** - keep previous working RLS policies as backup

---

## Recommendation

I suggest **Option 2** because:
- ✅ Low friction (don't block progress)
- ✅ Catches real issues (TypeScript + build errors)
- ✅ Preview URLs let you test before production
- ✅ Manual approval prevents accidents
- ✅ Easy to upgrade to Option 3 later

**My proposal:**
1. Set up GitHub Actions (ESLint + TypeScript check)
2. Enable Vercel Preview deployments
3. Create a PR template with checklist
4. Document testing steps

---

## Questions for You

1. **How often do you want to deploy?** (Daily? Weekly? On-demand?)
2. **Risk tolerance?** (Comfortable with occasional bugs reaching users, or need staging?)
3. **Who tests?** (Just you? Future team members?)
4. **Database migrations:** Need automated checks or okay with manual review?

