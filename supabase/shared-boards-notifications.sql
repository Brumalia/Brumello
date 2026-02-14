-- Simplified Shared Boards & Notifications Migration
-- Fixed: removed recursive policies

-- =====================================================
-- NOTIFICATIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('mention', 'card_assigned', 'board_invite', 'card_due')),
  title text NOT NULL,
  message text,
  link text,
  read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Drop old policies if exist
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can delete their own notifications" ON public.notifications;

-- Create simpler policies
CREATE POLICY "view_notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "update_notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "delete_notifications" ON public.notifications FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "insert_notifications" ON public.notifications FOR INSERT WITH CHECK (auth.uid() = user_id OR TRUE);

-- Index
CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON public.notifications(user_id);

-- =====================================================
-- SIMPLIFIED BOARD ACCESS - Allow board owner full access
-- Members can view but not own boards
-- =====================================================

-- Drop complex policies
DROP POLICY IF EXISTS "Users can view their boards" ON public.boards;
DROP POLICY IF EXISTS "Users can create boards" ON public.boards;
DROP POLICY IF EXISTS "Users can update their boards" ON public.boards;
DROP POLICY IF EXISTS "Users can delete their boards" ON public.boards;

-- Simple policies - owner only
CREATE POLICY "owners_can_view_boards" ON public.boards FOR SELECT USING (created_by = auth.uid());
CREATE POLICY "owners_can_insert_boards" ON public.boards FOR INSERT WITH CHECK (created_by = auth.uid());
CREATE POLICY "owners_can_update_boards" ON public.boards FOR UPDATE USING (created_by = auth.uid());
CREATE POLICY "owners_can_delete_boards" ON public.boards FOR DELETE USING (created_by = auth.uid());

-- =====================================================
-- BOARD MEMBERS - Allow viewing members of boards you own
-- =====================================================

DROP POLICY IF EXISTS "Users can view board members" ON public.board_members;
DROP POLICY IF EXISTS "Users can add board members" ON public.board_members;
DROP POLICY IF EXISTS "Users can manage board members" ON public.board_members;
DROP POLICY IF EXISTS "Users can remove board members" ON public.board_members;

CREATE POLICY "view_board_members" ON public.board_members FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.boards WHERE boards.id = board_members.board_id AND boards.created_by = auth.uid())
);

CREATE POLICY "insert_board_members" ON public.board_members FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.boards WHERE boards.id = board_members.board_id AND boards.created_by = auth.uid())
);

CREATE POLICY "update_board_members" ON public.board_members FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.boards WHERE boards.id = board_members.board_id AND boards.created_by = auth.uid())
);

CREATE POLICY "delete_board_members" ON public.board_members FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.boards WHERE boards.id = board_members.board_id AND boards.created_by = auth.uid())
);

-- =====================================================
-- LISTS - Owner only
-- =====================================================

DROP POLICY IF EXISTS "Users can view lists in their boards" ON public.lists;
DROP POLICY IF EXISTS "Users can create lists in their boards" ON public.lists;
DROP POLICY IF EXISTS "Users can update lists in their boards" ON public.lists;
DROP POLICY IF EXISTS "Users can delete lists in their boards" ON public.lists;

CREATE POLICY "owners_can_view_lists" ON public.lists FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.boards WHERE boards.id = lists.board_id AND boards.created_by = auth.uid())
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

-- =====================================================
-- CARDS - Owner only
-- =====================================================

DROP POLICY IF EXISTS "Users can view cards in their boards" ON public.cards;
DROP POLICY IF EXISTS "Users can create cards in their boards" ON public.cards;
DROP POLICY IF EXISTS "Users can update cards in their boards" ON public.cards;
DROP POLICY IF EXISTS "Users can delete cards in their boards" ON public.cards;

CREATE POLICY "owners_can_view_cards" ON public.cards FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.lists
    JOIN public.boards ON boards.id = lists.board_id
    WHERE lists.id = cards.list_id AND boards.created_by = auth.uid()
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

-- =====================================================
-- LABELS - Owner only
-- =====================================================

DROP POLICY IF EXISTS "Users can view labels in their boards" ON public.labels;

CREATE POLICY "owners_can_view_labels" ON public.labels FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.boards WHERE boards.id = labels.board_id AND boards.created_by = auth.uid())
);

-- =====================================================
-- COMMENTS - Owner only
-- =====================================================

DROP POLICY IF EXISTS "Users can view comments in their boards" ON public.comments;
DROP POLICY IF EXISTS "Users can create comments in their boards" ON public.comments;

CREATE POLICY "owners_can_view_comments" ON public.comments FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.cards
    JOIN public.lists ON lists.id = cards.list_id
    JOIN public.boards ON boards.id = lists.board_id
    WHERE cards.id = comments.card_id AND boards.created_by = auth.uid()
  )
);

CREATE POLICY "owners_can_insert_comments" ON public.comments FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.cards
    JOIN public.lists ON lists.id = cards.list_id
    JOIN public.boards ON boards.id = lists.board_id
    WHERE cards.id = comments.card_id AND boards.created_by = auth.uid()
  )
  AND auth.uid() = user_id
);

-- =====================================================
-- CARD LABELS - Owner only
-- =====================================================

DROP POLICY IF EXISTS "users_can_view_card_labels" ON public.card_labels;

CREATE POLICY "owners_can_view_card_labels" ON public.card_labels FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.cards
    JOIN public.lists ON lists.id = cards.list_id
    JOIN public.boards ON boards.id = lists.board_id
    WHERE cards.id = card_labels.card_id AND boards.created_by = auth.uid()
  )
);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Get board members
CREATE OR REPLACE FUNCTION public.get_board_members(p_board_id uuid)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  email text,
  role text,
  created_at timestamptz
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    bm.id,
    bm.user_id,
    u.email::text,
    bm.role::text,
    bm.created_at
  FROM public.board_members bm
  JOIN auth.users u ON u.id = bm.user_id
  WHERE bm.board_id = p_board_id
  ORDER BY bm.created_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Search users
CREATE OR REPLACE FUNCTION public.search_users(p_query text)
RETURNS TABLE (
  id uuid,
  email text
) AS $$
BEGIN
  RETURN QUERY
  SELECT u.id, u.email::text
  FROM auth.users u
  WHERE u.email ILIKE '%' || p_query || '%'
  LIMIT 10;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
