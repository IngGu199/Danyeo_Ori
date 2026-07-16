create extension if not exists pgtap with schema extensions;
begin;
select plan(3);

select has_function(
  'public',
  'get_pre_registration_count',
  array['uuid'],
  '사전예약 인원 집계 함수가 존재한다'
);

select ok(
  has_function_privilege('anon', 'public.get_pre_registration_count(uuid)', 'execute'),
  '비회원은 개인정보 없이 예약 인원 집계만 조회할 수 있다'
);

insert into public.pre_registrations (
  festival_id,
  name_ciphertext,
  phone_ciphertext,
  phone_lookup_hash,
  consent_version,
  consented_at,
  expires_at
) values (
  '11111111-1111-4111-8111-111111111111',
  decode('01', 'hex'),
  decode('02', 'hex'),
  repeat('a', 64),
  'test-v1',
  now(),
  now() + interval '90 days'
);

select is(
  public.get_pre_registration_count('11111111-1111-4111-8111-111111111111'),
  1::bigint,
  '활성 사전예약 건수만 집계한다'
);

select * from finish();
rollback;
