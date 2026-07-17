create extension if not exists pgtap with schema extensions;

begin;
set local search_path = public, extensions;
select plan(5);

select has_function('private', 'run_retention', array['timestamptz'], '파기 함수가 존재한다');
select has_table('private', 'retention_runs', '파기 실행 이력 테이블이 존재한다');
select has_table('retention', 'point_transactions_archive', '분리 보관 원장 테이블이 존재한다');

insert into public.pre_registrations (
  name_ciphertext,
  phone_ciphertext,
  phone_lookup_hash,
  consent_version,
  consented_at,
  created_at,
  expires_at
) values (
  decode('01', 'hex'),
  decode('02', 'hex'),
  repeat('d', 64),
  'launch-retention-test-v1',
  now() - interval '2 years',
  now() - interval '2 years',
  now() - interval '1 year'
);

select lives_ok(
  $$select private.run_retention(now())$$,
  '파기 작업을 반복 실행할 수 있다'
);

select is(
  (select count(*) from public.pre_registrations where phone_lookup_hash = repeat('d', 64)),
  0::bigint,
  '신청일 기준 보존기간이 지난 출시 알림 개인정보를 실제 삭제한다'
);

select * from finish();
rollback;
