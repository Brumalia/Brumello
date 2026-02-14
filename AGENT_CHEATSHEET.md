# Agent Cheatsheet - Quick Reference

**Print this. Keep it handy. Use it every morning.**

---

## 🎬 Morning Ritual (9am GMT)

```
1. Open DAILY_PLAN.md
2. Find today's section (with GMT times)
3. Copy agent tasks verbatim
4. Send to agents
5. Set checkpoint times (all in GMT)
6. Get coffee ☕
```

---

## Agent Quick Specs

### 🎨 Design Agent
**Task Example:** Buttons, cards, modals, animations
```
Create Button component (/components/Button.tsx):
- Green (#00ff41) bottom border 2px
- Font: DM Mono 14px weight 500
- Hover: .glow-green effect
- Sharp edges, no radius
Timeline: 2 hours
```
**Model:** MiniMax M2.5
**Checkpoint:** Every 90 mins

---

### 🔧 Backend Agent
**Task Example:** Migrations, API routes, databases
```
Create migration for board_members table:
- Schema: id, board_id, user_id, role
- RLS: owner-only access
- Timeline: 1.5 hours
```
**Model:** Claude Sonnet 4.5 (when complex)
**Checkpoint:** Every 2 hours

---

### 🚀 CI/CD Agent
**Task Example:** GitHub Actions, Vercel, automation
```
Create .github/workflows/lint.yml:
- Run: npm run lint && npm run build
- Trigger: on pull_request
- Fail if errors
Timeline: 1 hour
```
**Model:** MiniMax M2.5
**Checkpoint:** Every hour

---

### ✅ QA/Testing Agent
**Task Example:** Testing, accessibility, audits
```
Smoke test board creation:
- Create board → list → card
- Test @mentions work
- Check notifications fire
- Mobile responsive?
Timeline: 1.5 hours
```
**Model:** MiniMax M2.5
**Checkpoint:** Every 2 hours

---

### 📚 Research Agent
**Task Example:** Market research, specs, documentation
```
Research competitor sharing models:
- How do Trello, Linear, Notion handle permissions?
- Document findings in RESEARCH.md
- Include: features, UX patterns, best practices
Timeline: 2 hours
```
**Model:** MiniMax M2.5
**Checkpoint:** As they write

---

## 📋 Daily Flow (GMT)

```
9:00 GMT   Spawn agents
9:30 GMT   First checkpoint
10:30 GMT  Review PRs
12:00 GMT  Lunch
1:00 GMT   Test/review
3:00 GMT   Deploy
4:00 GMT   Docs
5:00 GMT   Wrap up
```

---

## ✅ Checklist: Before Spawning

- [ ] Task is specific (file names, deadlines, examples)
- [ ] Timeline is clear (2 hours? 1 hour?)
- [ ] You know what "done" looks like
- [ ] You've set checkpoint time
- [ ] You know which agent (right specialist?)
- [ ] Model is chosen (MiniMax or Sonnet?)

---

## 🎯 Success Signals

✅ **Agent is crushing it:**
- Delivered early
- Asks clarifying questions
- Offers improvements
- Code is clean
- PR is reviewable

❌ **Agent is stuck:**
- Silent for 30+ mins
- Asking vague questions
- Too big task
- Wrong specialist picked

---

## 🚨 Quick Fixes

**"Agent is stuck"**
→ Ask them for options
→ Break task smaller
→ Pair with you
→ Use Sonnet if needed

**"PR quality is bad"**
→ Request changes (be specific)
→ Have them re-review
→ Merge smaller PRs

**"I'm overwhelmed"**
→ Reduce agent count
→ Extend timelines
→ Checkpoint more often

**"Code conflicts"**
→ Never two agents same file
→ Sequential tasks
→ Plan dependencies upfront

---

## 📊 This Week's Agents (Feb 15-22, GMT)

### Day 1 (Sun 15)
- Design Agent: Buttons, Cards, Badges
- CI/CD Agent: GitHub Actions lint workflow

### Day 2 (Mon 17)
- Design Agent: Animations, glow effects
- CI/CD Agent: GitHub Actions test workflow

### Day 3 (Tue 18)
- Design Agent: Modals, empty states
- Research Agent: Accessibility + copy review

### Day 4 (Wed 19)
- CI/CD Agent: Vercel Preview workflow
- QA Agent: Smoke testing + TypeScript audit

### Day 5 (Thu 20)
- Backend Agent: Migration safety strategy
- QA Agent: Mobile responsiveness audit

### Day 6 (Fri 21)
- Research Agent: Competitive analysis update
- Strategy Agent: MVP specs (Agent Studio + Spending AI)

### Day 7 (Sat 22)
- QA Agent: Full UI/UX audit
- Strategy Agent: Week 2 roadmap

---

## 🔗 Resources

- `DAILY_PLAN.md` - Full week breakdown
- `docs/MULTI_AGENT_GUIDE.md` - Complete guide
- `BRUMELLO_DESIGN_SYSTEM.md` - Design specs to share with Design Agent
- `DEV_PROCESS.md` - CI/CD options to share with CI/CD Agent
- `IDEATION_RESEARCH.md` - Product ideas for Research Agent

---

## 💬 Template Messages

### To any agent:
```
"I need [specific deliverable] by [time].
Reference: [document/file].
Success looks like: [clear criteria].
You can reach me at [checkpoint time] if stuck."
```

### Design Agent:
```
"Create [component name] following BRUMELLO_DESIGN_SYSTEM.md.
File: [path].
Demo page: [path/page.tsx].
Done by: 11am."
```

### CI/CD Agent:
```
"Set up workflow at [.github/workflows/name.yml].
Should run: [npm command].
Trigger: [on push/pr/etc].
Done by: 10am."
```

### QA Agent:
```
"Test [feature] with this flow: [steps].
Check mobile at [widths].
Document findings in [file].
Done by: 2pm."
```

---

## 🎯 One-Sentence Daily Goal

Pick ONE from each day in DAILY_PLAN.md and make it happen.

**Example:** "Saturday: Ship 3 new components live in Vercel"

---

**You've got this. Agents ready. Let's ship.** 🚀

Reference: Commit `1027492` - Multi-agent guide complete
