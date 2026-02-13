-- Add missing RLS policies for labels and card_labels tables

-- =====================================================
-- LABELS - Add insert, update, delete policies
-- =====================================================

create policy "Users can create labels in their boards"
  on public.labels for insert
  with check (
    exists (
      select 1 from public.boards
      where boards.id = labels.board_id
      and boards.created_by = auth.uid()
    )
  );

create policy "Users can update labels in their boards"
  on public.labels for update
  using (
    exists (
      select 1 from public.boards
      where boards.id = labels.board_id
      and boards.created_by = auth.uid()
    )
  );

create policy "Users can delete labels in their boards"
  on public.labels for delete
  using (
    exists (
      select 1 from public.boards
      where boards.id = labels.board_id
      and boards.created_by = auth.uid()
    )
  );

-- =====================================================
-- CARD LABELS - Add all policies (none exist currently)
-- =====================================================

create policy "Users can view card labels in their boards"
  on public.card_labels for select
  using (
    exists (
      select 1 from public.cards
      join public.lists on lists.id = cards.list_id
      join public.boards on boards.id = lists.board_id
      where cards.id = card_labels.card_id
      and boards.created_by = auth.uid()
    )
  );

create policy "Users can add labels to cards in their boards"
  on public.card_labels for insert
  with check (
    exists (
      select 1 from public.cards
      join public.lists on lists.id = cards.list_id
      join public.boards on boards.id = lists.board_id
      where cards.id = card_labels.card_id
      and boards.created_by = auth.uid()
    )
  );

create policy "Users can remove labels from cards in their boards"
  on public.card_labels for delete
  using (
    exists (
      select 1 from public.cards
      join public.lists on lists.id = cards.list_id
      join public.boards on boards.id = lists.board_id
      where cards.id = card_labels.card_id
      and boards.created_by = auth.uid()
    )
  );
