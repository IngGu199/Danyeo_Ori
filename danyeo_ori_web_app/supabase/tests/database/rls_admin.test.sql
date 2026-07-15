create extension if not exists pgtap with schema extensions;

begin;
set local search_path = public, extensions;
select plan(6);

select has_table('private', 'admin_users', '관리자 권한 테이블이 private 스키마에 있다');
select has_table('private', 'admin_role_audit', '관리자 감사 테이블이 private 스키마에 있다');
select has_function('private', 'is_admin', array[]::text[], 'is_admin 함수가 존재한다');
select has_function('private', 'is_owner', array[]::text[], 'is_owner 함수가 존재한다');
select ok(
  not has_table_privilege('authenticated', 'private.admin_users', 'SELECT'),
  '일반 인증 역할은 관리자 권한 테이블을 직접 조회할 수 없다'
);
select ok(
  not has_function_privilege('authenticated', 'public.internal_grant_admin(uuid,uuid,text,text)', 'EXECUTE'),
  '인증 클라이언트는 관리자 등록 RPC를 실행할 수 없다'
);

select * from finish();
rollback;
