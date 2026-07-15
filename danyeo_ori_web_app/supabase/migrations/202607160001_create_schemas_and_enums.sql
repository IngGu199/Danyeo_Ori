create extension if not exists pgcrypto with schema extensions;

create schema if not exists private;
create schema if not exists retention;

revoke all on schema private from public, anon, authenticated;
revoke all on schema retention from public, anon, authenticated;

create type public.profile_status as enum ('active', 'withdrawn', 'suspended');
create type public.festival_status as enum ('draft', 'published', 'archived');
create type public.data_status as enum ('sample', 'verified');
create type public.game_type as enum ('click', 'quiz', 'roulette', 'timing', 'puzzle');
create type public.game_status as enum ('draft', 'active', 'inactive');
create type public.game_attempt_status as enum ('started', 'verified', 'rejected');
create type public.game_review_status as enum ('pending', 'cleared', 'flagged');
create type public.pre_registration_status as enum ('submitted', 'confirmed', 'cancelled');
create type public.point_transaction_type as enum ('earn', 'spend', 'expire', 'adjust');
create type public.reward_type as enum ('points', 'coupon', 'benefit');
create type public.reward_status as enum ('issued', 'used', 'expired', 'revoked');
create type private.admin_role as enum ('owner', 'operator');
create type private.admin_audit_action as enum ('grant', 'revoke', 'role_change', 'suspend');

comment on schema private is 'Data API에 노출하지 않는 권한, 감사, 보안, 파기 함수 영역';
comment on schema retention is '탈퇴 후 법적·내부 감사 목적으로 분리 보관하는 최소 데이터 영역';
