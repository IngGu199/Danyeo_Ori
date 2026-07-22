create or replace function private.archive_points_before_auth_user_delete()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_subject_ref uuid := gen_random_uuid();
begin
  insert into retention.point_transactions_archive (
    id, subject_ref, transaction_type, amount, balance_after,
    source_event_ref, reason_code, created_at, expires_at
  )
  select
    id, v_subject_ref, transaction_type, amount, balance_after,
    source_event_ref, reason_code, created_at, expires_at
  from public.point_transactions
  where user_id = old.id
  on conflict (id) do nothing;

  return old;
end;
$$;

revoke all on function private.archive_points_before_auth_user_delete() from public, anon, authenticated;

create trigger archive_points_before_auth_user_delete
before delete on auth.users
for each row execute function private.archive_points_before_auth_user_delete();

comment on function private.archive_points_before_auth_user_delete()
  is 'Auth 계정 직접 삭제 전에 포인트 원장을 비식별 subject_ref로 분리 보관';
