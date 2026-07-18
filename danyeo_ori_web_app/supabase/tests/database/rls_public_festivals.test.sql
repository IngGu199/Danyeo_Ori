create extension if not exists pgtap with schema extensions;

begin;
set local search_path = public, extensions;
select plan(6);

insert into public.festivals (
  id, slug, name, summary, description, start_date, end_date,
  region, venue, category, status, data_status
) values
  (
    '90000000-0000-4000-8000-000000000001', 'rls-test-published',
    'RLS 공개 축제', 'RLS 테스트', 'RLS 공개 조회 테스트',
    current_date, current_date + 1, '테스트', '공개 행사장', '문화', 'published', 'sample'
  ),
  (
    '90000000-0000-4000-8000-000000000002', 'rls-test-draft',
    'RLS 비공개 축제', 'RLS 테스트', 'RLS 비공개 조회 테스트',
    current_date, current_date + 1, '테스트', '비공개 행사장', '문화', 'draft', 'sample'
  );

insert into public.festival_games (
  id, festival_id, code, title, description, game_type, status, starts_at, ends_at
) values
  (
    '91000000-0000-4000-8000-000000000001', '90000000-0000-4000-8000-000000000001',
    'rls-test-active', '공개 게임', '공개 게임 테스트', 'click', 'active', now() - interval '1 hour', now() + interval '1 hour'
  ),
  (
    '91000000-0000-4000-8000-000000000002', '90000000-0000-4000-8000-000000000001',
    'rls-test-inactive', '비활성 게임', '비활성 게임 테스트', 'click', 'inactive', null, null
  ),
  (
    '91000000-0000-4000-8000-000000000003', '90000000-0000-4000-8000-000000000001',
    'rls-test-future', '예약 게임', '기간 밖 게임 테스트', 'click', 'active', now() + interval '1 day', now() + interval '2 days'
  ),
  (
    '91000000-0000-4000-8000-000000000004', '90000000-0000-4000-8000-000000000002',
    'rls-test-draft-parent', '비공개 축제 게임', '상위 축제 상태 테스트', 'click', 'active', null, null
  );

set local role anon;

select is(
  (select count(*) from public.festivals where slug = 'rls-test-published'),
  1::bigint,
  '비회원은 published 축제를 조회할 수 있다'
);
select is(
  (select count(*) from public.festivals where slug = 'rls-test-draft'),
  0::bigint,
  '비회원은 draft 축제를 조회할 수 없다'
);
select is(
  (select count(*) from public.festival_games where code = 'rls-test-active'),
  1::bigint,
  '비회원은 공개 축제의 활성 기간 게임을 조회할 수 있다'
);
select is(
  (select count(*) from public.festival_games where code = 'rls-test-inactive'),
  0::bigint,
  '비회원은 비활성 게임을 조회할 수 없다'
);
select is(
  (select count(*) from public.festival_games where code = 'rls-test-future'),
  0::bigint,
  '비회원은 노출 기간 전 게임을 조회할 수 없다'
);
select is(
  (select count(*) from public.festival_games where code = 'rls-test-draft-parent'),
  0::bigint,
  '비회원은 비공개 축제에 연결된 활성 게임을 조회할 수 없다'
);

select * from finish();
rollback;
