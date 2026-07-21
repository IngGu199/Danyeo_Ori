create extension if not exists pgtap with schema extensions;

begin;
set local search_path = public, extensions;
select plan(24);

select has_table('public', 'community_posts', 'community_posts 테이블이 존재한다');
select has_table('public', 'community_likes', 'community_likes 테이블이 존재한다');
select has_table('public', 'community_comments', 'community_comments 테이블이 존재한다');
select has_view('public', 'community_festival_categories', '축제 기반 커뮤니티 카테고리 뷰가 존재한다');
select ok((select relrowsecurity from pg_class where oid = 'public.community_posts'::regclass), 'community_posts RLS가 활성화되어 있다');
select ok((select relrowsecurity from pg_class where oid = 'public.community_likes'::regclass), 'community_likes RLS가 활성화되어 있다');
select ok((select relrowsecurity from pg_class where oid = 'public.community_comments'::regclass), 'community_comments RLS가 활성화되어 있다');

insert into auth.users (
  id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) values
  (
    'e1111111-1111-4111-8111-111111111111',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'community-one@example.test', '', now(),
    '{}'::jsonb, '{"nickname":"후기오리"}'::jsonb, now(), now()
  ),
  (
    'e2222222-2222-4222-8222-222222222222',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'community-two@example.test', '', now(),
    '{}'::jsonb, '{"nickname":"질문오리"}'::jsonb, now(), now()
  );

insert into public.festivals (
  id, slug, name, summary, description, start_date, end_date,
  region, venue, category, status, data_status
) values
  (
    'e3333333-3333-4333-8333-333333333333', 'community-published-festival',
    '커뮤니티 공개 축제', '커뮤니티 연동 테스트', '공개 축제 카테고리 자동 연동 테스트',
    current_date, current_date + 1, '테스트', '공개 행사장', '문화', 'published', 'sample'
  ),
  (
    'e4444444-4444-4444-8444-444444444444', 'community-draft-festival',
    '커뮤니티 비공개 축제', '커뮤니티 연동 테스트', '비공개 축제 노출 차단 테스트',
    current_date, current_date + 1, '테스트', '비공개 행사장', '문화', 'draft', 'sample'
  );

set local role anon;

select is(
  (select count(*) from public.community_festival_categories where slug = 'community-published-festival'),
  1::bigint,
  '어드민이 만든 published 축제는 커뮤니티 카테고리에 즉시 나타난다'
);
select is(
  (select count(*) from public.community_festival_categories where slug = 'community-draft-festival'),
  0::bigint,
  '비회원 커뮤니티에는 draft 축제 카테고리가 노출되지 않는다'
);

reset role;
select set_config(
  'request.jwt.claims',
  '{"sub":"e1111111-1111-4111-8111-111111111111","role":"authenticated"}',
  true
);
set local role authenticated;

select lives_ok(
  $$insert into public.community_posts (festival_id, kind, title, content)
    values (
      'e3333333-3333-4333-8333-333333333333',
      'review', '공개 축제 후기', '공개 축제에 연결된 충분히 긴 후기 내용입니다.'
    )$$,
  '회원은 published 축제에 연결된 게시글을 작성할 수 있다'
);

select is(
  (select author_nickname from public.community_posts where title = '공개 축제 후기'),
  '후기오리',
  '게시글 작성자 닉네임은 로그인 프로필에서 서버가 기록한다'
);

select throws_ok(
  $$insert into public.community_posts (festival_id, kind, title, content)
    values (
      'e4444444-4444-4444-8444-444444444444',
      'review', '비공개 축제 후기', '비공개 축제에는 작성할 수 없는 후기 내용입니다.'
    )$$,
  '42501',
  'new row violates row-level security policy for table "community_posts"',
  '회원도 draft 축제에는 게시글을 작성할 수 없다'
);

select lives_ok(
  $$insert into public.community_likes (post_id, user_id)
    values (
      (select id from public.community_posts where title = '공개 축제 후기'),
      'e1111111-1111-4111-8111-111111111111'
    )$$,
  '회원은 자신의 좋아요를 추가할 수 있다'
);

select is(
  (select like_count from public.community_posts where title = '공개 축제 후기'),
  1::bigint,
  '좋아요 추가 시 게시글 집계가 증가한다'
);

select lives_ok(
  $$insert into public.community_comments (post_id, content)
    values (
      (select id from public.community_posts where title = '공개 축제 후기'),
      '축제와 후기가 바로 연결되어 좋아요.'
    )$$,
  '회원은 공개 게시글에 댓글을 작성할 수 있다'
);

select is(
  (select comment_count from public.community_posts where title = '공개 축제 후기'),
  1::bigint,
  '댓글 추가 시 게시글 집계가 증가한다'
);

reset role;
select set_config(
  'request.jwt.claims',
  '{"sub":"e2222222-2222-4222-8222-222222222222","role":"authenticated"}',
  true
);
set local role authenticated;

update public.community_posts
  set title = '다른 사용자가 바꾼 제목'
  where title = '공개 축제 후기';

select is(
  (select title from public.community_posts where title = '공개 축제 후기'),
  '공개 축제 후기',
  '다른 회원은 게시글을 수정할 수 없다'
);

select is(
  (select count(*) from public.community_likes where post_id = (select id from public.community_posts where title = '공개 축제 후기')),
  0::bigint,
  '회원은 다른 사용자의 좋아요 행을 조회할 수 없다'
);

reset role;

select is(
  (select confdeltype::text from pg_constraint where conname = 'community_posts_festival_id_fkey'),
  'r',
  '리뷰가 있는 축제는 삭제 대신 보존·상태 전환하도록 FK가 보호한다'
);

select is(
  (select count(*) from public.community_posts where festival_id = 'e3333333-3333-4333-8333-333333333333'),
  1::bigint,
  '게시글은 축제 UUID에 직접 연결된다'
);

select is(
  (select count(*) from public.community_comments where post_id = (select id from public.community_posts where title = '공개 축제 후기')),
  1::bigint,
  '댓글은 게시글 삭제 시 함께 정리되는 관계로 연결된다'
);

select is(
  (select count(*) from public.community_likes where post_id = (select id from public.community_posts where title = '공개 축제 후기')),
  1::bigint,
  '좋아요는 게시글에 직접 연결되어 저장된다'
);

set local role anon;
select is(
  (select count(*) from public.community_posts where title = '공개 축제 후기'),
  1::bigint,
  '비회원도 공개 축제에 연결된 커뮤니티 글을 읽을 수 있다'
);
select is(
  public.increment_community_post_view((select id from public.community_posts where title = '공개 축제 후기')),
  1::bigint,
  '비회원 조회도 공개 게시글 조회수를 원자적으로 증가시킨다'
);
reset role;

select * from finish();
rollback;
