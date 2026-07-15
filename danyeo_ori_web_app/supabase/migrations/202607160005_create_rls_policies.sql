alter table public.profiles enable row level security;
alter table public.festivals enable row level security;
alter table public.festival_games enable row level security;
alter table public.pre_registrations enable row level security;
alter table public.game_attempts enable row level security;
alter table public.point_wallets enable row level security;
alter table public.point_transactions enable row level security;
alter table public.rewards enable row level security;
alter table private.admin_users enable row level security;
alter table private.admin_role_audit enable row level security;
alter table private.security_logs enable row level security;
alter table private.retention_runs enable row level security;
alter table retention.point_transactions_archive enable row level security;

revoke all on all tables in schema public from anon, authenticated;
revoke all on all tables in schema private from anon, authenticated;
revoke all on all tables in schema retention from anon, authenticated;

grant select on public.festivals, public.festival_games to anon, authenticated;
grant select on public.profiles, public.pre_registrations, public.game_attempts,
  public.point_wallets, public.point_transactions, public.rewards to authenticated;
grant update (nickname) on public.profiles to authenticated;
grant insert, update, delete on public.festivals, public.festival_games to authenticated;
grant update (status) on public.pre_registrations to authenticated;
grant update (review_status) on public.game_attempts to authenticated;

create policy profiles_select_own_or_owner
on public.profiles for select to authenticated
using (
  (select auth.uid()) is not null
  and ((select auth.uid()) = id or (select private.is_owner()))
);

create policy profiles_update_own
on public.profiles for update to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = id and status = 'active')
with check ((select auth.uid()) = id and status = 'active' and deleted_at is null);

create policy festivals_public_read
on public.festivals for select to anon, authenticated
using (status = 'published');

create policy festivals_admin_read
on public.festivals for select to authenticated
using ((select private.is_admin()));

create policy festivals_admin_insert
on public.festivals for insert to authenticated
with check ((select private.is_admin()));

create policy festivals_admin_update
on public.festivals for update to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy festivals_admin_delete
on public.festivals for delete to authenticated
using ((select private.is_owner()));

create policy festival_games_public_read
on public.festival_games for select to anon, authenticated
using (
  (status = 'active' and (starts_at is null or starts_at <= now()) and (ends_at is null or ends_at >= now()))
  and exists (
    select 1 from public.festivals f
    where f.id = festival_id and f.status = 'published'
  )
);

create policy festival_games_admin_read
on public.festival_games for select to authenticated
using ((select private.is_admin()));

create policy festival_games_admin_insert
on public.festival_games for insert to authenticated
with check ((select private.is_admin()));

create policy festival_games_admin_update
on public.festival_games for update to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy festival_games_admin_delete
on public.festival_games for delete to authenticated
using ((select private.is_owner()));

create policy pre_registrations_admin_select
on public.pre_registrations for select to authenticated
using ((select private.is_admin()));

create policy pre_registrations_admin_status_update
on public.pre_registrations for update to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy game_attempts_select_own_or_admin
on public.game_attempts for select to authenticated
using ((select auth.uid()) = user_id or (select private.is_admin()));

create policy game_attempts_admin_review
on public.game_attempts for update to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy point_wallets_select_own_or_owner
on public.point_wallets for select to authenticated
using ((select auth.uid()) = user_id or (select private.is_owner()));

create policy point_transactions_select_own_or_owner
on public.point_transactions for select to authenticated
using ((select auth.uid()) = user_id or (select private.is_owner()));

create policy rewards_select_own_or_admin
on public.rewards for select to authenticated
using ((select auth.uid()) = user_id or (select private.is_admin()));

alter default privileges in schema public revoke all on tables from anon, authenticated;
alter default privileges in schema private revoke all on tables from anon, authenticated;
alter default privileges in schema retention revoke all on tables from anon, authenticated;
