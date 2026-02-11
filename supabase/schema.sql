-- Brumello Database Schema
-- Created: 2026-02-11

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =====================================================
-- BOARDS
-- =====================================================
create table public.boards (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  background_color text default '#0079bf',
  created_by uuid references auth.users(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.boards enable row level security;

-- Policies: Users can see boards they created or are members of
create policy "Users can view their own boards"
  on public.boards for select
  using (auth.uid() = created_by);

create policy "Users can create boards"
  on public.boards for insert
  with check (auth.uid() = created_by);

create policy "Users can update their own boards"
  on public.boards for update
  using (auth.uid() = created_by);

create policy "Users can delete their own boards"
  on public.boards for delete
  using (auth.uid() = created_by);

-- =====================================================
-- BOARD MEMBERS
-- =====================================================
create table public.board_members (
  id uuid default uuid_generate_v4() primary key,
  board_id uuid references public.boards(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  role text default 'member' check (role in ('owner', 'admin', 'member')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(board_id, user_id)
);

-- Enable RLS
alter table public.board_members enable row level security;

-- Policies
create policy "Users can view board members of their boards"
  on public.board_members for select
  using (
    exists (
      select 1 from public.boards
      where boards.id = board_members.board_id
      and boards.created_by = auth.uid()
    )
  );

-- =====================================================
-- LISTS
-- =====================================================
create table public.lists (
  id uuid default uuid_generate_v4() primary key,
  board_id uuid references public.boards(id) on delete cascade not null,
  title text not null,
  position integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.lists enable row level security;

-- Policies: Users can see lists in boards they have access to
create policy "Users can view lists in their boards"
  on public.lists for select
  using (
    exists (
      select 1 from public.boards
      where boards.id = lists.board_id
      and boards.created_by = auth.uid()
    )
  );

create policy "Users can create lists in their boards"
  on public.lists for insert
  with check (
    exists (
      select 1 from public.boards
      where boards.id = lists.board_id
      and boards.created_by = auth.uid()
    )
  );

create policy "Users can update lists in their boards"
  on public.lists for update
  using (
    exists (
      select 1 from public.boards
      where boards.id = lists.board_id
      and boards.created_by = auth.uid()
    )
  );

create policy "Users can delete lists in their boards"
  on public.lists for delete
  using (
    exists (
      select 1 from public.boards
      where boards.id = lists.board_id
      and boards.created_by = auth.uid()
    )
  );

-- =====================================================
-- CARDS
-- =====================================================
create table public.cards (
  id uuid default uuid_generate_v4() primary key,
  list_id uuid references public.lists(id) on delete cascade not null,
  title text not null,
  description text,
  position integer not null default 0,
  due_date timestamp with time zone,
  completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.cards enable row level security;

-- Policies: Users can see cards in their boards
create policy "Users can view cards in their boards"
  on public.cards for select
  using (
    exists (
      select 1 from public.lists
      join public.boards on boards.id = lists.board_id
      where lists.id = cards.list_id
      and boards.created_by = auth.uid()
    )
  );

create policy "Users can create cards in their boards"
  on public.cards for insert
  with check (
    exists (
      select 1 from public.lists
      join public.boards on boards.id = lists.board_id
      where lists.id = cards.list_id
      and boards.created_by = auth.uid()
    )
  );

create policy "Users can update cards in their boards"
  on public.cards for update
  using (
    exists (
      select 1 from public.lists
      join public.boards on boards.id = lists.board_id
      where lists.id = cards.list_id
      and boards.created_by = auth.uid()
    )
  );

create policy "Users can delete cards in their boards"
  on public.cards for delete
  using (
    exists (
      select 1 from public.lists
      join public.boards on boards.id = lists.board_id
      where lists.id = cards.list_id
      and boards.created_by = auth.uid()
    )
  );

-- =====================================================
-- LABELS
-- =====================================================
create table public.labels (
  id uuid default uuid_generate_v4() primary key,
  board_id uuid references public.boards(id) on delete cascade not null,
  name text not null,
  color text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.labels enable row level security;

-- Policies
create policy "Users can view labels in their boards"
  on public.labels for select
  using (
    exists (
      select 1 from public.boards
      where boards.id = labels.board_id
      and boards.created_by = auth.uid()
    )
  );

-- =====================================================
-- CARD LABELS (Many-to-Many)
-- =====================================================
create table public.card_labels (
  card_id uuid references public.cards(id) on delete cascade not null,
  label_id uuid references public.labels(id) on delete cascade not null,
  primary key (card_id, label_id)
);

-- Enable RLS
alter table public.card_labels enable row level security;

-- =====================================================
-- COMMENTS
-- =====================================================
create table public.comments (
  id uuid default uuid_generate_v4() primary key,
  card_id uuid references public.cards(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.comments enable row level security;

-- Policies
create policy "Users can view comments in their boards"
  on public.comments for select
  using (
    exists (
      select 1 from public.cards
      join public.lists on lists.id = cards.list_id
      join public.boards on boards.id = lists.board_id
      where cards.id = comments.card_id
      and boards.created_by = auth.uid()
    )
  );

create policy "Users can create comments in their boards"
  on public.comments for insert
  with check (
    exists (
      select 1 from public.cards
      join public.lists on lists.id = cards.list_id
      join public.boards on boards.id = lists.board_id
      where cards.id = comments.card_id
      and boards.created_by = auth.uid()
    )
    and auth.uid() = user_id
  );

-- =====================================================
-- INDEXES for Performance
-- =====================================================
create index boards_created_by_idx on public.boards(created_by);
create index lists_board_id_idx on public.lists(board_id);
create index cards_list_id_idx on public.cards(list_id);
create index comments_card_id_idx on public.comments(card_id);
create index board_members_board_id_idx on public.board_members(board_id);
create index board_members_user_id_idx on public.board_members(user_id);

-- =====================================================
-- FUNCTIONS for Updated At
-- =====================================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply updated_at triggers
create trigger handle_boards_updated_at
  before update on public.boards
  for each row execute procedure public.handle_updated_at();

create trigger handle_lists_updated_at
  before update on public.lists
  for each row execute procedure public.handle_updated_at();

create trigger handle_cards_updated_at
  before update on public.cards
  for each row execute procedure public.handle_updated_at();

create trigger handle_comments_updated_at
  before update on public.comments
  for each row execute procedure public.handle_updated_at();
