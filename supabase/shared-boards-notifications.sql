-- Shared Boards & Notifications Migration
-- Created: 2026-02-14

-- =====================================================
-- FIX BOARD MEMBERS RLS (members can access boards)
-- =====================================================

-- Drop existing restrictive policies and replace with member-aware ones
drop policy if exists "Users can view their own boards" on public.boards;
drop policy if exists "Users can create boards" on public.boards;
drop policy if exists "Users can update their own boards" on public.boards;
drop policy if exists "Users can delete their own boards" on public.boards;

-- View: boards the user has access to (created or member)
create or replace view public.user_boards as
select b.* from public.boards b
left join public.board_members bm on bm.board_id = b.id
where b.created_by = auth.uid() 
   or bm.user_id = auth.uid();

-- Policy: Users can view boards they created or are members of
create policy "Users can view their boards"
  on public.boards for select
  using (
    exists (
      select 1 from public.board_members
      where board_members.board_id = boards.id
      and board_members.user_id = auth.uid()
    )
    or boards.created_by = auth.uid()
  );

create policy "Users can create boards"
  on public.boards for insert
  with check (auth.uid() = created_by);

create policy "Users can update their boards"
  on public.boards for update
  using (
    exists (
      select 1 from public.board_members
      where board_members.board_id = boards.id
      and board_members.user_id = auth.uid()
      and board_members.role in ('owner', 'admin')
    )
    or boards.created_by = auth.uid()
  );

create policy "Users can delete their boards"
  on public.boards for delete
  using (boards.created_by = auth.uid());

-- =====================================================
-- BOARD MEMBERS POLICIES (Allow members to view)
-- =====================================================

drop policy if exists "Users can view board members of their boards" on public.board_members;

create policy "Users can view board members"
  on public.board_members for select
  using (
    exists (
      select 1 from public.boards
      where boards.id = board_members.board_id
      and (
        boards.created_by = auth.uid()
        or exists (
          select 1 from public.board_members bm2
          where bm2.board_id = boards.id
          and bm2.user_id = auth.uid()
        )
      )
    )
  );

create policy "Users can add board members"
  on public.board_members for insert
  with check (
    exists (
      select 1 from public.boards
      where boards.id = board_members.board_id
      and (
        boards.created_by = auth.uid()
        or exists (
          select 1 from public.board_members bm2
          where bm2.board_id = boards.id
          and bm2.user_id = auth.uid()
          and bm2.role in ('owner', 'admin')
        )
      )
    )
  );

create policy "Users can manage board members"
  on public.board_members for update
  using (
    exists (
      select 1 from public.boards
      where boards.id = board_members.board_id
      and (
        boards.created_by = auth.uid()
        or exists (
          select 1 from public.board_members bm2
          where bm2.board_id = boards.id
          and bm2.user_id = auth.uid()
          and bm2.role in ('owner', 'admin')
        )
      )
    )
  );

create policy "Users can remove board members"
  on public.board_members for delete
  using (
    exists (
      select 1 from public.boards
      where boards.id = board_members.board_id
      and (
        boards.created_by = auth.uid()
        or exists (
          select 1 from public.board_members bm2
          where bm2.board_id = boards.id
          and bm2.user_id = auth.uid()
          and bm2.role in ('owner', 'admin')
        )
      )
    )
  );

-- =====================================================
-- LISTS - Update to use user_boards view
-- =====================================================

drop policy if exists "Users can view lists in their boards" on public.lists;
drop policy if exists "Users can create lists in their boards" on public.lists;
drop policy if exists "Users can update lists in their boards" on public.lists;
drop policy if exists "Users can delete lists in their boards" on public.lists;

create policy "Users can view lists in their boards"
  on public.lists for select
  using (
    exists (
      select 1 from public.boards
      where boards.id = lists.board_id
      and (
        boards.created_by = auth.uid()
        or exists (
          select 1 from public.board_members
          where board_members.board_id = boards.id
          and board_members.user_id = auth.uid()
        )
      )
    )
  );

create policy "Users can create lists in their boards"
  on public.lists for insert
  with check (
    exists (
      select 1 from public.boards
      where boards.id = lists.board_id
      and (
        boards.created_by = auth.uid()
        or exists (
          select 1 from public.board_members
          where board_members.board_id = boards.id
          and board_members.user_id = auth.uid()
        )
      )
    )
  );

create policy "Users can update lists in their boards"
  on public.lists for update
  using (
    exists (
      select 1 from public.boards
      where boards.id = lists.board_id
      and (
        boards.created_by = auth.uid()
        or exists (
          select 1 from public.board_members
          where board_members.board_id = boards.id
          and board_members.user_id = auth.uid()
        )
      )
    )
  );

create policy "Users can delete lists in their boards"
  on public.lists for delete
  using (
    exists (
      select 1 from public.boards
      where boards.id = lists.board_id
      and (
        boards.created_by = auth.uid()
        or exists (
          select 1 from public.board_members
          where board_members.board_id = boards.id
          and board_members.user_id = auth.uid()
        )
      )
    )
  );

-- =====================================================
-- CARDS - Update to use user_boards view
-- =====================================================

drop policy if exists "Users can view cards in their boards" on public.cards;
drop policy if exists "Users can create cards in their boards" on public.cards;
drop policy if exists "Users can update cards in their boards" on public.cards;
drop policy if exists "Users can delete cards in their boards" on public.cards;

create policy "Users can view cards in their boards"
  on public.cards for select
  using (
    exists (
      select 1 from public.lists
      join public.boards on boards.id = lists.board_id
      where lists.id = cards.list_id
      and (
        boards.created_by = auth.uid()
        or exists (
          select 1 from public.board_members
          where board_members.board_id = boards.id
          and board_members.user_id = auth.uid()
        )
      )
    )
  );

create policy "Users can create cards in their boards"
  on public.cards for insert
  with check (
    exists (
      select 1 from public.lists
      join public.boards on boards.id = lists.board_id
      where lists.id = cards.list_id
      and (
        boards.created_by = auth.uid()
        or exists (
          select 1 from public.board_members
          where board_members.board_id = boards.id
          and board_members.user_id = auth.uid()
        )
      )
    )
  );

create policy "Users can update cards in their boards"
  on public.cards for update
  using (
    exists (
      select 1 from public.lists
      join public.boards on boards.id = lists.board_id
      where lists.id = cards.list_id
      and (
        boards.created_by = auth.uid()
        or exists (
          select 1 from public.board_members
          where board_members.board_id = boards.id
          and board_members.user_id = auth.uid()
        )
      )
    )
  );

create policy "Users can delete cards in their boards"
  on public.cards for delete
  using (
    exists (
      select 1 from public.lists
      join public.boards on boards.id = lists.board_id
      where lists.id = cards.list_id
      and (
        boards.created_by = auth.uid()
        or exists (
          select 1 from public.board_members
          where board_members.board_id = boards.id
          and board_members.user_id = auth.uid()
        )
      )
    )
  );

-- =====================================================
-- LABELS - Update to use user_boards view
-- =====================================================

drop policy if exists "Users can view labels in their boards" on public.labels;

create policy "Users can view labels in their boards"
  on public.labels for select
  using (
    exists (
      select 1 from public.boards
      where boards.id = labels.board_id
      and (
        boards.created_by = auth.uid()
        or exists (
          select 1 from public.board_members
          where board_members.board_id = boards.id
          and board_members.user_id = auth.uid()
        )
      )
    )
  );

-- =====================================================
-- COMMENTS - Update to use user_boards view
-- =====================================================

drop policy if exists "Users can view comments in their boards" on public.comments;
drop policy if exists "Users can create comments in their boards" on public.comments;

create policy "Users can view comments in their boards"
  on public.comments for select
  using (
    exists (
      select 1 from public.cards
      join public.lists on lists.id = cards.list_id
      join public.boards on boards.id = lists.board_id
      where cards.id = comments.card_id
      and (
        boards.created_by = auth.uid()
        or exists (
          select 1 from public.board_members
          where board_members.board_id = boards.id
          and board_members.user_id = auth.uid()
        )
      )
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
      and (
        boards.created_by = auth.uid()
        or exists (
          select 1 from public.board_members
          where board_members.board_id = boards.id
          and board_members.user_id = auth.uid()
        )
      )
    )
    and auth.uid() = user_id
  );

-- =====================================================
-- NOTIFICATIONS TABLE
-- =====================================================

create table public.notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  type text not null check (type in ('mention', 'card_assigned', 'board_invite', 'card_due')),
  title text not null,
  message text,
  link text,
  read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.notifications enable row level security;

-- Policies
create policy "Users can view their own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "Users can create notifications for users"
  on public.notifications for insert
  with check (auth.uid() = user_id or auth.uid() in (
    select created_by from public.boards
    where id in (
      select board_id from public.board_members where user_id = notifications.user_id
    )
  ));

create policy "Users can update their own notifications"
  on public.notifications for update
  using (auth.uid() = user_id);

create policy "Users can delete their own notifications"
  on public.notifications for delete
  using (auth.uid() = user_id);

-- Index
create index notifications_user_id_idx on public.notifications(user_id);
create index notifications_read_idx on public.notifications(user_id, read);

-- =====================================================
-- NOTIFICATION TRIGGER FUNCTION
-- =====================================================

create or replace function public.create_mention_notification()
returns trigger as $$
declare
  mentioned_user uuid;
  card_title text;
  board_id uuid;
begin
  -- Only trigger on insert
  if TG_OP = 'INSERT' then
    -- Extract @mentions from new comment
    for mentioned_user in
      select distinct substring_matches.value::uuid
      from (
        select (regexp_matches(new.content, '@([a-f0-9-]{36})', 'g'))[1] as value
      ) as substring_matches
      where substring_matches.value is not null
    loop
      -- Skip if mentioning self
      if mentioned_user = new.user_id then
        continue;
      end if;
      
      -- Get card info
      select c.title, l.board_id into card_title, board_id
      from public.cards c
      join public.lists l on l.id = c.list_id
      where c.id = new.card_id;
      
      -- Create notification
      insert into public.notifications (user_id, type, title, message, link)
      values (
        mentioned_user,
        'mention',
        'You were mentioned',
        format('%s mentioned you in card "%s"', 
          (select email from auth.users where id = new.user_id),
          card_title
        ),
        format('/boards/%s?card=%s', board_id, new.card_id)
      );
    end loop;
    
    return new;
  end if;
  
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger
create trigger handle_comment_mention
  after insert on public.comments
  for each row
  execute procedure public.create_mention_notification();

-- =====================================================
-- GET BOARD MEMBERS FUNCTION
-- =====================================================

create or replace function public.get_board_members(p_board_id uuid)
returns table (
  id uuid,
  user_id uuid,
  email text,
  role text,
  created_at timestamptz
) as $$
begin
  return query
  select 
    bm.id,
    bm.user_id,
    u.email,
    bm.role,
    bm.created_at
  from public.board_members bm
  join auth.users u on u.id = bm.user_id
  where bm.board_id = p_board_id
  order by bm.created_at;
end;
$$ language plpgsql security definer;

-- =====================================================
-- SEARCH USERS FUNCTION (for inviting)
-- =====================================================

create or replace function public.search_users(p_query text)
returns table (
  id uuid,
  email text
) as $$
begin
  return query
  select u.id, u.email
  from auth.users u
  where u.email ilike '%' || p_query || '%'
  limit 10;
end;
$$ language plpgsql security definer;
