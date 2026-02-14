-- Migration: Enable board member access
-- Description: Allows board members to view shared boards, lists, and cards
-- Run: supabase db push

-- =====================================================
-- UPDATE BOARD POLICIES - Allow members to view
-- =====================================================

DROP POLICY IF EXISTS "owners_can_view_boards" ON public.boards;
DROP POLICY IF EXISTS "owners_can_insert_boards" ON public.boards;
DROP POLICY IF EXISTS "owners_can_update_boards" ON public.boards;
DROP POLICY IF EXISTS "owners_can_delete_boards" ON public.boards;

-- New policies: owner can do anything, members can view
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

-- =====================================================
-- UPDATE LIST POLICIES - Allow members to view
-- =====================================================

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

-- =====================================================
-- UPDATE CARD POLICIES - Allow members to view
-- =====================================================

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
