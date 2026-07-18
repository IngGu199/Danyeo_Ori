create view public.current_admin_access
with (security_invoker = true, security_barrier = true)
as
select true as is_admin
where private.is_admin();

comment on view public.current_admin_access is
  '현재 JWT 사용자가 활성 관리자인지만 노출하며 관리자 명단과 역할은 노출하지 않는다';

revoke all on public.current_admin_access from public, anon;
grant select on public.current_admin_access to authenticated;

drop policy if exists festivals_admin_delete on public.festivals;
create policy festivals_admin_delete
on public.festivals for delete to authenticated
using ((select private.is_admin()));

drop policy if exists festival_games_admin_delete on public.festival_games;
create policy festival_games_admin_delete
on public.festival_games for delete to authenticated
using ((select private.is_admin()));
