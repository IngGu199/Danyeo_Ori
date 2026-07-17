create or replace function public.get_pre_registration_count()
returns bigint
language sql
stable
security definer
set search_path = ''
as $$
  select count(*)
  from public.pre_registrations
  where status in ('submitted', 'confirmed')
    and deleted_at is null
    and expires_at > now();
$$;

revoke all on function public.get_pre_registration_count() from public;
grant execute on function public.get_pre_registration_count() to anon, authenticated, service_role;

comment on function public.get_pre_registration_count()
  is '개인정보를 노출하지 않고 유효한 다녀오리 출시 알림 신청자 수만 반환한다.';
