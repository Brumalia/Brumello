-- Checklist items within cards (like Trello checklists)

-- =====================================================
-- CHECKLISTS
-- =====================================================
create table public.checklists (
  id uuid default uuid_generate_v4() primary key,
  card_id uuid references public.cards(id) on delete cascade not null,
  title text not null default 'Checklist',
  position integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.checklists enable row level security;

-- Policies
create policy "Users can view checklists in their boards"
  on public.checklists for select
  using (
    exists (
      select 1 from public.cards
      join public.lists on lists.id = cards.list_id
      join public.boards on boards.id = lists.board_id
      where cards.id = checklists.card_id
      and boards.created_by = auth.uid()
    )
  );

create policy "Users can create checklists in their boards"
  on public.checklists for insert
  with check (
    exists (
      select 1 from public.cards
      join public.lists on lists.id = cards.list_id
      join public.boards on boards.id = lists.board_id
      where cards.id = checklists.card_id
      and boards.created_by = auth.uid()
    )
  );

create policy "Users can update checklists in their boards"
  on public.checklists for update
  using (
    exists (
      select 1 from public.cards
      join public.lists on lists.id = cards.list_id
      join public.boards on boards.id = lists.board_id
      where cards.id = checklists.card_id
      and boards.created_by = auth.uid()
    )
  );

create policy "Users can delete checklists in their boards"
  on public.checklists for delete
  using (
    exists (
      select 1 from public.cards
      join public.lists on lists.id = cards.list_id
      join public.boards on boards.id = lists.board_id
      where cards.id = checklists.card_id
      and boards.created_by = auth.uid()
    )
  );

-- =====================================================
-- CHECKLIST ITEMS
-- =====================================================
create table public.checklist_items (
  id uuid default uuid_generate_v4() primary key,
  checklist_id uuid references public.checklists(id) on delete cascade not null,
  text text not null,
  completed boolean default false,
  position integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.checklist_items enable row level security;

-- Policies
create policy "Users can view checklist items in their boards"
  on public.checklist_items for select
  using (
    exists (
      select 1 from public.checklists
      join public.cards on cards.id = checklists.card_id
      join public.lists on lists.id = cards.list_id
      join public.boards on boards.id = lists.board_id
      where checklists.id = checklist_items.checklist_id
      and boards.created_by = auth.uid()
    )
  );

create policy "Users can create checklist items in their boards"
  on public.checklist_items for insert
  with check (
    exists (
      select 1 from public.checklists
      join public.cards on cards.id = checklists.card_id
      join public.lists on lists.id = cards.list_id
      join public.boards on boards.id = lists.board_id
      where checklists.id = checklist_items.checklist_id
      and boards.created_by = auth.uid()
    )
  );

create policy "Users can update checklist items in their boards"
  on public.checklist_items for update
  using (
    exists (
      select 1 from public.checklists
      join public.cards on cards.id = checklists.card_id
      join public.lists on lists.id = cards.list_id
      join public.boards on boards.id = lists.board_id
      where checklists.id = checklist_items.checklist_id
      and boards.created_by = auth.uid()
    )
  );

create policy "Users can delete checklist items in their boards"
  on public.checklist_items for delete
  using (
    exists (
      select 1 from public.checklists
      join public.cards on cards.id = checklists.card_id
      join public.lists on lists.id = cards.list_id
      join public.boards on boards.id = lists.board_id
      where checklists.id = checklist_items.checklist_id
      and boards.created_by = auth.uid()
    )
  );

-- Indexes
create index checklists_card_id_idx on public.checklists(card_id);
create index checklist_items_checklist_id_idx on public.checklist_items(checklist_id);
