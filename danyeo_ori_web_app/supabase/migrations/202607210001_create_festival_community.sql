create table public.community_posts (
  id uuid primary key default gen_random_uuid(),
  festival_id uuid not null references public.festivals(id) on delete restrict,
  author_id uuid references auth.users(id) on delete set null,
  author_nickname text not null,
  kind text not null default 'review',
  title text not null,
  content text not null,
  image_path text,
  view_count bigint not null default 0,
  like_count bigint not null default 0,
  comment_count bigint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint community_posts_kind_check check (kind in ('review', 'question', 'game')),
  constraint community_posts_author_nickname_length check (char_length(author_nickname) between 2 and 30),
  constraint community_posts_title_length check (char_length(title) between 2 and 120),
  constraint community_posts_content_length check (char_length(content) between 10 and 5000),
  constraint community_posts_image_path_length check (image_path is null or char_length(image_path) <= 1000),
  constraint community_posts_counts_nonnegative check (view_count >= 0 and like_count >= 0 and comment_count >= 0)
);

create table public.community_likes (
  post_id uuid not null references public.community_posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create table public.community_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.community_posts(id) on delete cascade,
  author_id uuid references auth.users(id) on delete set null,
  author_nickname text not null,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint community_comments_author_nickname_length check (char_length(author_nickname) between 2 and 30),
  constraint community_comments_content_length check (char_length(content) between 1 and 1000)
);

create index community_posts_festival_created_idx
  on public.community_posts (festival_id, created_at desc);
create index community_posts_kind_created_idx
  on public.community_posts (kind, created_at desc);
create index community_comments_post_created_idx
  on public.community_comments (post_id, created_at desc);
create index community_likes_user_created_idx
  on public.community_likes (user_id, created_at desc);

create or replace function private.set_community_author()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid;
  v_nickname text;
begin
  v_user_id := auth.uid();

  if v_user_id is not null then
    select nullif(trim(p.nickname), '')
      into v_nickname
      from public.profiles p
      where p.id = v_user_id and p.status = 'active';

    if v_nickname is null then
      raise exception using errcode = '42501', message = 'Active profile required';
    end if;

    new.author_id := v_user_id;
    new.author_nickname := v_nickname;
  elsif new.author_nickname is null then
    raise exception using errcode = '23502', message = 'Seed author nickname required';
  end if;

  return new;
end;
$$;

revoke all on function private.set_community_author() from public, anon, authenticated;

create trigger community_posts_set_author
before insert on public.community_posts
for each row execute function private.set_community_author();

create trigger community_comments_set_author
before insert on public.community_comments
for each row execute function private.set_community_author();

create trigger community_posts_set_updated_at
before update on public.community_posts
for each row execute function private.set_updated_at();

create trigger community_comments_set_updated_at
before update on public.community_comments
for each row execute function private.set_updated_at();

create or replace function private.sync_community_like_count()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    update public.community_posts
      set like_count = like_count + 1
      where id = new.post_id;
    return new;
  end if;

  update public.community_posts
    set like_count = greatest(like_count - 1, 0)
    where id = old.post_id;
  return old;
end;
$$;

revoke all on function private.sync_community_like_count() from public, anon, authenticated;

create trigger community_likes_sync_count
after insert or delete on public.community_likes
for each row execute function private.sync_community_like_count();

create or replace function private.sync_community_comment_count()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    update public.community_posts
      set comment_count = comment_count + 1
      where id = new.post_id;
    return new;
  end if;

  update public.community_posts
    set comment_count = greatest(comment_count - 1, 0)
    where id = old.post_id;
  return old;
end;
$$;

revoke all on function private.sync_community_comment_count() from public, anon, authenticated;

create trigger community_comments_sync_count
after insert or delete on public.community_comments
for each row execute function private.sync_community_comment_count();

alter table public.community_posts enable row level security;
alter table public.community_likes enable row level security;
alter table public.community_comments enable row level security;

revoke all on public.community_posts, public.community_likes, public.community_comments from anon, authenticated;

grant select on public.community_posts to anon, authenticated;
grant insert (festival_id, kind, title, content, image_path) on public.community_posts to authenticated;
grant update (festival_id, kind, title, content, image_path) on public.community_posts to authenticated;
grant delete on public.community_posts to authenticated;

grant select on public.community_comments to anon, authenticated;
grant insert (post_id, content) on public.community_comments to authenticated;
grant delete on public.community_comments to authenticated;

grant select, insert, delete on public.community_likes to authenticated;

create policy community_posts_public_read
on public.community_posts for select to anon, authenticated
using (
  exists (
    select 1 from public.festivals f
    where f.id = festival_id and f.status = 'published'
  )
  or (select private.is_admin())
);

create policy community_posts_member_insert
on public.community_posts for insert to authenticated
with check (
  (select auth.uid()) = author_id
  and exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.status = 'active'
  )
  and exists (
    select 1 from public.festivals f
    where f.id = festival_id and f.status = 'published'
  )
);

create policy community_posts_owner_update
on public.community_posts for update to authenticated
using ((select auth.uid()) = author_id)
with check (
  (select auth.uid()) = author_id
  and exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.status = 'active'
  )
  and exists (
    select 1 from public.festivals f
    where f.id = festival_id and f.status = 'published'
  )
);

create policy community_posts_owner_delete
on public.community_posts for delete to authenticated
using ((select auth.uid()) = author_id);

create policy community_likes_select_own
on public.community_likes for select to authenticated
using ((select auth.uid()) = user_id);

create policy community_likes_insert_own
on public.community_likes for insert to authenticated
with check (
  (select auth.uid()) = user_id
  and exists (select 1 from public.community_posts p where p.id = post_id)
);

create policy community_likes_delete_own
on public.community_likes for delete to authenticated
using ((select auth.uid()) = user_id);

create policy community_comments_public_read
on public.community_comments for select to anon, authenticated
using (exists (select 1 from public.community_posts p where p.id = post_id));

create policy community_comments_member_insert
on public.community_comments for insert to authenticated
with check (
  (select auth.uid()) = author_id
  and exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.status = 'active'
  )
  and exists (select 1 from public.community_posts p where p.id = post_id)
);

create policy community_comments_owner_delete
on public.community_comments for delete to authenticated
using ((select auth.uid()) = author_id);

create or replace view public.community_festival_categories
with (security_invoker = true, security_barrier = true)
as
select
  id,
  slug,
  name,
  region,
  category,
  image_path,
  status,
  created_at,
  updated_at
from public.festivals;

revoke all on public.community_festival_categories from anon, authenticated;
grant select on public.community_festival_categories to anon, authenticated;

create or replace function public.increment_community_post_view(p_post_id uuid)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_view_count bigint;
begin
  update public.community_posts p
    set view_count = p.view_count + 1
    where p.id = p_post_id
      and exists (
        select 1 from public.festivals f
        where f.id = p.festival_id and f.status = 'published'
      )
    returning p.view_count into v_view_count;

  return v_view_count;
end;
$$;

revoke all on function public.increment_community_post_view(uuid) from public;
grant execute on function public.increment_community_post_view(uuid) to anon, authenticated;

comment on table public.community_posts is '축제에 직접 연결된 커뮤니티 후기·질문·게임 게시글';
comment on view public.community_festival_categories is 'festivals를 단일 원본으로 사용하는 커뮤니티 축제 카테고리';
comment on function public.increment_community_post_view(uuid) is '공개 축제 게시글 조회수를 원자적으로 증가';
