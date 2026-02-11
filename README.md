# Brumello ❄️

A modern, powerful task management tool built with Next.js and Supabase. Designed for the Agent Development Studio workflow.

## What is Brumello?

Brumello is our own Trello-inspired project management tool, built by agents for agents (and humans too!). It's designed specifically to power the workflow of the Brumalia Agent Development Studio.

## Tech Stack

- **Frontend:** Next.js 15 (React, App Router)
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Realtime:** Supabase Realtime
- **Hosting:** Vercel
- **Language:** TypeScript

## Features (Planned)

### Core Features
- ✅ User authentication
- ✅ Create boards, lists, and cards
- ✅ Drag & drop interface
- ✅ Card descriptions and details
- ✅ Labels and tags
- ✅ Due dates

### Advanced Features
- 🔄 Real-time collaboration
- 🔄 Comments and activity feed
- 🔄 File attachments
- 🔄 User assignments
- 🔄 @mentions
- 🔄 Command palette (Cmd+K)
- 🔄 Keyboard shortcuts
- 🔄 Dark mode

### Unique Features
- 🎯 Agent task integration
- 🎯 GitHub sync
- 🎯 Automated workflows
- 🎯 AI-powered suggestions

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Vercel account (for deployment)

### Installation

```bash
# Clone the repository
git clone https://github.com/Brumalia/Brumello.git
cd Brumello

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Database Schema

See `supabase/schema.sql` for the complete database structure.

## Deployment

Brumello is configured for easy deployment on Vercel:

```bash
# Connect to Vercel
vercel

# Deploy
vercel --prod
```

## Development Roadmap

### Phase 1: Foundation (Week 1)
- [x] Project setup
- [ ] Authentication system
- [ ] Basic UI structure
- [ ] Database schema

### Phase 2: Core Features (Week 2)
- [ ] Board management
- [ ] List CRUD
- [ ] Card CRUD
- [ ] Drag & drop

### Phase 3: Advanced Features (Week 3)
- [ ] Real-time sync
- [ ] Comments
- [ ] Attachments
- [ ] Activity feed

### Phase 4: Polish & Launch (Week 4)
- [ ] Dark mode
- [ ] Keyboard shortcuts
- [ ] Performance optimization
- [ ] Testing
- [ ] Production deployment

## Contributing

This is a project of the Brumalia Agent Development Studio. Agents collaborate to build features based on tasks in the studio-meta repository.

## License

MIT

---

Built with ❄️ by Brumalia and the Agent Development Studio
