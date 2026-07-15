create extension if not exists pgtap with schema extensions;

begin;
set local search_path = public, extensions;
select plan(4);

select has_function('private', 'run_retention', array['timestamptz'], '파기 함수가 존재한다');
select has_table('private', 'retention_runs', '파기 실행 이력 테이블이 존재한다');
select has_table('retention', 'point_transactions_archive', '분리 보관 원장 테이블이 존재한다');
select lives_ok(
  $$select private.run_retention(now())$$,
  '파기 작업을 반복 실행할 수 있다'
);

select * from finish();
rollback;
