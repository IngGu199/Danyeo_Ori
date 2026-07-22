-- 계정 삭제 시 사용자 소유 데이터는 함께 삭제하고, 운영 이력의 사용자 참조만 익명화한다.

alter table public.point_transactions
  drop constraint point_transactions_user_id_fkey,
  add constraint point_transactions_user_id_fkey
    foreign key (user_id) references public.point_wallets(user_id) on delete cascade;

alter table public.point_wallets
  drop constraint point_wallets_user_id_fkey,
  add constraint point_wallets_user_id_fkey
    foreign key (user_id) references auth.users(id) on delete cascade;

alter table public.rewards
  drop constraint rewards_user_id_fkey,
  add constraint rewards_user_id_fkey
    foreign key (user_id) references auth.users(id) on delete cascade;

alter table private.admin_users
  drop constraint admin_users_user_id_fkey,
  add constraint admin_users_user_id_fkey
    foreign key (user_id) references auth.users(id) on delete cascade,
  drop constraint admin_users_granted_by_fkey,
  add constraint admin_users_granted_by_fkey
    foreign key (granted_by) references auth.users(id) on delete set null,
  drop constraint admin_users_revoked_by_fkey,
  add constraint admin_users_revoked_by_fkey
    foreign key (revoked_by) references auth.users(id) on delete set null;

alter table private.admin_users
  drop constraint admin_users_revoke_state,
  add constraint admin_users_revoke_state check (
    (is_active and revoked_at is null and revoked_by is null and revoked_reason is null and expires_at is null)
    or (not is_active and revoked_at is not null and revoked_reason is not null and expires_at is not null)
  );

comment on constraint point_wallets_user_id_fkey on public.point_wallets
  is 'Auth 계정 삭제 시 사용자 포인트 지갑을 함께 삭제';
comment on constraint point_transactions_user_id_fkey on public.point_transactions
  is '포인트 지갑 삭제 시 온라인 원장을 함께 삭제하며, 탈퇴 절차에서는 사전에 retention 스키마로 분리 보관';
comment on constraint rewards_user_id_fkey on public.rewards
  is 'Auth 계정 삭제 시 사용자 보상 데이터를 함께 삭제';
comment on constraint admin_users_user_id_fkey on private.admin_users
  is 'Auth 계정 삭제 시 해당 관리자 권한 행을 함께 삭제';
comment on constraint admin_users_granted_by_fkey on private.admin_users
  is '권한 부여자 계정 삭제 시 관리자 권한 기록은 유지하고 부여자 참조만 익명화';
comment on constraint admin_users_revoked_by_fkey on private.admin_users
  is '권한 해제자 계정 삭제 시 관리자 권한 기록은 유지하고 해제자 참조만 익명화';
