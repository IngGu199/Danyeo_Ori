# Supabase 운영 절차

## 환경 분리

- Local: 마이그레이션, RLS, Edge Function, 파기 작업 개발. 가상 데이터만 사용합니다.
- Integration Cloud: 팀 통합과 Vercel Preview 검증. 운영 개인정보를 사용하지 않습니다.
- Production Cloud: 승인된 마이그레이션과 실제 운영 데이터만 사용합니다.

Cloud 연결, 비밀값 등록, `db push`, 함수 배포는 책임자 승인 후 수행합니다.

## 초기 owner 등록

두 대상자가 일반 회원가입과 이메일 인증을 마친 뒤 실행합니다.

```bash
SUPABASE_URL=... SUPABASE_SECRET_KEY=... npm run admin:bootstrap -- \
  <주-owner-uuid> <백업-owner-uuid> "초기 운영 책임자 등록"
```

초기 등록은 `private.admin_users`가 비어 있을 때 한 번만 성공합니다. Dashboard 접근 권한은 애플리케이션 owner 권한과 별개이므로 두 책임자 외에는 SQL Editor 접근 권한을 부여하지 않습니다.

## 관리자 추가

```bash
SUPABASE_URL=... SUPABASE_SECRET_KEY=... npm run admin:grant -- \
  <처리-owner-uuid> <대상-user-uuid> operator "축제 운영 담당"
```

- 처리자는 활성 owner여야 합니다.
- 대상자는 이메일 인증을 완료해야 합니다.
- operator는 다른 관리자를 추가하거나 해제할 수 없습니다.
- 활성 owner는 두 명으로 제한합니다.
- 변경은 `private.admin_role_audit`에 자동 기록됩니다.

## 관리자 해제와 계정 정지

```bash
SUPABASE_URL=... SUPABASE_SECRET_KEY=... npm run admin:revoke -- \
  <처리-owner-uuid> <대상-user-uuid> "담당 업무 종료"

SUPABASE_URL=... SUPABASE_SECRET_KEY=... npm run admin:suspend -- \
  <대상-user-uuid> 876000h
```

계정 탈취가 의심되면 권한 해제 후 Auth 계정을 즉시 정지합니다. 관리자 계정에는 운영 공개 전에 TOTP MFA를 적용합니다.

## 개인정보 파기

`private.run_retention()`은 매일 한국 시각 03:10에 실행되도록 마이그레이션에서 등록합니다.

- 다녀오리 출시 알림 신청: 신청일로부터 1년 후 이름 암호문·전화번호 암호문·중복 확인 HMAC을 함께 삭제합니다. 특정 축제 참가 예약 데이터로 사용하지 않습니다.
- 게임 기록: 회원 탈퇴 또는 마지막 활동 후 1년이 지나면 삭제합니다.
- 포인트 원장: 거래일로부터 5년 보관 후 삭제합니다.
- 관리자 권한 이력: 3년 후 삭제합니다.
- 보안 로그: 6개월 후 삭제합니다.

`deleted_at`만 기록하고 개인정보 원문을 남기는 방식은 파기로 취급하지 않습니다. 탈퇴 회원의 보존 대상 원장은 직접 사용자 ID를 제거해 `retention` 스키마로 옮깁니다. 포인트 원장 5년 보존은 현재 내부 감사 정책이므로 실제 공개 전에 법률 또는 개인정보 보호책임자 검토가 필요합니다.

## 복구·장애 대응

Cloud 백업 복원 후에는 `private.run_retention(now())`을 즉시 다시 실행해 백업 시점에 포함된 만료 데이터를 재파기합니다. 파기 작업 결과는 개인 식별값 없이 삭제 건수와 성공·실패 상태만 `private.retention_runs`에 기록합니다.

## 비밀값

다음 값은 Git에 커밋하지 않습니다.

- `SUPABASE_SECRET_KEY` 또는 `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_ACCESS_TOKEN`
- `SUPABASE_DB_PASSWORD`
- `PREREGISTRATION_ENCRYPTION_KEY`
- `PHONE_LOOKUP_HMAC_KEY`
- `SECURITY_LOG_HMAC_KEY`

웹과 모바일에는 `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`만 제공하며 secret/service 역할 키를 포함하지 않습니다.
