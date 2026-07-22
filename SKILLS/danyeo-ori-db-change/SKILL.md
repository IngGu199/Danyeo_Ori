---
name: danyeo-ori-db-change
description: Implement or review Danyeo Ori Supabase schema, migration, RLS, grant, trigger, database function, retention, generated type, seed, or pgTAP changes. Use when modifying database-backed festival, game, reward, authentication, admin, community, storage-policy, or account-deletion behavior, or when verifying local and Cloud migration safety.
---

# 다녀오리 DB 변경

## 기준 확인하기

1. 루트 `AGENTS.md`, `progress.md`, 관련 앱 코드를 읽는다.
2. `danyeo_ori_web_app/supabase/migrations/`에서 영향을 받는 테이블·함수·정책만 확인한다.
3. 관련 `supabase/tests/database/` 테스트와 `seed.sql`을 확인한다.
4. 현재 브랜치, 미커밋 변경, Node 22 사용 여부를 확인한다.

README나 인수인계 문서보다 마이그레이션, 테스트, 실제 코드, 최신 `progress.md`를 우선한다.

## 변경 범위 결정하기

- 스키마, RLS, GRANT, 함수, 트리거 중 어느 경계가 바뀌는지 적는다.
- anon, authenticated, 작성자, 관리자, service-role 각각의 기대 권한을 정의한다.
- 기존 데이터와 FK 삭제 동작에 미치는 영향을 확인한다.
- 보상, 포인트 원장, 개인정보 보존·파기 경계가 바뀌는지 확인한다.
- UI 변경만으로 해결할 수 없는 권한 문제를 DB 정책으로 다룬다.

## 마이그레이션 작성하기

- 이미 적용된 마이그레이션을 수정하지 않는다.
- 순서가 증가하는 새 마이그레이션 파일을 추가한다.
- DDL과 데이터 보정이 함께 필요하면 실패 시 원자적으로 처리되는지 확인한다.
- destructive change 전에 기존 행, FK, view, trigger, 함수 의존성을 검색한다.
- 테이블 삭제보다 `inactive`나 `archived`가 적합한 운영 데이터인지 판단한다.
- `security definer` 함수에는 고정된 `search_path`와 명시적 권한 검사를 사용한다.
- public 함수와 테이블의 GRANT를 명시하고 불필요한 기본 권한을 회수한다.
- service-role 키나 secret 값을 SQL, seed, 문서에 기록하지 않는다.

## RLS와 서버 권한 검증하기

- RLS를 활성화한 테이블에는 역할별 SELECT, INSERT, UPDATE, DELETE 기대값을 테스트한다.
- 관리자 UI 노출 여부와 관계없이 서버와 RLS에서 관리자 권한을 다시 확인한다.
- 작성자 ID, 사용자 ID, 닉네임처럼 클라이언트가 위조할 수 있는 값을 DB 또는 서버에서 확정한다.
- 공개 상위 객체가 숨겨졌을 때 하위 게임·게시글·리워드가 새어 나오지 않는지 확인한다.
- 포인트 잔액과 `point_transactions`를 클라이언트가 직접 변경하지 못하게 한다.
- 룰렛과 게임 보상은 Edge Function과 내부 DB 함수가 중복·idempotency를 검증한 뒤 확정한다.

## 테스트 추가하기

최소한 다음을 검증한다.

- 익명 사용자 공개 읽기 범위
- 일반 회원의 자신의 데이터 CRUD
- 다른 회원 데이터 접근 거절
- owner와 operator의 관리자 범위
- 중복 행·중복 보상·중복 좋아요 차단
- FK 삭제, cascade, restrict, set null 동작
- draft, inactive, archived, 기간 밖 데이터 비노출
- 비정상 점수·시간·이벤트 수 거절
- 계정 삭제와 보존 데이터 분리

## 로컬 검증 순서

```bash
cd <REPO_ROOT>/danyeo_ori_web_app
nvm use
npm run supabase:start
npm run supabase:reset
npm run supabase:test
npm run supabase:types
npm run typecheck --workspace @danyeo-ori/web
npm run lint --workspace @danyeo-ori/web
npm run build --workspace @danyeo-ori/web
cd ..
git diff --check
git status --short
```

- `supabase:reset`이 전체 마이그레이션과 seed를 처음부터 적용하는지 확인한다.
- `packages/types/src/database.generated.ts`를 수동 편집하지 않는다.
- 생성 타입 diff가 의도한 스키마 변경만 포함하는지 확인한다.
- DB 테스트 수치는 문서의 오래된 숫자가 아니라 이번 실행 결과를 보고한다.

## Cloud 경계 지키기

사용자의 별도 요청 전에는 다음을 수행하지 않는다.

- `supabase link`
- `supabase db push`
- `supabase secrets set`
- Edge Function 배포
- Vercel 환경 변수 변경 또는 재배포

승인을 받은 경우에도 대상 project ref와 Integration·Production 환경을 다시 확인하고 `supabase db push --dry-run` 결과를 먼저 검토한다. 적용 후 anon, 회원, owner, operator 스모크 테스트를 수행한다.

## 완료 보고하기

- 새 마이그레이션과 변경된 권한 경계를 설명한다.
- 데이터 보정과 삭제 동작을 설명한다.
- 수행한 pgTAP, 타입 생성, typecheck, lint, build 결과를 구분한다.
- Cloud에 반영하지 않았으면 명확히 밝힌다.
