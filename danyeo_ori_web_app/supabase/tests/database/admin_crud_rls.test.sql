create extension if not exists pgtap with schema extensions;

begin;
set local search_path = public, extensions;
select plan(8);

insert into auth.users (
  id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) values
  (
    'f1111111-1111-4111-8111-111111111111',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'admin-rls@example.test', '', now(),
    '{}'::jsonb, '{}'::jsonb, now(), now()
  ),
  (
    'f2222222-2222-4222-8222-222222222222',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'member-rls@example.test', '', now(),
    '{}'::jsonb, '{}'::jsonb, now(), now()
  );

insert into private.admin_users (user_id, role, granted_by, granted_reason)
values (
  'f1111111-1111-4111-8111-111111111111',
  'operator',
  'f1111111-1111-4111-8111-111111111111',
  'pgTAP 관리자 CRUD RLS 검증'
);

select set_config(
  'request.jwt.claims',
  '{"sub":"f1111111-1111-4111-8111-111111111111","role":"authenticated"}',
  true
);
set local role authenticated;

select is(
  (select is_admin from public.current_admin_access),
  true,
  '활성 관리자는 접근 확인 뷰에서 관리자 여부를 확인한다'
);

select lives_ok(
  $$insert into public.festivals (
    id, slug, name, summary, description, start_date, end_date,
    region, venue, category, status, data_status
  ) values (
    'f3333333-3333-4333-8333-333333333333',
    'admin-rls-festival', 'RLS 관리자 축제', '관리자 생성 테스트',
    'pgTAP 트랜잭션에서만 사용하는 데이터', '2026-09-01', '2026-09-03',
    '테스트', '테스트 장소', '테스트', 'draft', 'sample'
  )$$,
  '활성 관리자는 축제를 추가할 수 있다'
);

select lives_ok(
  $$insert into public.festival_games (
    id, festival_id, code, title, description, game_type
  ) values (
    'f4444444-4444-4444-8444-444444444444',
    'f3333333-3333-4333-8333-333333333333',
    'admin-rls-game', 'RLS 관리자 게임', '관리자 생성 테스트', 'click'
  )$$,
  '활성 관리자는 미니게임을 추가할 수 있다'
);

select lives_ok(
  $$update public.festival_games
    set description = '수정된 관리자 설명'
    where id = 'f4444444-4444-4444-8444-444444444444'$$,
  '활성 관리자는 미니게임 설명을 수정할 수 있다'
);

select lives_ok(
  $$delete from public.festivals
    where id = 'f3333333-3333-4333-8333-333333333333'$$,
  '활성 operator 관리자는 축제를 삭제할 수 있다'
);

select is(
  (select count(*) from public.festival_games where id = 'f4444444-4444-4444-8444-444444444444'),
  0::bigint,
  '관리자 축제 삭제는 연결된 미니게임을 함께 삭제한다'
);

reset role;
select set_config(
  'request.jwt.claims',
  '{"sub":"f2222222-2222-4222-8222-222222222222","role":"authenticated"}',
  true
);
set local role authenticated;

select is(
  (select count(*) from public.current_admin_access),
  0::bigint,
  '일반 회원에게 관리자 접근 확인 행을 노출하지 않는다'
);

select throws_ok(
  $$insert into public.festivals (
    slug, name, summary, description, start_date, end_date,
    region, venue, category, status, data_status
  ) values (
    'member-denied-festival', '차단 테스트', '차단 테스트', '차단 테스트',
    '2026-09-01', '2026-09-03', '테스트', '테스트', '테스트', 'draft', 'sample'
  )$$,
  '42501',
  'new row violates row-level security policy for table "festivals"',
  '일반 회원의 축제 추가를 RLS가 차단한다'
);

select * from finish();
rollback;
