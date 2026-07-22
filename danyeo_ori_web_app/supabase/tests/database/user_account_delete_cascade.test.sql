create extension if not exists pgtap with schema extensions;

begin;
set local search_path = public, extensions;
select plan(13);

select is(
  (select confdeltype::text from pg_constraint where conrelid = 'public.point_wallets'::regclass and conname = 'point_wallets_user_id_fkey'),
  'c',
  '계정 삭제 시 포인트 지갑을 cascade 삭제한다'
);
select is(
  (select confdeltype::text from pg_constraint where conrelid = 'public.point_transactions'::regclass and conname = 'point_transactions_user_id_fkey'),
  'c',
  '포인트 지갑 삭제 시 온라인 포인트 원장을 cascade 삭제한다'
);
select is(
  (select confdeltype::text from pg_constraint where conrelid = 'public.rewards'::regclass and conname = 'rewards_user_id_fkey'),
  'c',
  '계정 삭제 시 보상 데이터를 cascade 삭제한다'
);
select is(
  (select confdeltype::text from pg_constraint where conrelid = 'private.admin_users'::regclass and conname = 'admin_users_user_id_fkey'),
  'c',
  '계정 삭제 시 해당 관리자 권한을 cascade 삭제한다'
);
select is(
  (select confdeltype::text from pg_constraint where conrelid = 'private.admin_users'::regclass and conname = 'admin_users_granted_by_fkey'),
  'n',
  '권한 부여자 계정 삭제 시 운영 기록의 참조만 null 처리한다'
);
select is(
  (select confdeltype::text from pg_constraint where conrelid = 'private.admin_users'::regclass and conname = 'admin_users_revoked_by_fkey'),
  'n',
  '권한 해제자 계정 삭제 시 운영 기록의 참조만 null 처리한다'
);

insert into auth.users (
  id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) values
  (
    '71111111-1111-4111-8111-111111111111',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'delete-target@example.test', '', now(),
    '{}'::jsonb, '{"nickname":"삭제대상"}'::jsonb, now(), now()
  ),
  (
    '72222222-2222-4222-8222-222222222222',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'delete-grantee@example.test', '', now(),
    '{}'::jsonb, '{"nickname":"권한대상"}'::jsonb, now(), now()
  ),
  (
    '73333333-3333-4333-8333-333333333333',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'delete-revoked@example.test', '', now(),
    '{}'::jsonb, '{"nickname":"해제대상"}'::jsonb, now(), now()
  );

insert into public.festivals (
  id, slug, name, summary, description, start_date, end_date,
  region, venue, category, status, data_status
) values (
  '74444444-4444-4444-8444-444444444444', 'user-delete-cascade-test',
  '계정 삭제 테스트 축제', '계정 삭제 FK 테스트', '테스트 종료 시 롤백되는 축제',
  current_date, current_date + 1, '테스트', '테스트 장소', '문화', 'published', 'sample'
);

insert into public.festival_games (
  id, festival_id, code, title, description, game_type, status
) values (
  '75555555-5555-4555-8555-555555555555',
  '74444444-4444-4444-8444-444444444444',
  'user-delete-cascade-game', '계정 삭제 테스트 게임', '사용자 게임 기록 cascade 테스트', 'click', 'active'
);

insert into public.game_attempts (
  id, user_id, game_id, idempotency_key, expires_at
) values (
  '76666666-6666-4666-8666-666666666666',
  '71111111-1111-4111-8111-111111111111',
  '75555555-5555-4555-8555-555555555555',
  '77777777-7777-4777-8777-777777777777', now() + interval '1 year'
);

insert into public.rewards (
  id, user_id, game_attempt_id, idempotency_key, reward_type,
  point_amount, expires_at
) values (
  '78888888-8888-4888-8888-888888888888',
  '71111111-1111-4111-8111-111111111111',
  '76666666-6666-4666-8666-666666666666',
  '79999999-9999-4999-8999-999999999999', 'points', 100, now() + interval '1 year'
);

insert into public.point_transactions (
  id, user_id, transaction_type, amount, balance_after,
  game_attempt_id, reward_id, source_event_ref, idempotency_key, reason_code
) values (
  '7aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  '71111111-1111-4111-8111-111111111111',
  'earn', 100, 100,
  '76666666-6666-4666-8666-666666666666',
  '78888888-8888-4888-8888-888888888888',
  'user-delete-cascade-test',
  '7bbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
  'test_reward'
);

insert into public.community_posts (
  id, festival_id, author_id, author_nickname, kind, title, content
) values (
  '7ccccccc-cccc-4ccc-8ccc-cccccccccccc',
  '74444444-4444-4444-8444-444444444444',
  '71111111-1111-4111-8111-111111111111',
  '삭제대상', 'review', '계정 삭제 보존 게시글', '계정 삭제 후 작성자 참조만 익명화되는 테스트 게시글입니다.'
);

insert into public.community_comments (
  id, post_id, author_id, author_nickname, content
) values (
  '7ddddddd-dddd-4ddd-8ddd-dddddddddddd',
  '7ccccccc-cccc-4ccc-8ccc-cccccccccccc',
  '71111111-1111-4111-8111-111111111111',
  '삭제대상', '계정 삭제 후 작성자 참조만 익명화되는 댓글입니다.'
);

insert into public.community_likes (post_id, user_id)
values (
  '7ccccccc-cccc-4ccc-8ccc-cccccccccccc',
  '71111111-1111-4111-8111-111111111111'
);

insert into private.admin_users (
  user_id, role, is_active, granted_by, granted_reason,
  revoked_by, revoked_reason, revoked_at, expires_at
) values
  (
    '71111111-1111-4111-8111-111111111111', 'operator', true,
    '71111111-1111-4111-8111-111111111111', '계정 삭제 대상',
    null, null, null, null
  ),
  (
    '72222222-2222-4222-8222-222222222222', 'operator', true,
    '71111111-1111-4111-8111-111111111111', '부여자 익명화 테스트',
    null, null, null, null
  ),
  (
    '73333333-3333-4333-8333-333333333333', 'operator', false,
    '72222222-2222-4222-8222-222222222222', '해제자 익명화 테스트',
    '71111111-1111-4111-8111-111111111111', '테스트 해제', now(), now() + interval '3 years'
  );

select lives_ok(
  $$delete from auth.users where id = '71111111-1111-4111-8111-111111111111'$$,
  '참조 데이터가 있는 Auth 계정을 직접 삭제할 수 있다'
);

select ok(
  not exists (select 1 from auth.users where id = '71111111-1111-4111-8111-111111111111')
  and not exists (select 1 from public.profiles where id = '71111111-1111-4111-8111-111111111111')
  and not exists (select 1 from public.point_wallets where user_id = '71111111-1111-4111-8111-111111111111')
  and not exists (select 1 from public.point_transactions where user_id = '71111111-1111-4111-8111-111111111111')
  and not exists (select 1 from public.rewards where user_id = '71111111-1111-4111-8111-111111111111')
  and not exists (select 1 from public.game_attempts where user_id = '71111111-1111-4111-8111-111111111111')
  and not exists (select 1 from public.community_likes where user_id = '71111111-1111-4111-8111-111111111111')
  and not exists (select 1 from private.admin_users where user_id = '71111111-1111-4111-8111-111111111111'),
  '계정과 사용자 소유 데이터를 모두 삭제한다'
);

select ok(
  exists (
    select 1
    from retention.point_transactions_archive
    where id = '7aaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
      and subject_ref <> '71111111-1111-4111-8111-111111111111'
  ),
  '계정 직접 삭제 전 포인트 원장을 비식별 참조로 분리 보관한다'
);

select ok(
  exists (
    select 1 from public.community_posts
    where id = '7ccccccc-cccc-4ccc-8ccc-cccccccccccc' and author_id is null
  ),
  '게시글은 유지하고 삭제된 작성자 참조를 익명화한다'
);
select ok(
  exists (
    select 1 from public.community_comments
    where id = '7ddddddd-dddd-4ddd-8ddd-dddddddddddd' and author_id is null
  ),
  '댓글은 유지하고 삭제된 작성자 참조를 익명화한다'
);
select ok(
  exists (
    select 1 from private.admin_users
    where user_id = '72222222-2222-4222-8222-222222222222' and granted_by is null
  ),
  '다른 관리자 권한 기록은 유지하고 삭제된 부여자 참조를 익명화한다'
);
select ok(
  exists (
    select 1 from private.admin_users
    where user_id = '73333333-3333-4333-8333-333333333333' and revoked_by is null
  ),
  '해제된 관리자 기록은 유지하고 삭제된 해제자 참조를 익명화한다'
);

select * from finish();
rollback;
