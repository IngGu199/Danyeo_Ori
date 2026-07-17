create extension if not exists pgtap with schema extensions;
begin;
select plan(5);

select hasnt_column(
  'public',
  'pre_registrations',
  'festival_id',
  '출시 알림 신청은 특정 축제에 종속되지 않는다'
);

select has_function(
  'public',
  'get_pre_registration_count',
  array[]::text[],
  '전체 출시 알림 신청자 집계 함수가 존재한다'
);

select ok(
  has_function_privilege('anon', 'public.get_pre_registration_count()', 'execute'),
  '비회원은 개인정보 없이 전체 신청자 수만 조회할 수 있다'
);

select has_function(
  'public',
  'internal_submit_pre_registration',
  array['bytea', 'bytea', 'text', 'text', 'timestamp with time zone'],
  '축제 식별자 없이 출시 알림을 접수하는 서버 함수가 존재한다'
);

insert into public.pre_registrations (
  name_ciphertext,
  phone_ciphertext,
  phone_lookup_hash,
  consent_version,
  consented_at,
  status,
  created_at,
  expires_at
) values
  (
    decode('01', 'hex'),
    decode('02', 'hex'),
    repeat('a', 64),
    'launch-test-v1',
    now(),
    'submitted',
    now(),
    now() + interval '1 year'
  ),
  (
    decode('03', 'hex'),
    decode('04', 'hex'),
    repeat('b', 64),
    'launch-test-v1',
    now(),
    'cancelled',
    now(),
    now() + interval '1 year'
  ),
  (
    decode('05', 'hex'),
    decode('06', 'hex'),
    repeat('c', 64),
    'launch-test-v1',
    now() - interval '2 years',
    'confirmed',
    now() - interval '2 years',
    now() - interval '1 year'
  );

select is(
  public.get_pre_registration_count(),
  1::bigint,
  '취소·만료되지 않은 전체 출시 알림 신청만 집계한다'
);

select * from finish();
rollback;
