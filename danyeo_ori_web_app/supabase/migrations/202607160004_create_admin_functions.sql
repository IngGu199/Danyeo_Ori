create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from private.admin_users au
    where au.user_id = (select auth.uid())
      and au.is_active
      and au.role in ('owner', 'operator')
  );
$$;

create or replace function private.is_owner()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from private.admin_users au
    where au.user_id = (select auth.uid())
      and au.is_active
      and au.role = 'owner'
  );
$$;

revoke all on function private.is_admin() from public, anon;
revoke all on function private.is_owner() from public, anon;
grant execute on function private.is_admin() to authenticated;
grant execute on function private.is_owner() to authenticated;
grant usage on schema private to authenticated;

create or replace function private.assert_active_owner(p_actor_user_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not exists (
    select 1
    from private.admin_users
    where user_id = p_actor_user_id
      and role = 'owner'
      and is_active
  ) then
    raise exception 'active owner permission required' using errcode = '42501';
  end if;
end;
$$;

create or replace function private.bootstrap_owners(
  p_owner_one uuid,
  p_owner_two uuid,
  p_reason text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_owner_one = p_owner_two then
    raise exception 'two distinct owners are required';
  end if;
  if nullif(trim(p_reason), '') is null then
    raise exception 'reason is required';
  end if;
  if exists (select 1 from private.admin_users) then
    raise exception 'admin bootstrap has already completed';
  end if;
  if (select count(*) from auth.users where id in (p_owner_one, p_owner_two) and email_confirmed_at is not null) <> 2 then
    raise exception 'both owners must be email-confirmed users';
  end if;

  insert into private.admin_users (user_id, role, granted_by, granted_reason)
  values
    (p_owner_one, 'owner', p_owner_one, p_reason),
    (p_owner_two, 'owner', p_owner_one, p_reason);

  insert into private.admin_role_audit (
    action, actor_user_id, target_user_id, new_role, reason
  ) values
    ('grant', p_owner_one, p_owner_one, 'owner', p_reason),
    ('grant', p_owner_one, p_owner_two, 'owner', p_reason);
end;
$$;

create or replace function private.grant_admin(
  p_actor_user_id uuid,
  p_target_user_id uuid,
  p_role private.admin_role,
  p_reason text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_old_role private.admin_role;
  v_action private.admin_audit_action;
begin
  perform private.assert_active_owner(p_actor_user_id);
  if p_actor_user_id = p_target_user_id then
    raise exception 'owners cannot grant or change their own role';
  end if;
  if nullif(trim(p_reason), '') is null then
    raise exception 'reason is required';
  end if;
  if not exists (select 1 from auth.users where id = p_target_user_id and email_confirmed_at is not null) then
    raise exception 'target must be an email-confirmed user';
  end if;

  select role into v_old_role
  from private.admin_users
  where user_id = p_target_user_id;

  if p_role = 'owner'
    and coalesce(v_old_role <> 'owner', true)
    and (select count(*) from private.admin_users where role = 'owner' and is_active) >= 2 then
    raise exception 'active owners are limited to two; use replace_owner';
  end if;

  insert into private.admin_users (
    user_id, role, is_active, granted_by, granted_reason, granted_at,
    revoked_by, revoked_reason, revoked_at, expires_at
  ) values (
    p_target_user_id, p_role, true, p_actor_user_id, trim(p_reason), now(),
    null, null, null, null
  )
  on conflict (user_id) do update set
    role = excluded.role,
    is_active = true,
    granted_by = excluded.granted_by,
    granted_reason = excluded.granted_reason,
    granted_at = excluded.granted_at,
    revoked_by = null,
    revoked_reason = null,
    revoked_at = null,
    expires_at = null;

  v_action := case when v_old_role is null then 'grant' else 'role_change' end;
  insert into private.admin_role_audit (
    action, actor_user_id, target_user_id, old_role, new_role, reason
  ) values (
    v_action, p_actor_user_id, p_target_user_id, v_old_role, p_role, trim(p_reason)
  );
end;
$$;

create or replace function private.revoke_admin(
  p_actor_user_id uuid,
  p_target_user_id uuid,
  p_reason text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_old_role private.admin_role;
begin
  perform private.assert_active_owner(p_actor_user_id);
  if p_actor_user_id = p_target_user_id then
    raise exception 'owners cannot revoke themselves';
  end if;
  if nullif(trim(p_reason), '') is null then
    raise exception 'reason is required';
  end if;

  select role into v_old_role
  from private.admin_users
  where user_id = p_target_user_id and is_active
  for update;

  if v_old_role is null then
    raise exception 'target is not an active admin';
  end if;
  if v_old_role = 'owner'
    and (select count(*) from private.admin_users where role = 'owner' and is_active) <= 2 then
    raise exception 'two active owners must remain; use replace_owner';
  end if;

  update private.admin_users set
    is_active = false,
    revoked_by = p_actor_user_id,
    revoked_reason = trim(p_reason),
    revoked_at = now(),
    expires_at = now() + interval '3 years'
  where user_id = p_target_user_id;

  insert into private.admin_role_audit (
    action, actor_user_id, target_user_id, old_role, reason
  ) values (
    'revoke', p_actor_user_id, p_target_user_id, v_old_role, trim(p_reason)
  );
end;
$$;

create or replace function private.replace_owner(
  p_actor_user_id uuid,
  p_outgoing_owner_id uuid,
  p_incoming_owner_id uuid,
  p_reason text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform private.assert_active_owner(p_actor_user_id);
  if p_actor_user_id = p_outgoing_owner_id then
    raise exception 'an owner replacement must be approved by the other owner';
  end if;
  if p_outgoing_owner_id = p_incoming_owner_id then
    raise exception 'incoming and outgoing owners must differ';
  end if;
  if nullif(trim(p_reason), '') is null then
    raise exception 'reason is required';
  end if;
  if not exists (
    select 1 from private.admin_users
    where user_id = p_outgoing_owner_id and role = 'owner' and is_active
  ) then
    raise exception 'outgoing user is not an active owner';
  end if;
  if not exists (select 1 from auth.users where id = p_incoming_owner_id and email_confirmed_at is not null) then
    raise exception 'incoming owner must be an email-confirmed user';
  end if;

  insert into private.admin_users (
    user_id, role, is_active, granted_by, granted_reason, granted_at
  ) values (
    p_incoming_owner_id, 'owner', true, p_actor_user_id, trim(p_reason), now()
  )
  on conflict (user_id) do update set
    role = 'owner', is_active = true, granted_by = p_actor_user_id,
    granted_reason = trim(p_reason), granted_at = now(),
    revoked_by = null, revoked_reason = null, revoked_at = null, expires_at = null;

  update private.admin_users set
    is_active = false,
    revoked_by = p_actor_user_id,
    revoked_reason = trim(p_reason),
    revoked_at = now(),
    expires_at = now() + interval '3 years'
  where user_id = p_outgoing_owner_id;

  insert into private.admin_role_audit (
    action, actor_user_id, target_user_id, new_role, reason
  ) values ('grant', p_actor_user_id, p_incoming_owner_id, 'owner', trim(p_reason));

  insert into private.admin_role_audit (
    action, actor_user_id, target_user_id, old_role, reason
  ) values ('revoke', p_actor_user_id, p_outgoing_owner_id, 'owner', trim(p_reason));
end;
$$;

revoke all on function private.assert_active_owner(uuid) from public, anon, authenticated;
revoke all on function private.bootstrap_owners(uuid, uuid, text) from public, anon, authenticated;
revoke all on function private.grant_admin(uuid, uuid, private.admin_role, text) from public, anon, authenticated;
revoke all on function private.revoke_admin(uuid, uuid, text) from public, anon, authenticated;
revoke all on function private.replace_owner(uuid, uuid, uuid, text) from public, anon, authenticated;

grant execute on function private.bootstrap_owners(uuid, uuid, text) to service_role;
grant execute on function private.grant_admin(uuid, uuid, private.admin_role, text) to service_role;
grant execute on function private.revoke_admin(uuid, uuid, text) to service_role;
grant execute on function private.replace_owner(uuid, uuid, uuid, text) to service_role;

create or replace function public.internal_bootstrap_owners(
  p_owner_one uuid, p_owner_two uuid, p_reason text
)
returns void
language sql
security definer
set search_path = ''
as $$ select private.bootstrap_owners(p_owner_one, p_owner_two, p_reason); $$;

create or replace function public.internal_grant_admin(
  p_actor_user_id uuid, p_target_user_id uuid, p_role text, p_reason text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform private.grant_admin(
    p_actor_user_id,
    p_target_user_id,
    p_role::private.admin_role,
    p_reason
  );
end;
$$;

create or replace function public.internal_revoke_admin(
  p_actor_user_id uuid, p_target_user_id uuid, p_reason text
)
returns void
language sql
security definer
set search_path = ''
as $$ select private.revoke_admin(p_actor_user_id, p_target_user_id, p_reason); $$;

revoke all on function public.internal_bootstrap_owners(uuid, uuid, text) from public, anon, authenticated;
revoke all on function public.internal_grant_admin(uuid, uuid, text, text) from public, anon, authenticated;
revoke all on function public.internal_revoke_admin(uuid, uuid, text) from public, anon, authenticated;
grant execute on function public.internal_bootstrap_owners(uuid, uuid, text) to service_role;
grant execute on function public.internal_grant_admin(uuid, uuid, text, text) to service_role;
grant execute on function public.internal_revoke_admin(uuid, uuid, text) to service_role;
