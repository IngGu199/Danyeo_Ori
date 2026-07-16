create or replace function public.get_pre_registration_count(p_festival_id uuid)
returns bigint
language sql
stable
security definer
set search_path = ''
as $$
  select case
    when exists (
      select 1
      from public.festivals
      where id = p_festival_id and status = 'published'
    ) then (
      select count(*)
      from public.pre_registrations
      where festival_id = p_festival_id
        and status in ('submitted', 'confirmed')
        and deleted_at is null
    )
    else 0::bigint
  end;
$$;

revoke all on function public.get_pre_registration_count(uuid) from public;
grant execute on function public.get_pre_registration_count(uuid) to anon, authenticated, service_role;

comment on function public.get_pre_registration_count(uuid)
  is '개인정보를 노출하지 않고 공개 축제의 활성 사전예약 건수만 반환한다.';
