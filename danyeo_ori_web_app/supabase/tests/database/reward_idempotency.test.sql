create extension if not exists pgtap with schema extensions;

begin;
set local search_path = public, extensions;
select plan(5);

select has_table('public', 'point_wallets', '포인트 지갑 테이블이 존재한다');
select has_table('public', 'point_transactions', '포인트 원장 테이블이 존재한다');
select has_table('public', 'rewards', '혜택 테이블이 존재한다');
select ok(
  exists (
    select 1 from pg_indexes
    where schemaname = 'public'
      and tablename = 'point_transactions'
      and indexdef ilike '%idempotency_key%unique%'
  ) or exists (
    select 1 from pg_constraint
    where conrelid = 'public.point_transactions'::regclass
      and contype = 'u'
      and pg_get_constraintdef(oid) ilike '%idempotency_key%'
  ),
  '원장 idempotency_key가 고유하다'
);
select ok(
  not has_table_privilege('authenticated', 'public.point_wallets', 'UPDATE')
  and not has_table_privilege('authenticated', 'public.point_transactions', 'INSERT'),
  '클라이언트는 지갑과 원장을 수정할 수 없다'
);

select * from finish();
rollback;
