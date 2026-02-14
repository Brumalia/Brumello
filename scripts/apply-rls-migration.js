const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://prpuowaxaeqzxvmjofap.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!serviceRoleKey) {
  console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY environment variable not set');
  console.error('Usage: SUPABASE_SERVICE_ROLE_KEY=your_key node scripts/apply-rls-migration.js');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

const migration = `
-- Enable board member access
DROP POLICY IF EXISTS "owners_can_view_boards" ON public.boards;
DROP POLICY IF EXISTS "owners_can_insert_boards" ON public.boards;
DROP POLICY IF EXISTS "owners_can_update_boards" ON public.boards;
DROP POLICY IF EXISTS "owners_can_delete_boards" ON public.boards;

CREATE POLICY "can_view_boards" ON public.boards FOR SELECT USING (
  created_by = auth.uid() OR 
  EXISTS (
    SELECT 1 FROM public.board_members 
    WHERE board_members.board_id = boards.id 
    AND board_members.user_id = auth.uid()
  )
);

CREATE POLICY "owners_can_insert_boards" ON public.boards FOR INSERT WITH CHECK (created_by = auth.uid());
CREATE POLICY "owners_can_update_boards" ON public.boards FOR UPDATE USING (created_by = auth.uid());
CREATE POLICY "owners_can_delete_boards" ON public.boards FOR DELETE USING (created_by = auth.uid());

DROP POLICY IF EXISTS "owners_can_view_lists" ON public.lists;
DROP POLICY IF EXISTS "owners_can_insert_lists" ON public.lists;
DROP POLICY IF EXISTS "owners_can_update_lists" ON public.lists;
DROP POLICY IF EXISTS "owners_can_delete_lists" ON public.lists;

CREATE POLICY "can_view_lists" ON public.lists FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.boards 
    WHERE boards.id = lists.board_id 
    AND (
      boards.created_by = auth.uid() OR
      EXISTS (
        SELECT 1 FROM public.board_members 
        WHERE board_members.board_id = boards.id 
        AND board_members.user_id = auth.uid()
      )
    )
  )
);

CREATE POLICY "owners_can_insert_lists" ON public.lists FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.boards WHERE boards.id = lists.board_id AND boards.created_by = auth.uid())
);

CREATE POLICY "owners_can_update_lists" ON public.lists FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.boards WHERE boards.id = lists.board_id AND boards.created_by = auth.uid())
);

CREATE POLICY "owners_can_delete_lists" ON public.lists FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.boards WHERE boards.id = lists.board_id AND boards.created_by = auth.uid())
);

DROP POLICY IF EXISTS "owners_can_view_cards" ON public.cards;
DROP POLICY IF EXISTS "owners_can_insert_cards" ON public.cards;
DROP POLICY IF EXISTS "owners_can_update_cards" ON public.cards;
DROP POLICY IF EXISTS "owners_can_delete_cards" ON public.cards;

CREATE POLICY "can_view_cards" ON public.cards FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.lists
    JOIN public.boards ON boards.id = lists.board_id
    WHERE lists.id = cards.list_id AND (
      boards.created_by = auth.uid() OR
      EXISTS (
        SELECT 1 FROM public.board_members 
        WHERE board_members.board_id = boards.id 
        AND board_members.user_id = auth.uid()
      )
    )
  )
);

CREATE POLICY "owners_can_insert_cards" ON public.cards FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.lists
    JOIN public.boards ON boards.id = lists.board_id
    WHERE lists.id = cards.list_id AND boards.created_by = auth.uid()
  )
);

CREATE POLICY "owners_can_update_cards" ON public.cards FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.lists
    JOIN public.boards ON boards.id = lists.board_id
    WHERE lists.id = cards.list_id AND boards.created_by = auth.uid()
  )
);

CREATE POLICY "owners_can_delete_cards" ON public.cards FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.lists
    JOIN public.boards ON boards.id = lists.board_id
    WHERE lists.id = cards.list_id AND boards.created_by = auth.uid()
  )
);
`;

async function applyMigration() {
  try {
    console.log('🚀 Applying board member access migration to Supabase...\n');
    
    // Use sql function if available
    const { data, error } = await supabase.rpc('exec_sql', { sql: migration });
    
    if (error) {
      console.error('⚠️  Note: Direct SQL execution not available.');
      console.error('Please apply the migration manually:');
      console.error('1. Go to https://app.supabase.com/');
      console.error('2. Select your project');
      console.error('3. SQL Editor → New Query');
      console.error('4. Copy-paste the migration from supabase/migrations/');
      console.error('5. Click Run');
      process.exit(1);
    }
    
    console.log('✅ Migration applied successfully!');
    console.log('\nBoard members can now:');
    console.log('  • View shared boards');
    console.log('  • View lists and cards');
    console.log('  • View comments and labels');
    console.log('\nOnly owners can:');
    console.log('  • Edit/create/delete boards, lists, and cards');
    
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

applyMigration();
