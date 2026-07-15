create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text,
  status public.profile_status not null default 'active',
  last_active_at timestamptz not null default now(),
  game_data_expires_at timestamptz not null default (now() + interval '1 year'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint profiles_nickname_length check (nickname is null or char_length(nickname) between 2 and 30),
  constraint profiles_deleted_state check (deleted_at is null or status <> 'active')
);

create table public.festivals (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  summary text not null,
  description text not null,
  start_date date not null,
  end_date date not null,
  region text not null,
  venue text not null,
  category text not null,
  image_path text,
  status public.festival_status not null default 'draft',
  data_status public.data_status not null default 'sample',
  source_url text,
  source_checked_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint festivals_date_range check (start_date <= end_date),
  constraint festivals_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint festivals_verified_source check (
    data_status <> 'verified' or (source_url is not null and source_checked_at is not null)
  )
);

create table public.festival_games (
  id uuid primary key default gen_random_uuid(),
  festival_id uuid not null references public.festivals(id) on delete cascade,
  code text not null unique,
  title text not null,
  description text not null,
  game_type public.game_type not null,
  rules jsonb not null default '{}'::jsonb,
  reward_config jsonb not null default '{}'::jsonb,
  status public.game_status not null default 'draft',
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint festival_games_period check (starts_at is null or ends_at is null or starts_at < ends_at),
  constraint festival_games_code_format check (code ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create table public.pre_registrations (
  id uuid primary key default gen_random_uuid(),
  festival_id uuid not null references public.festivals(id) on delete restrict,
  name_ciphertext bytea not null,
  phone_ciphertext bytea not null,
  phone_lookup_hash text not null,
  consent_version text not null,
  consented_at timestamptz not null,
  status public.pre_registration_status not null default 'submitted',
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  deleted_at timestamptz,
  constraint pre_registrations_hash_format check (phone_lookup_hash ~ '^[a-f0-9]{64}$'),
  constraint pre_registrations_expiry check (expires_at > created_at)
);

create table public.game_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  game_id uuid not null references public.festival_games(id) on delete restrict,
  status public.game_attempt_status not null default 'started',
  review_status public.game_review_status not null default 'pending',
  score integer,
  server_result jsonb not null default '{}'::jsonb,
  idempotency_key uuid not null unique,
  completion_idempotency_key uuid unique,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  verified_at timestamptz,
  rewarded_at timestamptz,
  expires_at timestamptz not null,
  deleted_at timestamptz,
  constraint game_attempts_score_nonnegative check (score is null or score >= 0),
  constraint game_attempts_finish_order check (finished_at is null or finished_at >= started_at)
);

create table public.point_wallets (
  user_id uuid primary key references auth.users(id) on delete restrict,
  balance bigint not null default 0,
  version bigint not null default 0,
  updated_at timestamptz not null default now(),
  constraint point_wallets_nonnegative_balance check (balance >= 0)
);

create table public.rewards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete restrict,
  festival_id uuid references public.festivals(id) on delete set null,
  game_attempt_id uuid references public.game_attempts(id) on delete set null,
  idempotency_key uuid not null unique,
  reward_type public.reward_type not null,
  status public.reward_status not null default 'issued',
  point_amount bigint,
  coupon_code_ciphertext bytea,
  issued_at timestamptz not null default now(),
  used_at timestamptz,
  redeem_by timestamptz,
  expires_at timestamptz not null,
  metadata jsonb not null default '{}'::jsonb,
  constraint rewards_point_amount check (
    (reward_type = 'points' and point_amount is not null and point_amount >= 0)
    or (reward_type <> 'points' and point_amount is null)
  ),
  constraint rewards_use_order check (used_at is null or used_at >= issued_at)
);

create table public.point_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.point_wallets(user_id) on delete restrict,
  transaction_type public.point_transaction_type not null,
  amount bigint not null,
  balance_after bigint not null,
  festival_id uuid references public.festivals(id) on delete set null,
  game_attempt_id uuid references public.game_attempts(id) on delete set null,
  reward_id uuid references public.rewards(id) on delete set null,
  source_event_ref text not null,
  idempotency_key uuid not null unique,
  reason_code text not null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '5 years'),
  deleted_at timestamptz,
  constraint point_transactions_nonzero_amount check (amount <> 0),
  constraint point_transactions_nonnegative_balance check (balance_after >= 0),
  constraint point_transactions_sign check (
    (transaction_type = 'earn' and amount > 0)
    or (transaction_type in ('spend', 'expire') and amount < 0)
    or (transaction_type = 'adjust' and amount <> 0)
  )
);

create table private.admin_users (
  user_id uuid primary key references auth.users(id) on delete restrict,
  role private.admin_role not null,
  is_active boolean not null default true,
  granted_by uuid references auth.users(id) on delete restrict,
  granted_reason text not null,
  granted_at timestamptz not null default now(),
  revoked_by uuid references auth.users(id) on delete restrict,
  revoked_reason text,
  revoked_at timestamptz,
  expires_at timestamptz,
  constraint admin_users_revoke_state check (
    (is_active and revoked_at is null and revoked_by is null and revoked_reason is null and expires_at is null)
    or (not is_active and revoked_at is not null and revoked_by is not null and revoked_reason is not null and expires_at is not null)
  )
);

create table private.admin_role_audit (
  id bigint generated always as identity primary key,
  action private.admin_audit_action not null,
  actor_user_id uuid not null,
  target_user_id uuid not null,
  old_role private.admin_role,
  new_role private.admin_role,
  reason text not null,
  correlation_id uuid not null default gen_random_uuid(),
  occurred_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '3 years'),
  metadata jsonb not null default '{}'::jsonb
);

create table private.security_logs (
  id bigint generated always as identity primary key,
  user_id uuid,
  subject_ref text,
  ip_prefix_hash text,
  event_type text not null,
  request_result text not null,
  occurred_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '6 months'),
  metadata jsonb not null default '{}'::jsonb,
  constraint security_logs_no_raw_ip check (not (metadata ? 'ip') and not (metadata ? 'phone'))
);

create table private.retention_runs (
  id bigint generated always as identity primary key,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  status text not null default 'running',
  deleted_counts jsonb not null default '{}'::jsonb,
  error_message text,
  constraint retention_runs_status check (status in ('running', 'succeeded', 'failed'))
);

create table retention.point_transactions_archive (
  id uuid primary key,
  subject_ref uuid not null,
  transaction_type public.point_transaction_type not null,
  amount bigint not null,
  balance_after bigint not null,
  source_event_ref text not null,
  reason_code text not null,
  created_at timestamptz not null,
  expires_at timestamptz not null,
  retention_basis text not null default 'internal_dispute_and_fraud_review',
  legal_hold_until timestamptz
);

comment on table public.point_transactions is '수정하지 않는 포인트 변동 원장';
comment on table private.admin_users is '사용자 수정 메타데이터와 분리된 관리자 권한 기준';
comment on table retention.point_transactions_archive is '탈퇴 후 직접 사용자 식별자를 제거한 분리 보관 원장';
