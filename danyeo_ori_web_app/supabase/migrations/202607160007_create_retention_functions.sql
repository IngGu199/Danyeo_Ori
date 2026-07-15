create or replace function private.withdraw_user_data(p_user_id uuid)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_subject_ref uuid := gen_random_uuid();
begin
  if exists (
    select 1 from private.admin_users
    where user_id = p_user_id and is_active
  ) then
    raise exception 'active administrators must be revoked before withdrawal' using errcode = '42501';
  end if;

  if not exists (select 1 from public.profiles where id = p_user_id) then
    raise exception 'profile not found';
  end if;

  insert into retention.point_transactions_archive (
    id, subject_ref, transaction_type, amount, balance_after,
    source_event_ref, reason_code, created_at, expires_at
  )
  select
    id, v_subject_ref, transaction_type, amount, balance_after,
    source_event_ref, reason_code, created_at, expires_at
  from public.point_transactions
  where user_id = p_user_id
  on conflict (id) do nothing;

  delete from public.point_transactions where user_id = p_user_id;
  delete from public.rewards where user_id = p_user_id;
  delete from public.point_wallets where user_id = p_user_id;
  delete from public.game_attempts where user_id = p_user_id;

  update public.profiles set
    nickname = null,
    status = 'withdrawn',
    deleted_at = now(),
    updated_at = now()
  where id = p_user_id;

  return v_subject_ref;
end;
$$;

create or replace function private.run_retention(p_now timestamptz default now())
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_run_id bigint;
  v_pre_registrations bigint := 0;
  v_game_attempts bigint := 0;
  v_rewards bigint := 0;
  v_point_transactions bigint := 0;
  v_admin_audit bigint := 0;
  v_admin_users bigint := 0;
  v_security_logs bigint := 0;
  v_point_archive bigint := 0;
  v_counts jsonb;
begin
  insert into private.retention_runs default values returning id into v_run_id;

  delete from public.pre_registrations
  where expires_at <= p_now;
  get diagnostics v_pre_registrations = row_count;

  delete from public.game_attempts ga
  using public.profiles p
  where ga.user_id = p.id
    and p.game_data_expires_at <= p_now;
  get diagnostics v_game_attempts = row_count;

  delete from public.point_transactions
  where expires_at <= p_now;
  get diagnostics v_point_transactions = row_count;

  delete from public.rewards
  where expires_at <= p_now;
  get diagnostics v_rewards = row_count;

  delete from private.admin_role_audit
  where expires_at <= p_now;
  get diagnostics v_admin_audit = row_count;

  delete from private.admin_users
  where not is_active and expires_at <= p_now;
  get diagnostics v_admin_users = row_count;

  delete from private.security_logs
  where expires_at <= p_now;
  get diagnostics v_security_logs = row_count;

  delete from retention.point_transactions_archive
  where expires_at <= p_now
    and (legal_hold_until is null or legal_hold_until <= p_now);
  get diagnostics v_point_archive = row_count;

  v_counts := jsonb_build_object(
    'pre_registrations', v_pre_registrations,
    'game_attempts', v_game_attempts,
    'point_transactions', v_point_transactions,
    'rewards', v_rewards,
    'admin_role_audit', v_admin_audit,
    'admin_users', v_admin_users,
    'security_logs', v_security_logs,
    'point_transactions_archive', v_point_archive
  );

  update private.retention_runs set
    finished_at = now(),
    status = 'succeeded',
    deleted_counts = v_counts
  where id = v_run_id;

  return v_counts;
exception when others then
  if v_run_id is not null then
    update private.retention_runs set
      finished_at = now(),
      status = 'failed',
      error_message = left(sqlerrm, 1000)
    where id = v_run_id;
  end if;
  return jsonb_build_object('status', 'failed', 'error', left(sqlerrm, 1000));
end;
$$;

create or replace function public.internal_withdraw_user_data(p_user_id uuid)
returns uuid
language sql
security definer
set search_path = ''
as $$ select private.withdraw_user_data(p_user_id); $$;

revoke all on function private.withdraw_user_data(uuid) from public, anon, authenticated;
revoke all on function private.run_retention(timestamptz) from public, anon, authenticated;
revoke all on function public.internal_withdraw_user_data(uuid) from public, anon, authenticated;
grant execute on function private.run_retention(timestamptz) to service_role;
grant execute on function public.internal_withdraw_user_data(uuid) to service_role;
