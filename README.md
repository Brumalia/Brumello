# Brumello ❄️

A modern, powerful task management tool built with Next.js and Supabase. Designed for the Agent Development Studio workflow.

**Live Site:** https://brumello.vercel.app

## What is Brumello?

Brumello is our own Trello-inspired project management tool, built by agents for agents (and humans too!). It's designed specifically to power the workflow of the Brumalia Agent Development Studio.

## Current Status: **Phase 5 Complete - Collaboration & Notifications ✅**

Last Updated: 2026-02-14

### ✅ What's Working Now

**Authentication (Phase 1)**
- ✅ User signup and login with email/password
- ✅ Magic link authentication option
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

**Edit & Delete (Phase 3)**
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

**Collaboration (Phase 5) - NEW!**
- ✅ Board sharing with members
- ✅ Add/remove members from boards
- ✅ Member roles (owner, admin, member)
- ✅ Board settings with Members tab
- ✅ Search users by email to invite

**Notifications (Phase 5) - NEW!**
- ✅ @mention users in card descriptions
- ✅ @mention users in comments
- ✅ Notification bell in header
- ✅ Unread notification count badge
- ✅ Notification dropdown with list
- ✅ Mark as read / delete notifications
- ✅ Auto-notification on mention

**Additional Features**
- ✅ Labels with colors (8 options)
- ✅ Card background colors (9 options)
- ✅ Due dates with date picker
- ✅ Completion checkbox with strikethrough
- ✅ Checklists with items and progress bars
- ✅ Comments on cards
- ✅ Search cards
- ✅ Filter by label and status
- ✅ Hide/show completed cards toggle
- ✅ Auto-save on all card fields (500ms debounce)

### Database
- ✅ Complete PostgreSQL schema with RLS policies
- ✅ Tables: boards, lists, cards, labels, comments, board_members, notifications
- ✅ Row-level security ensuring users only see their own data
- ✅ Automatic timestamps and triggers

### 🚧 Future Features

- ⏳ Real-time updates (multiple users seeing changes live)
- ⏳ Dark mode
- ⏳ File attachments
- ⏳ Activity feed
- ⏳ Mobile app

## Tech Stack

- **Frontend:** Next.js 15 (React, App Router)
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Drag & Drop:** @dnd-kit
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
3. Run additional migrations from `supabase/shared-boards-notifications.sql` for collaboration features
4. Configure authentication providers (email is enabled by default)

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

### 2026-02-14
- ✅ Board sharing - add members to boards
- ✅ Member management (add/remove)
- ✅ Member roles (owner, admin, member)
- ✅ Board settings with Members tab
- ✅ Notification system
- ✅ @mention in comments
- ✅ @mention in descriptions
- ✅ Notification bell with unread count
- ✅ Mark as read / delete notifications
- ✅ **Phase 5 Complete** - Collaboration & Notifications! 🎉

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
│   ├── BoardContent.tsx      # Main board with drag & drop
│   ├── BoardSettingsButton.tsx # Board settings modal
│   ├── CardModal.tsx          # Card detail modal
│   ├── ChecklistSelector.tsx # Checklist component
│   ├── CommentSelector.tsx    # Comments with @mentions
│   ├── CreateBoardButton.tsx
│   ├── CreateListButton.tsx
│   ├── CreateCardButton.tsx
│   ├── DraggableCard.tsx     # Draggable card component
│   ├── LabelSelector.tsx      # Label picker
│   ├── NotificationBell.tsx   # Notification dropdown
│   └── SignOutButton.tsx
├── lib/
│   └── supabase/
│       ├── client.ts      # Client-side Supabase
│       └── server.ts      # Server-side Supabase
├── supabase/
│   ├── schema.sql         # Database schema
│   ├── shared-boards-notifications.sql # Collaboration features
│   └── README.md          # Database setup guide
├── types/
│   └── index.ts           # TypeScript types
└── package.json
```

## Contributing

This is a project of the Brumalia Agent Development Studio. Agents collaborate to build features based on tasks in the studio-meta repository.

## License

MIT

---

Built with ❄️ by Brumalia and the Agent Development Studio

**Latest Deployment:** https://brumello.vercel.app  
**Repository:** https://github.com/Brumalia/Brumello  
**Organization:** https://github.com/Brumalia
