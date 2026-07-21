drop policy community_posts_public_read on public.community_posts;

create policy community_posts_public_read
on public.community_posts for select to anon, authenticated
using (
  exists (
    select 1 from public.festivals f
    where f.id = festival_id and f.status = 'published'
  )
);

create policy community_posts_admin_read
on public.community_posts for select to authenticated
using ((select private.is_admin()));

comment on policy community_posts_public_read on public.community_posts is '비회원도 공개 축제의 게시글만 조회';
comment on policy community_posts_admin_read on public.community_posts is '관리자는 상태 변경된 축제의 게시글도 운영 목적으로 조회';
