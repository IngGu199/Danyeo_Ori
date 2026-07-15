create or replace function private.submit_pre_registration(
  p_festival_id uuid,
  p_name_ciphertext bytea,
  p_phone_ciphertext bytea,
  p_phone_lookup_hash text,
  p_consent_version text,
  p_consented_at timestamptz
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_registration_id uuid;
  v_end_date date;
begin
  select end_date into v_end_date
  from public.festivals
  where id = p_festival_id and status = 'published';

  if v_end_date is null then
    raise exception 'festival is not available for registration';
  end if;
  if p_consented_at < now() - interval '15 minutes' or p_consented_at > now() + interval '1 minute' then
    raise exception 'invalid consent timestamp';
  end if;
  if p_phone_lookup_hash !~ '^[a-f0-9]{64}$' then
    raise exception 'invalid phone lookup hash';
  end if;
  if nullif(trim(p_consent_version), '') is null then
    raise exception 'consent version is required';
  end if;

  insert into public.pre_registrations (
    festival_id, name_ciphertext, phone_ciphertext, phone_lookup_hash,
    consent_version, consented_at, expires_at
  ) values (
    p_festival_id, p_name_ciphertext, p_phone_ciphertext, p_phone_lookup_hash,
    trim(p_consent_version), p_consented_at,
    (v_end_date + 91)::timestamp at time zone 'Asia/Seoul'
  )
  returning id into v_registration_id;

  return v_registration_id;
end;
$$;

create or replace function private.start_game_attempt(
  p_user_id uuid,
  p_game_id uuid,
  p_idempotency_key uuid
)
returns public.game_attempts
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_attempt public.game_attempts;
  v_game public.festival_games;
  v_expiry timestamptz;
begin
  select * into v_attempt
  from public.game_attempts
  where idempotency_key = p_idempotency_key;
  if found then
    if v_attempt.user_id <> p_user_id then
      raise exception 'idempotency key belongs to another user' using errcode = '42501';
    end if;
    return v_attempt;
  end if;

  if not exists (select 1 from public.profiles where id = p_user_id and status = 'active') then
    raise exception 'active profile required' using errcode = '42501';
  end if;

  select * into v_game
  from public.festival_games
  where id = p_game_id
    and status = 'active'
    and (starts_at is null or starts_at <= now())
    and (ends_at is null or ends_at >= now());
  if not found then
    raise exception 'game is not active';
  end if;

  v_expiry := now() + interval '1 year';
  update public.profiles set
    last_active_at = now(),
    game_data_expires_at = v_expiry
  where id = p_user_id;

  insert into public.game_attempts (
    user_id, game_id, idempotency_key, expires_at
  ) values (
    p_user_id, p_game_id, p_idempotency_key, v_expiry
  ) returning * into v_attempt;

  return v_attempt;
end;
$$;

create or replace function private.complete_game_attempt(
  p_user_id uuid,
  p_attempt_id uuid,
  p_score integer,
  p_idempotency_key uuid,
  p_client_event_count integer default 0
)
returns public.game_attempts
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_attempt public.game_attempts;
  v_rules jsonb;
  v_duration integer;
  v_success_score integer;
  v_max_score integer;
  v_elapsed numeric;
  v_verified boolean;
begin
  if p_score < 0 or p_client_event_count < 0 then
    raise exception 'score and event count must be nonnegative';
  end if;

  select ga.* into v_attempt
  from public.game_attempts ga
  where ga.id = p_attempt_id
  for update of ga;

  if not found or v_attempt.user_id <> p_user_id then
    raise exception 'attempt not found' using errcode = '42501';
  end if;

  select rules into v_rules
  from public.festival_games
  where id = v_attempt.game_id;

  if v_attempt.completion_idempotency_key = p_idempotency_key then
    return v_attempt;
  end if;
  if v_attempt.status <> 'started' then
    raise exception 'attempt has already completed';
  end if;

  v_duration := greatest(coalesce((v_rules ->> 'duration_seconds')::integer, 30), 1);
  v_success_score := greatest(coalesce((v_rules ->> 'success_score')::integer, 1), 0);
  v_max_score := greatest(coalesce((v_rules ->> 'max_score')::integer, 100000), v_success_score);
  v_elapsed := extract(epoch from (now() - v_attempt.started_at));
  v_verified := v_elapsed >= 1
    and v_elapsed <= v_duration + 5
    and p_score between v_success_score and v_max_score
    and p_client_event_count <= greatest(v_max_score * 2, 100);

  update public.game_attempts set
    status = case when v_verified then 'verified' else 'rejected' end,
    score = p_score,
    completion_idempotency_key = p_idempotency_key,
    finished_at = now(),
    verified_at = now(),
    server_result = jsonb_build_object(
      'verified', v_verified,
      'elapsed_seconds', round(v_elapsed, 3),
      'client_event_count', p_client_event_count,
      'rule_version', coalesce(v_rules ->> 'version', '1')
    )
  where id = p_attempt_id
  returning * into v_attempt;

  update public.profiles set
    last_active_at = now(),
    game_data_expires_at = now() + interval '1 year'
  where id = p_user_id;

  return v_attempt;
end;
$$;

create or replace function private.draw_reward_points(p_reward_config jsonb)
returns bigint
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  v_kind text := coalesce(p_reward_config ->> 'kind', 'points');
  v_outcome jsonb;
  v_total_weight bigint := 0;
  v_cursor bigint := 0;
  v_draw bigint;
  v_bytes bytea;
begin
  if v_kind = 'points' then
    return greatest(coalesce((p_reward_config ->> 'point_amount')::bigint, 0), 0);
  end if;
  if v_kind <> 'roulette' or jsonb_typeof(p_reward_config -> 'outcomes') <> 'array' then
    raise exception 'invalid reward configuration';
  end if;

  select coalesce(sum((item ->> 'weight')::bigint), 0)
  into v_total_weight
  from jsonb_array_elements(p_reward_config -> 'outcomes') item;
  if v_total_weight <= 0 then
    raise exception 'roulette total weight must be positive';
  end if;

  v_bytes := extensions.gen_random_bytes(4);
  v_draw := (
    get_byte(v_bytes, 0)::bigint * 16777216
    + get_byte(v_bytes, 1)::bigint * 65536
    + get_byte(v_bytes, 2)::bigint * 256
    + get_byte(v_bytes, 3)::bigint
  ) % v_total_weight;

  for v_outcome in select value from jsonb_array_elements(p_reward_config -> 'outcomes')
  loop
    v_cursor := v_cursor + (v_outcome ->> 'weight')::bigint;
    if v_draw < v_cursor then
      return greatest(coalesce((v_outcome ->> 'points')::bigint, 0), 0);
    end if;
  end loop;

  raise exception 'roulette draw failed';
end;
$$;

create or replace function private.claim_reward(
  p_user_id uuid,
  p_attempt_id uuid,
  p_idempotency_key uuid
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_attempt public.game_attempts;
  v_game public.festival_games;
  v_festival_id uuid;
  v_reward_id uuid;
  v_transaction_id uuid;
  v_points bigint;
  v_balance bigint;
  v_existing public.point_transactions;
  v_existing_reward public.rewards;
begin
  select * into v_existing_reward
  from public.rewards
  where idempotency_key = p_idempotency_key;
  if found then
    if v_existing_reward.user_id <> p_user_id then
      raise exception 'idempotency key belongs to another user' using errcode = '42501';
    end if;
    select * into v_existing
    from public.point_transactions
    where reward_id = v_existing_reward.id;
    return jsonb_build_object(
      'reward_id', v_existing_reward.id,
      'transaction_id', v_existing.id,
      'points', v_existing_reward.point_amount,
      'balance', coalesce(v_existing.balance_after, (select balance from public.point_wallets where user_id = p_user_id)),
      'idempotent_replay', true
    );
  end if;

  select * into v_existing
  from public.point_transactions
  where idempotency_key = p_idempotency_key;
  if found then
    if v_existing.user_id <> p_user_id then
      raise exception 'idempotency key belongs to another user' using errcode = '42501';
    end if;
    return jsonb_build_object(
      'reward_id', v_existing.reward_id,
      'transaction_id', v_existing.id,
      'points', v_existing.amount,
      'balance', v_existing.balance_after,
      'idempotent_replay', true
    );
  end if;

  select * into v_attempt
  from public.game_attempts
  where id = p_attempt_id
  for update;
  if not found or v_attempt.user_id <> p_user_id then
    raise exception 'attempt not found' using errcode = '42501';
  end if;
  if v_attempt.status <> 'verified' then
    raise exception 'only verified attempts can receive rewards';
  end if;
  if v_attempt.rewarded_at is not null then
    raise exception 'attempt has already received a reward' using errcode = '23505';
  end if;

  select fg.* into v_game
  from public.festival_games fg
  where fg.id = v_attempt.game_id and fg.status = 'active';
  if not found then
    raise exception 'game is not active';
  end if;

  v_festival_id := v_game.festival_id;

  v_points := private.draw_reward_points(v_game.reward_config);

  insert into public.point_wallets (user_id)
  values (p_user_id)
  on conflict (user_id) do nothing;

  select balance into v_balance
  from public.point_wallets
  where user_id = p_user_id
  for update;
  v_balance := v_balance + v_points;

  insert into public.rewards (
    user_id, festival_id, game_attempt_id, idempotency_key, reward_type, point_amount,
    redeem_by, expires_at, metadata
  ) values (
    p_user_id, v_festival_id, p_attempt_id, p_idempotency_key, 'points', v_points,
    now() + interval '1 year', now() + interval '5 years',
    jsonb_build_object('game_code', v_game.code)
  ) returning id into v_reward_id;

  if v_points > 0 then
    insert into public.point_transactions (
      user_id, transaction_type, amount, balance_after, festival_id,
      game_attempt_id, reward_id, source_event_ref, idempotency_key, reason_code
    ) values (
      p_user_id, 'earn', v_points, v_balance, v_festival_id,
      p_attempt_id, v_reward_id, 'game_attempt:' || p_attempt_id::text,
      p_idempotency_key, 'game_reward'
    ) returning id into v_transaction_id;

    update public.point_wallets set
      balance = v_balance,
      version = version + 1,
      updated_at = now()
    where user_id = p_user_id;
  end if;

  update public.game_attempts set rewarded_at = now()
  where id = p_attempt_id;

  return jsonb_build_object(
    'reward_id', v_reward_id,
    'transaction_id', v_transaction_id,
    'points', v_points,
    'balance', v_balance,
    'idempotent_replay', false
  );
end;
$$;

create or replace function private.record_security_event(
  p_user_id uuid,
  p_subject_ref text,
  p_ip_prefix_hash text,
  p_event_type text,
  p_request_result text,
  p_metadata jsonb default '{}'::jsonb
)
returns void
language sql
security definer
set search_path = ''
as $$
  insert into private.security_logs (
    user_id, subject_ref, ip_prefix_hash, event_type, request_result, metadata
  ) values (
    p_user_id, p_subject_ref, p_ip_prefix_hash, p_event_type, p_request_result,
    p_metadata - 'ip' - 'phone' - 'name' - 'email'
  );
$$;

create or replace function public.internal_submit_pre_registration(
  p_festival_id uuid, p_name_ciphertext bytea, p_phone_ciphertext bytea,
  p_phone_lookup_hash text, p_consent_version text, p_consented_at timestamptz
)
returns uuid language sql security definer set search_path = ''
as $$
  select private.submit_pre_registration(
    p_festival_id, p_name_ciphertext, p_phone_ciphertext,
    p_phone_lookup_hash, p_consent_version, p_consented_at
  );
$$;

create or replace function public.internal_start_game_attempt(
  p_user_id uuid, p_game_id uuid, p_idempotency_key uuid
)
returns public.game_attempts language sql security definer set search_path = ''
as $$ select private.start_game_attempt(p_user_id, p_game_id, p_idempotency_key); $$;

create or replace function public.internal_complete_game_attempt(
  p_user_id uuid, p_attempt_id uuid, p_score integer,
  p_idempotency_key uuid, p_client_event_count integer default 0
)
returns public.game_attempts language sql security definer set search_path = ''
as $$
  select private.complete_game_attempt(
    p_user_id, p_attempt_id, p_score, p_idempotency_key, p_client_event_count
  );
$$;

create or replace function public.internal_claim_reward(
  p_user_id uuid, p_attempt_id uuid, p_idempotency_key uuid
)
returns jsonb language sql security definer set search_path = ''
as $$ select private.claim_reward(p_user_id, p_attempt_id, p_idempotency_key); $$;

create or replace function public.internal_record_security_event(
  p_user_id uuid, p_subject_ref text, p_ip_prefix_hash text,
  p_event_type text, p_request_result text, p_metadata jsonb default '{}'::jsonb
)
returns void language sql security definer set search_path = ''
as $$
  select private.record_security_event(
    p_user_id, p_subject_ref, p_ip_prefix_hash,
    p_event_type, p_request_result, p_metadata
  );
$$;

revoke all on function private.submit_pre_registration(uuid, bytea, bytea, text, text, timestamptz) from public, anon, authenticated;
revoke all on function private.start_game_attempt(uuid, uuid, uuid) from public, anon, authenticated;
revoke all on function private.complete_game_attempt(uuid, uuid, integer, uuid, integer) from public, anon, authenticated;
revoke all on function private.draw_reward_points(jsonb) from public, anon, authenticated;
revoke all on function private.claim_reward(uuid, uuid, uuid) from public, anon, authenticated;
revoke all on function private.record_security_event(uuid, text, text, text, text, jsonb) from public, anon, authenticated;

revoke all on function public.internal_submit_pre_registration(uuid, bytea, bytea, text, text, timestamptz) from public, anon, authenticated;
revoke all on function public.internal_start_game_attempt(uuid, uuid, uuid) from public, anon, authenticated;
revoke all on function public.internal_complete_game_attempt(uuid, uuid, integer, uuid, integer) from public, anon, authenticated;
revoke all on function public.internal_claim_reward(uuid, uuid, uuid) from public, anon, authenticated;
revoke all on function public.internal_record_security_event(uuid, text, text, text, text, jsonb) from public, anon, authenticated;

grant execute on function public.internal_submit_pre_registration(uuid, bytea, bytea, text, text, timestamptz) to service_role;
grant execute on function public.internal_start_game_attempt(uuid, uuid, uuid) to service_role;
grant execute on function public.internal_complete_game_attempt(uuid, uuid, integer, uuid, integer) to service_role;
grant execute on function public.internal_claim_reward(uuid, uuid, uuid) to service_role;
grant execute on function public.internal_record_security_event(uuid, text, text, text, text, jsonb) to service_role;
