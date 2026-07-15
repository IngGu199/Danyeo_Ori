create extension if not exists pgtap with schema extensions;

begin;
set local search_path = public, extensions;
select plan(5);

select has_table('public', 'profiles', 'profiles 테이블이 존재한다');
select ok(
  (select relrowsecurity from pg_class where oid = 'public.profiles'::regclass),
  'profiles RLS가 활성화되어 있다'
);
select ok(
  has_table_privilege('authenticated', 'public.profiles', 'SELECT'),
  '회원은 profiles SELECT 권한이 있다'
);
select ok(
  not has_table_privilege('anon', 'public.profiles', 'SELECT'),
  '비회원은 profiles를 조회할 수 없다'
);
select ok(
  not has_table_privilege('authenticated', 'public.profiles', 'INSERT'),
  '회원은 profiles를 직접 생성할 수 없다'
);

select * from finish();
rollback;
