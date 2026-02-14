# Brumello ❄️

A modern, powerful task management tool built with Next.js and Supabase. Designed for the Agent Development Studio workflow.

**Live Site:** https://brumello.vercel.app

## What is Brumello?

Brumello is our own Trello-inspired project management tool, built by agents for agents (and humans too!). It's designed specifically to power the workflow of the Brumalia Agent Development Studio.

## Current Status: **Phase 4 - Drag & Drop Complete ✅**

Last Updated: 2026-02-13

### ✅ What's Working Now

**Authentication (Phase 1)**
- ✅ User signup and login with email/password
- ✅ Protected routes and sessions
- ✅ Sign out functionality
- ✅ Supabase Auth integration

**Board Management (Phase 2)**
- ✅ Create boards with custom titles and descriptions
- ✅ 8 color themes for boards
- ✅ View all your boards in a grid
- ✅ Click into individual boards
- ✅ Create lists within boards
- ✅ Add cards to lists
- ✅ Real-time database updates

**Edit & Delete (Phase 3 - High Priority)**
- ✅ Edit card titles and descriptions (modal view)
- ✅ Delete cards with confirmation
- ✅ Edit list titles (inline editing)
- ✅ Delete lists with card count warning
- ✅ Card details modal with full editing
- ✅ Keyboard shortcuts (Esc to cancel, Enter to save)

**Drag & Drop (Phase 4)**
- ✅ Drag cards within lists to reorder
- ✅ Drag cards between different lists
- ✅ Smooth animations and visual feedback
- ✅ Drag overlay preview
- ✅ Touch support for mobile devices
- ✅ Auto-save positions to database

**Database**
- ✅ Complete PostgreSQL schema with RLS policies
- ✅ Tables: boards, lists, cards, labels, comments, board_members
- ✅ Row-level security ensuring users only see their own data
- ✅ Automatic timestamps and triggers

### 🚧 Next Features

**Phase 5: Polish & Enhancement**
- ⏳ Due dates with calendar picker
- ⏳ Labels/tags with colors
- ⏳ Board settings (edit/delete boards)

**Phase 4: Collaboration**
- ⏳ Real-time updates (multiple users)
- ⏳ Comments on cards
- ⏳ File attachments
- ⏳ User assignments
- ⏳ Activity feed

**Phase 5: Polish**
- ⏳ Dark mode
- ⏳ Keyboard shortcuts
- ⏳ Command palette (Cmd+K)
- ⏳ Mobile responsive improvements
- ⏳ Performance optimization

### Unique Features (Planned)

- 🎯 Agent task integration with studio-meta
- 🎯 GitHub sync for development tasks
- 🎯 Automated workflows
- 🎯 AI-powered suggestions

## Tech Stack

- **Frontend:** Next.js 15 (React, App Router)
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Realtime:** Supabase Realtime (planned)
- **Hosting:** Vercel
- **Language:** TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Vercel account (for deployment)

### Local Development

```bash
# Clone the repository
git clone https://github.com/Brumalia/Brumello.git
cd Brumello

# Install dependencies
npm install

# Set up environment variables
# Create .env.local with:
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Run the development server
npm run dev
```

Open [https://brumello.vercel.app](https://brumello.vercel.app) to see the app, or run locally with `npm run dev`.

### Database Setup

1. Create a new Supabase project
2. Run the SQL schema from `supabase/schema.sql` in the Supabase SQL Editor
3. Configure authentication providers (email is enabled by default)

## Deployment

Brumello is configured for easy deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel project settings
3. Deploy!

## Development Progress Log

### 2026-02-11
- ✅ Initial Next.js setup with TypeScript and Tailwind
- ✅ Supabase integration (client & server)
- ✅ Complete database schema with RLS policies
- ✅ Landing page design
- ✅ Deployed to Vercel

### 2026-02-12 (Morning)
- ✅ Email/password authentication system
- ✅ Login and signup pages
- ✅ Protected dashboard
- ✅ Sign out functionality
- ✅ Board creation with color picker
- ✅ Boards list view
- ✅ Individual board pages
- ✅ List creation within boards
- ✅ Card creation within lists
- ✅ Fixed Next.js 15 params compatibility
- ✅ Fixed invisible button bug (CSS contrast)
- ✅ Fixed stuck "Adding..." buttons

### 2026-02-12 (Evening)
- ✅ Card details modal with edit/delete
- ✅ List inline editing
- ✅ List delete with confirmation
- ✅ Card description support
- ✅ Hover menus and keyboard shortcuts
- ✅ Error handling improvements
- ✅ **Phase 3 Complete** - Brumello is now fully functional!

### 2026-02-13 (Morning)
- ✅ Installed @dnd-kit libraries
- ✅ Drag & drop for cards (within lists)
- ✅ Drag & drop for cards (between lists)
- ✅ Smooth animations and drag overlay
- ✅ Position persistence to database
- ✅ Touch/mobile support
- ✅ **Phase 4 Complete** - Drag & drop working! 🎯

## Project Structure

```
Brumello/
├── app/
│   ├── auth/
│   │   ├── login/         # Login page
│   │   └── signup/        # Signup page
│   ├── boards/
│   │   ├── page.tsx       # Boards list
│   │   └── [id]/
│   │       └── page.tsx   # Individual board view
│   ├── dashboard/         # User dashboard
│   └── page.tsx           # Landing page
├── components/
│   ├── CreateBoardButton.tsx
│   ├── CreateListButton.tsx
│   ├── CreateCardButton.tsx
│   └── SignOutButton.tsx
├── lib/
│   └── supabase/
│       ├── client.ts      # Client-side Supabase
│       └── server.ts      # Server-side Supabase
├── supabase/
│   ├── schema.sql         # Database schema
│   └── README.md          # Database setup guide
└── package.json
```

## Contributing

This is a project of the Brumalia Agent Development Studio. Agents collaborate to build features based on tasks in the studio-meta repository.

## Roadmap

**Short-term (Next 2 weeks)**
- Edit/delete functionality for cards and lists
- Drag & drop interface
- Card details modal
- Due dates

**Medium-term (Next month)**
- Real-time collaboration
- Comments system
- Labels and filtering
- Dark mode

**Long-term**
- Mobile app (React Native)
- Integration with Agent Development Studio
- Automated task creation from GitHub issues
- AI-powered task suggestions

## License

MIT

---

Built with ❄️ by Brumalia and the Agent Development Studio

**Latest Deployment:** https://brumello.vercel.app  
**Repository:** https://github.com/Brumalia/Brumello  
**Organization:** https://github.com/Brumalia
