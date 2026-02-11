# Supabase Setup

## Running the Database Schema

To set up the Brumello database:

1. Go to your Supabase project dashboard: https://supabase.com/dashboard/project/prpuowaxaeqzxvmjofap
2. Click **"SQL Editor"** in the left sidebar
3. Click **"New query"**
4. Copy the entire contents of `schema.sql` from this directory
5. Paste into the SQL Editor
6. Click **"Run"** (or press Cmd/Ctrl + Enter)

You should see: "Success. No rows returned"

This will create all the tables, policies, and indexes needed for Brumello.

## Database Structure

### Tables

- **boards** - Project boards
- **board_members** - Users who have access to boards
- **lists** - Columns within boards
- **cards** - Individual task cards
- **labels** - Color-coded labels for cards
- **card_labels** - Many-to-many relationship between cards and labels
- **comments** - Comments on cards

### Security (RLS Policies)

Row Level Security (RLS) is enabled on all tables to ensure:
- Users can only see boards they created
- Users can only modify their own content
- All queries respect ownership and permissions

### Indexes

Performance indexes are created on all foreign keys and frequently queried fields.

## Next Steps

After running the schema:
1. Enable email authentication in Supabase Auth settings
2. Configure auth providers (email/password, OAuth, etc.)
3. Test by creating a board via the app

---

❄️
