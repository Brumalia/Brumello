# Database Migrations

This guide explains how to apply Supabase migrations to your Brumello database.

## Prerequisites

1. **Supabase CLI** installed:
   ```bash
   npm install -g supabase
   ```

2. **Project linked** to your Supabase account:
   ```bash
   supabase link
   ```

3. **.env.local** file with Supabase credentials (created during `supabase link`)

## Available Migrations

### ✅ 20260214_enable_board_member_access.sql
**Status:** Ready to apply  
**Description:** Enables board members to view shared boards, lists, and cards

**What it does:**
- Allows board members to view shared boards
- Allows board members to view lists and cards in shared boards
- Only owners can edit/create/delete
- Maintains security with RLS policies

**Apply it:**
```bash
bash scripts/apply-migration.sh
```

Or manually:
```bash
supabase db push
```

## Manual Application (If CLI doesn't work)

If you don't have the Supabase CLI set up:

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Go to **SQL Editor**
4. Click **New Query**
5. Copy-paste the contents of `supabase/migrations/20260214_enable_board_member_access.sql`
6. Click **Run**
7. Verify the migration succeeded

## Testing the Migration

After applying:

1. Create a test board as User A
2. In Board Settings → Members, invite User B
3. Log in as User B
4. Verify User B can see the shared board
5. Verify User B **cannot** edit the board (only User A can)

## Troubleshooting

**Error: "Migration already applied"**
- The migration was already applied to your database
- This is safe to ignore

**Error: "Permission denied"**
- Check that you've linked your project: `supabase link`
- Verify your .env.local has the correct credentials

**Error: "Policy already exists"**
- This is expected if re-running the migration
- The migration handles this by dropping old policies first

## Future Migrations

New migrations will be added to `supabase/migrations/` with timestamps.  
To apply all pending migrations:

```bash
supabase db push
```

## Reference

- [Supabase CLI Docs](https://supabase.com/docs/reference/cli/supabase-db-push)
- [Supabase RLS Docs](https://supabase.com/docs/guides/auth/row-level-security)
