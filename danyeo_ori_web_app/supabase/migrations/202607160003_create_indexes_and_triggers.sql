create unique index pre_registrations_active_phone_unique
  on public.pre_registrations (phone_lookup_hash)
  where deleted_at is null;

create index festivals_calendar_idx on public.festivals (start_date, end_date)
  where status = 'published';
create index festivals_region_category_idx on public.festivals (region, category)
  where status = 'published';
create index festival_games_festival_status_idx on public.festival_games (festival_id, status);
create index game_attempts_user_started_idx on public.game_attempts (user_id, started_at desc);
create index game_attempts_game_status_idx on public.game_attempts (game_id, status);
create index game_attempts_expiry_idx on public.game_attempts (expires_at) where deleted_at is null;
create index point_transactions_user_created_idx on public.point_transactions (user_id, created_at desc);
create unique index point_transactions_source_type_unique
  on public.point_transactions (source_event_ref, transaction_type);
create unique index rewards_attempt_type_unique
  on public.rewards (user_id, game_attempt_id, reward_type)
  where game_attempt_id is not null;
create index pre_registrations_expiry_idx on public.pre_registrations (expires_at) where deleted_at is null;
create index rewards_expiry_idx on public.rewards (expires_at) where status in ('issued', 'used', 'expired');
create index admin_role_audit_expiry_idx on private.admin_role_audit (expires_at);
create index security_logs_expiry_idx on private.security_logs (expires_at);
create index point_archive_expiry_idx on retention.point_transactions_archive (expires_at);

create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function private.set_updated_at();

create trigger festivals_set_updated_at
before update on public.festivals
for each row execute function private.set_updated_at();

create trigger festival_games_set_updated_at
before update on public.festival_games
for each row execute function private.set_updated_at();

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_nickname text;
begin
  v_nickname := nullif(trim(new.raw_user_meta_data ->> 'nickname'), '');
  if v_nickname is null or char_length(v_nickname) < 2 or char_length(v_nickname) > 30 then
    v_nickname := '축제러-' || left(new.id::text, 8);
  end if;

  insert into public.profiles (id, nickname)
  values (new.id, v_nickname);

  insert into public.point_wallets (user_id)
  values (new.id);

  return new;
end;
$$;

revoke all on function private.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function private.handle_new_user();
